import jsonHandler from '../mstr-object/mstr-normalized-json-handler';

class OfficeConverterServiceV2 {
  createTable(response) {
    return {
      id: response.id,
      name: response.name,
      crosstab: this.isCrosstab(response),
      headers: this.getHeaders(response),
      rows: this.getRows(response),
      columnInformation: this._getColumnInformation(response),
    };
  }

  getRows(response) {
    // onMetric is passed when mapping the row [{rv:1, fv:"$1"}, ...]
    const onMetric = ({rv}) => rv;
    return jsonHandler.renderRows(response.data.metricValues, onMetric);
  }

  getHeaders(response) {
    const onHeader = (e) => e.value[0];
    const rows = jsonHandler.renderHeaders(response.definition, 'rows', response.data.headers, onHeader);
    const columns = jsonHandler.renderHeaders(response.definition, 'columns', response.data.headers, onHeader);
    return {rows, columns};
  }

  _getColumnInformation(response) {

  }
}

export default new OfficeConverterServiceV2();
