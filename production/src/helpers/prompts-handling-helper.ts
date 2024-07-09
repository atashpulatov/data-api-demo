import { dialogHelper } from '../dialog/dialog-helper';
import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';

import { DialogCommands } from '../dialog/dialog-controller-types';
import {
  AnswersState,
  PromptObject,
  PromptsAnswer,
} from '../redux-reducer/answers-reducer/answers-reducer-types';

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
 * @param {*} promptObjects prompts from instance if the object is being imported otherwise from the object
 * reducer based on the condition checked in prompt-window's loadEmbeddedDossier: updatedPromptObjects
 * @param {*} previousPromptsAnswers are obtained from the persisted answers
 * @returns
 */
export function prepareGivenPromptAnswers(
  promptObjects: PromptObject[],
  previousPromptsAnswers: PromptsAnswer[]
): AnswersState[] {
  const resAnswers: PromptsAnswer[] = [];
  // Loop through the prompts objects and find the corresponding answer from the persisted answers.
  // and assign the 'type' property to the answer. Also, mark the answer as 'useDefault'
  // if it is not required and has no values.
  if (promptObjects.length > 0) {
    promptObjects?.forEach(promptObject => {
      const previousPromptIndex = previousPromptsAnswers.findIndex(
        answerPrmpt => answerPrmpt && answerPrmpt.key === promptObject.key
      );
      if (previousPromptIndex >= 0) {
        const tempAnswer = { ...previousPromptsAnswers[previousPromptIndex] };
        if (!promptObject.required && tempAnswer.values.length === 0) {
          tempAnswer.useDefault = true;
        }
        resAnswers.push(tempAnswer);
      }
    });
  }
  return [{ messageName: 'New Dossier', answers: resAnswers }];
}

/**
 * This method is used to answer the prompts of the Dossier's instance.
 * It will loop through the prompts and answer them along with nested prompts
 * @param {*} instanceDefinition
 * @param {*} objectId
 * @param {*} projectId
 * @param {*} promptsAnswers - is in the following format,
 * representing the preparedPromptAnswers, or the object cached prompt answers, or answers from instance
[
  {
    messageName: 'New Dossier',
    answers: [
      {
        key: '2C8E58F049B088D631DE75B4C1F25EAB@0@10',
        values: [
          '<rsl lcl="1033"><pa key="2C8E58F049B088D631DE75B4C1F25EAB@0@10"><exp >
          <nd et="14" nt="4" dmt="1" ddt="-1"><nd et="5" nt="4" dmt="1" ddt="-1"><nd et="1" nt="5" dmt="1" ddt="-1">
          <at did="8D679D3811D3E4981000E787EC6DE8A4" tp="12" stp="3072" n="Country" disp_n="Country"></at>
          </nd><nd et="1" nt="2" dmt="1" ddt="-1"><mi ><es >
          <at did="8D679D3811D3E4981000E787EC6DE8A4" tp="12" stp="3072" n="Country" disp_n="Country"></at>
          <e ei="8D679D3811D3E4981000E787EC6DE8A4:1" emt="1" disp_n="USA"></e></es></mi></nd><op fnt="22"></op></nd>
          <op fnt="19"></op></nd></exp></pa></rsl>'
        ],
        useDefault: false,
        answers?: [...] , //optional; TODO for m2021: the REST API rejects this as it is not needed. Should be removed.
        type?: string // optional; TODO for m2021: the REST API rejects this as it is not needed. Should be removed.
      }
    ]
  },
  {
    messageName: 'New Dossier',
    answers: [
      {
        key: '607711684CA10A102176B097D5EFA39F@0@10',
        values: [
          '8D679D4B11D3E4981000E787EC6DE8A4:4~1048576~Central'
        ],
        useDefault: false,
        answers?: [...] , //optional;  TODO for m2021: the REST API rejects this as it is not needed. Should be removed.
        type?: string // optional  TODO for m2021: the REST API rejects this as it is not needed. Should be removed.
      }
    ]
  }
]
 * @param {*} previousPromptAnswers - persisted answers from answer reducer
 * @returns
 */
