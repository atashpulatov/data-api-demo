import jsonHandler from '../mstr-object/mstr-normalized-json-handler';

/**
 * Service to parse JSON response from REST API v2
 *
 * @class OfficeConverterServiceV2
 */
class OfficeConverterServiceV2 {
  createTable(response) {
    return {
      id: response.id,
      name: response.name,
      cubeId: response.cubeID,
      cubeName: response.cubeName,
      isCrosstab: this.isCrosstab(response),
      headers: this.getHeaders(response),
      rows: this.getRows(response),
      columnInformation: this.getColumnInformation(response),
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
    return !!response.definition.crossTab;
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
    const onMetric = ({rv}) => rv;
    const onAttribute = ({name}) => name;
    if (this.isCrosstab(response)) {
      return jsonHandler.renderRows(response.data.values, onMetric);
    } else {
      return jsonHandler.renderTabular(response.definition, response.data, response.headers, onAttribute, onMetric);
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
    const onElement = ({name}) => name;
    if (this.isCrosstab(response)) {
      const rows = jsonHandler.renderHeaders(response.definition, 'rows', response.headers, onElement);
      const columns = jsonHandler.renderHeaders(response.definition, 'columns', response.headers, onElement);
      return {rows, columns};
    } else {
      const attributeTitles = jsonHandler.renderTitles(response.definition, 'rows', response.headers, onElement);
      const metricHeaders = jsonHandler.renderHeaders(response.definition, 'columns', response.headers, onElement);
      return {columns: [...attributeTitles[0], ...metricHeaders[0]]};
    }
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
    const metricColumns = jsonHandler.renderHeaders(response.definition, 'columns', response.headers, onElement);
    const attributeColumns = jsonHandler.renderTitles(response.definition, 'rows', response.headers, onElement);
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
