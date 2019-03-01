import {officeContext} from '../office/office-context';

class AttributeSelectorHelpers {
    officeMessageParent = (command, reportId, projectId, reportSubtype, body) => {
      const updateObject = {command, reportId, projectId, reportSubtype, body};
      const Office = officeContext.getOffice();

      Office.context.ui.messageParent(JSON.stringify(updateObject));
    };
}

export const attributeSelectorHelpers = new AttributeSelectorHelpers();
