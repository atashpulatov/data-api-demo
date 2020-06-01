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
    const isCrosstabular = false; // We may have crosstabular in compoundGrid
    const columnInformation = this.getColumnInformation(definition, data);
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

  getColumnInformation(definition, data) {
    const { headers } = data;
    const onElement = (element) => element;
    const commonColumns = this.renderCompoundGridRowTitles(headers, definition, onElement);
    const params = [headers, definition, onElement, onElement];
    // TODO: In ColumnSets Metrics are not always the last row!! We may need for formatting properly
    const columnSetColumns = this.renderCompoundGridColumnHeaders(...params);
    return [...commonColumns[commonColumns.length - 1], ...columnSetColumns[columnSetColumns.length - 1]];
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
    // TODO Compound Grid Support
    const rowsAttributes = definition.grid.rows.map(({ name }) => name);
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
    const { definition, data } = response;
    const { headers } = data;
    const onElement = (e) => `'${e.value.join(' ')}`;
    const onAttribute = (e) => e.formValues[0];
    const onMetric = (e) => e.name;

    return {
      rows: this.renderCompoundGridRowHeaders(headers, definition, onElement),
      columns: this.renderCompoundGridColumnHeaders(headers, definition, onAttribute, onMetric)
    };
  }

  renderCompoundGridRowTitles(headers, definition, onElement = (e) => e) {
    return mstrNormalizedJsonHandler.renderTitles(definition, 'rows', headers, onElement, false);
  }

  renderCompoundGridRowHeaders(headers, definition, onElement = (e) => e) {
    return mstrNormalizedJsonHandler.renderHeaders(definition, 'rows', headers, onElement, false);
  }

  renderCompoundGridColumnHeaders(headers, definition, onAttribute, onMetric) {
    const { columnSets: columnSetsHeaders } = headers;
    const { columnSets: columnSetsDefinition } = definition.grid;
    const transposedHeaders = columnSetsHeaders.map(mstrNormalizedJsonHandler.transposeMatrix);
    const boundingHeight = this.calculateColumnHeaderHeight(columnSetsHeaders, columnSetsDefinition);

    const parsedHeaders = [];

    for (let i = 0; i < transposedHeaders.length; i++) {
      const header = transposedHeaders[i];
      const columnsDefinition = [...columnSetsDefinition[i].columns];

      // Add empty row when column sets have different height
      while (header.length < boundingHeight) {
        columnsDefinition.unshift({ type: null, elements: [] });
        header.unshift(Array(header[0].length).fill(-1));
      }

      for (let j = 0; j < boundingHeight; j++) {
        const headerRow = header[j];
        const { type, elements } = columnsDefinition[j];
        const columnSetRow = headerRow.map(index => {
          // -1 is for empty row
          if (index < 0) { return ''; }
          const element = elements[index];
          switch (type) {
            case 'attribute':
              return onAttribute(element);
            case 'templateMetrics':
              return onMetric(element);
              // Consolidation will go here
            default:
              return '';
          }
        });
        if (parsedHeaders[j]) {
          parsedHeaders[j].push(...columnSetRow);
        } else {
          parsedHeaders[j] = columnSetRow;
        }
      }
    }

    return parsedHeaders;
  }
}

export default new CompoundGridHandler();
