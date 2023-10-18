import { mstrObjectRestService } from '../mstr-object/mstr-object-rest-service';

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

  // Loop through the prompts objects and find the corresponding answer from the persisted answers.
  // and assign the 'type' property to the answer. Also, mark the answer as 'useDefault'
  // if it is not required and has no values.
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
      promptsAnswers: promptsAnswers[count] ? promptsAnswers[count] : { answers: [] },
      bIncludeIgnoreRequiredPrompts: true,
    };

    // Applying prompt answers to current instead of forcing the instance to execute the prompts.
    // as indicated in:
    // https://microstrategy.github.io/rest-api-docs/common-workflows/analytics/use-prompts-objects/answer-prompts/#nested-prompts
    count > 0 ? await mstrObjectRestService.applyDossierPrompts(config)
      : await mstrObjectRestService.updateDossierPrompts(config);

    let dossierStatusResponse = await mstrObjectRestService
      .getDossierStatus(objectId, currentInstanceDefinition.mid, projectId);

    // Keep fetching the status of the Dossier's instance until request is no longer
    // being processed (statusCode => 202).
    // When statusCode is 202, it means that the Dossier's instance is done processing.
    while (dossierStatusResponse.statusCode === 202) {
      await sleep(1000);
      dossierStatusResponse = await mstrObjectRestService
        .getDossierStatus(objectId, currentInstanceDefinition.mid, projectId);
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
  let dossierInstanceDefinition = { ...instanceDef };
  if (dossierInstanceDefinition && dossierInstanceDefinition.status === 2) {
    // Re-prompt the Dossier's instance to apply previous answers. Get new instance definition.
    const rePromptResponse = await mstrObjectRestService.rePromptDossier(objectId, instanceDef.mid, projectId);
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
 * This function is used to prepare the prompted report to apply previously saved ir given answers
 * if applicable. It will create an instance of the report and then create a Dossier based on that instance.
 * And it will apply the answers to the prompts of the Dossier's instance, including nested prompts.
 * @param {*} chosenObjectIdLocal
 * @param {*} projectId
 * @param {*} promptsAnswers
 * @returns
 */
export async function preparePromptedReport(chosenObjectIdLocal, projectId, promptsAnswers) {
  const config = { objectId: chosenObjectIdLocal, projectId };
  const instanceDefinition = await mstrObjectRestService.createInstance(config);
  const { instanceId } = instanceDefinition;

  // execute and create an instance so we can get the prompts answers applied to it.
  let dossierInstanceDefinition = await mstrObjectRestService
    .createDossierBasedOnReport(chosenObjectIdLocal, instanceId, projectId);

  if (promptsAnswers?.length > 0 && dossierInstanceDefinition.status === 2) {
    // Reflect saved answers to the prompts of the Dossier's instance if applicable.
    dossierInstanceDefinition = await answerDossierPromptsHelper(
      dossierInstanceDefinition,
      chosenObjectIdLocal,
      projectId,
      promptsAnswers
    );
  }

  // Re-prompt the Dossier's instance to change execution status to 2 and force Prompts' dialog to open.
  const repromptResponse = await mstrObjectRestService
    .rePromptDossier(chosenObjectIdLocal, dossierInstanceDefinition.mid, projectId);
  dossierInstanceDefinition.mid = repromptResponse.mid;
  dossierInstanceDefinition.id = chosenObjectIdLocal;

  return dossierInstanceDefinition;
}

/**
 * Updates answers with answers and types from server definition.
 * @param {} answers
 * @param {*} answerDefMap
 */
function addDefDataToAnswers(answers, answerDefMap) {
  answers.forEach(answer => {
    const answerDef = answerDefMap.get(answer.key);

    answerDef?.answers && (answer.answers = answerDef.answers);
    answerDef?.type && (answer.type = answerDef.type);
  });
}

/**
 * Append the server's version of the answers to the promptsAnswers object.
 * This version of answers will be used to invoke the REST API endpoint when
 * importing or re-prompting a report/dossier.
 * @param {*} currentAnswers - An array of answers to be updated, passed in as reference object
 * @param {*} promptsAnsDef
 * @param {*} areReportAnswers - if true, will update answers for nested answers.
*/
function updateAnswersWithPromptsDef(currentAnswers, promptsAnsDef, areReportAnswers) {
  const answerDefMap = new Map(promptsAnsDef.map(prompt => [prompt.key, prompt]));

  if (areReportAnswers) { // Reports, one level deep down
    currentAnswers.forEach(currentAnswer => {
      const { answers } = currentAnswer;
      addDefDataToAnswers(answers, answerDefMap);
    });
  } else { // Dossiers
    addDefDataToAnswers(currentAnswers, answerDefMap);
  }
}

/**
 * Merges the answers from the server with the answers from the Embedded API.
 * Dossiers and Reports have different ways to structure the answers; hence, the need
 * to use flag to indicate whether the answers are deep (Reports) or not (Dossiers).
 * @param {*} objectId
 * @param {*} projectId
 * @param {*} instanceId
 * @param {*} currentAnswers - reference to array with answers to be updated
 * @param {*} areReportAnswers - if true, will process Report's JSON structure for answers.
 */
export async function mergeAnswersWithPromptsDefined(objectId, projectId, instanceId,
  currentAnswers, areReportAnswers = true) {
  // Do nothing if there are no answers to be updated
  if (currentAnswers?.length === 0) {
    return;
  }

  // Get the answers applied to the current dossier's instance from the server.
  // Need to incorporate these answers because they're formatted differently than the ones
  // returned by the Embedded API. The REST API endpoint expects the answers to be in a
  // different format than the Embedded API.
  const promptsAnsDef = await mstrObjectRestService.getObjectPrompts(objectId, projectId, instanceId, true);

  // Update answers based on promptsAnsDef to insert JSON answers from server
  // this JSON structure is expected by the REST API endpoint
  promptsAnsDef?.length > 0 && updateAnswersWithPromptsDef(currentAnswers, promptsAnsDef, areReportAnswers);
}
