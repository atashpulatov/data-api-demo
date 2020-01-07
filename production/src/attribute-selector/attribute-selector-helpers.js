import { officeContext } from '../office/office-context';

class AttributeSelectorHelpers {
  officeMessageParent = (
    command, chosenObjectId, projectId, chosenObjectSubtype, body, chosenObjectName, instanceId, promptsAnswers, importSubtotal,
  ) => {
    const updateObject = {
      command,
      chosenObjectId,
      projectId,
      chosenObjectSubtype,
      body,
      chosenObjectName,
      instanceId,
      promptsAnswers,
      isPrompted: !!promptsAnswers,
      importSubtotal
    };
    const Office = officeContext.getOffice();
    Office.context.ui.messageParent(JSON.stringify(updateObject));
  };
}

export const attributeSelectorHelpers = new AttributeSelectorHelpers();
