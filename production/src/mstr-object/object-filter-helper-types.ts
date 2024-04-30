type Element = {
  id: string;
  name: string;
  subType: string;
  threshold: unknown;
  limit?: {
    text: string;
    tree: unknown;
    tokens: unknown[];
  };
};

export type Token = {
  level: string;
  state: string;
  value: string | number;
  type: string;
  target?: unknown;
  attributeForm?: unknown;
};

type ViewTemplate = {
  rows: unknown;
  columns: {
    units: {
      type: string;
      elements: Element[];
    }[];
    sorts: unknown[];
  };
  pageBy: unknown;
};

type ViewFilter = {
  text: string;
  tree: unknown;
  tokens: Token[];
};

type ReportFilter = {
  text: string;
  tree: unknown;
  tokens: Token[];
};

type DataTemplate = {
  units: {
    id?: string;
    name: string;
    type: string;
    elements: unknown[];
    limit: {
      text: string;
      tree: unknown;
      tokens: Token[];
    };
  }[];
};

export type ReportDefinition = {
  grid: {
    viewTemplate: ViewTemplate;
    viewFilter: ViewFilter;
  };
  dataSource: {
    filter: ReportFilter;
    dataTemplate: DataTemplate;
  };
};

export type FiltersText = {
  reportFilterText?: string;
  reportLimitsText?: string;
  viewFilterText?: string;
  metricLimitsText?: string;
};

type DossierFilter = {
  key: string;
  name: string;
  summary: string;
  source: unknown;
  synchronizedAcrossChapter: boolean;
  selectorType: string;
  displayStyle: string;
  hasAllOption: boolean;
  targets: any[];
  multiSelectionAllowed: boolean;
  currentSelection: unknown;
};

type DossierChapter = {
  key: string;
  name: string;
  pages: unknown[];
  filters: DossierFilter[];
};

export type DossierDefinition = {
  id: string;
  name: string;
  datasets: unknown[];
  currentChapter: string;
  chapters: DossierChapter[];
};
