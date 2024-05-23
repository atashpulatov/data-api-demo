class FormattingHelper {
  /**
   * Gets columns range to apply formatting to.
   *
   * Offset is added to index for tables, for crosstabs index is subtracted by offset.
   *
   * @param index Index of a column.
   * @param isCrosstab Specify if object is a crosstab
   * @param offset Number of columns to be offsetted when formatting
   * @param officeTable Reference to Excel table
   * @param columns Number of columns in the table
   * @param metricsInRows Specify if metrics are present in rows
   * @returns Columns range to apply formatting to
   */
  getColumnRangeForFormatting(
    index: number,
    isCrosstab: boolean,
    offset: number,
    officeTable: Excel.Table,
    columns?: number,
    metricsInRows?: boolean
  ): Excel.Range {
    const objectIndex = isCrosstab ? index - offset : index + offset;
    // Crosstab
    if (isCrosstab && index < offset) {
      // @ts-expect-error TODO - investigate why getItemAt is called without argument
      return officeTable.columns.getItemAt().getDataBodyRange().getOffsetRange(0, objectIndex);
    }

    // Metrics in rows
    if (metricsInRows) {
      if (isCrosstab) {
        return officeTable.rows.getItemAt(objectIndex).getRange();
      }

      return officeTable.rows
        .getItemAt(objectIndex)
        .getRange()
        .getOffsetRange(0, columns - 1);
    }

    // Tabular
    return officeTable.columns.getItemAt(objectIndex).getDataBodyRange();
  }
}

const formattingHelper = new FormattingHelper();
export default formattingHelper;
