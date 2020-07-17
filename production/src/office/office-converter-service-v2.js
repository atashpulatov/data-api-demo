import mstrObjectType from '../mstr-object/mstr-object-type-enum';
import mstrCompoundGridHandler from '../mstr-object/handler/mstr-compound-grid-handler';
import mstrGridHandler from '../mstr-object/handler/mstr-grid-handler';
import mstrCompoundGridFlatten from '../mstr-object/helper/mstr-compound-grid-flatten';

/**
 * Service to parse JSON response from REST API v2
 *
 * @class OfficeConverterServiceV2
 */
class OfficeConverterServiceV2 {
  createTable(response) {
    const handler = this.getHandler(response);
    const mstrTable = handler.createTable(response);

    mstrTable.subtotalsInfo = {};
    const subtotals = this.getSubtotalsInformation(response);
    if (subtotals) {
      mstrTable.subtotalsInfo = { subtotalsDefined: subtotals.defined, subtotalsVisible: subtotals.visible };
    }

    return mstrTable;
  }


  /**
   * Gets raw table rows
   *
   * @param {JSON} response
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @return {number[]}
   */
  getRows = (response, isCrosstab) => {
    const handler = this.getHandler(response);
    return handler.getRows(response, isCrosstab);
  }


  /**
   * Gets object with crosstab rows and column headers
   *
   * @param {JSON} response
   * @param {Boolean} isCrosstab Specify if object is a crosstab
   * @param {Boolean} isCrosstabular Crosstabular is a Crosstab report with metrics in Rows and nothing in columns
   * @return {Object}

   */
  getHeaders = (response, isCrosstab, isCrosstabular) => {
    const handler = this.getHandler(response);
    return handler.getHeaders(response, isCrosstab, isCrosstabular);
  }

  /**
     * Gets subtotals defined or visible information from the response.
     *
     * @param {JSON} response
     * @return {Object}
     */
  getSubtotalsInformation = (response) => {
    const handler = this.getHandler(response);
    return handler.getSubtotalsInformation(response);
  };

  /**
     * Checks if response contains crosstabs
     *
     * @param {JSON} response
     * @return {Boolean}
     */
  isCrosstab = (response) => {
    try {
      const { grid } = response.definition;
      return !!grid.crossTab && grid.columns.length !== 0;
    } catch (error) {
      // This is changing so often that we want to at least return false
      return false;
    }
  };

  getHandler = (response) => {
    const { definition: { grid } } = response;
    switch (response.visualizationType) {
      case mstrObjectType.visualizationType.COMPOUND_GRID:
        if (
          grid.crossTab
          && !(grid.metricsPosition && grid.metricsPosition.axis === 'rows'
          && grid.columnSets.length <= 1 && !grid.columnSets[0].length && !grid.columnSets[0].columns.length)
        ) {
          return mstrCompoundGridHandler;
        }

        mstrCompoundGridFlatten.flattenColumnSets(response);
        return mstrGridHandler;
      default:
        return mstrGridHandler;
    }
  }
}

export default new OfficeConverterServiceV2();
