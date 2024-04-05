class MstrCompoundGridFlatten {
  /**
   * Filters out empty column sets from response
   *
   * @param response response containing information about object
   */
  filterEmptyColumnSets = (response: any): void => {
    const { data, definition } = response;
    const { headers, metricValues } = data;
    const { grid } = definition;

    grid.columnSets = grid.columnSets.filter(
      ({ columns }: { columns: any[] }) => columns.length > 0
    );
    headers.columnSets = headers.columnSets.filter(
      (columnHeaders: any[]) => columnHeaders.length > 0
    );
    metricValues.columnSets = metricValues.columnSets.filter(
      ({ raw }: { raw: any }) => raw.length > 0
    );
  };

  /**
   * Flatten compound grid column sets to structure compatible with grid handler
   *
   * @param {JSON} response response containing information about object
   */
  flattenColumnSets(response: any): void {
    const { data, definition } = response;
    const { headers } = data;
    const { grid } = definition;
    let gridColumns: any[] = [];

    if (grid.columnSets[0].columns[0]) {
      gridColumns = this.flattenColumnSetsMetricElemets(grid);
    }

    const headerColumns = this.flattenColumnSetsHeaders(headers);

    const metricValues = this.flattenMetricValues(data);

    headers.columns = headerColumns.length ? [headerColumns] : [];
    grid.columns = gridColumns;
    data.metricValues = { ...data.metricValues, ...metricValues };
  }

  /**
   * Flatten metrics values from all column sets into single array
   *
   * @param data contains infromation about object table body
   * @returns flattened metric values
   */
  flattenMetricValues = (
    data: any
  ): {
    raw: any[];
    formatted: any[];
    extras: any[];
  } => {
    const columSetsNumber = data.metricValues.columnSets.length;
    const metricValues = { raw: [] as any, formatted: [] as any, extras: [] as any };
    let rawValues;

    for (let i = 0; i < data.metricValues.columnSets[0].raw.length; i++) {
      rawValues = [];

      for (let index = 0; index < columSetsNumber; index++) {
        const rowRawValues = data.metricValues.columnSets[index].raw;

        if (rowRawValues.length > 0) {
          rawValues.push(...rowRawValues[i]);
        }
      }
      metricValues.raw.push(rawValues);
    }

    return metricValues;
  };

  /**
   * Flatten headers values indexes from all column sets into single array
   *
   * @param headers contains infromation about headers values indexes
   * @returns flattened metric values
   */
  flattenColumnSetsHeaders = (headers: any): any[] => {
    const columSetsNumber = headers.columnSets.length;
    let headerIndexOffset = 0;
    const headerColumns = [];

    for (let i = 0; i < columSetsNumber; i++) {
      for (const columnSet of headers.columnSets[i]) {
        headerColumns.push(columnSet[0] + headerIndexOffset);
      }
      headerIndexOffset += headers.columnSets[i].length;
    }
    return headerColumns;
  };

  /**
   * Flatten metric elemets from all column sets into single array
   *
   * @param grid contains infromation about metric elemets
   * @returns flattened metric elemets
   */
  flattenColumnSetsMetricElemets = (grid: any): any[] => {
    const columSetsNumber = grid.columnSets.length;
    const gridColumns = [
      {
        name: 'Metrics',
        id: '00000000000000000000000000000000',
        type: 'templateMetrics',
        elements: [] as any[],
      },
    ];

    for (let i = 0; i < columSetsNumber; i++) {
      const columnSetColumn = grid.columnSets[i].columns[0];

      if (columnSetColumn && columnSetColumn.elements.length > 0) {
        for (const element of columnSetColumn.elements) {
          gridColumns[0].elements.push(element);
        }
      }
    }
    return gridColumns;
  };
}

const mstrCompoundGridFlatten = new MstrCompoundGridFlatten();
export default mstrCompoundGridFlatten;