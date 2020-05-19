
export function parseColumnSets(columnSets) {
  const parsedColumns = [];
  columnSets.forEach(({ columns }) => {
    parsedColumns.push(...columns);
  });
  return parsedColumns;
}

export function parseRowValues(columnSetsMetricValues, rows) {
  // TODO: Proper row parsing

}

export function calculateColumnHeaderHeight(columnSetsHeaders, columnSets) {
  // TODO: Take into consideration attribute forms from columnSets
  let boundingHeight = 0;
  columnSetsHeaders.forEach(columnSet => {
    if (columnSet.length > boundingHeight) {
      boundingHeight = columnSet.length;
    }
  });
  return boundingHeight;
}

export function calculateColumnHeaderOffset(columnSets, columnSetsDefinition) {
  const offset = [0]; // No offset for first columnSet
  for (let i = 0; i < columnSets.length - 1; i++) {
    // console.log(columnSets[i]);
    // console.log(columnSetsDefinition[i].columns);

    offset.push(columnSetsDefinition[i].columns.length + offset[i]);
  }
  return offset;
}

export function parseColumnSetHeaders(columnSetsHeaders, columnSetsDefinition) {
  const boundingHeight = calculateColumnHeaderHeight(columnSetsHeaders, columnSetsDefinition);
  const indexOffset = calculateColumnHeaderOffset(columnSetsHeaders, columnSetsDefinition);
  console.log(indexOffset);
  const normalizedHeaders = [];

  for (let i = 0; i < columnSetsHeaders.length; i++) {
    const header = columnSetsHeaders[i];
    console.log('header', header);
    if (header) {
      const offset = indexOffset[i];
      if (i > 0) {
        header.forEach(headerIndex => { headerIndex[1] += offset; });
      }

      const emptyHeader = [];
      while (header.length + emptyHeader.length < boundingHeight) {
        emptyHeader.push([-1, -1]);
      }
      normalizedHeaders.push(...emptyHeader, ...header);
    }
  }
  console.log('caca', normalizedHeaders);
  return normalizedHeaders;
}

export function parseCompoundGrid(response) {
  const { definition, data } = response;
  const columns = parseColumnSets(definition.grid.columnSets);
  const metrics = parseRowValues(data.metricValues.columnSets, data.paging.current);
  const headers = parseColumnSetHeaders(data.headers.columnSets, definition.grid.columnSets);
  console.log(columns);
  console.log(headers);
  delete definition.grid.columnSets;
  delete data.headers.columnSets;
  delete data.metricValues.columnSets;
  definition.grid.columns = columns;
  data.headers.columns = headers;
  data.metricValues = { raw: metrics };
  return response;
}
