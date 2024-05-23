/* eslint-disable class-methods-use-this */
import mstrAttributeFormHelper from '../helper/mstr-attribute-form-helper';
import mstrAttributeMetricHelper from '../helper/mstr-attribute-metric-helper';

import { MstrTable } from '../../redux-reducer/operation-reducer/operation-reducer-types';

import jsonHandler from './mstr-normalized-json-handler';
/**
 * Handler to parse grids
 *
 * @class GridHandler
 */
class GridHandler {
  createTable(response: any): MstrTable {
    const { grid } = response.definition;
    // Crosstabular is a Crosstab report with metrics in Rows and nothing in columns, so we display it as tabular
    const isCrosstabular =
      grid.metricsPosition && grid.metricsPosition.axis === 'rows' && grid.columns.length === 0;
    const isPageByInMetricsAxis = grid.metricsPosition?.axis === 'pageBy';
    const columnInformation = this.getColumnInformation(
      response,
      isCrosstabular,
      isPageByInMetricsAxis
    );
    const isCrosstab = !isCrosstabular && this.isCrosstab(response);
    const { attributes, metrics } = mstrAttributeMetricHelper.extractAttributesMetrics(grid);
    return {
      tableSize: this.getTableSize(response, columnInformation, isCrosstab),
      columnInformation,
      headers: this.getHeaders(response, isCrosstab, isCrosstabular, isPageByInMetricsAxis),
      id: response.k || response.id,
      isCrosstab,
      isCrosstabular,
      name: response.n || response.name,
      rows: this.getRows(response, isCrosstab),
      visualizationType: response.visualizationType,
      attributesNames: this.getAttributesName(response.definition, response.attrforms),
      attributes,
      metrics,
    };
  }

  /**
   * Get attribute names for crosstab report
   *
   * @param definition Object definition from response
   * @return Contains arrays of columns and rows attributes names
   */
  getAttributesName = (
    definition: any,
    attrforms: any
  ): { rowsAttributes: any[]; columnsAttributes: any[] } => {
    const columnsAttributes = mstrAttributeFormHelper.getAttributeWithForms(
      definition.grid.columns,
      attrforms
    );
    const rowsAttributes = mstrAttributeFormHelper.getAttributeWithForms(
      definition.grid.rows,
      attrforms
    );
    return { rowsAttributes, columnsAttributes };
  };

  /**
   * Gets raw table rows
   *
   * @param response
   * @param isCrosstab Specify if object is a crosstab
   * @return
   */
  getRows = (response: any, isCrosstab: boolean): { row: any[]; rowTotals?: any[] } => {
    const rowTotals: any[] = [];
    const { attrforms } = response;
    const onAttribute = (array: any[]) => (element: any) => {
      if (array) {
        array.push(element.subtotalAddress);
      }
      return `${element.value.join(' ')}`;
    };
    if (isCrosstab) {
      return { row: jsonHandler.renderRows(response.data) };
    }
    if (response.definition) {
      response.definition.attrforms = attrforms;
    }
    const row = jsonHandler.renderTabular(
      response.definition,
      response.data,
      onAttribute(rowTotals)
    );
    return { row, rowTotals };
  };

