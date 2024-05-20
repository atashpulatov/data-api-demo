import { t } from 'i18next';

import {
  DossierDefinition,
  FiltersText,
  ReportDefinition,
  Token,
} from './object-filter-helper-types';

/**
 * Returns the string representation of a token.
 * If the token is a function, it returns the uppercase translation of the function name.
 * Otherwise, it returns the string representation of the token value.
 *
 * @param token - The token to get the string representation of.
 * @returns The string representation of the token.
 */
const getTokenString = (token: Token): string => {
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
  return token.value.toString();
};

/**
 * Converts an array of filter tokens to a string representation of the filter.
 *
 * @param tokens - The array of tokens to convert.
 * @returns The string representation of the tokens.
 */
const convertTokensToString = (tokens: Token[]): string =>
  tokens?.length
    ? // slice(1) to remove the first token which is the root token, "%"
    tokens
      .slice(1)
      .map(token => getTokenString(token))
      .join(' ')
      .trim()
    : '-';

/**
 * Generates the report filter text, report limits text, view filter text, and metric limits text based on the provided filter data.
 * @param reportDefinition - The filter data object which is the response from the API call to get the report filter data.
 * @returns An object containing the generated report filter text, report limits text, view filter text, and metric limits text.
 */
export const generateReportFilterTexts = (reportDefinition: ReportDefinition): FiltersText => {
  const reportFilter = reportDefinition?.dataSource?.filter;
  const reportLimits = reportDefinition?.dataSource?.dataTemplate?.units?.find(
    unit => unit.type === 'metrics'
  )?.limit;
  const viewFilter = reportDefinition?.grid?.viewFilter;
  const metricLimits = reportDefinition?.grid?.viewTemplate?.columns?.units?.find(
    unit => unit.type === 'metrics'
  )?.elements;

  const reportFilterText = convertTokensToString(reportFilter?.tokens);
  const reportLimitsText = convertTokensToString(reportLimits?.tokens);
  const viewFilterText = convertTokensToString(viewFilter?.tokens);

  const definedMetricLimits = metricLimits?.filter(element => element.limit);
  const joinDelimiter = ` ) ${t('and').toUpperCase()} ( `;
  const metricLimitsText = definedMetricLimits?.length
    ? `( ${definedMetricLimits.map(element => element.limit.text || '').join(joinDelimiter)} )`
    : '-';
  return {
    reportFilterText,
    reportLimitsText,
    viewFilterText,
    metricLimitsText,
  };
};

/**
 * Generates the filter text for a dossier based on the provided filter data.
 * @param dossierDefinition - The filter data for the dossier.
 * @param chapterKey - The chapter key of the dossier to generate the filter text for.
 * @returns The generated filter text.
 */
export const generateDossierFilterText = (
  dossierDefinition: DossierDefinition,
  chapterKey: string
): string => {
  const selectedChapter = dossierDefinition.chapters.find(chapter => chapter.key === chapterKey);
  const joinDelimiter = `) ${t('and').toUpperCase()} (`;
  const dossierFilterSummary = `(${selectedChapter.filters
    .filter(filter => filter.summary)
    .map(filter => filter.summary)
    .join(joinDelimiter)})`;

  return dossierFilterSummary;
};
