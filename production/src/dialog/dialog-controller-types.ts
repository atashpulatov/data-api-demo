import { PageByConfiguration } from '@mstr/connector-components';

import { PageByData } from '../page-by/page-by-types';
import {
  Body,
  DossierData,
  ObjectData,
  SubtotalsInfo,
  VisualizationInfo,
} from '../types/object-types';
import { OverviewActionCommands } from './overview/overview-types';

import mstrObjectType from '../mstr-object/mstr-object-type-enum';
import { DisplayAttrFormNames, ObjectImportType } from '../mstr-object/constants';

// TODO: Fix any types
export interface DialogResponse {
  command: DialogCommands | OverviewActionCommands;
  objectWorkingIds?: number[];
  error?: any;
  objectsDialogInfo?: ObjectDialogInfo[];
}

export interface ObjectDialogInfo {
  objectWorkingId?: number;
  insertNewWorksheet?: boolean;
  withEdit?: boolean;
  newName?: string;
  chosenObjectId?: string;
  chosenObject?: string;
  chosenObjectName?: string;
  chosenProject?: string;
  chosenObjectSubtype?: string;
  chosenSubtype?: number;
  dossierData?: DossierData;
  importType?: ObjectImportType;
  isPrompted?: boolean;
  promptsAnswers?: any;
  visualizationInfo?: VisualizationInfo;
  preparedInstanceId?: string;
  displayAttrFormNames?: DisplayAttrFormNames;
  projectId?: string;
  body?: Body;
  instanceId?: string;
  subtotalsInfo?: SubtotalsInfo;
  filterDetails?: FilterDetails[];
  pageByData?: PageByData;
  isPageBy?: boolean;
  pageByConfigurations?: PageByConfiguration[][];
}

export type ObjectToImport = ObjectData & { pageByConfigurations: PageByConfiguration[][] };

export interface FilterDetails {
  items: string[];
  name: string;
}

export interface ReportParams {
  bindId?: string;
  mstrObjectType?: typeof mstrObjectType;
  isDuplicate?: boolean;
  object?: any;
  pageByData?: PageByData;
}

export enum DialogCommands {
  COMMAND_OK = 'command_ok',
  COMMAND_SECONDARY = 'command_secondary',
  COMMAND_CANCEL = 'command_cancel',
  COMMAND_ON_UPDATE = 'commandOnUpdate',
  COMMAND_ERROR = 'commandError',
  COMMAND_BROWSE_UPDATE = 'commandBrowseUpdate',
  COMMAND_DIALOG_LOADED = 'commandDialogLoaded',
  COMMAND_CLOSE_DIALOG = 'commandCloseDialog',
  COMMAND_EXECUTE_NEXT_REPROMPT_TASK = 'commandExecuteNextRepromptTask',
}