  /**
   * Gets object with crosstab rows and column headers
   *
   * @param response
   * @param isCrosstab Specify if object is a crosstab
   * @param isCrosstabular Crosstabular is a Crosstab report with metrics in Rows and nothing in columns
   * @param isPageByInMetricsAxis Specify if metricsPosition axis is pageBy
   * @return
   */
  getHeaders(
    response: any,
    isCrosstab: boolean,
    isCrosstabular?: boolean,
    isPageByInMetricsAxis?: boolean
  ): {
    rows?: any[];
    columns?: any[];
    subtotalAddress?: any[];
  } {
    const rowTotals: any[] = [];
    const columnTotals: any[] = [];
    const { attrforms, definition } = response;
    const { grid } = definition;
    const supportForms = attrforms ? attrforms.supportForms : false;
    const onElement = (array?: any[]) => (element: any) => {
      if (array) {
        array.push(element.subtotalAddress);
      }
      // attribute as row with forms
      const forms = mstrAttributeFormHelper.getAttributesTitleWithForms(element, attrforms);
      if (forms) {
        return forms;
      }
      // attribute as column with forms
      return supportForms && element.value.length > 1
        ? element.value.map((form: any) => `${form}`)
        : `${element.value.join(' ')}`;
    };
    if (isCrosstab) {
      const rows = jsonHandler.renderHeaders(
        response.definition,
        'rows',
        response.data.headers,
        onElement(rowTotals),
        supportForms
      );
      const columns = jsonHandler.renderHeaders(
        response.definition,
        'columns',
        response.data.headers,
        onElement(columnTotals),
        supportForms
      );
      const subtotalAddress = [...rowTotals, ...columnTotals];
      return { rows, columns, subtotalAddress };
    }
    const attributeTitles = jsonHandler.renderTitles(
      response.definition,
      'rows',
      response.data.headers,
      onElement(),
      supportForms
    );

    let metricHeaders;

    if (isPageByInMetricsAxis) {
      const { pageBy } = grid;
      const { index } = grid.metricsPosition;

      metricHeaders = [[pageBy[index].name]];
    } else {
      metricHeaders = jsonHandler.renderHeaders(
        response.definition,
        'columns',
        response.data.headers,
        onElement(),
        supportForms
      );
    }

    return isCrosstabular
      ? { columns: [[...attributeTitles[0], ...metricHeaders[0], "' "]] }
      : { columns: [[...attributeTitles[0], ...metricHeaders[0]]] };
  }

  /**
   * Returns number of rows and metric columns of tabular data if not crosstabs of metrics grid if crosstabs
   *
   * @param response
   * @param columnInformation - Array with indexed column definition for metrics and attributes
   * @param isCrosstab Specify if object is a crosstab
   * @return
   */
  getTableSize = (
    response: any,
    columnInformation: any,
    isCrosstab: boolean
  ): { rows: number; columns: number } => {
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
      columns,
    };
  };

  /**
   * Checks if response contains crosstabs
   *
   * @param response
   * @return
   */
  isCrosstab = (response: any): boolean => {
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
   * @param response
   * @param isCrosstabular Crosstabular is a Crosstab report with metrics in Rows and nothing in columns
   * @param isPageByInMetricsAxis Specify if metricsPosition axis is pageBy
   * @return
   */
  getColumnInformation = (
    response: any,
    isCrosstabular: boolean,
    isPageByInMetricsAxis: boolean
  ): any[] => {
    const { attrforms } = response;
    const supportForms = attrforms ? attrforms.supportForms : false;
    let columns;

    const onElement = (element: any): any => element;
    const metricColumns = jsonHandler.renderHeaders(
      response.definition,
      'columns',
      response.data.headers,
      onElement
    );
    const parsedMetricColumns = jsonHandler.getMetricsColumnsInformation(metricColumns);

    const attributeColumns = jsonHandler.renderTitles(
      response.definition,
      'rows',
      response.data.headers,
      onElement
    );

    if (!attributeColumns.length) {
      columns = parsedMetricColumns;
    } else if (isCrosstabular || isPageByInMetricsAxis) {
      columns = [...attributeColumns[attributeColumns.length - 1], ...parsedMetricColumns, []];
    } else {
      columns = [...attributeColumns[attributeColumns.length - 1], ...parsedMetricColumns];
    }

    return mstrAttributeFormHelper.splitAttributeForms(columns, supportForms);
  };

  /**
   * Gets subtotals defined or visible information from the response.
   *
   * @param response
   * @return
   */
  getSubtotalsInformation = (response: any): any => {
    try {
      const { subtotals } = response.definition.grid;
      return subtotals;
    } catch (error) {
      return false;
    }
  };
}

export default new GridHandler();
