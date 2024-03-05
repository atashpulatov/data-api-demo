import { officeContext } from '../office/office-context';
import { selectorProperties } from '../attribute-selector/selector-properties';

class PopupHelper {
  handlePopupErrors = (error) => {
    const errorObj = error
     && {
       status: error.status,
       message: error.message,
       response: error.response,
       type: error.type
     };
    const { commandError } = selectorProperties;
    const message = {
      command: commandError,
      error: errorObj,
    };
    this.officeMessageParent(message);
  };

  officeMessageParent = (message) => {
    const office = officeContext.getOffice();
    office.context.ui.messageParent(JSON.stringify(message));
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
      chosenObjectId: popupState.id || popupState.objectId,
      instanceId: popupState.instanceId,
      projectId: popupState.projectId,
      chosenObjectName: popupState.name,
      chosenObjectType: popupState.mstrObjectType,
      chosenObjectSubtype: popupState.mstrObjectType === 'report' ? 768 : 779,
      promptsAnswers: promptsAnswers || popupState.promptsAnswers,
      subtotalsInfo: popupState.subtotalsInfo,
      isEdit: popupState.isEdit,
      visualizationInfo,
      dossierName,
      selectedViz: `${chapterKey}:${visualizationKey}`,
      displayAttrFormNames: popupState.displayAttrFormNames
    };

    return this.restoreFilters(popupState.body, chosenObjectData, formsPrivilege);
  }

  restoreFilters(body, chosenObjectData, formsPrivilege) {
    try {
      if (body) {
        const { requestedObjects, viewFilter } = body;
        if (requestedObjects) {
          const { attributes, metrics } = body.requestedObjects;
          if (attributes && attributes.length !== 0) {
            chosenObjectData.selectedAttributes = attributes.map((attribute) => attribute.id);
            chosenObjectData.selectedAttrForms = formsPrivilege ? this.getAttrFormKeys(attributes) : [];
          }
          if (metrics && metrics.length !== 0) {
            chosenObjectData.selectedMetrics = metrics.map((metric) => metric.id);
          }
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
  };

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
