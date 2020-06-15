/* eslint-disable class-methods-use-this */
import mstrNormalizedJsonHandler from './mstr-normalized-json-handler';

/**
 * Handler to parse compound grid
 *
 * @class CompoundGridHandler
 */
class CompoundGridHandler {
  createTable(response) {
    const { definition, data, attrforms } = response;
    // Crosstabular is a Crosstab report with metrics in Rows and nothing in columns, so we display it as tabular
    const isCrosstabular = false;
    const columnInformation = this.getColumnInformation(definition, data, attrforms);
    const isCrosstab = true;

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
    };
  }

  parseColumnSets(columnSets) {
    const parsedColumns = [];
    columnSets.forEach(({ columns }) => {
      parsedColumns.push(...columns);
    });
    return parsedColumns;
  }

  getColumnInformation(definition, data, attrforms) {
    const { headers } = data;
    const onElement = (element) => [element];
    const supportForms = attrforms ? attrforms.supportForms : false;

    const commonColumns = this.renderCompoundGridRowTitles(headers, definition, onElement, supportForms);
    const params = [headers, definition, onElement, onElement];
    const columnSetColumns = this.renderCompoundGridColumnHeaders(...params);

    const parsedColumnSetColumns = mstrNormalizedJsonHandler.getMetricsColumnsInformation(columnSetColumns);
    const columns = [...commonColumns[commonColumns.length - 1], ...parsedColumnSetColumns];

    return mstrNormalizedJsonHandler.splitAttributeForms(columns, supportForms);
  }

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

  getAttributesName(definition, attrforms) {
    const rowsAttributes = mstrNormalizedJsonHandler.getAttributeWithForms(definition.grid.rows, attrforms);
    return { rowsAttributes };
  }

  calculateColumnHeaderHeight(columnSetsHeaders, columnSets) {
  // TODO: Take into consideration attribute forms from columnSets
    let boundingHeight = 0;
    columnSetsHeaders.forEach(columnSet => {
      const { length } = columnSet[0];
      if (length > boundingHeight) {
        boundingHeight = length;
      }
    });
    return boundingHeight;
  }

  calculateColumnHeaderOffset(columnSets, columnSetsDefinition) {
    const offset = [0]; // No offset for first columnSet
    for (let i = 0; i < columnSets.length - 1; i++) {
      offset.push(columnSetsDefinition[i].columns.length + offset[i]);
    }
    return offset;
  }

  getRows = (response) => ({ row: this.renderRows(response.data) })

  getSubtotalsInformation = () => [] // TODO

  renderRows(data, valueMatrix = 'raw') {
    const { metricValues: { columnSets }, paging } = data;
    const rowTable = [];
    for (let row = 0; row < paging.current; row++) {
      const rowValues = [];
      for (let colSet = 0; colSet < columnSets.length; colSet++) {
        rowValues.push(...columnSets[colSet][valueMatrix][row]);
      }
      rowTable.push(rowValues);
    }
    return rowTable;
  }

  getHeaders(response) {
    const { definition, data, attrforms } = response;
    const { headers } = data;
    const supportForms = attrforms ? attrforms.supportForms : false;

    const onElement = (array) => (e) => {
      if (array) { array.push(e.subtotalAddress); }
      // attribute as row with forms
      const forms = mstrNormalizedJsonHandler.getAttributesTitleWithForms(e, attrforms);
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

  renderCompoundGridRowTitles(headers, definition, onElement = (e) => e, supportForms) {
    return mstrNormalizedJsonHandler.renderTitles(definition, 'rows', headers, onElement, supportForms);
  }

  renderCompoundGridRowHeaders(headers, definition, onElement = (e) => e, supportForms) {
    return mstrNormalizedJsonHandler.renderHeaders(definition, 'rows', headers, onElement, supportForms);
  }

  renderCompoundGridColumnHeaders(headers, definition, onAttribute, onMetric) {
    const { columnSets: columnSetsHeaders } = headers;
    const { columnSets: columnSetsDefinition } = definition.grid;

    let colIndex = 0;
    let startColIndex = 0;
    let attrFormsBoundingHeight = 0;
    const parsedHeaders = [];

    // adding empty header for empty column sets
    for (let i = 0; i < columnSetsHeaders.length; i++) {
      if (columnSetsHeaders[i].length === 0) {
        columnSetsHeaders[i].push([-1]);
        columnSetsDefinition[i].columns.push({ type: null, elements: [] });
      }
    }
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

  handleAttributeForms(boundingHeight, attrFormsBoundingHeight, parsedHeaders) {
    if (boundingHeight !== attrFormsBoundingHeight) {
      for (let i = 0; i < parsedHeaders.length; i++) {
        while (parsedHeaders[i].length < attrFormsBoundingHeight) {
          parsedHeaders[i].unshift('\'');
        }
      }
    }
  }

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
