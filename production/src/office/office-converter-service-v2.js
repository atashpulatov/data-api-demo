import jsonHandler from '../mstr-object/mstr-normalized-json-handler';
import { officeProperties } from '../redux-reducer/office-reducer/office-properties';
import { getCompoundGridTable } from '../mstr-object/mstr-compound-grid-handler';
import mstrObjectType from '../mstr-object/mstr-object-type-enum';

/**
 * Service to parse JSON response from REST API v2
 *
 * @class OfficeConverterServiceV2
 */
class OfficeConverterServiceV2 {
  createTable(response) {
    if (response.visualizationType === mstrObjectType.visualizationType.COMPOUND_GRID) {
      return getCompoundGridTable(response);
    }

    return this.createGridTable(response);
  }

  createGridTable(response) {
    const { grid } = response.definition;
    // Crosstabular is a Crosstab report with metrics in Rows and nothing in columns, so we display it as tabular
    const isCrosstabular = grid.metricsPosition && grid.metricsPosition.axis === 'rows' && grid.columns.length === 0;
    const columnInformation = this.getColumnInformation(response, isCrosstabular);
    const isCrosstab = !isCrosstabular && this.isCrosstab(response);
    let subtotalsInfo = {};
    const subtotals = this.getSubtotalsInformation(response);
    if (subtotals) {
      subtotalsInfo = { subtotalsDefined: subtotals.defined, subtotalsVisible: subtotals.visible };
    }
    return {
      tableSize: this.getTableSize(response, columnInformation, isCrosstab),
      columnInformation,
      headers: this.getHeaders(response, isCrosstab, isCrosstabular),
      id: response.k || response.id,
      isCrosstab,
      isCrosstabular,
      name: response.n || response.name,
      rows: this.getRows(response, isCrosstab),
      visualizationType: response.visualizationType || null,
      attributesNames: this.getAttributesName(response.definition, response.attrforms),
      subtotalsInfo,
    };
  }

  /**
   * Gets subtotals defined or visible information from the response.
   *
   * @param {JSON} response
   * @return {Object}
   */
  getSubtotalsInformation = (response) => {
    try {
      const { subtotals } = response.definition.grid;
      return subtotals;
    } catch (error) {
      return false;
    }
  }

