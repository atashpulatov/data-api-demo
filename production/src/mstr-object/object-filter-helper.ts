import { t } from 'i18next';

import { ReportFiltersDefinition, ReportFiltersText, Token } from './object-filter-helper-types';

/**
 * Converts an array of filter tokens to a string representation of the filter.
 *
 * @param tokens - The array of tokens to convert.
 * @returns The string representation of the tokens.
 */
const convertTokensToString = (tokens: Token[]): string =>
  // slice(1) to remove the first token which is the root token, "%"
  tokens
    .slice(1)
    .map(token => {
      if (token.type === 'function') {
        if (token.value === 'And') {
          return t('and').toUpperCase();
        }
        if (token.value === 'Or') {
          return t('or').toUpperCase();
        }
        if (token.value === 'Not') {
          return t('not').toUpperCase();
        }
      }
      return token.value;
    })
    .join(' ')
    .trim();

/**
 * Generates the report filter text, report limits text, view filter text, and metric limits text based on the provided filter data.
 * @param filterData - The filter data object which is the response from the API call to get the report filter data.
 * @returns An object containing the generated report filter text, report limits text, view filter text, and metric limits text.
 */
export const generateReportFilterText = (
  filterData: ReportFiltersDefinition
): ReportFiltersText => {
  const reportFilter = filterData?.dataSource?.filter;
  const reportLimits = filterData?.dataSource?.dataTemplate?.units.find(
    unit => unit.type === 'metrics'
  ).limit;
  const viewFilter = filterData?.grid?.viewFilter;
  const metricLimits = filterData?.grid?.viewTemplate?.columns?.units.find(
    unit => unit.type === 'metrics'
  ).elements;

  const reportFilterText = convertTokensToString(reportFilter.tokens);
  const reportLimitsText = convertTokensToString(reportLimits.tokens);
  const viewFilterText = convertTokensToString(viewFilter.tokens);
  const metricLimitsText = `( ${metricLimits.map(element => element.limit.text).join(` ) ${t('And')} ( `)} )`;

  return {
    reportFilterText,
    reportLimitsText,
    viewFilterText,
    metricLimitsText,
  };
};
