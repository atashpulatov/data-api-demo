import mstrAttributeFormHelper from '../helper/mstr-attribute-form-helper';
import mstrAttributeMetricHelper from '../helper/mstr-attribute-metric-helper';

import mstrNormalizedJsonHandler from './mstr-normalized-json-handler';

/**
 * Handler to parse compound grid
 *
 * @class CompoundGridHandler
 */
class CompoundGridHandler {
  /**
   * Parses compound grid JSON response to the same structure as normal grids
   *
   * @param {JSON} response
   * @returns {Object} mstr table
   */
  createTable(response) {
    const { definition, data, attrforms } = response;
    // Crosstabular is a Crosstab report with metrics in Rows and nothing in columns, so we display it as tabular
    const isCrosstabular = false;
    const columnInformation = this.getColumnInformation(definition, data, attrforms);
    const isCrosstab = true;
    const { grid } = definition;
    const { attributes, metrics } =
      mstrAttributeMetricHelper.extractAttributesMetricsCompoundGrid(grid);
    return {
      tableSize: this.getTableSize(data),
      columnInformation,
      headers: this.getHeaders(response),
      id: response.k,
      isCrosstab,
      isCrosstabular,
      name: response.n,
      rows: this.getRows(response),
      visualizationType: response.visualizationType,
      attributesNames: this.getAttributesName(definition, attrforms),
      attributes,
      metrics,
    };
  }

  /**
   * Returns array with indexed column definition
   *
   * @param {Object} definition grid definition from instance
   * @param {Object} data grid data from instance
   * @param {Object} attrforms attribute forms information
   * @returns
   */
  getColumnInformation(definition, data, attrforms) {
    const { headers } = data;
    const onElement = element => [element];
    const supportForms = attrforms ? attrforms.supportForms : false;

    const commonColumns = this.renderCompoundGridRowTitles(
      headers,
      definition,
      supportForms,
      onElement
    );
    const params = [data, definition, onElement, onElement];
    const columnSetColumns = this.renderCompoundGridColumnHeaders(...params);

    const parsedColumnSetColumns =
      mstrNormalizedJsonHandler.getMetricsColumnsInformation(columnSetColumns);
    const columns = [...commonColumns[commonColumns.length - 1], ...parsedColumnSetColumns];

    return mstrAttributeFormHelper.splitAttributeForms(columns, supportForms);
  }

  /**
   * Returns number of rows and metric columns of tabular data if not crosstabs of metrics grid if crosstabs
   *
   * @param {Object} data grid data from response
   * @return {Object} object with rows and columns
   */
  getTableSize(data) {
    const {
      headers: { columnSets },
    } = data;
    let columns = 0;
    for (const columnSet of columnSets) {
      columns += columnSet.length;
    }
    return {
      rows: data.paging.total,
      columns,
    };
  }

  /**
   * Get attribute names
   *
   * @param {JSON} definition Object definition from response
   * @param {JSON} attrforms attribute forms information
   * @return {Object} Contains arrays of columns and rows attributes names
   */
  getAttributesName(definition, attrforms) {
    const rowsAttributes = mstrAttributeFormHelper.getAttributeWithForms(
      definition.grid.rows,
      attrforms
    );
    return { rowsAttributes };
  }

  /**
   * Column set headers may have different dimensions
   * This function calculates the bounding height
   *
   * @param {Array} columnSetsHeaders column set headers from instance data
   * @returns bounding height
   */
  calculateColumnHeaderHeight(columnSetsHeaders) {
    let boundingHeight = 0;
    columnSetsHeaders.forEach(columnSet => {
      if (columnSet.length !== 0) {
        const { length } = columnSet[0];
        if (length > boundingHeight) {
          boundingHeight = length;
        }
      }
    });
    return boundingHeight;
  }

  /**
   * Gets raw table rows
   *
   * @param {JSON} response
   * @return {Object} object with rows property
   */
  getRows = response => ({ row: this.renderRows(response.data) });

  /**
   * Gets subtotals defined or visible information from the response.
   *
   * @param {JSON} response
   * @return {Object}
   */
  getSubtotalsInformation = _response => []; // Not supported at this moment