  /**
   * Checks if response contains crosstabs
   *
   * @param {JSON} response
   * @return {Boolean}
   */
  isCrosstab = (response) => {
    try {
      const { grid } = response.definition;
      return !!grid.crossTab && grid.columns.length !== 0;
    } catch (error) {
      // This is changing so often that we want to at least return false
      return false;
    }
  }

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
          case displayAttrFormNames.automatic:
            title = singleForm ? `'${e.name}` : `'${e.name} ${formName}`;
            titles.push(title);
            break;
          case displayAttrFormNames.on:
            titles.push(`'${e.name} ${formName}`);
            break;
          case displayAttrFormNames.off:
            titles.push(`'${e.name}`);
            break;
          case displayAttrFormNames.formNameOnly:
            titles.push(`'${formName}`);
            break;
          case displayAttrFormNames.showAttrNameOnce:
            title = index === 0 ? `'${e.name} ${formName}` : `'${formName}`;
            titles.push(title);
            break;
          default:
            title = singleForm ? `'${e.name}` : `'${e.name} ${formName}`;
            titles.push(title);
            break;
        }
      }
      return titles;
    }
    return false;
  }

  /**
   * Get attribute names for crosstab report
   *
   * @param {JSON} definition Object definition from response
   * @return {Object} Contains arrays of columns and rows attributes names
   */
  getAttributesName = (definition, attrforms) => {
    const getAttributeWithForms = (elements) => {
      let names = [];
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const forms = this.getAttributesTitleWithForms(element, attrforms);
        names = forms ? [...names, ...forms] : [...names, `'${element.name}`];
      }
      return names;
    };

    const columnsAttributes = getAttributeWithForms(definition.grid.columns);
    const rowsAttributes = getAttributeWithForms(definition.grid.rows);
    return { rowsAttributes, columnsAttributes };
  };

  /**
   * Gets raw table rows
   *
   * @param {JSON} response
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @return {number[]}
   */
  getRows=(response, isCrosstab) => {
    const rowTotals = [];
    const { attrforms } = response;
    const onAttribute = (array) => (e) => {
      if (array) { array.push(e.subtotalAddress); }
      return `'${e.value.join(' ')}`;
    };
    if (isCrosstab) {
      return { row: jsonHandler.renderRows(response.data) };
    }
    if (response.definition) {
      response.definition.attrforms = attrforms;
    }
    const row = jsonHandler.renderTabular(response.definition, response.data, onAttribute(rowTotals));
    return { row, rowTotals };
  }


  /**
   * Gets object with crosstab rows and column headers
   *
   * @param {JSON} response
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @param {Boolean} isCrosstabular Crosstabular is a Crosstab report with metrics in Rows and nothing in columns
   * @return {Object}

   */
  getHeaders(response, isCrosstab, isCrosstabular) {
    const rowTotals = [];
    const columnTotals = [];
    const { attrforms } = response;
    const supportForms = attrforms ? attrforms.supportForms : false;
    const onElement = (array) => (e) => {
      if (array) { array.push(e.subtotalAddress); }
      // attribute as row with forms
      const forms = this.getAttributesTitleWithForms(e, attrforms);
      if (forms) {
        return forms;
      }
      // attribute as column with forms
      return supportForms && e.value.length > 1 ? e.value.map((form) => `'${form}`) : `'${e.value.join(' ')}`;
    };
    if (isCrosstab) {
      const rows = jsonHandler.renderHeaders(response.definition, 'rows', response.data.headers, onElement(rowTotals), supportForms);
      const columns = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement(columnTotals), supportForms);
      const subtotalAddress = [...rowTotals, ...columnTotals];
      return { rows, columns, subtotalAddress };
    }
    const attributeTitles = jsonHandler.renderTitles(response.definition, 'rows', response.data.headers, onElement(), supportForms);
    const metricHeaders = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement(), supportForms);
    return isCrosstabular ? { columns: [[...attributeTitles[0], ...metricHeaders[0], '\' ']] } : { columns: [[...attributeTitles[0], ...metricHeaders[0]]] };
  }

  /**
   * Returns number of rows and metric columns of tabular data if not crosstabs of metrics grid if crosstabs
   *
   * @param {JSON} response
   * @param {Object} columnInformation - Array with indexed column definition for metrics and attributes
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @return {Number}
   */
  getTableSize = (response, columnInformation, isCrosstab) => {
    const columnsCount = columnInformation.length;
    const columnHeader = response.data.headers.columns[0];
    let columns;

    if (isCrosstab) {
      columns = columnHeader ? columnHeader.length : 0;
    } else {
      columns = columnsCount;
    }

    return {
      rows: response.data.paging.total,
      columns
    };
  }

  /**
   * Gets array with indexed column definition
   *
   * @param {JSON} response
   * @param {Boolean} isCrosstabular Crosstabular is a Crosstab report with metrics in Rows and nothing in columns
   * @return {Object}
   */
  getColumnInformation = (response, isCrosstabular) => {
    const { attrforms } = response;
    const supportForms = attrforms ? attrforms.supportForms : false;

    let columns;
    const onElement = (element) => element;
    const metricColumns = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement);
    const attributeColumns = jsonHandler.renderTitles(response.definition, 'rows', response.data.headers, onElement);
    if (!attributeColumns.length) {
      columns = metricColumns[metricColumns.length - 1];
    } else if (isCrosstabular) {
      columns = [...attributeColumns[attributeColumns.length - 1], ...metricColumns[metricColumns.length - 1], []];
    } else {
      columns = [...attributeColumns[attributeColumns.length - 1], ...metricColumns[metricColumns.length - 1]];
    }
    return this.splitAttributeForms(columns, supportForms);
  }

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
  }
}

export default new OfficeConverterServiceV2();
