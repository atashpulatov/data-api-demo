import { PageByPaging } from '../page-by/page-by-types';
import { VisualizationTypes } from './mstr-object-types';

export type Axis = 'rows' | 'columns';

export type ValueMatrix = 'raw' | 'formatted' | 'extras';

export interface Form {
  id: string;
  name: string;
  dataType: string;
  baseFormCategory?: string;
  baseFormType: string;
}

export interface Element {
  name?: string; // check
  id: string;
  formValues: string[];
  subtotal?: boolean;
}

export interface Attribute {
  id?: string;
  name?: string;
  type: string;
  forms?: Form[];
  elements: Element[];
}

export interface MetricsPosition {
  axis: Axis;
  index: number;
}

export interface NumberFormatting {
  category: number;
  decimalPlaces: number;
  thousandSeparator?: boolean;
  currencySymbol?: string;
  currencyPosition?: number;
  formatString: string;
  negativeType?: number;
}

export interface MetricElement extends Element {
  name: string;
  type: string;
  min: number;
  max: number;
  dataType: string;
  numberFormatting: NumberFormatting;
}

export interface ColumnSet {
  key: string;
  name: string;
  metricsPosition: MetricsPosition;
  columns: Attribute[];
  sorting: {
    rows: any[];
    columns: any[];
  };
  thresholds: any[];
}

export interface Grid {
  crossTab: boolean;
  metricsPosition: MetricsPosition;
  rows: Attribute[];
  columns: (Attribute | { elements: MetricElement[] })[]; // check for metrics in rows
  pageBy: Attribute[];
  sorting: {
    rows: any[];
    columns: any[];
  };
  thresholds: any[];
}

// Check if fields are missing
export interface CompoundGrid {
  crossTab: boolean;
  rows: (Attribute | { elements: MetricElement[] })[];
  columnSets: ColumnSet[];
}

interface Source {
  id: string;
  name: string;
}

export interface Headers {
  rows: number[][];
  columns: number[][];
}

export interface CompoundGridHeaders {
  rows: number[][];
  columnSets: number[][][];
}

export interface MetricValues {
  raw: number[][];
  formatted: string[][];
  extras: any[][][];
}

export interface CompondGridMetricValues {
  columnSets: MetricValues[];
}

export interface Data {
  currentPageBy: number[];
  paging: PageByPaging;
  headers: Headers;
  metricValues: MetricValues;
}

export interface CompoundGridData {
  currentPageBy: number[];
  paging: PageByPaging;
  headers: CompoundGridHeaders;
  metricValues: CompondGridMetricValues;
}

export interface MstrObjectDefinition {
  headerCells: any[]; // TODO: check if correct
  grid: Grid;
  attrforms: any; // TODO: check if correct
}

export interface MstrCompoundGridDefinition {
  headerCells: any[]; // TODO: check if correct
  grid: CompoundGrid;
  attrforms: any; // TODO: check if correct
}

// Response for non compound grid object
export interface MstrObjectResponse {
  id: string;
  name: string;
  instanceId: string;
  status: number;
  source: Source;
  definition: MstrObjectDefinition;
  data: Data;
  attrforms?: any; // TODO: check if correct
}

export interface MstrCompoundGridResponse {
  k: string;
  n: string;
  visualizationType: VisualizationTypes;
  definition: MstrCompoundGridDefinition;
  data: CompoundGridData;
  attrforms?: any; // TODO: check if correct
}