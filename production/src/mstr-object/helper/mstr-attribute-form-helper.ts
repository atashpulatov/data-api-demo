import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';

class MstrAttributeFormHelper {
  /**
   * Split attribute forms with their own column information,
   * only if the user has privileges.
   *
   * @param {Array} columns column definition from MicroStrategy
   * @param {Boolean} supportForms user's privilege to use attribute forms
   * @returns {Array} column information including attribute forms
   */
  splitAttributeForms = (columns: any[], supportForms: boolean): any[] => {
    const fullColumnInformation: any[] = [];
    columns.forEach(column => {
      const type = column.type ? column.type.toLowerCase() : null;
      switch (type) {
        case 'metric':
          fullColumnInformation.push({
            category: column.numberFormatting.category,
            formatString: column.numberFormatting.formatString,
            id: column.id,
            isAttribute: false,
            name: column.name,
          });
          break;
        case 'attribute':
        case 'customgroup':
        case 'consolidation':
          if (column.forms && supportForms) {
            for (const form of column.forms) {
              fullColumnInformation.push({
                attributeId: column.id,
                attributeName: column.name,
                forms: [form],
                isAttribute: true,
              });
            }
          } else {
            fullColumnInformation.push({
              attributeId: column.id,
              attributeName: column.name,
              forms: column.forms ? column.forms : [],
              isAttribute: true,
            });
          }
          break;
        default:
          fullColumnInformation.push({});
      }
    });
    return fullColumnInformation;
  };

  /**
   * Get attribute title names with attribute forms
   *
   * @param element Object definition element from response
   * @param attrforms Dispay attribute form names setting inside office-properties.js
   * @returns Contains arrays of columns and rows attributes forms names
   */
  getAttributesTitleWithForms = (element: any, attrforms: any): any | false => {
    const supportForms = attrforms ? attrforms.supportForms : false;
    const nameSet = attrforms && attrforms.displayAttrFormNames;
    const { displayAttrFormNames } = officeProperties;
    const titles = [];

    if (supportForms && element.type === 'attribute' && element.forms.length >= 0) {
      const singleForm = element.forms.length === 1;

      for (let index = 0; index < element.forms.length; index++) {
        const formName = element.forms[index].name;
        let title;

        switch (nameSet) {
          case displayAttrFormNames.on:
            titles.push(`${element.name} ${formName}`);
            break;
          case displayAttrFormNames.off:
            titles.push(`${element.name}`);
            break;
          case displayAttrFormNames.formNameOnly:
            titles.push(`${formName}`);
            break;
          case displayAttrFormNames.showAttrNameOnce:
            title = index === 0 ? `${element.name} ${formName}` : `${formName}`;
            titles.push(title);
            break;
          default:
            title = singleForm ? `${element.name}` : `${element.name} ${formName}`;
            titles.push(title);
            break;
        }
      }
      return titles;
    }
    return false;
  };

  getAttributeWithForms = (elements: any, attrforms: any): string[] => {
    if (!elements) {
      return [];
    }

    let names: string[] = [];
    for (const element of elements) {
      const headerCount = element.headerCount || 1;

      for (let headerIndex = 0; headerIndex < headerCount; headerIndex++) {
        if (element.type !== 'templateMetrics') {
          const forms = this.getAttributesTitleWithForms(element, attrforms);

          names = forms ? [...names, ...forms] : [...names, `${element.name}`];
        }
      }
    }
    return names;
  };
}

const mstrAttributeFormHelper = new MstrAttributeFormHelper();
export default mstrAttributeFormHelper;
