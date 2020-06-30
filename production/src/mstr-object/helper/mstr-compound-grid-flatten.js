class MstrCompoundGridFlatten {
  flattenColumnSets(response) {
    const { data, definition } = response;
    const { headers } = data;
    const { grid } = definition;
    let gridColumns = [];

    if (grid.columnSets[0].columns[0]) {
      gridColumns = this.flattenColumnSetsMetricElemets(grid);
    }

    const headerColumns = this.flattenColumnSetsHeaders(headers);

    const metricValues = this.flattenMetricValues(data);

    headers.columns = headerColumns.length ? [headerColumns] : [];
    grid.columns = gridColumns;
    data.metricValues = { ...data.metricValues, ...metricValues };
  }


  flattenMetricValues = (data) => {
    const columSetsNumber = data.metricValues.columnSets.length;
    const metricValues = { raw: [], formatted: [], extras: [] };
    let rawValues;

    for (let i = 0; i < data.metricValues.columnSets[0].raw.length; i++) {
      rawValues = [];

      for (let index = 0; index < columSetsNumber; index++) {
        rawValues.push(...data.metricValues.columnSets[index].raw[i]);
        // metricValues.formatted[i].push(...data.metricValues.columnSets[index].formatted[i]);
        // metricValues.extras[i].push(...data.metricValues.columnSets[index].extras[i]);
      }
      metricValues.raw.push(rawValues);
    }

    return metricValues;
  }

  flattenColumnSetsHeaders= (headers) => {
    const columSetsNumber = headers.columnSets.length;
    let headerIndexOffset = 0;
    const headerColumns = [];

    for (let i = 0; i < columSetsNumber; i++) {
      for (let index = 0; index < headers.columnSets[i].length; index++) {
        headerColumns.push(headers.columnSets[i][index][0] + headerIndexOffset);
      }
      headerIndexOffset += headers.columnSets[i].length;
    }
    return headerColumns;
  }

  flattenColumnSetsMetricElemets=(grid) => {
    const columSetsNumber = grid.columnSets.length;
    const gridColumns = [{
      name: 'Metrics',
      id: '00000000000000000000000000000000',
      type: 'templateMetrics',
      elements: []
    }];

    for (let i = 0; i < columSetsNumber; i++) {
      for (let index = 0; index < grid.columnSets[i].columns[0].elements.length; index++) {
        gridColumns[0].elements.push(grid.columnSets[i].columns[0].elements[index]);
      }
    }
    return gridColumns;
  }
}

const mstrCompoundGridFlatten = new MstrCompoundGridFlatten();
export default mstrCompoundGridFlatten;
