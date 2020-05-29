import mstrObjectType from '../mstr-object/mstr-object-type-enum';
import mstrCompoundGridHandler from '../mstr-object/mstr-compound-grid-handler';
import mstrGridHandler from '../mstr-object/mstr-grid-handler';

/**
 * Service to parse JSON response from REST API v2
 *
 * @class OfficeConverterServiceV2
 */
class OfficeConverterServiceV2 {
  createTable(response) {
    let mstrTable = {};
    switch (response.visualizationType) {
      case mstrObjectType.visualizationType.COMPOUND_GRID:
        mstrTable = mstrCompoundGridHandler.createTable(response);
        break;
      default:
        mstrTable = mstrGridHandler.createTable(response);
        break;
    }

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
    switch (response.visualizationType) {
      case mstrObjectType.visualizationType.COMPOUND_GRID:
        return mstrCompoundGridHandler.getRows(response);
      default:
        return mstrGridHandler.getRows(response, isCrosstab);
    }
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
    switch (response.visualizationType) {
      case mstrObjectType.visualizationType.COMPOUND_GRID:
        return mstrCompoundGridHandler.getHeaders(response);
      default:
        return mstrGridHandler.getHeaders(response, isCrosstab, isCrosstabular);
    }
  }

  /**
   * Gets subtotals defined or visible information from the response.
   *
   * @param {JSON} response
   * @return {Object}
   */
  getSubtotalsInformation = (response) => {
    switch (response.visualizationType) {
      case mstrObjectType.visualizationType.COMPOUND_GRID:
        return mstrCompoundGridHandler.getSubtotalsInformation(response);
      default:
        return mstrGridHandler.getSubtotalsInformation(response);
    }
  }

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
  }
}

export default new OfficeConverterServiceV2();
