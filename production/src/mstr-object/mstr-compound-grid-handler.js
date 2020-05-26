import mstrNormalizedJsonHandler from './mstr-normalized-json-handler';

export function parseColumnSets(columnSets) {
  const parsedColumns = [];
  columnSets.forEach(({ columns }) => {
    parsedColumns.push(...columns);
  });
  return parsedColumns;
}

export function renderRows(columnSetsMetricValues, currentRows, valueMatrix = 'raw') {
  const rowTable = [];
  for (let row = 0; row < currentRows; row++) {
    const rowValues = [];
    for (let colSet = 0; colSet < columnSetsMetricValues.length; colSet++) {
      rowValues.push(...columnSetsMetricValues[colSet][valueMatrix][row]);
    }
    rowTable.push(rowValues);
  }
  return rowTable;
}

export function calculateColumnHeaderHeight(columnSetsHeaders, columnSets) {
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

export function calculateColumnHeaderOffset(columnSets, columnSetsDefinition) {
  const offset = [0]; // No offset for first columnSet
  for (let i = 0; i < columnSets.length - 1; i++) {
    offset.push(columnSetsDefinition[i].columns.length + offset[i]);
  }
  return offset;
}

export function renderCompoundGridRowHeaders(headers, definition) {
  const onElement = (e) => `'${e.value.join(' ')}`;
  return mstrNormalizedJsonHandler.renderHeaders(definition, 'rows', headers, onElement, false);
}

export function renderCompoundGridColumnHeaders(columnSetsHeaders, columnSetsDefinition) {
  const transposedHeaders = columnSetsHeaders.map(mstrNormalizedJsonHandler.transposeMatrix);
  const boundingHeight = calculateColumnHeaderHeight(columnSetsHeaders, columnSetsDefinition);

  const parsedHeaders = [];

  for (let i = 0; i < transposedHeaders.length; i++) {
    const header = transposedHeaders[i];
    const columnsDefinition = columnSetsDefinition[i].columns;

    // Add empty row when column sets have different height
    while (header.length < boundingHeight) {
      header.unshift(Array(header[0].length).fill(-1));
    }


    for (let j = 0; j < boundingHeight; j++) {
      const headerRow = header[j];
      const { type, elements } = columnsDefinition[j];
      const columnSetRow = headerRow.map(index => {
        // -1 is for empty row
        if (index < 0) { return ''; }
        switch (type) {
          case 'attribute':
            return elements[index].formValues[0];
          case 'templateMetrics':
            return elements[index].name;
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
