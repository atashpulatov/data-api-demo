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
      columnInformation: this.getColumnInformation(response),
      cubeId: response.cubeID,
      cubeName: response.cubeName,
      headers: this.getHeaders(response),
      id: response.id,
      isCrosstab,
      name: response.name,
      rows: this.getRows(response, isCrosstab),
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
   * Gets raw table rows
   *
   * @param {JSON} response
   * @return {number[]}
   * @memberof OfficeConverterServiceV2
   */
  getRows(response) {
    // onMetric is passed when mapping the row [{rv:1, fv:"$1"}, ...]
    const onAttribute = ({value}) => value.join(' ');
    if (this.isCrosstab(response)) {
      return jsonHandler.renderRows(response.data);
    } else {
      return jsonHandler.renderTabular(response.definition, response.data, onAttribute);
    }
  }

  /**
   * Gets object with crosstab rows and column headers
   *
   * @param {JSON} response
   * @return {Object}
   * @memberof OfficeConverterServiceV2
   */
  getHeaders(response) {
    const onElement = ({value}) => value.join(' ');
    if (this.isCrosstab(response)) {
      const rows = jsonHandler.renderHeaders(response.definition, 'rows', response.data.headers, onElement);
      const columns = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement);
      return {rows, columns};
    } else {
      const attributeTitles = jsonHandler.renderTitles(response.definition, 'rows', response.data.headers, onElement);
      const metricHeaders = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement);
      return {columns: [[...attributeTitles[0], ...metricHeaders[0]]]};
    }
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
    return {
      rows: response.data.paging.total,
      columns: isCrosstab ? response.data.headers.columns[0].length : columnInformation.length,
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
    const onElement = (element) => element;
    const metricColumns = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onElement);
    const attributeColumns = jsonHandler.renderTitles(response.definition, 'rows', response.data.headers, onElement);
    const columns = [...attributeColumns[attributeColumns.length - 1], ...metricColumns[metricColumns.length - 1]];
    return columns.map((element, index) => {
      switch (element.type.toLowerCase()) {
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
