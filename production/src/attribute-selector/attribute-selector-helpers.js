import {officeContext} from '../office/office-context';

class AttributeSelectorHelpers {
    officeMessageParent = (command, body) => {
      const updateObject = {command, body};
      const Office = officeContext.getOffice();

      Office.context.ui.messageParent(JSON.stringify(updateObject));
    };
}

export const attributeSelectorHelpers = new AttributeSelectorHelpers();
