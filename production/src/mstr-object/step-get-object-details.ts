import { mstrObjectRestService } from './mstr-object-rest-service';
import { generateDossierFilterText, generateReportFilterTexts } from './object-filter-helper';
import { FiltersText } from './object-filter-helper-types';

import { OperationData } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { ObjectData, VisualizationInfo } from '../types/object-types';

import operationErrorHandler from '../operation/operation-error-handler';
import operationStepDispatcher from '../operation/operation-step-dispatcher';
import {
  getObjectPrompts,
  populateDefinition,
  populateDetails,
} from './get-object-details-methods';

class StepGetObjectDetails {
  /**
   * Creates Instance definition object which contains data about MSTR object needed in next steps.
   *
   * If instance of an object does not exist, new one will be created.
   * All additional manipulations like prompts answers or body will be applied.
   *
   * This function is subscribed as one of the operation steps with the key GET_INSTANCE_DEFINITION,
   * therefore should be called only via operation bus.
   *
   * @param objectData.objectWorkingId Unique Id of the object allowing to reference specific object
   * @param objectData.displayAttrFormNames The style in which attribute form will be displayed
   * @param objectData.subtotalsInfo Determines if subtotals will be displayed and stores subtotal addresses
   * @param objectData.bindId Unique Id of the Office table used for referencing the table in Excel
   * @param objectData.visualizationInfo Contains information about location of visualization in dossier
   * @param operationData.stepsQueue Queue of steps in current operation
   */
  getObjectDetails = async (
    objectData: ObjectData,
    operationData: OperationData
  ): Promise<void> => {
    console.group('Get object details');
    console.time('Total');

    try {
      const { objectWorkingId, objectId, projectId, mstrObjectType } = objectData;

      const {
        ancestors,
        certifiedInfo,
        dateCreated,
        dateModified,
        description,
        owner,
        name,
        version,
      } = await mstrObjectRestService.getObjectInfo(objectId, projectId, mstrObjectType);
      console.log('objectData', objectData);

      const prompts = await getObjectPrompts(objectData, objectId, projectId, operationData);

      const getFilterInformation = async (): Promise<FiltersText> => {
        let filtersText;
        switch (mstrObjectType.name) {
          case 'report': {
            const reportDefinition = await mstrObjectRestService.getReportDefinition(
              objectId,
              projectId
            );
            return generateReportFilterTexts(reportDefinition);
          }
          case 'dossier': {
            const dossierDefinition = await mstrObjectRestService.getDossierDefinition(
              objectId,
              projectId
            );
            const { chapterKey } = objectData.visualizationInfo as VisualizationInfo;
            filtersText = {
              viewFilterText: generateDossierFilterText(dossierDefinition, chapterKey),
            };
            break;
          }
          default:
            // TODO: transform to string, cause it returns {operands: any[], operator: string}
            filtersText = { viewFilter: objectData.body?.viewFilter } as FiltersText;
        }
        return filtersText;
      };

      const objectFilters = await getFilterInformation();

      const details = populateDetails(
        ancestors,
        certifiedInfo,
        dateCreated,
        dateModified,
        description,
        objectFilters,
        owner,
        version
      );
      const definition = populateDefinition(objectData, prompts, name);

      const updatedObject = {
        ...objectData,
        ...(details ? { details } : {}),
        ...(definition ? { definition } : {}),
      };

      operationStepDispatcher.updateObject(updatedObject);
      operationStepDispatcher.completeGetObjectDetails(objectWorkingId);
    } catch (error) {
      console.trace('getObjectDetails: ', error);
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData, error);
    } finally {
      console.timeEnd('Total');
      console.groupEnd();
    }
  };
}

const stepGetObjectDetails = new StepGetObjectDetails();
export default stepGetObjectDetails;
