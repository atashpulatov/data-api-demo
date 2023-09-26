import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';

const {
  rePromptDossier,
  answerDossierPrompts,
  getDossierStatus,
  createInstance,
  createDossierBasedOnReport,
} = mstrObjectRestService;

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

/**
 * This function is used to prepare the prompts answers to be used in answering the prompted Dossier's instance.
 * It will loop through both the prompts objects (instance) and previously given answers (persisted)
 * to prepare final collection of prompt answers.
 * @param {*} promptObjects
 * @param {*} previousPromptsAnswers
 * @returns
 */
export function prepareGivenPromptAnswers(promptObjects, previousPromptsAnswers) {
  const givenPromptsAnswers = [{ messageName: 'New Dossier', answers: [] }];
  promptObjects.forEach((promptObject) => {
    const previousPromptIndex = previousPromptsAnswers.findIndex(
      (answerPrmpt) => answerPrmpt && answerPrmpt.key === promptObject.key
    );
    if (previousPromptIndex >= 0) {
      const tempAnswer = { ...previousPromptsAnswers[previousPromptIndex], type: promptObject.type };
      if (!promptObject.required && tempAnswer.values.length === 0) {
        tempAnswer.useDefault = true;
      }
      givenPromptsAnswers[0].answers.push(tempAnswer);
    } else if (promptObject.required) {
      givenPromptsAnswers[0].answers.push({
        key: promptObject.key, useDefault: true, type: promptObject.type, values: []
      });
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
export async function answerDossierPromptsHelper(instanceDefinition, objectId, projectId, promptsAnswers) {
  const currentInstanceDefinition = { ...instanceDefinition };
  let count = 0;

  // Loop through the prompts and answer them until the instance is not prompted anymore.
  while (currentInstanceDefinition.status === 2) {
    const config = {
      objectId,
      projectId,
      instanceId: currentInstanceDefinition.mid,
      promptsAnswers: promptsAnswers[count]
    };

    await answerDossierPrompts(config);
    await sleep(500);

    let dossierStatusResponse = await getDossierStatus(objectId, currentInstanceDefinition.mid, projectId);
    while (dossierStatusResponse.statusCode === 202) {
      await sleep(100);
      dossierStatusResponse = await getDossierStatus(objectId, currentInstanceDefinition.mid, projectId);
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
 * @param {*} instanceDef
 * @param {*} objectId
 * @param {*} projectId
 * @param {*} promptsAnswers
 * @returns
 */
export async function preparePromptedDossier(instanceDef, objectId, projectId, promptsAnswers) {
  let dossierInstanceDefinition = instanceDef; // || await createDossierInstance(projectId, objectId);
  if (dossierInstanceDefinition.status === 2) {
    // Re-prompt the Dossier's instance to apply previous answers. Get new instance definition.
    const rePromptResponse = await rePromptDossier(objectId, instanceDef.mid, projectId);
    dossierInstanceDefinition.mid = rePromptResponse.mid;

    // Loop through the prompts and answer them.
    dossierInstanceDefinition = await answerDossierPromptsHelper(
      dossierInstanceDefinition,
      objectId,
      projectId,
      promptsAnswers
    );
  }

  return dossierInstanceDefinition;
}

/**
 *
 * @param {*} chosenObjectIdLocal
 * @param {*} projectId
 * @param {*} promptsAnswers
 * @returns
 */
export async function preparePromptedReport(chosenObjectIdLocal, projectId, promptsAnswers) {
  const config = { objectId: chosenObjectIdLocal, projectId };
  const instanceDefinition = await createInstance(config);
  const { instanceId } = instanceDefinition;

  let dossierInstanceDefinition = await createDossierBasedOnReport(chosenObjectIdLocal, instanceId, projectId);

  if (dossierInstanceDefinition.status === 2) {
    dossierInstanceDefinition = await answerDossierPromptsHelper(
      dossierInstanceDefinition,
      chosenObjectIdLocal,
      projectId,
      promptsAnswers
    );
  }

  const repromptResponse = await rePromptDossier(chosenObjectIdLocal, dossierInstanceDefinition.mid, projectId);
  dossierInstanceDefinition.mid = repromptResponse.mid;
  dossierInstanceDefinition.id = chosenObjectIdLocal;

  return dossierInstanceDefinition;
}
