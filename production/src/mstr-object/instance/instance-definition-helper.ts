import { ObjectExecutionStatus } from '../../helpers/prompts-handling-helper';
import { mstrObjectRestService } from '../mstr-object-rest-service';

import { PageByData, PageByDisplayType } from '../../page-by/page-by-types';

import mstrObjectEnum from '../mstr-object-type-enum';

class InstanceDefinitionHelper {
  /**
   * Answers prompts and modify instance of the object.
   *
   * @param instanceDefinition Object containing information about MSTR object
   * @param objectId Id object neing currentrly imported
   * @param projectId Id of the Mstr project which object is part of
   * @param promptsAnswers Stored prompt answers
   * @param dossierData Contains information about dossier
   * @param body Contains requested objects and filters
   * @param displayAttrFormNames Contains information about displayed form attributes
   * @returns instanceDefinition object containing information about MSTR object
   */
  modifyInstanceWithPrompt = async ({
    instanceDefinition,
    objectId,
    projectId,
    promptsAnswers,
    dossierData,
    body,
    displayAttrFormNames,
  }: {
    instanceDefinition: any;
    objectId: string;
    projectId: string;
    promptsAnswers: any[];
    dossierData: any;
    body: any;
    displayAttrFormNames: any;
  }): Promise<any> => {
    // Status 2 = report has open prompts to be answered before data can be returned
    if (instanceDefinition.status !== ObjectExecutionStatus.PROMPTED) {
      return instanceDefinition;
    }

    try {
      let count = 0;

      while (
        instanceDefinition.status === ObjectExecutionStatus.PROMPTED &&
        count < promptsAnswers.length
      ) {
        const config = {
          objectId,
          projectId,
          instanceId: instanceDefinition.instanceId,
          promptsAnswers: promptsAnswers[count],
        };

        await mstrObjectRestService.answerPrompts(config);

        const configInstance = {
          ...config,
          dossierData,
          body,
          displayAttrFormNames,
        };

        if (count === promptsAnswers.length - 1) {
          instanceDefinition = await mstrObjectRestService.modifyInstance(configInstance);
        }

        count += 1;
      }

      return instanceDefinition;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * Gets page-by elements ids and modifies instance of the object.
   *
   * @param objectData Contains information about MSTR object
   * @param pageByData Contains information about page-by elements
   * @param instanceDefinition Object containing information about MSTR object
   * @param body Contains requested objects and filters.
   * @returns instanceDefinition object containing information about MSTR object
   */
  modifyInstanceForPageBy = async (
    objectData: any,
    pageByData: PageByData,
    instanceDefinition: any,
    body: any
  ): Promise<any> => {
    if (!pageByData || pageByData?.pageByDisplayType === PageByDisplayType.DEFAULT_PAGE) {
      return instanceDefinition;
    }

    const currentPageBy = pageByData?.elements.map(value => ({ id: value.valueId }));

    const configInstance = {
      ...objectData,
      instanceId: instanceDefinition.instanceId,
      body: { ...body, currentPageBy },
    };

    return mstrObjectRestService.modifyInstance(configInstance);
  };

  /**
   * Creates instance of a report and modifies it with given prompt answer.
   *
   * @param objectData Contains information about MSTR object
   * @returns instanceDefinition object containing information about MSTR object
   */
  createReportInstance = async (objectData: any): Promise<any> => {
    if (objectData.mstrObjectType !== mstrObjectEnum.mstrObjectType.report) {
      return;
    }

    const instanceDefinition = await mstrObjectRestService.createInstance(objectData);

    return this.modifyInstanceWithPrompt({
      instanceDefinition,
      ...objectData,
    });
  };
}

const instanceDefinitionHelper = new InstanceDefinitionHelper();
export default instanceDefinitionHelper;
