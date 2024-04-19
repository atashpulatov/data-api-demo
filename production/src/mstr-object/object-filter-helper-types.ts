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

export type ReportFiltersDefinition = {
  grid: {
    viewTemplate: ViewTemplate;
    viewFilter: ViewFilter;
  };
  dataSource: {
    filter: ReportFilter;
    dataTemplate: DataTemplate;
  };
};

export type ReportFiltersText = {
  reportFilterText: string;
  reportLimitsText: string;
  viewFilterText: string;
  metricLimitsText: string;
};
