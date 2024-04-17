import React from 'react';
import { connect } from 'react-redux';

import { ObtainInstanceHelper } from './obtain-instance-helper';
import overviewHelper from './overview/overview-helper';
import { popupHelper } from './popup-helper';
import { popupViewSelectorHelper } from './popup-view-selector-helper';

import { PopupTypeEnum } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';

import { AttributeSelectorWindow } from '../attribute-selector/attribute-selector-window';
import { DossierWindow } from '../embedded/dossier/dossier-window';
import { LibraryWindow } from '../embedded/library/library-window';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { PromptsWindow } from '../prompts/prompts-window';
import { navigationTreeActions } from '../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import { popupActions } from '../redux-reducer/popup-reducer/popup-actions';
import { MultipleRepromptTransitionPage } from './multiple-reprompt-transition-page/multiple-reprompt-transition-page';
import { OverviewWindow } from './overview/overview-window';

interface PopupViewSelectorProps {
  authToken?: string;
  popupType?: PopupTypeEnum;
}

const renderProperComponent = (popupType: PopupTypeEnum): any => {
  switch (popupType) {
    case PopupTypeEnum.dataPreparation:
    case PopupTypeEnum.editFilters:
      // @ts-expect-error
      return <AttributeSelectorWindow />;
    case PopupTypeEnum.libraryWindow:
      // @ts-expect-error
      return <LibraryWindow />;
    case PopupTypeEnum.promptsWindow:
    case PopupTypeEnum.repromptingWindow:
    case PopupTypeEnum.repromptReportDataOverview:
      return <PromptsWindow />;
    case PopupTypeEnum.dossierWindow:
    case PopupTypeEnum.repromptDossierDataOverview:
      // @ts-expect-error
      return <DossierWindow />;
    case PopupTypeEnum.obtainInstanceHelper:
      return <ObtainInstanceHelper />;
    case PopupTypeEnum.multipleRepromptTransitionPage:
      return <MultipleRepromptTransitionPage />;
    case PopupTypeEnum.importedDataOverview:
      return (
        <OverviewWindow
          onImport={overviewHelper.sendImportRequest}
          onEdit={overviewHelper.sendEditRequest}
          onReprompt={overviewHelper.sendRepromptRequest}
          onRefresh={overviewHelper.sendRefreshRequest}
          onDelete={overviewHelper.sendDeleteRequest}
          onDuplicate={overviewHelper.sendDuplicateRequest}
          onRename={overviewHelper.sendRenameRequest}
          onGoToWorksheet={overviewHelper.sendGoToWorksheetRequest}
          onDismissNotification={overviewHelper.sendDismissNotificationRequest}
        />
      );
    default:
      return null;
  }
};

export const PopupViewSelectorNotConnected: React.FC<PopupViewSelectorProps> = props => {
  const { authToken, popupType: popupTypeProps } = props;
  if (!authToken) {
    console.log('Waiting for token to be passed');
    return null;
  }
  const popupType = popupViewSelectorHelper.setPopupType(props, popupTypeProps);
  return renderProperComponent(popupType);
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
};

export const PopupViewSelector = connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupViewSelectorNotConnected);
