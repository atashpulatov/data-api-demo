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
    return response.definition.grid.crossTab;
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
    return jsonHandler.renderRows(response.data.metricValues, onMetric);
  }

  /**
   * Gets object with crosstab rows and column headers
   *
   * @param {JSON} response
   * @return {Object}
   * @memberof OfficeConverterServiceV2
   */
  getHeaders(response) {
    const onHeader = (e) => e.value[0];
    const rows = jsonHandler.renderHeaders(response.definition, 'rows', response.data.headers, onHeader);
    const columns = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onHeader);
    return {rows, columns};
  }

  /**
   * Gets array with indexed column definition
   *
   * @param {JSON} response
   * @return {Object}
   * @memberof OfficeConverterServiceV2
   */
  getColumnInformation(response) {
    const onColumnHeader = (element) => element;
    const columns = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onColumnHeader);
    const lastRow = columns[columns.length - 1];
    return lastRow.map((element, index) => {
      if (element.type === 'Metric') {
        return {
          category: element.numberFormatting.category,
          formatString: element.numberFormatting.formatString,
          id: element.id,
          index,
          isAttribute: false,
          name: element.name,
        };
      }
      // TODO: Check, currently there are no v2 examples that have attributes in the table body
      return {
        attributeId: element.id,
        attributeName: element.name,
        formId: element.form.id,
        formName: element.form.name,
        index,
        isAttribute: true,
      };
    });
  }
}

export default new OfficeConverterServiceV2();
