import MstrObjectType from '../mstr-object-type-enum';

class MstrAttributeMetricHelper {
  /**
   * Extracts attributes and metrics for a compound grid
   *
   * @param {Object} grid contains information about mstr object's structure (rows, columns)
   *
   * @returns {Object} object with two properties: attributes and metrics
   */
  extractAttributesMetricsCompoundGrid(grid) {
    // equivalent to grid.columnSets.flatMap(columnSet => columnSet.columns);
    const columns = grid.columnSets.reduce((allColumns, currColumnSet) => allColumns.concat(currColumnSet.columns), []);
    const { rows } = grid;
    const attributes = this.extractAttributes(rows, columns);
    const metrics = this.extractMetrics(rows, columns);

    return { attributes, metrics };
  }

  /**
   * Extracts attributes and metrics for a grid
   *
   * @param {Object} grid contains information about mstr object's structure (rows, columns)
   *
   * @returns {Object} object with two properties: attributes and metrics,
   */
  extractAttributesMetrics(grid) {
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
  extractAttributes = (rows, columns) => columns
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
  extractMetrics = (rows, columns) => columns
    .filter(({ type }) => type === 'templateMetrics')
    .concat(rows.filter(({ type }) => type === 'templateMetrics'))
    // equivalent to flatMap(({ elements }) => elements)
    .reduce((allElements, { elements: currElements }) => allElements.concat(currElements), [])
    .map(({ id, name }) => ({ id, name }));

  /**
   * Extracts metrics from body of the response we get from MSTR REST API
   *
   * @param {Object} body body of the response we get from MicroStrategy REST API
   *
   * @returns {Object[]} Array of metric objects with id and name properties
   */  
  extractMetricsInRows = (body) => {
    const columns = body.visualizationType === MstrObjectType.visualizationType.COMPOUND_GRID ?
      body.definition.grid.columnSets.reduce((allColumns, currColumnSet) => allColumns.concat(currColumnSet.columns), []) :
      body.definition.grid.columns;
    const { rows } = body.definition.grid;

    return this.extractMetrics(rows, columns);
  }

  /**
   * Compares two metric arrays and returns their difference
   * 
   * @param {Object[]} fetchedMetrics Array of metrics where new unique metrics will be searched
   * @param {Object[]} currentMetrics Array of metrics based on which the difference will be calculated
   * 
   * @returns {Object[]} Array of unique metrics that are present in fetchedMetrics
   * and not present in currentMetrics; Empty array if there are no such metrics
   */
  getMetricsDifference(fetchedMetrics, currentMetrics) {
    return fetchedMetrics.filter(fetchedMetric => !currentMetrics.some(currentMetric => currentMetric.id === fetchedMetric.id));
  }
  
  /**
   * Extracts metrics from body and returns the difference
   * between them and currentMetrics 
   * 
   * @param {Object} body body of the response we get from MicroStrategy REST API
   * @param {Object[]} currentMetrics Array of metrics we currently store
   * 
   * @returns {Object[]} Array of unique metrics not present in current metrics
   */
  getMetricsInRows(body, currentMetrics) {
    const extractedMetrics = this.extractMetricsInRows(body);
    return this.getMetricsDifference(extractedMetrics, currentMetrics);
  }

  /**
   * Returns boolean based on metric position
   * 
   * @param {Object} body response we get from the rest API
   * 
   * @returns {boolean} true if metrics are in rows false otherwise 
   */
  isMetricInRows(body) {
    return !!body.definition.grid.metricsPosition ? 
      body.definition.grid.metricsPosition.axis === 'rows' :
      false;     
  }
}

const mstrAttributeMetricHelper = new MstrAttributeMetricHelper();
export default mstrAttributeMetricHelper;
