import jsonHandler from '../mstr-object/mstr-normalized-json-handler';

/**
 * Service to parse JSON response from REST API v2
 *
 * @class OfficeConverterServiceV2
 */
class OfficeConverterServiceV2 {
  createTable(response) {
    // Crosstabular is a Crosstab report with metrics in Rows and nothing in columns, so we display it as tabular
    const isCrosstabular = response.definition.grid.metricsPosition.axis === 'rows'
      && response.definition.grid.columns.length === 0;
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
      const { grid } = response.definition;
      return !!grid.crossTab && grid.columns.length !== 0;
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
    const supportForms = true;
    const getAttributeWithForms = (elements) => {
      let names = [];
      for (let i = 0; i < elements.length; i++) {
        const e = elements[i];
        const forms = supportForms && this.getAttributesForms(e);
        names = forms ? [...names, ...forms] : [...names, `'${e.name}`];
      }
      return names;
    };

    const columnsAttributes = getAttributeWithForms(definition.grid.columns);
    const rowsAttributes = getAttributeWithForms(definition.grid.rows);
    return { rowsAttributes, columnsAttributes };
  }

  /**
   * Gets raw table rows
   *
   * @param {JSON} response
   * @param {Boolean} isCrosstab
   * @return {number[]}
   * @memberof OfficeConverterServiceV2
   */
  getRows(response, isCrosstab) {
    const rowTotals = [];
    const onAttribute = (array) => (e) => {
      if (array) array.push(e.subtotalAddress);
      return `'${e.value.join(' ')}`;
    };
    if (isCrosstab) {
      return { row: jsonHandler.renderRows(response.data) };
    }
    const row = jsonHandler.renderTabular(response.definition, response.data, onAttribute(rowTotals));
    return { row, rowTotals };
  }

  /**
   * Gets object with crosstab rows and column headers
   *
   * @param {JSON} response
   * @param {Boolean} isCrosstab
   * @param {Boolean} isCrosstabular Crosstabular is a Crosstab report with metrics in Rows and nothing in columns, so we display it as tabular
   * @return {Object}
   * @memberof OfficeConverterServiceV2
   */
  getHeaders(response, isCrosstab, isCrosstabular) {
    const rowTotals = [];
    const columnTotals = [];
    const onElement = (array) => (e) => {
      if (array) array.push(e.subtotalAddress);
      const supportForms = true;
      const forms = this.getAttributesForms(e);
      if (supportForms && forms) {
        return forms; // attribute as row with forms
      }
      return e.value.length > 1 ? e.value : `'${e.value.join(' ')}`; // attribute as column with forms
    };
    if (isCrosstab) {
      const rows = jsonHandler.renderHeaders(response.definition, 'rows', response.data.headers, onElement(rowTotals));
      const columns = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement(columnTotals), true);
      const subtotalAddress = [...rowTotals, ...columnTotals];
      return { rows, columns, subtotalAddress };
    }
    const attributeTitles = jsonHandler.renderTitles(response.definition, 'rows', response.data.headers, onElement(), true);
    const metricHeaders = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement());
    return isCrosstabular ? { columns: [[...attributeTitles[0], ...metricHeaders[0], '\' ']] } : { columns: [[...attributeTitles[0], ...metricHeaders[0]]] };
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
    const columnHeader = response.data.headers.columns[0];
    for (let index = 0; supportForms && index < columnInformation.length; index++) {
      const element = columnInformation[index];
      if (element.isAttribute && element.forms.length > 1) {
        columnsCount = columnsCount + element.forms.length - 1;
      }
    }
    return {
      rows: response.data.paging.total,
      columns: isCrosstab ? (columnHeader ? columnHeader.length : 0) : columnsCount,
    };
  }

  /**
   * Gets array with indexed column definition
   *
   * @param {JSON} response
   * @param {Boolean} isCrosstabular Crosstabular is a Crosstab report with metrics in Rows and nothing in columns, so we display it as tabular
   * @return {Object}
   * @memberof OfficeConverterServiceV2
   */
  getColumnInformation(response, isCrosstabular) {
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
