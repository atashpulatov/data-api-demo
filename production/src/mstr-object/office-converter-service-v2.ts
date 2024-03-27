import mstrCompoundGridFlatten from './helper/mstr-compound-grid-flatten';

import { MstrTable } from '../redux-reducer/operation-reducer/operation-reducer-types';
import { VisualizationTypes } from './mstr-object-types';

import mstrCompoundGridHandler from './handler/mstr-compound-grid-handler';
import mstrGridHandler from './handler/mstr-grid-handler';

/**
 * Service to parse JSON response from REST API v2
 *
 */
class OfficeConverterServiceV2 {
  /**
   * cretes mstrTable object containing information about structure of the object
   *
   * @param response
   * @return
   */
  createTable(response: any): MstrTable {
    const handler = this.getHandler(response);
    const mstrTable = handler.createTable(response);

    mstrTable.subtotalsInfo = {};
    mstrTable.metricsPosition = response.definition.grid.metricsPosition;
    const subtotals = this.getSubtotalsInformation(response);
    if (subtotals) {
      mstrTable.subtotalsInfo = {
        subtotalsDefined: subtotals.defined,
        subtotalsVisible: subtotals.visible,
      };
    }

    return mstrTable;
  }

  /**
   * Gets raw table rows
   *
   * @param response
   * @param isCrosstab Specify if object is a crosstab
   * @return
   */
  getRows = (response: any, isCrosstab: boolean): { row: any[]; rowTotals?: any[] } => {
    const handler = this.getHandler(response);
    return handler.getRows(response, isCrosstab);
  };

  /**
   * Gets object with crosstab rows and column headers
   *
   * @param response
   * @param isCrosstab Specify if object is a crosstab
   * @param isCrosstabular Crosstabular is a Crosstab report with metrics in Rows and nothing in columns
   * @return 

   */
  getHeaders = (
    response: any,
    isCrosstab: boolean,
    isCrosstabular?: boolean
  ): {
    rows?: any[];
    columns?: any[];
    subtotalAddress?: any[];
  } => {
    const handler = this.getHandler(response);
    return handler.getHeaders(response, isCrosstab, isCrosstabular);
  };

  /**
   * Gets subtotals defined or visible information from the response.
   *
   * @param response
   * @return
   */
  getSubtotalsInformation = (response: any): any => {
    const handler = this.getHandler(response);
    return handler.getSubtotalsInformation(response);
  };

  /**
   * Checks if response contains crosstabs
   *
   * @param  response
   * @return
   */
  isCrosstab = (response: any): boolean => {
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
   * @param response
   * @return
   */
  getHandler = (response: any): any => {
    switch (response.visualizationType) {
      case VisualizationTypes.COMPOUND_GRID:
      case VisualizationTypes.MICROCHARTS:
        return this.getHandlerForCompoundGrid(response);
      default:
        return mstrGridHandler;
    }
  };

  /**
   * return reference to handler based on compound grid structure
   *
   * @param response
   * @return
   */
  getHandlerForCompoundGrid = (response: any): any => {
    const {
      definition: { grid },
    } = response;
    const isCrosstab = grid.crossTab;
    const notEmptyColumnSet = grid.columnSets.find(
      ({ columns }: { columns: any[] }) => columns.length > 0
    );

    // We are removing empty column sets only for non crosstab visualizatoins and
    // only when they have at least 1 non empty columnset
    if (!isCrosstab && notEmptyColumnSet) {
      mstrCompoundGridFlatten.filterEmptyColumnSets(response);
    }

    const { metricsPosition, columnSets } = grid;
    const isMetricsInRows = metricsPosition && metricsPosition.axis === 'rows';
    const columnSetsCondition =
      columnSets.length <= 1 && !columnSets[0].length && !columnSets[0].columns.length;

    if (isCrosstab && !(isMetricsInRows && columnSetsCondition)) {
      return mstrCompoundGridHandler;
    }

    mstrCompoundGridFlatten.flattenColumnSets(response);
    return mstrGridHandler;
  };

  /**
   * replaces all cell data values containing null (which is MSTR standard for no data)
   * to empty string (which is Excel standard for no data) as "null" in Excel means "do not change current value"
   *
   * @param  response body
   * @return
   */
  convertCellValuesToExcelStandard = (body: any): any => {
    const replaceNullValues = (value: any): any => (value === null ? '' : value);

    const replaceNullsInNestedRawValues = (metricValues: any): any => {
      Object.keys(metricValues).forEach(key => {
        if (key === 'raw') {
          metricValues[key] = metricValues[key].map((singleRawArray: any[]): any[] =>
            singleRawArray.map(replaceNullValues)
          );
        } else {
          replaceNullsInNestedRawValues(metricValues[key]);
        }
      });
    };
    replaceNullsInNestedRawValues(body.data.metricValues);
    return body;
  };
}

export default new OfficeConverterServiceV2();
