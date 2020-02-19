import { officeContext } from '../office/office-context';

class AttributeSelectorHelpers {
  officeMessageParent = (
    command, chosenObjectId, projectId, chosenObjectSubtype, body,
    chosenObjectName, instanceId, promptsAnswers, subtotalsInfo, displayAttrFormNamesSet
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
      subtotalsInfo,
      displayAttrFormNames: displayAttrFormNamesSet
    };
    const Office = officeContext.getOffice();
    Office.context.ui.messageParent(JSON.stringify(updateObject));
  };
}

export const attributeSelectorHelpers = new AttributeSelectorHelpers();
