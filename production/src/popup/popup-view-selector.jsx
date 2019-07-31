import React from 'react';
import {connect} from 'react-redux';
import {actions} from '../navigation/navigation-tree-actions';
import {AttributeSelectorWindow} from '../attribute-selector/attribute-selector-window';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {NavigationTree} from '../navigation/navigation-tree';
import {LoadingPage} from '../loading/loading-page';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {PromptsWindow} from '../prompts/prompts-window';
import {RefreshAllPage} from '../loading/refresh-all-page';
import {mstrObjectRestService} from '../mstr-object/mstr-object-rest-service';
import {preparePromptedReport} from './popup-actions';

export const _PopupViewSelector = (props) => {
  let popupType = props.popupType;
  const {propsToPass, methods, importRequested, editedReport} = props;

  if ((importRequested && !props.isPrompted)
    || (importRequested && !!props.dossierData && !!props.dossierData.instanceId)) {
      console.log('proceedtoimport');
      
    proceedToImport(props);
  } else if (!!props.isPrompted && !!props.dossierData && !!props.dossierData.instanceId) {
    if (!!editedReport.instanceId && props.preparedInstance === editedReport.instanceId) {
      popupType = PopupTypeEnum.editFilters;
    } else {
      obtainInstanceWithPromptsAnswers(propsToPass, props);
      return null;
    }
  } else if (!!props.isPrompted && (importRequested || popupType === PopupTypeEnum.dataPreparation)) {
    popupType = PopupTypeEnum.promptsWindow;
    propsToPass.projectId = props.chosenProjectId;
    propsToPass.reportId = props.chosenObjectId;
  }

  // if (importRequested) {
  //   if (!props.isPrompted) {
  //     proceedToImport(props);
  //   } else if (!!props.dossierData && !!props.dossierData.instanceId) {
  //     console.log({props});
  //     proceedToImport(props);
  //   } else {
  //     popupType = PopupTypeEnum.promptsWindow;
  //     propsToPass.projectId = props.chosenProjectId;
  //     propsToPass.reportId = props.chosenObjectId;
  //   }
  // }
  if (!props.authToken || !propsToPass) {
    console.log('Waiting for token to be passed');
    return null;
  }
  propsToPass.token = props.authToken;
  return renderProperComponent(popupType, methods, propsToPass, editedReport);
};

async function obtainInstanceWithPromptsAnswers(propsToPass, props) {
  console.log({props});
  debugger;
  let instanceDefinition = await mstrObjectRestService.createInstance(propsToPass.reportId, propsToPass.projectId, true, null, null);
  let count = 0;
  while (instanceDefinition.status === 2) {
    await mstrObjectRestService.answerPrompts(propsToPass.reportId, propsToPass.projectId, instanceDefinition.instanceId, props.promptsAnswers[count]);
    instanceDefinition = await mstrObjectRestService.getInstance(propsToPass.reportId, propsToPass.projectId, true, null, null, instanceDefinition.instanceId);
    count++;
  }
  const preparedReport = {
    id: propsToPass.reportId,
    projectId: propsToPass.projectId,
    name: propsToPass.reportName,
    objectType: propsToPass.reportType,
  };
  preparePromptedReport(instanceDefinition.instanceId, preparedReport);
}

function renderProperComponent(popupType, methods, propsToPass, editedReport) {
  if (popupType === PopupTypeEnum.dataPreparation) {
    return <AttributeSelectorWindow mstrData={propsToPass} handleBack={methods.handleBack} />;
  }
  if (popupType === PopupTypeEnum.editFilters) {
    const mstrData = {
      ...propsToPass,
      ...editedReport,
    };
    return <AttributeSelectorWindow mstrData={mstrData} handleBack={methods.handleBack} />;
  }
  if (popupType === PopupTypeEnum.navigationTree) {
    return <NavigationTree handlePrepare={methods.handlePrepare} mstrData={propsToPass} handlePopupErrors={methods.handlePopupErrors} />;
  }
  if (popupType === PopupTypeEnum.loadingPage) {
    return <LoadingPage />;
  }
  if (popupType === PopupTypeEnum.refreshAllPage) {
    return <RefreshAllPage />;
  }
  if (popupType === PopupTypeEnum.promptsWindow) {
    return <PromptsWindow mstrData={propsToPass} />;
  }
  if (popupType === PopupTypeEnum.repromptingWindow) {
    const mstrData = {
      ...propsToPass,
      ...editedReport,
      isReprompt: true,
    };
    return <PromptsWindow mstrData={mstrData} />; // use the same window as with prompting, but provide report info
  }
  // TODO: do some error handling here
  return null;
}

function proceedToImport(props) {
  const okObject = {
    command: selectorProperties.commandOk,
    chosenObject: props.chosenObjectId,
    chosenProject: props.chosenProjectId,
    chosenSubtype: props.chosenSubtype,
    isPrompted: props.isPrompted,
    promptsAnswers: props.promptsAnswers,
  };
  if (!!props.dossierData) {
    okObject.dossierData = {
      ...props.dossierData,
      reportName: props.chosenProjectName,
    };
  }
  props.startLoading();
  props.startImport();
  Office.context.ui.messageParent(JSON.stringify(okObject));
}

export function mapStateToProps(state) {
  const popupState = state.popupReducer.editedReport;
  return {
    ...state.navigationTree,
    authToken: state.sessionReducer.authToken,
    editedReport: parsePopupState(popupState),
    preparedInstance: state.popupReducer.preparedInstance,
  };
};

const popupActions = {
  ...actions,
  preparePromptedReport,
};

export const PopupViewSelector = connect(mapStateToProps, actions)(_PopupViewSelector);

function parsePopupState(popupState) {
  if (!popupState) {
    return;
  }
  const reportData = {
    reportId: popupState.id,
    instanceId: popupState.instanceId,
    projectId: popupState.projectId,
    reportName: popupState.name,
    reportType: popupState.objectType,
    reportSubtype: popupState.objectType === 'report'
      ? 768
      : 779,
    promptsAnswers: popupState.promptsAnswers,
  };
  restoreFilters(popupState.body, reportData);
  return reportData;
}

function restoreFilters(body, reportData) {
  try {
    if (body && body.requestedObjects) {
      reportData.selectedAttributes = body.requestedObjects.attributes && body.requestedObjects.attributes.map((attr) => attr.id);
      reportData.selectedMetrics = body.requestedObjects.metrics && body.requestedObjects.metrics.map((mtrc) => mtrc.id);
    }
    if (body && body.viewFilter) {
      reportData.selectedFilters = parseFilters(body.viewFilter.operands);
    }
  } catch (error) {
    console.warn(error);
  } finally {
    return reportData;
  }
}

function parseFilters(filtersNodes) {
  if (!!filtersNodes[0].operands) {
    // equivalent to flatMap((node) => node.operands)
    return parseFilters(filtersNodes.reduce((nodes, node) => nodes.concat(node.operands), []));
  } else {
    const elementNodes = filtersNodes.filter((node) => node.type === 'elements');
    // equivalent to flatMap((node) => node.elements)
    const elements = elementNodes.reduce((elements, node) => elements.concat(node.elements), []);
    const elementsIds = elements.map((elem) => elem.id);
    return elementsIds
        .reduce((filters, elem) => {
          const attrId = elem.split(':')[0];
          filters[attrId] = !filters[attrId]
          ? [elem]
          : [...filters[attrId], elem];
          return filters;
        }, {});
  }
}