  /**
   * Creates an array with metric values per columnSet
   * If the table doesn't have metrics we return an empty 2d array
   *
   * @param {Object} data - Metric values object
   * @param {String} valueMatrix - Cell value ("raw*", "formatted", "extras")
   *
   * @return {Array}
   */
  renderRows(data, valueMatrix = 'raw') {
    const {
      metricValues: { columnSets },
      paging,
      headers,
    } = data;
    const rowTable = [];
    for (let row = 0; row < paging.current; row++) {
      const rowValues = [];
      for (let colSet = 0; colSet < columnSets.length; colSet++) {
        const headersColumnSetLength = headers.columnSets[colSet].length;

        if (columnSets[colSet][valueMatrix][row] && columnSets[colSet][valueMatrix][row].length) {
          rowValues.push(...columnSets[colSet][valueMatrix][row]);
        } else if (headersColumnSetLength) {
          // if we have no metric values, but we still have headers thats mean we have attributes only in column set,
          // to display it properly we are creating an array filled with nulls
          rowValues.push(...Array(headersColumnSetLength).fill(null));
        }
      }
      rowTable.push(rowValues);
    }
    return rowTable;
  }

  /**
   * Gets object with compound grid rows and column headers
   *
   * @param {JSON} response
   * @return {Object} rows, columns and subtotals values
   */
  getHeaders(response) {
    const { definition, data, attrforms } = response;
    const { headers } = data;
    const supportForms = attrforms ? attrforms.supportForms : false;

    const onElement = array => e => {
      if (array) {
        array.push(e.subtotalAddress);
      }
      // attribute as row with forms
      const forms = mstrAttributeFormHelper.getAttributesTitleWithForms(e, attrforms);
      if (forms) {
        return forms;
      }
      // attribute as column with forms
      return supportForms && e.value.length > 1
        ? e.value.map(form => `${form}`)
        : `${e.value.join(' ')}`;
    };

    const onAttribute = array => (e, numberOfForms, attributeIndex, colIndex) => {
      if (array && e.subtotal) {
        array.push({ attributeIndex, colIndex, axis: 'columns' });
      } else {
        array.push(false);
      }

      if (e.formValues) {
        for (let index = e.formValues.length; index < numberOfForms; index++) {
          e.formValues.unshift("'");
        }
      }

      return supportForms ? e.formValues : [e.formValues[0]];
    };

    const onMetric = e => [e.name];

    const rowTotals = [];
    const columnTotals = [];

    const rows = this.renderCompoundGridRowHeaders(
      headers,
      definition,
      supportForms,
      onElement(rowTotals)
    );
    const columns = this.renderCompoundGridColumnHeaders(
      data,
      definition,
      onAttribute(columnTotals),
      onMetric
    );
    const subtotalAddress = [...rowTotals, ...columnTotals];

    return { rows, columns, subtotalAddress };
  }

  /**
   * Creates a 2D array with the header titles
   *
   * @param {Array} headers - header data from response
   * @param {Object} definition - Dataset definition
   * @param {function} onElement - Callback function to process elements
   * @param {string} supportForms - attribute form information
   *
   * @return {Array}
   */
  renderCompoundGridRowTitles(headers, definition, supportForms, onElement = e => e) {
    return mstrNormalizedJsonHandler.renderTitles(
      definition,
      'rows',
      headers,
      onElement,
      supportForms
    );
  }

  /**
   * Creates a 2D array with the compround grid row headers
   *
   * @param {Array} headers - Header data from response
   * @param {Object} definition - Dataset definition
   * @param {function} onElement - Callback function to process elements
   * @param {string} supportForms - attribute form information
   *
   * @return {Array}
   */
  renderCompoundGridRowHeaders(headers, definition, supportForms, onElement = e => e) {
    return mstrNormalizedJsonHandler.renderHeaders(
      definition,
      'rows',
      headers,
      onElement,
      supportForms
    );
  }

