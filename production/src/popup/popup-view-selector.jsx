import React from 'react';
import { connect } from 'react-redux';
import { AttributeSelectorWindow } from '../attribute-selector/attribute-selector-window';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { DossierWindow } from '../dossier/dossier-window';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { LoadingPage } from '../loading/loading-page';
import { RefreshAllPage } from '../loading/refresh-all-page';
import mstrObjectEnum from '../mstr-object/mstr-object-type-enum';
import { NavigationTree } from '../navigation/navigation-tree';
import { actions } from '../navigation/navigation-tree-actions';
import { PromptsWindow } from '../prompts/prompts-window';
import { popupActions } from './popup-actions';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';
import { popupHelper } from './popup-helper';
import { popupStateActions } from './popup-state-actions';

const { createInstance, answerPrompts, getInstance } = mstrObjectRestService;

export const PopupViewSelectorHOC = (props) => {
  let { popupType } = props;
  console.log({ props });
  const { propsToPass, methods, importRequested, dossierOpenRequested, loading } = props;
  const isPrompted = propsToPass.isPrompted || props.isPrompted;
  if (!props.authToken || !propsToPass) {
    console.log('Waiting for token to be passed');
    return null;
  }
  propsToPass.authToken = props.authToken;
  propsToPass.editRequested = popupType === PopupTypeEnum.editFilters;
  const localEditReport = { ...props.editedObject };
  if (
    (importRequested && !isPrompted)
    || (importRequested && arePromptsAnswered(props))
  ) {
    proceedToImport(props);
  } else if (
    !!isPrompted
    && arePromptsAnswered(props)
    && !propsToPass.forceChange
  ) {
    if (isInstanceWithPromptsAnswered(props)) {
      if (popupType === PopupTypeEnum.repromptingWindow) {
        popupType = PopupTypeEnum.editFilters;
        propsToPass.editRequested = true;
      }
    } else if (dossierOpenRequested) {
      // pass given prompts answers to dossierWindow
      propsToPass.promptsAnswers = props.promptsAnswers;
      popupType = PopupTypeEnum.dossierWindow;
    } else {
      obtainInstanceWithPromptsAnswers(propsToPass, props);
      return <div />;
    }
  } else if (promptedReportSubmitted(props) || (dossierOpenRequested && !!isPrompted)) {
    popupType = PopupTypeEnum.promptsWindow;
    propsToPass.projectId = props.chosenProjectId;
    propsToPass.chosenObjectId = props.chosenObjectId;
  } else if ((dossierOpenRequested) && (!loading)) {
    // open dossier without prompts
    propsToPass.promptsAnswers = null;
    popupType = PopupTypeEnum.dossierWindow;
  }
  return renderProperComponent(popupType, methods, propsToPass, localEditReport);
};

function wasReportJustImported(props) {
  const isNullOrEmpty = (obj) => {
    const stringifiedObj = JSON.stringify(obj);
    return !obj || stringifiedObj === '{}' || stringifiedObj === '[]';
  };
  return (
    !!props.editedObject
    && isNullOrEmpty(props.editedObject.selectedAttributes)
    && isNullOrEmpty(props.editedObject.selectedMetrics)
    && isNullOrEmpty(props.editedObject.selectedFilters)
  );
}

function promptedReportSubmitted(props) {
  return (
    !!(props.propsToPass.isPrompted || props.isPrompted)
    && (props.importRequested || props.popupType === PopupTypeEnum.dataPreparation)
  );
}

function isInstanceWithPromptsAnswered(props) {
  return (
    !!props.editedObject
    && !!props.editedObject.instanceId
    && props.preparedInstance === props.editedObject.instanceId
  );
}

function arePromptsAnswered(props) {
  return !!props.dossierData && !!props.dossierData.instanceId;
}

async function obtainInstanceWithPromptsAnswers(propsToPass, props) {
  const projectId = propsToPass.projectId || props.editedObject.projectId;
  const objectId = propsToPass.chosenObjectId || props.editedObject.chosenObjectId;
  const configInstace = { objectId, projectId };
  let instanceDefinition = await createInstance(configInstace);
  let count = 0;
  while (instanceDefinition.status === 2) {
    const configPrompts = {
      objectId,
      projectId,
      instanceId: instanceDefinition.instanceId,
      promptsAnswers: props.promptsAnswers[count],
    };
    await answerPrompts(configPrompts);
    const configAnsPrompts = { objectId, projectId, instanceId: instanceDefinition.instanceId };
    try {
      instanceDefinition = await getInstance(configAnsPrompts);
    } catch (error) {
      popupHelper.handlePopupErrors(error);
    }
    count += 1;
  }
  const body = createBody(props.editedObject && props.editedObject.selectedAttributes,
    props.editedObject && props.editedObject.selectedMetrics,
    props.editedObject && props.editedObject.selectedFilters);
  const preparedReport = {
    id: objectId,
    projectId,
    name: propsToPass.chosenObjectName || props.editedObject.chosenObjectName,
    objectType: mstrObjectEnum.mstrObjectType.report,
    instanceId: instanceDefinition.instanceId,
    promptsAnswers: props.promptsAnswers,
    body,
  };
  console.log({ preparedReport, propsToPass });
  props.preparePromptedReport(instanceDefinition.instanceId, preparedReport);
}

