/**
 * Helper class to manipulate the new normalized REST API V2
 *
 */

import {
  Axis,
  Data,
  Headers,
  MstrObjectDefinition,
  ValueMatrix,
} from '../mstr-object-response-types';

class NormalizedJsonHandler {
  /**
   * Gets the element name based on its index, returns object with an additional value key.
   * Generate unified value property for single-form attribute element, multi-form
   * attribute element and metric-object-as-element.
   *
   * @param definition - Dataset definition
   * @param axis - 'rows' or 'columns'
   * @param attributeIndex - Array index that corresponds to an attribute
   * @param elementIndex - Array index that corresponds to an attribue element
   *
   * @return
   */
  lookupElement = ({
    definition,
    axis,
    attributeIndex,
    elementIndex,
    rowIndex = -1,
    colIndex = -1,
  }: {
    definition: any;
    axis: Axis;
    attributeIndex: number;
    elementIndex: number;
    rowIndex?: number;
    colIndex?: number;
  }): any => {
    const { crossTab } = definition.grid;
    const rawElement = definition.grid[axis][attributeIndex].elements[elementIndex];
    const { name, formValues, subtotal } = rawElement;

    if (formValues) {
      const { forms } = definition.grid[axis][attributeIndex];
      const numberOfForms = forms ? forms.length : 0;
      for (let index = formValues.length; index < numberOfForms; index++) {
        formValues.unshift('');
      }
    }

    if (!subtotal) {
      return {
        ...rawElement,
        value: formValues || [name],
        subtotalAddress: false,
      };
    }
    return {
      ...rawElement,
      value: formValues || [name],
      subtotalAddress: crossTab ? { attributeIndex, colIndex, axis } : { attributeIndex, rowIndex },
    };
  };

  /**
   * Gets the attribute name based on its index, returns object with an additional value key.
   *
   * @param definition - Dataset definition
   * @param axis - 'rows' or 'columns'
   * @param attributeIndex - Array index that corresponds to an attribute
   *
   * @return
   */
  lookupAttributeName = (definition: any, axis: Axis, attributeIndex: number): any => {
    const rawAttribute = definition.grid[axis][attributeIndex];
    const { name, formValues } = rawAttribute;
    return { ...rawAttribute, value: formValues || [name] };
  };

  /**
   * Get an array with element names
   *
   * @param {Object} definition - Dataset definition
   * @param {string} axis - 'rows' or 'columns'
   * @param {number} elementIndices - Array index that corresponds to an attribue element
   * @return {Array}
   */
  mapElementIndicesToElements = ({
    definition,
    axis,
    headerCells: elementIndices,
    rowIndex = -1,
    colIndex = -1,
  }: {
    definition: any;
    axis: Axis;
    headerCells: any[];
    rowIndex?: number;
    colIndex?: number;
  }): any[] => {
    const result = [];
    const { length } = definition.grid[axis];
    let columnIndex = 0;

    for (let attributeIndex = 0; attributeIndex < length; attributeIndex++) {
      const headerCount = definition.grid[axis][attributeIndex].headerCount || 1;
      const { elements } = definition.grid[axis][attributeIndex] || '';

      for (let headerIndex = 0; headerIndex < headerCount; headerIndex++) {
        const elementIndex = elementIndices[columnIndex];
        const isValueDuplicated =
          elements[elementIndices[columnIndex - 1]] === elements[elementIndex];

        if (elementIndex < 0 || (headerIndex !== 0 && isValueDuplicated)) {
          result.push({ value: [''] });
        } else {
          result.push(
            this.lookupElement({
              definition,
              axis,
              attributeIndex,
              elementIndex,
              rowIndex,
              colIndex,
            })
          );
        }
        columnIndex++;
      }
    }
    return result;
  };