  /**
   * Creates a 2D array with the column grid headers
   *
   * @param {Object} data - contains data boaut  headers and values from response
   * @param {Object} definition - Dataset definition
   * @param {function} onAttribute - Callback function to attributes
   * @param {function} onMetric - Callback function to process metrics
   *
   * @return {Array}
   */
  renderCompoundGridColumnHeaders(data, definition, onAttribute, onMetric) {
    const {
      headers: { columnSets: columnSetsHeaders },
      metricValues: { columnSets: columnSetsMetricValues },
    } = data;

    const { columnSets: columnSetsDefinition } = definition.grid;

    let colIndex = 0;
    let startColIndex = 0;
    let attrFormsBoundingHeight = 0;
    const parsedHeaders = [];

    this.populateEmptyColumnSetsHeaders(
      columnSetsHeaders,
      columnSetsMetricValues,
      columnSetsDefinition
    );
    const boundingHeight = this.calculateColumnHeaderHeight(columnSetsHeaders);

    // iterating over column sets
    for (let i = 0; i < columnSetsHeaders.length; i++) {
      const header = columnSetsHeaders[i];
      const currentColumnSet = columnSetsDefinition[i];
      this.addEmptyHeaders(header, boundingHeight, currentColumnSet);
      const columnsDefinition = [...currentColumnSet.columns];

      // iterating over columns in column set
      for (let j = 0; j < header.length; j++) {
        colIndex = startColIndex;

        // iterating over elements in columns
        for (let k = 0; k < header[j].length; k++) {
          colIndex = startColIndex + j;

          // if array containing header of column does not exist we create it
          if (!parsedHeaders[colIndex]) {
            parsedHeaders[colIndex] = [];
          }

          const elementIndex = header[j][k];

          if (elementIndex < 0) {
            // -1 is for empty row
            parsedHeaders[colIndex].push("'");
          } else {
            const { type, elements, forms } = columnsDefinition[k];
            const element = elements[elementIndex];
            // consolidation does not have forms field in this case we set 1 as forms length
            const formsLength = forms ? forms.length : 1;

            switch (type) {
              case 'attribute':
              case 'consolidation':
                parsedHeaders[colIndex].push(...onAttribute(element, formsLength, j, colIndex));
                break;
              case 'templateMetrics':
                parsedHeaders[colIndex].push(...onMetric(element));
                break;
              case 'customgroup':
                parsedHeaders[colIndex].push(...element.formValues);
                break;
              default:
                parsedHeaders[colIndex].push("'");
            }
          }
        }
        attrFormsBoundingHeight = Math.max(parsedHeaders[colIndex].length, attrFormsBoundingHeight);
      }
      // startColIndex is number of columns in previous columnsets
      startColIndex += header.length;
    }

    this.handleAttributeForms(boundingHeight, attrFormsBoundingHeight, parsedHeaders);

    return mstrNormalizedJsonHandler.transposeMatrix(parsedHeaders);
  }

  /**
   * Adds empty cells when we have different header height due to attribute forms
   *
   * @param {Number} boundingHeight headers height
   * @param {Number} attrFormsBoundingHeight headerds height with attribute forms
   * @param {Array} parsedHeaders compound grid normalized headers
   */
  handleAttributeForms(boundingHeight, attrFormsBoundingHeight, parsedHeaders) {
    if (boundingHeight !== attrFormsBoundingHeight) {
      for (const header of parsedHeaders) {
        while (header.length < attrFormsBoundingHeight) {
          header.unshift("'");
        }
      }
    }
  }

  /**
   * Adds placeholder for empty value for empty column set headers
   *
   * @param {Array} columnSetsHeaders  Contains headers indexes for each columnset
   * @param {Array} columnSetsMetricValues  contains metric values for each columnset
   * @param {Array} columnSetsDefinition  Contains headers values for each columnset
   */
  populateEmptyColumnSetsHeaders(columnSetsHeaders, columnSetsMetricValues, columnSetsDefinition) {
    for (let i = 0; i < columnSetsHeaders.length; i++) {
      const rawMetricValues = columnSetsMetricValues[i].raw;

      if (
        columnSetsHeaders[i].length === 0 &&
        rawMetricValues &&
        rawMetricValues[0] &&
        rawMetricValues[0].length > 0
      ) {
        for (let j = 0; j < rawMetricValues[0].length; j++) {
          if (j === 0) {
            columnSetsDefinition[i].columns.unshift({
              type: null,
              elements: [],
            });
          }
          columnSetsHeaders[i].unshift([-1]);
        }
      }
    }
  }

  /**
   * Adds empty elements to columnSets with different dimensions
   *
   * @param {Array} header
   * @param {Number} boundingHeight
   * @param {Object} currentColumnSet
   */
  addEmptyHeaders(header, boundingHeight, currentColumnSet) {
    for (let i = 0; i < header.length; i++) {
      while (header[i].length < boundingHeight) {
        if (i === 0) {
          currentColumnSet.columns.unshift({ type: null, elements: [] });
        }
        header[i].unshift(-1);
      }
    }
  }
}

export default new CompoundGridHandler();