// TODO: get this method from library
function createBody(attributes, metrics, filters, instanceId) {
  // temporary line below.
  // Once the rest structure is unified for both endpoints,
  // this conditional won't be needed anymore.
  const restObjectType = !instanceId ? 'requestedObjects' : 'template';
  const body = {
    [restObjectType]: {
      attributes: [],
      metrics: [],
    },
  };
  if (attributes && attributes.length > 0) {
    attributes.forEach((att) => {
      body[restObjectType].attributes.push({ id: att });
    });
  }
  if (metrics && metrics.length > 0) {
    metrics.forEach((met) => {
      body[restObjectType].metrics.push({ id: met });
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
    branch.operands[1].elements.push({ id: item, });
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
    : { operator: 'And', operands: filterOperands };
}

function proceedToImport(props) {
  let visualizationInfo;
  if (props.chosenChapterKey) {
    visualizationInfo = {
      chapterKey: props.chosenChapterKey,
      visualizationKey: props.chosenVisualizationKey,
    };
  }
  const okObject = {
    command: selectorProperties.commandOk,
    chosenObject: props.chosenObjectId,
    chosenProject: props.chosenProjectId,
    chosenSubtype: props.chosenSubtype,
    isPrompted: props.isPrompted,
    promptsAnswers: props.promptsAnswers,
    visualizationInfo,
    preparedInstanceId: props.preparedInstanceId,
    isEdit: props.isEdit,
  };
  if (props.dossierData) {
    okObject.dossierData = {
      ...props.dossierData,
      chosenObjectName: props.chosenObjectName,
    };
    const { isReprompt } = props.dossierData;
    // skip this part if report contains no selected attribiutes/metrics/filters
    if (isReprompt && !wasReportJustImported(props)) {
      okObject.command = selectorProperties.commandOnUpdate;
      const { selectedAttributes, selectedMetrics, selectedFilters } = props.editedObject;
      okObject.body = createBody(selectedAttributes, selectedMetrics, selectedFilters, false);
    }
  }
  props.startLoading();
  props.startImport();
  window.Office.context.ui.messageParent(JSON.stringify(okObject));
}

function renderProperComponent(popupType, methods, propsToPass, editedObject,) {
  if (popupType === PopupTypeEnum.dataPreparation) {
    const mstrData = { ...propsToPass, instanceId: editedObject.instanceId, promptsAnswers: editedObject.promptsAnswers };
    console.log('hello');
    return (
      <AttributeSelectorWindow />
    );
  }
  if (popupType === PopupTypeEnum.editFilters) {
    console.log(editedObject);
    const mstrData = {
      ...propsToPass,
      ...editedObject,
    };

    console.log(mstrData);
    return (
      <AttributeSelectorWindow
      // handleBack={() => methods.handleBack(null, null, null, true)} // FIXME: Don't know how to adjust it just yet.
      />
    );
  }
  if (popupType === PopupTypeEnum.navigationTree) {
    return (
      <NavigationTree
      // handleDossierOpen={methods.handleDossierOpen}
      />
    );
  }
  if (popupType === PopupTypeEnum.loadingPage) {
    return <LoadingPage />;
  }
  if (popupType === PopupTypeEnum.refreshAllPage) {
    return <RefreshAllPage />;
  }
  if (popupType === PopupTypeEnum.promptsWindow) {
    return (
      <PromptsWindow
        mstrData={propsToPass}
        handleBack={methods.handleBack}
        handlePopupErrors={popupHelper.handlePopupErrors}
      />
    );
  }
  if (popupType === PopupTypeEnum.repromptingWindow) {
    const mstrData = {
      ...propsToPass,
      ...editedObject,
      isReprompt: true,
    };
    return (
      <PromptsWindow
        mstrData={mstrData}
        handleBack={methods.handleBack}
        handlePopupErrors={popupHelper.handlePopupErrors}
      />
    ); // use the same window as with prompting, but provide report info
  }
  if (popupType === PopupTypeEnum.dossierWindow) {
    return (
      <DossierWindow
        mstrData={propsToPass}
        editedObject={editedObject}
        handleBack={methods.handleBack}
        handlePopupErrors={popupHelper.handlePopupErrors}
        t={propsToPass.t}
      />
    );
  }
  // TODO: do some error handling here
  return null;
}

export function mapStateToProps(state) {
  const popupState = state.popupReducer.editedObject;
  const { promptsAnswers } = state.navigationTree;
  return {
    ...state.navigationTree,
    authToken: state.sessionReducer.authToken,
    editedObject: { ...(popupHelper.parsePopupState(popupState, promptsAnswers)) },
    preparedInstance: state.popupReducer.preparedInstance,
    propsToPass: { ...state.popupStateReducer },
    popupType: state.popupStateReducer.popupType,
  };
}

const mapDispatchToProps = {
  ...actions,
  preparePromptedReport: popupActions.preparePromptedReport,
};

export const PopupViewSelector = connect(mapStateToProps, mapDispatchToProps)(PopupViewSelectorHOC);
