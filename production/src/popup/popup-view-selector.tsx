import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { PageBy } from '@mstr/connector-components';

import { handleExecuteNextRepromptTask } from '../helpers/prompts-handling-helper';
import { ObtainInstanceHelper } from './obtain-instance-helper';
import { popupHelper } from './popup-helper';
import { popupViewSelectorHelper } from './popup-view-selector-helper';

import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';
import { ObjectData } from '../types/object-types';

import { AttributeSelectorWindow } from '../attribute-selector/attribute-selector-window';
import { DossierWindow } from '../embedded/dossier/dossier-window';
import { LibraryWindow } from '../embedded/library/library-window';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { PromptsWindow } from '../prompts/prompts-window';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { navigationTreeSelectors } from '../redux-reducer/navigation-tree-reducer/navigation-tree-reducer-selectors';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { popupStateActions } from '../redux-reducer/popup-state-reducer/popup-state-actions';
import { MultipleRepromptTransitionPage } from './multiple-reprompt-transition-page/multiple-reprompt-transition-page';
import { OverviewWindow } from './overview/overview-window';

interface PopupViewSelectorProps {
  authToken?: string;
  requestPageByModalClose?: () => void;
  popupType?: DialogType;
  editedObject?: ObjectData;
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
  const { authToken, popupType: popupTypeProps, requestPageByModalClose, editedObject } = props;

  const isPageByModalOpenRequested = useSelector(
    navigationTreeSelectors.selectIsPageByModalOpenRequested
  );
  const pageBy = useSelector(navigationTreeSelectors.selectPageBy);
  const chosenObjectName = useSelector(navigationTreeSelectors.selectChosenObjectName);
  const importPageByConfigurations = useSelector(
    navigationTreeSelectors.selectImportPageByConfigurations
  );

  const popupType = popupViewSelectorHelper.setPopupType(props, popupTypeProps);

  useEffect(() => {
    // @ts-expect-error
    dispatch(popupStateActions.setDialogType(popupType));
  }, [dispatch, popupType]);

  if (!authToken) {
    console.info('Waiting for token to be passed');
    return null;
  }

  return (
    <div>
      {isPageByModalOpenRequested && (
        <PageBy
          pageByData={pageBy}
          objectName={chosenObjectName}
          onImport={pageByConfigurations => {
            importPageByConfigurations(pageByConfigurations);
            requestPageByModalClose();
          }}
          onCancel={() => {
            requestPageByModalClose();
            handleExecuteNextRepromptTask();
          }}
          pageByConfiguration={popupViewSelectorHelper.getPageByConfigurations(
            editedObject.objectWorkingId
          )}
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
  const { promptsAnswers } = navigationTree;
  const { supportForms } = officeReducer;
  const { popupType, importType } = popupStateReducer;
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
  };
}

const mapDispatchToProps = {
  ...navigationTreeActions,
  preparePromptedReport: popupActions.preparePromptedReport,
  requestPageByModalOpen: navigationTreeActions.requestPageByModalOpen,
  requestPageByModalClose: navigationTreeActions.requestPageByModalClose,
  requestImport: navigationTreeActions.requestImport,
};

export const PopupViewSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupViewSelectorNotConnected);
