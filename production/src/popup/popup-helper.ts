import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';

import { selectorProperties } from '../attribute-selector/selector-properties';
import { officeContext } from '../office/office-context';

class PopupHelper {
  handlePopupErrors(error: any): void {
    const errorObj = error && {
      status: error.status,
      message: error.message,
      response: error.response,
      type: error.type,
    };
    const { commandError } = selectorProperties;
    const message = {
      command: commandError,
      error: errorObj,
    };
    this.officeMessageParent(message);
  }

  officeMessageParent(message: any): void {
    const office = officeContext.getOffice();
    office.context.ui.messageParent(JSON.stringify(message));
  }

  parsePopupState(popupState: any, promptsAnswers: any, formsPrivilege: boolean): any {
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
      objectWorkingId: popupState.objectWorkingId,
      chosenObjectId: popupState.id || popupState.objectId,
      instanceId: popupState.instanceId,
      projectId: popupState.projectId,
      chosenObjectName: popupState.name,
      chosenObjectType: popupState.mstrObjectType,
      chosenObjectSubtype: popupState.mstrObjectType.name === 'report' ? 768 : 779,
      promptsAnswers: promptsAnswers.length ? promptsAnswers : popupState.promptsAnswers,
      subtotalsInfo: popupState.subtotalsInfo,
      isEdit: popupState.isEdit,
      visualizationInfo,
      dossierName,
      selectedViz: `${chapterKey}:${visualizationKey}`,
      displayAttrFormNames: popupState.displayAttrFormNames,
      pageByData: popupState.pageByData,
    };

    return this.restoreFilters(popupState.body, chosenObjectData, formsPrivilege);
  }

  restoreFilters(body: any, chosenObjectData: any, formsPrivilege: boolean): any {
    try {
      if (body) {
        const { requestedObjects, viewFilter } = body;
        if (requestedObjects) {
          const { attributes, metrics } = body.requestedObjects;
          if (attributes && attributes.length !== 0) {
            chosenObjectData.selectedAttributes = attributes.map((attribute: any) => attribute.id);
            chosenObjectData.selectedAttrForms = formsPrivilege
              ? this.getAttrFormKeys(attributes)
              : [];
          }
          if (metrics && metrics.length !== 0) {
            chosenObjectData.selectedMetrics = metrics.map((metric: any) => metric.id);
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

  getAttrFormKeys(attributes: any): string[] {
    const checkedForms: string[] = [];
    attributes &&
      [...attributes].forEach(attribute => {
        attribute.forms &&
          [...attribute.forms].forEach(form => {
            checkedForms.push(`${attribute.id}-${form.id}`);
          });
      });
    return checkedForms;
  }

  parseFilters(filtersNodes: any): any[] {
    if (filtersNodes && filtersNodes[0] && filtersNodes[0].operands) {
      // equivalent to flatMap((node) => node.operands)
      return this.parseFilters(
        filtersNodes.reduce((nodes: any, node: any) => nodes.concat(node.operands), [])
      );
    }
    const elementNodes = filtersNodes.filter((node: any) => node.type === 'elements');
    // equivalent to flatMap((node) => node.elements)
    const reducedElements = elementNodes.reduce(
      (elements: any, node: any) => elements.concat(node.elements),
      []
    );
    const elementsIds = reducedElements.map((element: any) => element.id);
    return elementsIds.reduce((filters: any, element: any) => {
      const attrId = element.split(':')[0];
      filters[attrId] = !filters[attrId] ? [element] : [...filters[attrId], element];
      return filters;
    }, {});
  }

  /**
   * Determines whether the currently open dialog is displaying the prompts editor for a report
   * in the Overview dialog, or from the SidePanel.
   *
   * @param popupType - The type of the popup to check.
   * @returns - returns true if the popup type is a prompted report.
   */
  isRepromptReportPopupType(popupType: DialogType): boolean {
    return (
      popupType === DialogType.repromptingWindow ||
      popupType === DialogType.repromptReportDataOverview
    );
  }
}

export const popupHelper = new PopupHelper();
