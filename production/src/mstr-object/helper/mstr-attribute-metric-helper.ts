import { VisualizationTypes } from '../mstr-object-types';

class MstrAttributeMetricHelper {
  /**
   * Extracts attributes and metrics for a compound grid
   *
   * @param grid contains information about mstr object's structure (rows, columns)
   *
   * @returns object with two properties: attributes and metrics
   */
  extractAttributesMetricsCompoundGrid(grid: any): { attributes: any[]; metrics: any[] } {
    // equivalent to grid.columnSets.flatMap(columnSet => columnSet.columns);
    const columns = grid.columnSets.reduce(
      (allColumns: any, currColumnSet: any) => allColumns.concat(currColumnSet.columns),
      []
    );
    const { rows } = grid;
    const attributes = this.extractAttributes(rows, columns);
    const metrics = this.extractMetrics(rows, columns);

    return { attributes, metrics };
  }

  /**
   * Extracts attributes and metrics for a grid
   *
   * @param grid contains information about mstr object's structure (rows, columns)
   *
   * @returns object with two properties: attributes and metrics,
   */
  extractAttributesMetrics(grid: any): { attributes: any[]; metrics: any[] } {
    const { rows, columns } = grid;
    const attributes = this.extractAttributes(rows, columns);
    const metrics = this.extractMetrics(rows, columns);

    return { attributes, metrics };
  }

  /**
   * Extracts attributes from rows and columns that we get from MSTR REST API
   *
   * @param {Array} rows mstr object row definition from MicroStrategy REST API
   * @param {Array} columns mstr object  column definition from MicroStrategy REST API
   *
   * @returns {Object[]} Array of attribute objects with id and name properties
   */
  extractAttributes = (rows: any[], columns: any[]): any[] =>
    columns
      .filter(({ type }) => type === 'attribute')
      .concat(rows.filter(({ type }) => type === 'attribute'))
      .map(({ id, name }) => ({ id, name }));

  /**
   * Extracts metrics from rows and columns that we get from MSTR REST API
   *
   * @param {Array} rows mstr object row definition from MicroStrategy REST API
   * @param {Array} columns mstr object  column definition from MicroStrategy REST API
   *
   * @returns {Object[]} Array of metric objects with id and name properties
   */
  extractMetrics = (rows: any[], columns: any[]): any[] =>
    columns
      .filter(({ type }) => type === 'templateMetrics')
      .concat(rows.filter(({ type }) => type === 'templateMetrics'))
      // equivalent to flatMap(({ elements }) => elements)
      .reduce((allElements, { elements: currElements }) => allElements.concat(currElements), [])
      .map(({ id, name }: { id: string; name: string }) => ({ id, name }));

  /**
   * Extracts metrics from body of the response we get from MSTR REST API
   *
   * @param {Object} body body of the response we get from MicroStrategy REST API
   *
   * @returns {Object[]} Array of metric objects with id and name properties
   */
  extractMetricsInRows = (body: any): any[] => {
    const columns =
      body.visualizationType === VisualizationTypes.COMPOUND_GRID
        ? body.definition.grid.columnSets.reduce(
            (allColumns: any, currColumnSet: any) => allColumns.concat(currColumnSet.columns),
            []
          )
        : body.definition.grid.columns;
    const { rows } = body.definition.grid;

    return this.extractMetrics(rows, columns);
  };

  /**
   * Compares two metric arrays and returns their difference
   *
   * @param fetchedMetrics Array of metrics where new unique metrics will be searched
   * @param currentMetrics Array of metrics based on which the difference will be calculated
   *
   * @returns {Object[]} Array of unique metrics that are present in fetchedMetrics
   * and not present in currentMetrics; Empty array if there are no such metrics
   */
  getMetricsDifference = (fetchedMetrics: any[], currentMetrics: any): any[] =>
    fetchedMetrics.filter(
      fetchedMetric =>
        !currentMetrics.some((currentMetric: any) => currentMetric.id === fetchedMetric.id)
    );

  /**
   * Extracts metrics from body and returns the difference
   * between them and currentMetrics
   *
   * @param body body of the response we get from MicroStrategy REST API
   * @param currentMetrics Array of metrics we currently store
   *
   * @returns Array of unique metrics not present in current metrics
   */
  getMetricsInRows(body: any, currentMetrics: any[]): any[] {
    const extractedMetrics = this.extractMetricsInRows(body);
    return this.getMetricsDifference(extractedMetrics, currentMetrics);
  }

  /**
   * Returns boolean based on metric position
   *
   * @param body response we get from the rest API
   *
   * @returns true if metrics are in rows false otherwise
   */
  isMetricInRows = (body: any): boolean =>
    body.definition.grid.metricsPosition
      ? body.definition.grid.metricsPosition.axis === 'rows'
      : false;

  /**
   * Gets information about metrics in rows based on provided parameters
   *
   * @param body body of the response from MicroStrategy REST API
   * @param metricsInRows array of metrics in rows
   * @param fetchedBody body of currenly fetched part of object data
   *
   * @returns object containing information about metrics in rows
   */
  getMetricsInRowsInfo(
    body: any,
    metricsInRows: any[],
    fetchedBody: any
  ): {
    metricsInRows: any[];
    metricsRows: any[];
  } {
    const isMetricInRows = this.isMetricInRows(body);
    const metricsRows: any = [];

    if (isMetricInRows) {
      metricsInRows = this.getMetricsInRows(body, metricsInRows);

      const { grid } = fetchedBody.definition;

      if (grid.metricsPosition) {
        const { index: metricsIndex } = grid.metricsPosition;
        const { rows } = fetchedBody.data.headers;

        rows.forEach((fetchedBodyRow: any) => {
          metricsRows.push(grid.rows[metricsIndex].elements[fetchedBodyRow[metricsIndex]]);
        });
      }
    }

    return { metricsInRows, metricsRows };
  }
}

const mstrAttributeMetricHelper = new MstrAttributeMetricHelper();
export default mstrAttributeMetricHelper;