  /**
   * Get an array with element names
   *
   * @param definition - Dataset definition
   * @param axis - 'rows' or 'columns'
   * @return
   */
  mapElementIndicesToNames = ({ definition, axis }: { definition: any; axis: Axis }): any[] => {
    const result = [];
    const { length } = definition.grid[axis];

    for (let attributeIndex = 0; attributeIndex < length; attributeIndex++) {
      // For elementsIndices tuple, each subscript is an attribute index and each value is an element index.
      const headerCount = definition.grid[axis][attributeIndex].headerCount || 1;

      for (let headerIndex = 0; headerIndex < headerCount; headerIndex++) {
        result.push(this.lookupAttributeName(definition, axis, attributeIndex));
      }
    }
    return result;
  };

  /**
   * Creates a 2D Array with row attribute headers and metric values
   *
   * @param {Object} definition - Dataset definition
   * @param {Object} data - Response data object
   * @param {function} onElement - Callback function to process elements
   * @param {String} valueMatrix - Cell value ("raw*", "formatted", "extras")
   *
   * @return {Array}
   */
  renderTabular = (
    definition: MstrObjectDefinition,
    data: Data,
    onElement: Function,
    valueMatrix: ValueMatrix = 'raw'
  ): any[][] => {
    // For each row in header zone.
    const { headers, metricValues } = data;
    const { rows } = headers;
    const result = [];
    const { attrforms, grid } = definition;
    const supportForms = attrforms ? attrforms.supportForms : false;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const headerCells = rows[rowIndex];
      const rowElements = this.mapElementIndicesToElements({
        definition,
        axis: 'rows',
        headerCells,
        rowIndex,
      });
      const tabularRows = [];
      for (let attributeIndex = 0; attributeIndex < rowElements.length; attributeIndex++) {
        const element = rowElements[attributeIndex];
        if (supportForms && element.value.length > 1) {
          for (let index = 0; index < element.value.length; index++) {
            const form = `${element.value[index]}`;
            tabularRows.push(form);
          }
        } else {
          tabularRows.push(onElement(element, rowIndex, attributeIndex));

          // Add extra empty cell for subtotal when it's for multiple attribute forms
          if (element.subtotal && element.subtotalAddress) {
            const subtotalAttribute = grid.rows[element.subtotalAddress.attributeIndex];
            if (
              supportForms &&
              subtotalAttribute &&
              subtotalAttribute.forms &&
              subtotalAttribute.forms.length > 1
            ) {
              for (let idx = 0; idx < subtotalAttribute.forms.length - 1; idx++) {
                tabularRows.push(``);
              }
            }
          }
        }
      }

      if (metricValues && metricValues.raw.length > 0) {
        result.push(tabularRows.concat(metricValues[valueMatrix][rowIndex]));
      } else {
        result.push(tabularRows);
      }
    }

