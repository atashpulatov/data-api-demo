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
  splitAttributeForms = (columns, supportForms) => {
    const fullColumnInformation = [];
    columns.forEach((column) => {
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
            for (let i = 0; i < column.forms.length; i++) {
              fullColumnInformation.push({
                attributeId: column.id,
                attributeName: column.name,
                forms: [column.forms[i]],
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
   * @param {JSON} e Object definition element from response
   * @param {String} attrforms Dispay attribute form names setting inside office-properties.js
   * @return {Object} Contains arrays of columns and rows attributes forms names
   */
  getAttributesTitleWithForms = (e, attrforms) => {
    const supportForms = attrforms ? attrforms.supportForms : false;
    const nameSet = attrforms && attrforms.displayAttrFormNames;
    const { displayAttrFormNames } = officeProperties;
    const titles = [];

    if (supportForms && e.type === 'attribute' && e.forms.length >= 0) {
      const singleForm = e.forms.length === 1;

      for (let index = 0; index < e.forms.length; index++) {
        const formName = e.forms[index].name;
        let title;

        switch (nameSet) {
          case displayAttrFormNames.on:
            titles.push(`${e.name} ${formName}`);
            break;
          case displayAttrFormNames.off:
            titles.push(`${e.name}`);
            break;
          case displayAttrFormNames.formNameOnly:
            titles.push(`${formName}`);
            break;
          case displayAttrFormNames.showAttrNameOnce:
            title = index === 0 ? `${e.name} ${formName}` : `${formName}`;
            titles.push(title);
            break;
          default:
            title = singleForm ? `${e.name}` : `${e.name} ${formName}`;
            titles.push(title);
            break;
        }
      }
      return titles;
    }
    return false;
  };

  getAttributeWithForms = (elements, attrforms) => {
    if (!elements) { return []; }

    let names = [];
    for (const element of elements) {
      const headerCount = element.headerCount || 1;

      for (let headerIndex = 0; headerIndex < headerCount; headerIndex++) {
        const forms = this.getAttributesTitleWithForms(element, attrforms);
        names = forms ? [...names, ...forms] : [...names, `${element.name}`];
      }
    }

    return names;
  };
}

const mstrAttributeFormHelper = new MstrAttributeFormHelper();
export default mstrAttributeFormHelper;
