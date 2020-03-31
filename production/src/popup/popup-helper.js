import { officeContext } from '../office/office-context';
import { selectorProperties } from '../attribute-selector/selector-properties';


function sortPromptsAnswers(array) {
  for (let i = 0; i < array.length; i++) {
    array[i].values.sort();
  }
}
class PopupHelper {
  handlePopupErrors = (error) => {
    const errorObj = error
     && {
       status: error.status,
       message: error.message,
       response: error.response,
       type: error.type
     };
    const messageObject = {
      command: selectorProperties.commandError,
      error: errorObj,
    };
    officeContext
      .getOffice()
      .context.ui.messageParent(JSON.stringify(messageObject));
  };

  parsePopupState(popupState, promptsAnswers, formsPrivilege) {
    if (!popupState) {
      return;
    }
    let chapterKey;
    let visualizationKey;
    let dossierName;
    const { visualizationInfo } = popupState;
    if (visualizationInfo) {
      ({ chapterKey, visualizationKey } = visualizationInfo);
      const { dossierStructure } = visualizationInfo;
      if (dossierStructure) {
        ({ dossierName } = dossierStructure);
      }
    }
    const chosenObjectData = {
      chosenObjectId: popupState.id,
      instanceId: popupState.instanceId,
      projectId: popupState.projectId,
      chosenObjectName: popupState.name,
      chosenObjectType: popupState.objectType,
      chosenObjectSubtype: popupState.objectType === 'report' ? 768 : 779,
      promptsAnswers: promptsAnswers || popupState.promptsAnswers,
      subtotalsInfo: popupState.subtotalsInfo,
      isEdit: popupState.isEdit,
      visualizationInfo,
      dossierName,
      selectedViz: `${chapterKey}:${visualizationKey}`,
      displayAttrFormNames: popupState.displayAttrFormNames
    };
    if (promptsAnswers) {
      return this.comparePromptAnswers(popupState, promptsAnswers, chosenObjectData, formsPrivilege);
    }
    return this.restoreFilters(popupState.body, chosenObjectData, formsPrivilege);
  }

  comparePromptAnswers(popupState, promptsAnswers, chosenObjectData, formsPrivilege) {
    sortPromptsAnswers(popupState.promptsAnswers[0].answers);
    sortPromptsAnswers(promptsAnswers[0].answers);
    if (JSON.stringify(popupState.promptsAnswers) === JSON.stringify(promptsAnswers)) {
      return this.restoreFilters(popupState.body, chosenObjectData, formsPrivilege);
    }
    return chosenObjectData;
  }


  restoreFilters(body, chosenObjectData, formsPrivilege) {
    try {
      if (body) {
        const { requestedObjects, viewFilter } = body;
        if (requestedObjects) {
          const { attributes, metrics } = body.requestedObjects;
          chosenObjectData.selectedAttributes = attributes && attributes.map((attribute) => attribute.id);
          chosenObjectData.selectedMetrics = metrics && metrics.map((metric) => metric.id);
          chosenObjectData.selectedAttrForms = formsPrivilege ? this.getAttrFormKeys(attributes) : [];
        }
        if (viewFilter) {
          chosenObjectData.selectedFilters = this.parseFilters(body.viewFilter.operands);
        }
      }
    } catch (error) {
      console.warn(error);
    }
    return chosenObjectData;
  }

  getAttrFormKeys = (attributes) => {
    const checkedForms = [];
    attributes && [...attributes].forEach((attribute) => {
      attribute.forms && [...attribute.forms].forEach((form) => {
        checkedForms.push(`${attribute.id}-${form.id}`);
      });
    });
    return checkedForms;
  }

  parseFilters(filtersNodes) {
    if (filtersNodes && filtersNodes[0] && filtersNodes[0].operands) {
      // equivalent to flatMap((node) => node.operands)
      return this.parseFilters(filtersNodes.reduce((nodes, node) => nodes.concat(node.operands), []));
    }
    const elementNodes = filtersNodes.filter((node) => node.type === 'elements');
    // equivalent to flatMap((node) => node.elements)
    const reducedElements = elementNodes.reduce((elements, node) => elements.concat(node.elements), []);
    const elementsIds = reducedElements.map((elem) => elem.id);
    return elementsIds.reduce((filters, elem) => {
      const attrId = elem.split(':')[0];
      filters[attrId] = !filters[attrId] ? [elem] : [...filters[attrId], elem];
      return filters;
    }, {});
  }
}

export const popupHelper = new PopupHelper();
