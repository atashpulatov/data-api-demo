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
  /**
   * cretes mstrTable object containing information about structure of the object
   *
   * @param {JSON} response
   * @return {number[]}
   */
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

  /**
   * return reference to handler based on response structure
   *
   * @param {JSON} response
   * @return {Class}
   */
  getHandler = (response) => {
    switch (response.visualizationType) {
      case mstrObjectType.visualizationType.COMPOUND_GRID:
        return this.getHandlerForCompoundGrid(response);
      default:
        return mstrGridHandler;
    }
  }

  /**
   * return reference to handler based on compound grid structure
   *
   * @param {JSON} response
   * @return {Class}
   */
  getHandlerForCompoundGrid = (response) => {
    const { definition: { grid } } = response;
    const isCrosstab = grid.crossTab;
    const notEmptyColumnSet = grid.columnSets.find(({ columns }) => columns.length > 0);

    // We are removing empty column sets only for non crosstab visualizatoins and
    // only when they have at least 1 non empty columnset
    if (!isCrosstab && notEmptyColumnSet) {
      mstrCompoundGridFlatten.filterEmptyColumnSets(response);
    }

    const { metricsPosition, columnSets } = grid;
    const isMetricsInRows = metricsPosition && metricsPosition.axis === 'rows';
    const columnSetsCondition = columnSets.length <= 1 && !columnSets[0].length && !columnSets[0].columns.length;

    if (isCrosstab && !(isMetricsInRows && columnSetsCondition)) {
      return mstrCompoundGridHandler;
    }

    mstrCompoundGridFlatten.flattenColumnSets(response);
    return mstrGridHandler;
  }
}

export default new OfficeConverterServiceV2();
