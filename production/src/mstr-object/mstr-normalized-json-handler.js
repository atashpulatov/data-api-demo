/* eslint-disable class-methods-use-this */

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
  lookupElement = ({ definition, axis, attributeIndex, elementIndex, rowIndex = -1, colIndex = -1 }) => {
    const { crossTab } = definition.grid;
    const rawElement = definition.grid[axis][attributeIndex].elements[elementIndex];
    const { name, formValues, subtotal } = rawElement;
    if (!subtotal) {
      return {
        ...rawElement, value: formValues || [name], subtotalAddress: false,
      };
    }
    return {
      ...rawElement,
      value: formValues || [name],
      subtotalAddress: crossTab ? { attributeIndex, colIndex, axis } : { attributeIndex, rowIndex },
    };
  }

  /**
   * Gets the attribute name based on its index, returns object with an additional value key.
   *
   * @param {Object} definition - Dataset definition
   * @param {string} axis - 'rows' or 'columns'
   * @param {number} attributeIndex - Array index that corresponds to an attribute
   *
   * @memberof JSONHandler
   * @return {Object}
   */
  lookupAttributeName = (definition, axis, attributeIndex) => {
    const rawAttribute = definition.grid[axis][attributeIndex];
    const { name, formValues } = rawAttribute;
    return { ...rawAttribute, value: formValues || [name] };
  }

  /**
   * Get an array with element names
   *
   * @param {Object} definition - Dataset definition
   * @param {string} axis - 'rows' or 'columns'
   * @param {number} elementIndices - Array index that corresponds to an attribue element
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  mapElementIndicesToElements = ({ definition, axis, headerCells: elementIndices, rowIndex = -1, colIndex = -1 }) => {
    const result = [];
    for (let attributeIndex = 0; attributeIndex < elementIndices.length; attributeIndex++) {
      const elementIndex = elementIndices[attributeIndex];
      if (elementIndex < 0) {
        result.push({ value: [''] });
      } else {
        // For elementsIndices tuple, each subscript is an attribute index and each value is an element index.
        result.push(this.lookupElement({ definition, axis, attributeIndex, elementIndex, rowIndex, colIndex }));
      }
    }
    return result;
  }

  /**
   * Get an array with element names
   *
   * @param {Object} definition - Dataset definition
   * @param {string} axis - 'rows' or 'columns'
   * @param {number} elementIndices - Array index that corresponds to an attribue element
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  mapElementIndicesToNames = ({ definition, axis, headerCells: elementIndices }) => {
    const result = [];
    for (let attributeIndex = 0; attributeIndex < elementIndices.length; attributeIndex++) {
      // For elementsIndices tuple, each subscript is an attribute index and each value is an element index.
      result.push(this.lookupAttributeName(definition, axis, attributeIndex));
    }
    return result;
  }

  /**
   * Creates a 2D Array with row attribute headers and metric values
   *
   * @param {Object} definition - Dataset definition
   * @param {Object} data - Response data object
   * @param {function} onElement - Callback function to process elements
   * @param {String} valueMatrix - Cell value ("raw*", "formatted", "extras")
   *
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  renderTabular = (definition, data, onElement, valueMatrix = 'raw') => {
    // For each row in header zone.
    const { headers, metricValues } = data;
    const { rows } = headers;
    const result = [];
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const headerCells = rows[rowIndex];
      const rowElements = this.mapElementIndicesToElements({ definition, axis: 'rows', headerCells, rowIndex });
      const tabularRows = [];
      for (let attributeIndex = 0; attributeIndex < rowElements.length; attributeIndex++) {
        const element = rowElements[attributeIndex];
        const supportForms = true;
        if (supportForms && element.value.length > 1) {
          for (let index = 0; index < element.value.length; index++) {
            const form = `'${element.value[index]}`;
            tabularRows.push(form);
          }
        } else {
          tabularRows.push(onElement(element, rowIndex, attributeIndex));
        }
      }
      if (metricValues && metricValues.raw.length > 0) {
        result.push(tabularRows.concat(metricValues[valueMatrix][rowIndex]));
      } else {
        result.push(tabularRows);
      }
    }
    if ((result.length === 0) && metricValues && metricValues.raw.length > 0) {
      result.push([].concat(metricValues[valueMatrix][0]));
    }
    return result;
  };

  /**
   * Creates a 2D array with the crosstabs headers
   *
   * @param {Object} definition - Dataset definition
   * @param {string} axis - 'rows' or 'columns'
   * @param {Array} headers - Header data from response
   * @param {function} onElement - Callback function to process elements
   *
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  renderHeaders = (definition, axis, headers, onElement, supportForms) => {
    if (headers[axis].length === 0) return [[]];
    const headersNormalized = axis === 'columns' ? this._transposeMatrix(headers[axis]) : headers[axis];
    const matrix = headersNormalized.map((headerCells, colIndex) => {
      const axisElements = this.mapElementIndicesToElements({ definition, axis, headerCells, colIndex });
      if (supportForms) {
        let result = [];
        for (let i = 0; i < axisElements.length; i++) {
          const elements = onElement(axisElements[i]);
          result = typeof elements === 'string' ? [...result, elements] : [...result, ...elements];
        }
        return result;
      }
      return axisElements.map((e, axisIndex, elementIndex) => onElement(e, axisIndex, elementIndex));
    });
    return axis === 'columns' ? this._transposeMatrix(matrix) : matrix;
  }

  /**
   * Creates a 2D array with the header titles
   *
   * @param {Object} definition - Dataset definition
   * @param {string} axis - 'rows' or 'columns'
   * @param {Array} headers - header data from response
   * @param {function} onElement - Callback function to process elements
   *
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  renderTitles = (definition, axis, headers, onElement, supportForms) => {
    const columnTitles = headers[axis].map((headerCells) => {
      const mapFn = axis === 'rows' ? this.mapElementIndicesToNames : this.mapElementIndicesToElements;
      const axisElements = mapFn({ definition, axis, headerCells });
      if (supportForms) {
        let result = [];
        for (let i = 0; i < axisElements.length; i++) {
          const elements = onElement(axisElements[i]);
          result = typeof elements === 'string' ? [...result, elements] : [...result, ...elements];
        }
        return result;
      }
      return axisElements.map((e, axisIndex, elementIndex) => onElement(e, axisIndex, elementIndex));
    });
    if (columnTitles.length === 0) return [[]];
    return columnTitles;
  }

  /**
   * Creates an array with the metric values. We pass a function to pick the object key onElement.
   * e.g., onElement = (value) => value.rv;
   * If the table doesn't have metrics we return an empty 2d array
   *
   * @param {Object} data - Metric values object
   * @param {String} valueMatrix - Cell value ("raw*", "formatted", "extras")
   *
   * @memberof NormalizedJsonHandler
   * @return {Array}
   */
  renderRows = (data, valueMatrix = 'raw') => (data.metricValues ? data.metricValues[valueMatrix] : Array(data.paging.current).fill(Array(data.headers.columns[0].length).fill(null)))

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
   *
   * @param {Array} headers - Array with row and column header index
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

  /**
   * Tranpose a matrix (2D array)
   *
   * @param {Array} matrix - 2D Array
   *
   * @memberof NormalizedJsonHandler
   * @return {Array} - Transposed 2D array
   */
  _transposeMatrix = (matrix) => matrix[0].map((_, col) => matrix.map((row) => row[col]));
}

export default new NormalizedJsonHandler();
