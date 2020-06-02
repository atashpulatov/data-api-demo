import jsonHandler from './mstr-normalized-json-handler';
import { officeProperties } from '../redux-reducer/office-reducer/office-properties';

/**
 * Handler to parse grids
 *
 * @class GridHandler
 */
class GridHandler {
  createTable(response) {
    const { grid } = response.definition;
    // Crosstabular is a Crosstab report with metrics in Rows and nothing in columns, so we display it as tabular
    const isCrosstabular = grid.metricsPosition && grid.metricsPosition.axis === 'rows' && grid.columns.length === 0;
    const columnInformation = this.getColumnInformation(response, isCrosstabular);
    const isCrosstab = !isCrosstabular && this.isCrosstab(response);

    return {
      tableSize: this.getTableSize(response, columnInformation, isCrosstab),
      columnInformation,
      headers: this.getHeaders(response, isCrosstab, isCrosstabular),
      id: response.k || response.id,
      isCrosstab,
      isCrosstabular,
      name: response.n || response.name,
      rows: this.getRows(response, isCrosstab),
      attributesNames: this.getAttributesName(response.definition, response.attrforms),
    };
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
  getRows = (response, isCrosstab) => {
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
    };

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
    const parsedMetricColumns = jsonHandler.getMetricsColumnsInformation(metricColumns);

    const attributeColumns = jsonHandler.renderTitles(response.definition, 'rows', response.data.headers, onElement);

    if (!attributeColumns.length) {
      columns = parsedMetricColumns;
    } else if (isCrosstabular) {
      columns = [...attributeColumns[attributeColumns.length - 1], ...parsedMetricColumns, []];
    } else {
      columns = [...attributeColumns[attributeColumns.length - 1], ...parsedMetricColumns];
    }

    return jsonHandler.splitAttributeForms(columns, supportForms);
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
}

export default new GridHandler();
