class MstrAttributeMetricHelper {
  /**
   * Extracts attributes and metrics for a compound grid
   * 
   * @param {Object} grid contains information about mstr object's structure (rows, columns)
   * 
   * @returns {Object} object with two properties: attributes and metrics
   */
  extractAttributesMetricsCompoundGrid(grid) {
    const columns = grid.columnSets.flatMap(columnSet => columnSet.columns);
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
    .flatMap(({ elements }) => elements)
    .map(({ id, name }) => ({ id, name }));
}

const mstrAttributeMetricHelper = new MstrAttributeMetricHelper();
export default mstrAttributeMetricHelper;