export async function answerDossierPromptsHelper(
  instanceDefinition: any,
  objectId: string,
  projectId: string,
  promptsAnswers: AnswersState[],
  previousPromptAnswers: PromptsAnswer[],
  currentReportPromptKeys: AnswersState[]
): Promise<any> {
  const currentInstanceDefinition = { ...instanceDefinition };
  let count = 0;

  // Loop through the prompts and answer them until the instance is not prompted anymore.
  while (currentInstanceDefinition.status === ObjectExecutionStatus.PROMPTED) {
    const config = {
      objectId,
      projectId,
      instanceId: currentInstanceDefinition.mid,
      promptsAnswers: promptsAnswers[count]
        ? promptsAnswers[count]
        : {
            messageName: 'New Dossier',
            answers: [] as any[],
          },
      ignoreValidateRequiredCheck: true,
    };
    let tempPromptsAnswers: AnswersState;
    if (promptsAnswers[count] !== undefined) {
      tempPromptsAnswers = promptsAnswers[count];
      await mstrObjectRestService.answerDossierPrompts(config);
    } else {
      const prompts = await mstrObjectRestService.getObjectPrompts(
        objectId,
        projectId,
        config.instanceId
      );
      const [preparedAnswers] = prepareGivenPromptAnswers(prompts, previousPromptAnswers);
      config.promptsAnswers = preparedAnswers;
      tempPromptsAnswers = preparedAnswers;
      await mstrObjectRestService.answerDossierPrompts(config);
    }

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

    // add keys from prompts to the currentReportPromptKeys
    currentReportPromptKeys.push(tempPromptsAnswers);
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
  promptsAnswers: AnswersState[],
  previousPromptsAnswers: PromptsAnswer[]
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
        promptsAnswers,
        previousPromptsAnswers,
        []
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
 * Forces the prompt dialog to open by making a re-prompt request for the dossier instance.
 * Updates the dossier instance definition with the new mid if the re-prompt is successful.
 * Happens only re-use prompt answers is turned off or when reuse prompt answer is on and
 * the prompt answers are not provided yet by any other prompt in the reprompts queue.
 *
 * @param {string} chosenObjectIdLocal - The ID of the chosen dossier object.
 * @param {any} dossierInstanceDefinition - The dossier instance definition to be updated.
 * @param {string} projectId - The ID of the project.
 * @returns {Promise<any>} - A promise that resolves to the updated dossier instance definition.
 */

async function forceOpenPromptDialog(
  chosenObjectIdLocal: string,
  dossierInstanceDefinition: any,
  projectId: string
): Promise<any> {
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
 * Collects unique prompt keys from an array of prompt objects.
 *
 * @param {Object[]} promptObjs - An array of prompt objects potentially containing keys
 * @param {string[]} [keys=[]] - The unique prompt keys from redux reprompt queue state.
 * @returns {string[]} An array of unique keys collected from the prompt objects.
 */
export const collectPromptKeys = (promptObjs: { key: string }[], keys: string[] = []): string[] => {
  promptObjs.forEach(promptObject => {
    if (promptObject.key && !keys.includes(promptObject.key)) {
      keys.push(promptObject.key);
    }
  });
  return keys;
};

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
  promptsAnswers: AnswersState[],
  previousAnswers: PromptsAnswer[],
  promptKeys: string[],
  currentReportPromptKeys: AnswersState[]
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
        promptsAnswers,
        previousAnswers,
        currentReportPromptKeys
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

  // compare currentReportPromptKeys with promptKeys
  const currentReportPromptKeysArray = currentReportPromptKeys.flatMap(obj =>
    obj.answers.map((answer: { key: any }) => answer.key)
  );
  const hasAllKeys = currentReportPromptKeysArray.every(key => promptKeys.includes(key));

  if (!hasAllKeys) {
    // Re-prompt the Dossier's instance to change execution status to 2 and force Prompts' dialog to open.
    dossierInstanceDefinition = await forceOpenPromptDialog(
      chosenObjectIdLocal,
      dossierInstanceDefinition,
      projectId
    );
  }
  return dossierInstanceDefinition;
}

/**
 * Sends a message to the sidepanel in order to execute the next reprompt task.
 */
export const handleExecuteNextRepromptTask = (): void => {
  const message = { command: DialogCommands.COMMAND_EXECUTE_NEXT_REPROMPT_TASK };
  dialogHelper.officeMessageParent(message);
};
