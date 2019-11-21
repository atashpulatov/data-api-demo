import jsonHandler from '../mstr-object/mstr-normalized-json-handler';

/**
 * Service to parse JSON response from REST API v2
 *
 * @class OfficeConverterServiceV2
 */
class OfficeConverterServiceV2 {
  createTable(response) {
    const columnInformation = this.getColumnInformation(response);
    const isCrosstab = this.isCrosstab(response);
    return {
      tableSize: this.getTableSize(response, columnInformation, isCrosstab),
      columnInformation,
      headers: this.getHeaders(response),
      id: response.k || response.id,
      isCrosstab,
      name: response.n || response.name,
      rows: this.getRows(response, isCrosstab),
      attributesNames: this.getAttributesName(response.definition),
    };
  }

  /**
   * Checks if response contains crosstabs
   *
   * @param {JSON} response
   * @return {Boolean}
   * @memberof OfficeConverterServiceV2
   */
  isCrosstab(response) {
    try {
      return !!response.definition.grid.crossTab;
    } catch (error) {
      // This is changing so often that we want to at least return false
      return false;
    }
  }

  /**
   * Get attribute forms names
   *
   * @param {JSON} e Object definition from response
   * @return {Object} Contains arrays of columns and rows attributes forms names
   * @memberof OfficeConverterServiceV2
   */
  getAttributesForms = (e) => {
    const titles = [];
    if (e.type === 'attribute' && e.forms.length > 1) {
      for (let index = 0; index < e.forms.length; index++) {
        const formName = e.forms[index].name;
        titles.push(`'${e.name} ${formName}`);
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
   * @memberof OfficeConverterServiceV2
   */
  getAttributesName = (definition) => {
    const columnsAttributes = definition.grid.columns.map((e) => `'${e.name}`);
    const rowsAttributes = definition.grid.rows.map((e) => `'${e.name}`);
    return { rowsAttributes, columnsAttributes };
  }

  /**
   * Gets raw table rows
   *
   * @param {JSON} response
   * @return {number[]}
   * @memberof OfficeConverterServiceV2
   */
  getRows(response) {
    const rowTotals = [];
    const onAttribute = (array) => (e) => {
      if (array) array.push(e.subtotalAddress);
      return `'${e.value.join(' ')}`;
    };
    if (this.isCrosstab(response)) {
      return { row: jsonHandler.renderRows(response.data) };
    }
    const row = jsonHandler.renderTabular(response.definition, response.data, onAttribute(rowTotals));
    return { row, rowTotals };
  }

  /**
   * Gets object with crosstab rows and column headers
   *
   * @param {JSON} response
   * @return {Object}
   * @memberof OfficeConverterServiceV2
   */
  getHeaders(response) {
    const rowTotals = [];
    const columnTotals = [];
    const onElement = (array) => (e) => {
      if (array) array.push(e.subtotalAddress);
      const supportForms = true;
      const forms = this.getAttributesForms(e);
      if (supportForms && forms) {
        return forms;
      }
      return `'${e.value.join(' ')}`;
    };

    if (this.isCrosstab(response)) {
      const rows = jsonHandler.renderHeaders(response.definition, 'rows', response.data.headers, onElement(rowTotals));
      const columns = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement(columnTotals));
      const subtotalAddress = [...rowTotals, ...columnTotals];
      return { rows, columns, subtotalAddress };
    }
    const attributeTitles = jsonHandler.renderTitles(response.definition, 'rows', response.data.headers, onElement(), true);
    const metricHeaders = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement());
    return { columns: [[...attributeTitles[0], ...metricHeaders[0]]] };
  }

  /**
   * Returns number of rows and metric columns of tabular data if not crosstabs of metrics grid if crosstabs
   *
   * @param {JSON} response
   * @param {Object} columnInformation - Array with indexed column definition for metrics and attributes
   * @param {Boolean} isCrosstab
   * @return {Number}
   * @memberof OfficeConverterServiceV2
   */
  getTableSize(response, columnInformation, isCrosstab) {
    const supportForms = true;
    let columnsCount = columnInformation.length;
    for (let index = 0; supportForms && index < columnInformation.length; index++) {
      const element = columnInformation[index];
      if (element.isAttribute && element.forms.length > 1) {
        columnsCount = columnsCount + element.forms.length - 1;
      }
    }
    return {
      rows: response.data.paging.total,
      columns: isCrosstab ? response.data.headers.columns[0].length : columnsCount,
    };
  }

  /**
   * Gets array with indexed column definition
   *
   * @param {JSON} response
   * @return {Object}
   * @memberof OfficeConverterServiceV2
   */
  getColumnInformation(response) {
    let columns;
    const onElement = (element) => element;
    const metricColumns = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement);
    const attributeColumns = jsonHandler.renderTitles(response.definition, 'rows', response.data.headers, onElement);
    if (!attributeColumns.length) {
      columns = metricColumns[metricColumns.length - 1];
    } else {
      columns = [...attributeColumns[attributeColumns.length - 1], ...metricColumns[metricColumns.length - 1]];
    } // we return only columns attributes if there is no attributes in rows
    return columns.map((element, index) => {
      const type = element.type ? element.type.toLowerCase() : null;
      switch (type) {
        case 'metric':
          return {
            category: element.numberFormatting.category,
            formatString: element.numberFormatting.formatString,
            id: element.id,
            index,
            isAttribute: false,
            name: element.name,
          };
        case 'attribute':
          return {
            attributeId: element.id,
            attributeName: element.name,
            forms: element.forms,
            index,
            isAttribute: true,
          };
        default:
          return {};
      }
    });
  }
}

export default new OfficeConverterServiceV2();
