class MstrAttributeMetricHelper {
  extractAttributesMetricsCompoundGrid(grid) {
    const columns = grid.columnSets.flatMap(columnSet => columnSet.columns);
    const { rows } = grid;
    const attributes = this.extractAttributes(rows, columns);
    const metrics = this.extractMetrics(rows, columns);

    return { attributes, metrics };
  }

  extractAttributesMetrics(grid) {
    const { rows, columns } = grid;
    const attributes = this.extractAttributes(rows, columns);
    const metrics = this.extractMetrics(rows, columns);

    return { attributes, metrics };
  }

  extractAttributes = (rows, columns) => columns
    .filter(({ type }) => type === 'attribute')
    .concat(rows.filter(({ type }) => type === 'attribute'))
    .map(({ id, name }) => ({ id, name }));

  extractMetrics = (rows, columns) => columns
    .filter(({ type }) => type === 'templateMetrics')
    .concat(rows.filter(({ type }) => type === 'templateMetrics'))
    .flatMap(({ elements }) => elements)
    .map(({ id, name }) => ({ id, name }));

}

const mstrAttributeMetricHelper = new MstrAttributeMetricHelper();
export default mstrAttributeMetricHelper;