    if (result.length === 0 && metricValues && metricValues.raw.length > 0) {
      result.push([].concat(metricValues[valueMatrix][0]));
    }
    return result;
  };

  /**
   * Creates a 2D array with the attribute forms headers
   *
   * @param result - the forms headers
   * @param axisElements - the axis elements
   * @param onElement - Callback function to process elements
   *
   * @return
   */
  convertForms = (result: any[], axisElements: any[], onElement: Function): any[] => {
    for (const axisElement of axisElements) {
      const elements = onElement(axisElement);
      result = typeof elements === 'string' ? [...result, elements] : [...result, ...elements];
    }
    return result;
  };

  /**
   * Creates a 2D array with the crosstabs headers
   *
   * @param definition - Dataset definition
   * @param axis - 'rows' or 'columns'
   * @param headers - Header data from response
   * @param onElement - Callback function to process elements
   *
   * @return
   */
  renderHeaders = (
    definition: MstrObjectDefinition,
    axis: Axis,
    headers: Headers,
    onElement: Function,
    supportForms?: string
  ): any[][] => {
    if (headers[axis].length === 0) {
      return [[]];
    }
    const headersNormalized =
      axis === 'columns' ? this.transposeMatrix(headers[axis]) : headers[axis];

    const matrix = headersNormalized.map((headerCells: any[], colIndex: number) => {
      const axisElements = this.mapElementIndicesToElements({
        definition,
        axis,
        headerCells,
        colIndex,
      });

      return supportForms
        ? this.convertForms([], axisElements, onElement)
        : axisElements.map((e, axisIndex, elementIndex) => onElement(e, axisIndex, elementIndex));
    });

    return axis === 'columns' ? this.transposeMatrix(matrix) : matrix;
  };

  /**
   * Creates a 2D array with the header titles
   *
   * @param definition - Dataset definition
   * @param axis - 'rows' or 'columns'
   * @param headers - header data from response
   * @param onElement - Callback function to process elements
   *
   * @return {Array}
   */
  renderTitles = (
    definition: MstrObjectDefinition,
    axis: Axis,
    headers: Headers,
    onElement: Function,
    supportForms?: string
  ): any[][] => {
    const columnTitles = headers[axis].map((headerCells: any) => {
      const mapFn =
        axis === 'rows' ? this.mapElementIndicesToNames : this.mapElementIndicesToElements;
      const axisElements = mapFn({ definition, axis, headerCells });
      return supportForms
        ? this.convertForms([], axisElements, onElement)
        : axisElements.map((e, axisIndex, elementIndex) => onElement(e, axisIndex, elementIndex));
    });
    if (columnTitles.length === 0) {
      return [[]];
    }
    return columnTitles;
  };

  /**
   * Creates an array with the metric values. We pass a function to pick the object key onElement.
   * e.g., onElement = (value) => value.rv;
   * If the table doesn't have metrics we return an empty 2d array
   *
   * @param data - Metric values object
   * @param valueMatrix - Cell value ("raw*", "formatted", "extras")
   *
   * @return
   */
  renderRows = (data: Data, valueMatrix: ValueMatrix = 'raw'): any[][] =>
    data.metricValues && data.metricValues[valueMatrix].length
      ? data.metricValues[valueMatrix]
      : Array(data.paging.current).fill(Array(data.headers.columns[0].length).fill(null));

  /**
   * For keep-only/exclude on an attribute cell
   *
   * @param definition - Dataset definition
   * @param axis - 'rows' or 'columns'
   * @param attributeIndex - Array index that corresponds to an attribute
   * @param headerIndex - Array index that corresponds to the header
   *
   * @return {Array}
   */
  getElementIdForGivenHeaderCell = (
    definition: any,
    axis: Axis,
    attributeIndex: number,
    headerIndex: number
  ): string => {
    // axis is either "rows" or "columns"
    const attribute = definition.grid[axis][attributeIndex];
    const element = attribute.elements[headerIndex];
    return element.id;
  };

  /**
   * For keep-only/exclude on a metric value cell
   *
   * @param headers - Array with row and column header index
   * @param mvZoneRowIndex - Metric value row index
   * @param mvZoneColumnIndex - Metric value column index
   *
   * @return
   */
  getElementIdListForGivenMetricCell = (
    headers: any,
    mvZoneRowIndex: number,
    mvZoneColumnIndex: number
  ): string[] => {
    const rowHeader = headers.rows[mvZoneRowIndex];
    const columnHeader = headers.columns[mvZoneColumnIndex];
    return rowHeader.concat(columnHeader).map((element: any) => element.id);
  };

  getMetricsColumnsInformation(columns: any[]): any[] {
    if (columns.length === 0) {
      return columns;
    }
    const transposedHeaders = this.transposeMatrix(columns);

    const parsedColumns = [];

    for (const currentColumn of transposedHeaders) {
      const metrics = currentColumn.find((element: any) => element.type === 'metric');

      if (metrics) {
        parsedColumns.push(metrics);
      } else {
        parsedColumns.push(currentColumn[currentColumn.length - 1]);
      }
    }
    return parsedColumns;
  }

  /**
   * Tranpose a matrix (2D array)
   *
   * @param matrix - 2D Array
   *
   * @return - Transposed 2D array
   */
  transposeMatrix = (matrix: any[][]): any[][] =>
    matrix[0].map((_, col) => matrix.map(row => row[col]));
}

export default new NormalizedJsonHandler();
