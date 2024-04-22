import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';

import { PromptsAnswer } from '../redux-reducer/answers-reducer/answers-reducer-types';

const sleep = (milliseconds: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });

export const ObjectExecutionStatus = {
  READY: 1,
  PROMPTED: 2,
};

/**
 * This function is used to prepare the prompts answers to be used in answering the prompted Dossier's instance.
 * It will loop through both the prompts objects (instance) and previously given answers (persisted)
 * to prepare final collection of prompt answers.
 * @param promptObjects
 * @param previousPromptsAnswers
 * @returns
 */
export function prepareGivenPromptAnswers(
  promptObjects: any[],
  previousPromptsAnswers: PromptsAnswer[]
): any[] {
  const givenPromptsAnswers: any[] = [{ messageName: 'New Dossier', answers: [] }];

  // Loop through the prompts objects and find the corresponding answer from the persisted answers.
  // and assign the 'type' property to the answer. Also, mark the answer as 'useDefault'
  // if it is not required and has no values.
  promptObjects?.forEach(promptObject => {
    const previousPromptIndex = previousPromptsAnswers.findIndex(
      answerPrmpt => answerPrmpt && answerPrmpt.key === promptObject.key
    );
    if (previousPromptIndex >= 0) {
      const tempAnswer = {
        ...previousPromptsAnswers[previousPromptIndex],
        type: promptObject.type,
      };
      if (!promptObject.required && tempAnswer.values.length === 0) {
        tempAnswer.useDefault = true;
      }
      givenPromptsAnswers[0].answers.push(tempAnswer);
    }
  });

  return givenPromptsAnswers;
}

/**
 * This method is used to answer the prompts of the Dossier's instance.
 * It will loop through the prompts and answer them along with nested prompts
 * @param {*} instanceDefinition
 * @param {*} objectId
 * @param {*} projectId
 * @param {*} promptsAnswers
 * @returns
 */
export async function answerDossierPromptsHelper(
  instanceDefinition: any,
  objectId: string,
  projectId: string,
  promptsAnswers: PromptsAnswer[]
): Promise<any> {
  const currentInstanceDefinition = { ...instanceDefinition };
  let count = 0;

  // Loop through the prompts and answer them until the instance is not prompted anymore.
  while (currentInstanceDefinition.status === ObjectExecutionStatus.PROMPTED) {
    const config = {
      objectId,
      projectId,
      instanceId: currentInstanceDefinition.mid,
      promptsAnswers: promptsAnswers[count] ? promptsAnswers[count] : ({ answers: [] } as any),
      ignoreValidateRequiredCheck: true,
    };

    await mstrObjectRestService.answerDossierPrompts(config);

    let dossierStatusResponse = await mstrObjectRestService.getDossierStatus(
      objectId,
      currentInstanceDefinition.mid,
      projectId
    );

    // Keep fetching the status of the Dossier's instance until request is no longer
    // being processed (statusCode => 202).
    // When statusCode is 202, it means that the Dossier's instance is done processing.
    while (dossierStatusResponse.statusCode === 202) {
      await sleep(1000);
      dossierStatusResponse = await mstrObjectRestService.getDossierStatus(
        objectId,
        currentInstanceDefinition.mid,
        projectId
      );
    }
    currentInstanceDefinition.status = dossierStatusResponse.body.status;

    count += 1;
  }

  return currentInstanceDefinition;
}

/**
 * This method is used to prepare the Dossier's instance to apply previous answers.
 * It will validated instance is prompted prior to applying prompts.
 * If prompted, it will answer the prompts and return the updated instance definition.
 * @param instanceDefinition
 * @param dossierId
 * @param projectId
 * @param promptsAnswers
 * @returns
 */
