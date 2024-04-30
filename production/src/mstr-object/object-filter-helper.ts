import { t } from 'i18next';

import {
  DossierDefinition,
  FiltersText,
  ReportDefinition,
  Token,
} from './object-filter-helper-types';

/**
 * Converts an array of filter tokens to a string representation of the filter.
 *
 * @param tokens - The array of tokens to convert.
 * @returns The string representation of the tokens.
 */
const convertTokensToString = (tokens: Token[]): string =>
  // slice(1) to remove the first token which is the root token, "%"
  tokens?.length && tokens
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
 * @param reportDefinition - The filter data object which is the response from the API call to get the report filter data.
 * @returns An object containing the generated report filter text, report limits text, view filter text, and metric limits text.
 */
export const generateReportFilterTexts = (reportDefinition: ReportDefinition): FiltersText => {
  const reportFilter = reportDefinition?.dataSource?.filter;
  const reportLimits = reportDefinition?.dataSource?.dataTemplate?.units.find(
    unit => unit.type === 'metrics'
  ).limit;
  const viewFilter = reportDefinition?.grid?.viewFilter;
  const metricLimits = reportDefinition?.grid?.viewTemplate?.columns?.units.find(
    unit => unit.type === 'metrics'
  ).elements;

  const joinDelimiter = ` ) ${t('and').toUpperCase()} ( `;
  const reportFilterText = convertTokensToString(reportFilter.tokens) || "-";
  const reportLimitsText = convertTokensToString(reportLimits.tokens) || "-";
  const definedMetricLimits = metricLimits.filter(element => element.limit);
  const metricLimitsText = definedMetricLimits.length ?
    `( ${definedMetricLimits.map(element => element.limit.text).join(joinDelimiter)} )` : "-";

  const viewFilterText = convertTokensToString(viewFilter.tokens) || "-";

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

  const dossierFilterSummary = `( ${selectedChapter.filters
    .map(filter => filter.summary)
    .join(` ) ${t('and').toUpperCase()} ( `)} )`;

  return dossierFilterSummary;
};
