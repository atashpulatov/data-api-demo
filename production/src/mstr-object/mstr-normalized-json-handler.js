/**
 * Helper class to manipulate the new normalized REST API V2
 *
 * @export
 * @class NormalizedJsonHandler
 */

class NormalizedJsonHandler {
  /**
   * Gets the element name based on its index, returns object with an additional value key.
   * Generate unified value property for single-form attribute element, multi-form
   * attribute element and metric-object-as-element.
   *
   * @param {Object} definition - Dataset definition
   * @param {string} axis - 'rows' or 'columns'
   * @param {number} attributeIndex - Array index that corresponds to an attribute
   * @param {number} elementIndex - Array index that corresponds to an attribue element
   *
   * @memberof JSONHandler
   * @return {Object}
   */
  lookupElement = (definition, axis, attributeIndex, elementIndex) => {
    const rawElement = definition.grid[axis][attributeIndex].elements[elementIndex];
    const {name, formValues} = rawElement;
    return {...rawElement, value: formValues || [name]};
  };

  /**
   * Get an array with element names
   *
   * @param {Object} definition - Dataset definition
   * @param {string} axis - 'rows' or 'columns'
   * @param {number} elementIndices - Array index that corresponds to an attribue element
   * @memberof NormalizedJsonHandler
   * @return {array}
   */
  mapElementIndicesToElements = (definition, axis, elementIndices) => {
    return elementIndices.map((elementIndex, attributeIndex) =>
      // For elementsIndices tuple, each subscript is an attribute index and each value is an element index.
      this.lookupElement(definition, axis, attributeIndex, elementIndex));
  };

  /**
   *
   * Creates a 2D Array with row attribute headers and metric values
   *
   * @param {Object} definition - Dataset definition
   * @param {Object} data - Response data object
   * @param {function} onElement - Callback function to process elements
   * @param {function} onMetricValue - Callback function to process metric values
   *
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  renderTabular = (definition, data, onElement, onMetricValue) => {
    // For each row in header zone.
    const {headers, metricValues} = data;

    return headers.rows.map((headerCells, rowIndex) => {
      const rowElements = this.mapElementIndicesToElements(definition, 'rows', headerCells);
      return (
        // Process elements
        rowElements.map((e, attributeIndex) => onElement(e, rowIndex, attributeIndex))
      ).concat(
          // Process metric values of the same row
          metricValues[rowIndex].map((mv, mvZoneColumnIndex) => onMetricValue(mv, rowIndex, mvZoneColumnIndex))
      );
    });
  };
  /**
   * Creates a 2D Array for row headers
   *
   * @param {Object} definition - Dataset definition
   * @param {Object} headers - Response data object
   *
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  renderRowHeaders = (definition, headers) => {
    return headers.rows.map((array) => {
      return array.map((arrayItem, arrayItemIndex) => {
        return definition.grid.rows[arrayItemIndex].elements[arrayItem].formValues[0];
      });
    });
  }

  /**
   * Creates a 2D Array for column headers
   *
   * @param {Object} definition - Dataset definition
   * @param {Object} headers - Response data object
   *
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  renderColumnHeaders = (definition, headers) => {
    const firstItemsArray = [];
    const secondItemsArray = [];
    const result = [];
    headers.columns.forEach((pair) => {
      firstItemsArray.push(pair[0]);
      secondItemsArray.push(pair[1]);
    });
    const firstResult = firstItemsArray.map((elem) => definition.grid.columns[0].elements[elem].formValues[0]);
    const secondResult = secondItemsArray.map((elem) => definition.grid.columns[1].elements[elem].name);
    result.push(firstResult, secondResult);
    return result;
  }

  /**
   * For keep-only/exclude on an attribute cell
   *
   * @param {Object} definition - Dataset definition
   * @param {string} axis - 'rows' or 'columns'
   * @param {number} attributeIndex - Array index that corresponds to an attribute
   * @param {number} headerIndex - Array index that corresponds to the header
   *
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  getElementIdForGivenHeaderCell = (definition, axis, attributeIndex, headerIndex) => {
    // axis is either "rows" or "columns"
    const attribute = definition.grid[axis][attributeIndex];
    const element = attribute.elements[headerIndex];
    return element.id;
  }

  /**
   * For keep-only/exclude on a metric value cell
   * @param {array} headers - Array with row and column header index
   * @param {number} mvZoneRowIndex - Metric value row index
   * @param {number} mvZoneColumnIndex - Metric value column index
   *
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  getElementIdListForGivenMetricCell = (headers, mvZoneRowIndex, mvZoneColumnIndex) => {
    const rowHeader = headers.rows[mvZoneRowIndex];
    const columnHeader = headers.columns[mvZoneColumnIndex];
    return (rowHeader.concat(columnHeader)).map((element) => element.id);
  }
}

export default new NormalizedJsonHandler();
