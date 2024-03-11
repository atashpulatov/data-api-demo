/**
 * Helper responsible for merging cells in cross tab report header for multiform attributes.
 *
 * Example:
 *
 * | Country | Employee | Employee | Employee |
 *
 * would be rendered:
 *
 * | Country |            Employee            |
 *
 * Merging cells in headers happens when 'Display attribute form names' is 'Off' while preparing data during import.
 *
 * All adjoining cells containing the same string are being merged.
 */
class OfficeApiHeaderMergeHelper {
  /**
   * Merges headers for rows.
   *
   * @param attributes - Names of attributes for rows.
   * @param titlesRange - Excel range containing attributes titles.
   *
   */
  mergeHeaderRows(attributes: string[], titlesRange: Excel.Range): void {
    this.mergeHeaderItems(attributes, titlesRange, this.handleMergeRowsFunc);
  }

  /**
   * Merges headers for columns.
   *
   * @param attributes - Names of attributes for columns.
   * @param titlesRange - Excel range containing attributes titles.
   *
   */
  mergeHeaderColumns(attributes: string[], titlesRange: Excel.Range): void {
    this.mergeHeaderItems(attributes, titlesRange, this.handleMergeColumnsFunc);
  }

  /**
   * Validates attributes names.
   *
   * @param attributes - Attributes names.
   * @returns true when non-empty array, false otherwise
   *
   */
  validateAttributes(attributes: string[]): boolean {
    return attributes && Array.isArray(attributes) && attributes.length > 0;
  }

  /**
   * Merges header items, using specified handleMergeFunc (handleMergeRowsFunc for rows or handleMergeColumnsFunc
   * for columns).
   *
   * 1. Calculate starts of all intervals (e.g. [0, 1] for [Country, Employee, Employee, Employee]).
   * 2. Calculate start-length pairs of each Excel range to be merged (e.g. [[1, 3]]).
   * 3. For each start-length pair call handleMergeRowsFunc or handleMergeColumnsFunc to merge and center cells.
   *
   * Do nothing for an empty list of attributes names.
   *
   * @param attributes - Names of attributes for rows.
   * @param titlesRange - Excel range containing attributes titles.
   * @param handleMergeFunc - function used for merging.
   *
   */
  mergeHeaderItems(attributes: string[], titlesRange: Excel.Range, handleMergeFunc: any): void {
    if (!this.validateAttributes(attributes)) {
      return;
    }

    const intervalStarts = this.calculateIntervalStarts(attributes);
    const intervals = this.calculateIntervals(intervalStarts, attributes.length);

    for (const interval of intervals) {
      handleMergeFunc(titlesRange, interval, attributes.length);
    }
  }

  /**
   * Merges and formats Excel cells for rows.
   *
   * 1. Create a new range based on titlesRange by resizing (getResizedRange) and moving it (getOffsetRange).
   * 2. Merge cells.
   * 3. Center merged cell horizontally.
   *
   * Resizing is relative to the first cell of titlesRange, negative value means shrinking the range.
   * Moving is relative to the first cell of resized titlesRange.
   *
   * @param titlesRange - Excel range containing attributes titles.
   * @param interval - object containing start index and length of range to be merged.
   * @param attributesLength - number of elements in attributes array.
   */
  handleMergeRowsFunc(titlesRange: Excel.Range, interval: any, attributesLength: number): void {
    const range = titlesRange
      .getResizedRange(0, interval.len - attributesLength)
      .getOffsetRange(0, interval.start);
    range.merge();
    range.format.horizontalAlignment = window.Excel.HorizontalAlignment.center;
  }

  /**
   * Merges and formats Excel cells for columns.
   *
   * 1. Create a new range based on titlesRange by resizing (getResizedRange) and moving it (getOffsetRange).
   * 2. Merge cells.
   * 3. Center merged cell vertically.
   *
   * Resizing is relative to the first cell of titlesRange, negative value means shrinking the range.
   * Moving is relative to the first cell of resized titlesRange.
   *
   * @param titlesRange - Excel range containing attributes titles.
   * @param interval - object containing start index and length of range to be merged.
   * @param attributesLength - number of elements in attributes array.
   */
  handleMergeColumnsFunc = (
    titlesRange: Excel.Range,
    interval: any,
    attributesLength: number
  ): void => {
    const range = titlesRange
      .getResizedRange(interval.len - attributesLength, 0)
      .getOffsetRange(interval.start, 0);
    range.merge();
    range.format.verticalAlignment = window.Excel.VerticalAlignment.center;
  };

  /**
   * Calculates indices of starts of all intervals - i.e.,  adjoining cells containing the same string.
   *
   * Examples:
   *
   * ['a'] -> [0]
   * ['a', 'a'] -> [0]
   * ['a', 'a', 'b'] -> [0, 2]
   *
   * @param attributes - Non empty (already validated) array of names of attributes.
   * @returns Indices of starts of all intervals.
   *
   */
  calculateIntervalStarts(attributes: string[]): number[] {
    const intervalStarts = [0];

    for (let i = 1; i < attributes.length; i++) {
      if (attributes[i] !== attributes[i - 1]) {
        intervalStarts.push(i);
      }
    }

    return intervalStarts;
  }

  /**
   * Calculates intervals representing Excel cell ranges to be merged. Intervals are not being generated for
   * 1-element ranges (no point to merge .
   *
   * Examples:
   *
   * for attributes[] === ['a']: [0], 1 -> []
   * for attributes[] === ['a', 'a']: [0], 2 -> [{ start: 0, len: 2 }]
   * for attributes[] === ['a', 'a', 'b']: [0, 2], 3 -> [{ start: 0, len: 2 }]
   * for attributes[] === ['a', 'a', 'b', 'b']: [0, 2], 4 -> [{ start: 0, len: 2 }, { start: 2, len: 2 }]
   *
   * @param intervalStarts - Indices of starts of all intervals.
   * @param attributesNo - Number of attributes.
   * @returns Intervals representing Excel cell ranges to be merged - array
   * of items: { start: number, len: number }
   */
  calculateIntervals = (
    intervalStarts: number[],
    attributesNo: number
  ): { start: number; len: number }[] => {
    if (!intervalStarts || !intervalStarts.length || attributesNo <= 1) {
      return [];
    }

    const intervals = [];

    for (let i = 0; i < intervalStarts.length - 1; i++) {
      if (intervalStarts[i + 1] > intervalStarts[i] + 1) {
        intervals.push({
          start: intervalStarts[i],
          len: intervalStarts[i + 1] - intervalStarts[i],
        });
      }
    }

    // Handle last element.
    if (attributesNo > intervalStarts[intervalStarts.length - 1] + 1) {
      intervals.push({
        start: intervalStarts[intervalStarts.length - 1],
        len: attributesNo - intervalStarts[intervalStarts.length - 1],
      });
    }

    return intervals;
  };
}

const { mergeHeaderRows, mergeHeaderColumns } = new OfficeApiHeaderMergeHelper();
export { mergeHeaderRows, mergeHeaderColumns };
