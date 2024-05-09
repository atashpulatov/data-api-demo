import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { PageBy } from '@mstr/connector-components';

import { handleExecuteNextRepromptTask } from '../helpers/prompts-handling-helper';
import { pageByHelper } from '../page-by/page-by-helper';
import { ObtainInstanceHelper } from './obtain-instance-helper';
import { popupHelper } from './popup-helper';
import { popupViewSelectorHelper } from './popup-view-selector-helper';

import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';

import { AttributeSelectorWindow } from '../attribute-selector/attribute-selector-window';
import { DossierWindow } from '../embedded/dossier/dossier-window';
import { LibraryWindow } from '../embedded/library/library-window';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { PromptsWindow } from '../prompts/prompts-window';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { navigationTreeSelectors } from '../redux-reducer/navigation-tree-reducer/navigation-tree-reducer-selectors';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { popupSelectors } from '../redux-reducer/popup-reducer/popup-selectors';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { MultipleRepromptTransitionPage } from './multiple-reprompt-transition-page/multiple-reprompt-transition-page';
import { OverviewWindow } from './overview/overview-window';

interface PopupViewSelectorProps {
  authToken?: string;
  popupType?: DialogType;
  isPrompted?: boolean;
  isReprompt?: boolean;
  isEdit?: boolean;
  requestPageByModalClose?: () => void;
  clearEditedObject?: () => void;
  clearPromptAnswers?: () => void;
  selectObject?: () => void;
}

const renderProperComponent = (popupType: DialogType): any => {
  switch (popupType) {
    case DialogType.dataPreparation:
    case DialogType.editFilters:
      // @ts-expect-error
      return <AttributeSelectorWindow />;
    case DialogType.libraryWindow:
      // @ts-expect-error
      return <LibraryWindow />;
    case DialogType.promptsWindow:
    case DialogType.repromptingWindow:
    case DialogType.repromptReportDataOverview:
      return <PromptsWindow />;
    case DialogType.dossierWindow:
    case DialogType.repromptDossierDataOverview:
      // @ts-expect-error
      return <DossierWindow />;
    case DialogType.obtainInstanceHelper:
      return <ObtainInstanceHelper />;
    case DialogType.multipleRepromptTransitionPage:
      return <MultipleRepromptTransitionPage />;
    case DialogType.importedDataOverview:
      return <OverviewWindow />;
    default:
      return null;
  }
};

export const PopupViewSelectorNotConnected: React.FC<PopupViewSelectorProps> = props => {
  const dispatch = useDispatch();
  const {
    authToken,
    popupType: popupTypeProps,
    isPrompted,
    isReprompt,
    isEdit,
    requestPageByModalClose,
    clearEditedObject,
    clearPromptAnswers,
    selectObject,
  } = props;

  const isPageByModalOpenRequested = useSelector(
    navigationTreeSelectors.selectIsPageByModalOpenRequested
  );
  const pageByResponse = useSelector(navigationTreeSelectors.selectPageByResponse);
  const chosenObjectName = useSelector(navigationTreeSelectors.selectChosenObjectName);
  const importPageByConfigurations = useSelector(
    navigationTreeSelectors.selectImportPageByConfigurations
  );
  const editedObject = useSelector(popupSelectors.selectEditedObject);

  const popupType = popupViewSelectorHelper.setPopupType(props, popupTypeProps);

  useEffect(() => {
    // @ts-expect-error
    dispatch(popupStateActions.setDialogType(popupType));
  }, [dispatch, popupType]);

  if (!authToken) {
    console.info('Waiting for token to be passed');
    return null;
  }

  const handlePageByModalClose = (): void => {
    requestPageByModalClose();

    if (isReprompt && !isEdit) {
      handleExecuteNextRepromptTask();
    }

    if (isPrompted && popupType === DialogType.libraryWindow) {
      clearEditedObject();
      clearPromptAnswers();
      selectObject();
    }
  };

  const pageByData = {
    items: pageByResponse?.pageBy,
    validCombintations: pageByResponse?.validPageByElements.items,
  };

  const pageByConfiguration = pageByHelper.getPageByConfigurations(
    editedObject?.objectWorkingId,
    pageByHelper.parseValidPageByElements(
      pageByResponse.pageBy,
      pageByResponse?.validPageByElements
    )
  );

  return (
    <div>
      {isPageByModalOpenRequested && (
        <PageBy
          pageByData={pageByData}
          objectName={editedObject?.definition?.sourceName ?? chosenObjectName}
          onImport={pageByConfigurations => {
            importPageByConfigurations(pageByConfigurations);
            requestPageByModalClose();
          }}
          onCancel={handlePageByModalClose}
          pageByConfiguration={pageByConfiguration}
        />
      )}
      {renderProperComponent(popupType)}
    </div>
  );
};

function mapStateToProps(state: any): any {
  const {
    navigationTree,
    popupReducer: { editedObject, preparedInstance },
    sessionReducer: { attrFormPrivilege, authToken },
    officeReducer,
    popupStateReducer,
    repromptsQueueReducer,
  } = state;
  const { promptsAnswers, isPrompted } = navigationTree;
  const { supportForms } = officeReducer;
  const { popupType, importType, isReprompt, isEdit } = popupStateReducer;
  const isReport =
    editedObject && editedObject.mstrObjectType.name === mstrObjectEnum.mstrObjectType.report.name;
  const formsPrivilege = supportForms && attrFormPrivilege && isReport;
  return {
    ...navigationTree,
    authToken,
    editedObject: {
      ...popupHelper.parsePopupState(editedObject, promptsAnswers, formsPrivilege),
    },
    preparedInstance,
    propsToPass: { ...popupStateReducer },
    popupType,
    importType,
    formsPrivilege,
    repromptsQueueProps: { ...repromptsQueueReducer },
    isPrompted,
    isReprompt,
    isEdit,
  };
}

const mapDispatchToProps = {
  ...navigationTreeActions,
  preparePromptedReport: popupActions.preparePromptedReport,
  requestPageByModalOpen: navigationTreeActions.requestPageByModalOpen,
  requestPageByModalClose: navigationTreeActions.requestPageByModalClose,
  requestImport: navigationTreeActions.requestImport,
  clearEditedObject: popupActions.clearEditedObject,
  clearPromptAnswers: navigationTreeActions.clearPromptAnswers,
  selectObject: navigationTreeActions.selectObject,
};

export const PopupViewSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupViewSelectorNotConnected);