export async function preparePromptedDossier(
  instanceDefinition: any,
  dossierId: string,
  projectId: string,
  promptsAnswers: PromptsAnswer[]
): Promise<any> {
  let dossierInstanceDefinition = { ...instanceDefinition };
  if (dossierInstanceDefinition?.status === ObjectExecutionStatus.PROMPTED) {
    // Re-prompt the Dossier's instance to apply previous answers. Get new instance definition.
    const rePromptResponse = await mstrObjectRestService.rePromptDossier(
      dossierId,
      instanceDefinition.mid,
      projectId
    );
    dossierInstanceDefinition.mid = rePromptResponse.mid;

    try {
      // Loop through the prompts and answer them.
      dossierInstanceDefinition = await answerDossierPromptsHelper(
        dossierInstanceDefinition,
        dossierId,
        projectId,
        promptsAnswers
      );
    } catch (error) {
      console.error('Error applying prompt answers:', error);

      // Proceed with creating a new Dossier's instance to ensure prompts
      // are rendered with default values. No saved answers will be applied.
      // Delete the current Dossier's instance and create a new one based on the dossier Id.
      await mstrObjectRestService.deleteDossierInstance(
        projectId,
        dossierId,
        dossierInstanceDefinition.mid
      );

      const body = { disableManipulationsAutoSaving: false, persistViewState: true };
      dossierInstanceDefinition = await mstrObjectRestService.createDossierInstance(
        projectId,
        dossierId,
        body
      );

      return dossierInstanceDefinition;
    }
  }

  return dossierInstanceDefinition;
}

/**
 * Resets current prompted instance by deleting in and creating a new one based on the report.
 * This is used to ensure that the prompts are rendered with default values and force the user
 * to answer them again starting with a clean slate even for nested prompts.
 *
 * @param {*} projectId - project id
 * @param {*} objectId - report's objectId
 * @param {*} sourceReportInstanceId - instance Id of the current report's instance
 * @param {*} dossierInstanceId - dossier instance definition
 * @returns
 */
async function resetDossierInstance(
  projectId: string,
  objectId: string,
  sourceReportInstanceId: string,
  dossierInstanceId: string
): Promise<any> {
  // Delete the Dossier's instance to remove lingering one.
  await mstrObjectRestService.deleteDossierInstance(projectId, objectId, dossierInstanceId);

  // Create a new prompted Dossier's instance based on the report
  const dossierInstanceDefinition = await mstrObjectRestService.createDossierBasedOnReport(
    objectId,
    sourceReportInstanceId,
    projectId
  );

  return dossierInstanceDefinition;
}

/**
 * This function is used to prepare the prompted report to apply previously saved ir given answers
 * if applicable. It will create an instance of the report and then create a Dossier based on that instance.
 * And it will apply the answers to the prompts of the Dossier's instance, including nested prompts.
 * @param chosenObjectIdLocal
 * @param projectId
 * @param promptsAnswers
 * @returns
 */
export async function preparePromptedReport(
  chosenObjectIdLocal: string,
  projectId: string,
  promptsAnswers: any[]
): Promise<any> {
  const config: any = { objectId: chosenObjectIdLocal, projectId };
  const instanceDefinition = await mstrObjectRestService.createInstance(config);
  const { instanceId } = instanceDefinition;

  // execute and create an instance so we can get the prompts answers applied to it.
  let dossierInstanceDefinition = await mstrObjectRestService.createDossierBasedOnReport(
    chosenObjectIdLocal,
    instanceId,
    projectId
  );

  // Do not try answering prompts if collection is empty.
  if (
    promptsAnswers?.length > 0 &&
    promptsAnswers[0].answers?.length > 0 &&
    dossierInstanceDefinition.status === ObjectExecutionStatus.PROMPTED
  ) {
    try {
      // Reflect saved answers to the prompts of the Dossier's instance if applicable.
      dossierInstanceDefinition = await answerDossierPromptsHelper(
        dossierInstanceDefinition,
        chosenObjectIdLocal,
        projectId,
        promptsAnswers
      );
    } catch (error) {
      console.error('Error applying prompt answers:', error);

      // Proceed with creating a new Dossier's instance based on the report and ensure prompts
      // are rendered with default values. No saved answers will be applied.
      dossierInstanceDefinition = await resetDossierInstance(
        projectId,
        chosenObjectIdLocal,
        instanceId,
        dossierInstanceDefinition.mid
      );

      return dossierInstanceDefinition;
    }
  }

  // Re-prompt the Dossier's instance to change execution status to 2 and force Prompts' dialog to open.
  const repromptResponse = await mstrObjectRestService.rePromptDossier(
    chosenObjectIdLocal,
    dossierInstanceDefinition.mid,
    projectId
  );

  if (repromptResponse?.mid) {
    dossierInstanceDefinition.mid = repromptResponse.mid;
    dossierInstanceDefinition.id = chosenObjectIdLocal;
  }

  return dossierInstanceDefinition;
}
