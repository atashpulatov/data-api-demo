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
  const {propsToPass, methods, importRequested} = props;

  if (!props.authToken || !propsToPass) {
    console.log('Waiting for token to be passed');
    return null;
  }
  propsToPass.token = props.authToken;

  propsToPass.editRequested = popupType === PopupTypeEnum.editFilters;
  const localEditReport = {...props.editedReport};
  if ((importRequested && !props.isPrompted)
    || (importRequested && arePromptsAnswered(props))) {
    proceedToImport(props);
  } else if (!!props.isPrompted && arePromptsAnswered(props) && !propsToPass.forceChange) {
    if (isInstanceWithPromptsAnswered(props)) {
      popupType === PopupTypeEnum.repromptingWindow
        && wasReportJustImported(props) && proceedToImport(props);
      popupType = PopupTypeEnum.editFilters;
    } else {
      obtainInstanceWithPromptsAnswers(propsToPass, props);
      return <div />;
    }
  } else if (promptedReportSubmitted(props)) {
    popupType = PopupTypeEnum.promptsWindow;
    propsToPass.projectId = props.chosenProjectId;
    propsToPass.reportId = props.chosenObjectId;
  }

  return renderProperComponent(popupType, methods, propsToPass, localEditReport);
};

function wasReportJustImported(props) {
  const isNullOrEmpty = (obj) => {
    const stringifiedObj = JSON.stringify(obj);
    return !obj || stringifiedObj === '{}' || stringifiedObj === '[]';
  };
  return !!props.editedReport
    && isNullOrEmpty(props.editedReport.selectedAttributes)
    && isNullOrEmpty(props.editedReport.selectedMetrics)
    && isNullOrEmpty(props.editedReport.selectedFilters);
}

function promptedReportSubmitted(props) {
  return !!props.isPrompted
    && (props.importRequested || props.popupType === PopupTypeEnum.dataPreparation);
}

function isInstanceWithPromptsAnswered(props) {
  return !!props.editedReport && !!props.editedReport.instanceId
    && props.preparedInstance === props.editedReport.instanceId;
}

function arePromptsAnswered(props) {
  return !!props.dossierData && !!props.dossierData.instanceId;
}

async function obtainInstanceWithPromptsAnswers(propsToPass, props) {
  const projectId = propsToPass.projectId || props.editedReport.projectId;
  const reportId = propsToPass.reportId || props.editedReport.reportId;
  let instanceDefinition = await mstrObjectRestService.createInstance(reportId, projectId, true, null, null);
  let count = 0;
  while (instanceDefinition.status === 2) {
    await mstrObjectRestService.answerPrompts(reportId, projectId, instanceDefinition.instanceId, props.promptsAnswers[count]);
    instanceDefinition = await mstrObjectRestService.getInstance(reportId, projectId, true, null, null, instanceDefinition.instanceId);
    count++;
  }
  const body = createBody(
      props.editedReport && props.editedReport.selectedAttributes,
      props.editedReport && props.editedReport.selectedMetrics,
      props.editedReport && props.editedReport.selectedFilters
  );
  const preparedReport = {
    id: reportId,
    projectId: projectId,
    name: propsToPass.reportName,
    objectType: 'report',
    instanceId: instanceDefinition.instanceId,
    promptsAnswers: props.promptsAnswers,
    body,
  };
  console.log({preparedReport, propsToPass});
  props.preparePromptedReport(instanceDefinition.instanceId, preparedReport);
}

// TODO: get this method from library
function createBody(attributes, metrics, filters, instanceId) {
  // temporary line below.
  // Once the rest structure is unified for both endpoints, this conditional won't be needed anymore.
  const restObjectType = !instanceId ? 'requestedObjects' : 'template';
  const body = {
    [restObjectType]: {
      attributes: [],
      metrics: [],
    },
  };
  if (attributes && attributes.length > 0) {
    attributes.forEach((att) => {
      body[restObjectType].attributes.push({'id': att});
    });
  }
  if (metrics && metrics.length > 0) {
    metrics.forEach((met) => {
      body[restObjectType].metrics.push({'id': met});
    });
  }
  if (filters && Object.keys(filters).length > 0) {
    body.viewFilter = composeFilter(filters);
  }
  return body;
}

// TODO: remove once create body is from library
function composeFilter(selectedFilters) {
  let branch;
  const filterOperands = [];
  const addItem = (item) => {
    branch.operands[1].elements.push({
      id: item,
    });
  };
  for (const att in selectedFilters) {
    if (selectedFilters[att].length) {
      branch = {
        operator: 'In',
        operands: [],
      };
      branch.operands.push({
        type: 'attribute',
        id: att,
      });
      branch.operands.push({
        type: 'elements',
        elements: [],
      });
      selectedFilters[att].forEach(addItem);
      filterOperands.push(branch);
    }
  }
  const operandsLength = filterOperands.length;
  if (!operandsLength) {
    return;
  }
  return operandsLength === 1
    ? filterOperands[0]
    : {operator: 'And', operands: filterOperands};
};

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

function renderProperComponent(popupType, methods, propsToPass, editedReport) {
  if (popupType === PopupTypeEnum.dataPreparation) {
    return <AttributeSelectorWindow mstrData={propsToPass} handleBack={methods.handleBack} />;
  }
  if (popupType === PopupTypeEnum.editFilters) {
    const mstrData = {
      ...propsToPass,
      ...editedReport,
    };
    return <AttributeSelectorWindow mstrData={mstrData} handleBack={() => methods.handleBack(null, null, null, true)} />;
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
    return <PromptsWindow mstrData={propsToPass} handleBack={methods.handleBack} />;
  }
  if (popupType === PopupTypeEnum.repromptingWindow) {
    const mstrData = {
      ...propsToPass,
      ...editedReport,
      isReprompt: true,
    };
    return <PromptsWindow mstrData={mstrData} handleBack={methods.handleBack} />; // use the same window as with prompting, but provide report info
  }
  // TODO: do some error handling here
  return null;
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

export const PopupViewSelector = connect(mapStateToProps, popupActions)(_PopupViewSelector);

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
