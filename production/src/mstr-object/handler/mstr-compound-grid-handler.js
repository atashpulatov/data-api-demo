/* eslint-disable class-methods-use-this */
import mstrNormalizedJsonHandler from './mstr-normalized-json-handler';
import mstrAttributeFormHelper from '../helper/mstr-attribute-form-helper';
import mstrAttributeMetricHelper from '../helper/mstr-attribute-metric-helper';

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
    const { attributes, metrics } = mstrAttributeMetricHelper.extractAttributesMetricsCompoundGrid(grid);
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
      attributes: attributes,
      metrics: metrics
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
    const onElement = (element) => [element];
    const supportForms = attrforms ? attrforms.supportForms : false;

    const commonColumns = this.renderCompoundGridRowTitles(headers, definition, onElement, supportForms);
    const params = [headers, definition, onElement, onElement];
    const columnSetColumns = this.renderCompoundGridColumnHeaders(...params);

    const parsedColumnSetColumns = mstrNormalizedJsonHandler.getMetricsColumnsInformation(columnSetColumns);
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
    const { headers: { columnSets } } = data;
    let columns = 0;
    for (let index = 0; index < columnSets.length; index++) {
      columns += columnSets[index].length;
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
    const rowsAttributes = mstrAttributeFormHelper.getAttributeWithForms(definition.grid.rows, attrforms);
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
  getRows = (response) => ({ row: this.renderRows(response.data) })

  /**
   * Gets subtotals defined or visible information from the response.
   *
   * @param {JSON} response
   * @return {Object}
   */
  getSubtotalsInformation = (response) => [] // TODO


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
    const { metricValues: { columnSets }, paging } = data;
    const rowTable = [];
    for (let row = 0; row < paging.current; row++) {
      const rowValues = [];
      for (let colSet = 0; colSet < columnSets.length; colSet++) {
        if (columnSets[colSet][valueMatrix][row] && columnSets[colSet][valueMatrix][row].length) {
          rowValues.push(...columnSets[colSet][valueMatrix][row]);
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

    const onElement = (array) => (e) => {
      if (array) { array.push(e.subtotalAddress); }
      // attribute as row with forms
      const forms = mstrAttributeFormHelper.getAttributesTitleWithForms(e, attrforms);
      if (forms) {
        return forms;
      }
      // attribute as column with forms
      return supportForms && e.value.length > 1 ? e.value.map((form) => `'${form}`) : `'${e.value.join(' ')}`;
    };

    const onAttribute = (array) => (e, attributeIndex, colIndex) => {
      if (array && e.subtotal) { array.push({ attributeIndex, colIndex, axis: 'columns' }); } else {
        array.push(false);
      }
      return supportForms ? e.formValues : [e.formValues[0]];
    };

    const onMetric = (e) => [e.name];

    const rowTotals = [];
    const columnTotals = [];

    const rows = this.renderCompoundGridRowHeaders(headers, definition, onElement(rowTotals), supportForms);
    const columns = this.renderCompoundGridColumnHeaders(headers, definition, onAttribute(columnTotals), onMetric);
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
  renderCompoundGridRowTitles(headers, definition, onElement = (e) => e, supportForms) {
    return mstrNormalizedJsonHandler.renderTitles(definition, 'rows', headers, onElement, supportForms);
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
  renderCompoundGridRowHeaders(headers, definition, onElement = (e) => e, supportForms) {
    return mstrNormalizedJsonHandler.renderHeaders(definition, 'rows', headers, onElement, supportForms);
  }

  /**
   * Creates a 2D array with the column grid headers
   *
   * @param {Object} definition - Dataset definition
   * @param {string} axis - 'rows' or 'columns'
   * @param {Array} headers - Header data from response
   * @param {function} onElement - Callback function to process elements
   *
   * @return {Array}
   */
  renderCompoundGridColumnHeaders(headers, definition, onAttribute, onMetric) {
    const { columnSets: columnSetsHeaders } = headers;
    const { columnSets: columnSetsDefinition } = definition.grid;

    let colIndex = 0;
    let startColIndex = 0;
    let attrFormsBoundingHeight = 0;
    const parsedHeaders = [];

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
            parsedHeaders[colIndex].push('\'');
          } else {
            const { type, elements } = columnsDefinition[k];
            const element = elements[elementIndex];

            switch (type) {
              case 'attribute':
              case 'consolidation':
                parsedHeaders[colIndex].push(...onAttribute(element, j, colIndex));
                break;
              case 'templateMetrics':
                parsedHeaders[colIndex].push(...onMetric(element));
                break;
              default:
                parsedHeaders[colIndex].push('\'');
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
      for (let i = 0; i < parsedHeaders.length; i++) {
        while (parsedHeaders[i].length < attrFormsBoundingHeight) {
          parsedHeaders[i].unshift('\'');
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
