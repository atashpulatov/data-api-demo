import { PageByData } from '../page-by/page-by-types';
import { RequestPageByModalOpenData } from '../redux-reducer/navigation-tree-reducer/navigation-tree-reducer-types';

import { DisplayAttrFormNames, ObjectImportType } from '../mstr-object/constants';

export interface AttributeSelectorNotConnectedProps {
  title: string;
  triggerUpdate: boolean;
  openModal: boolean;
  session: SessionProps;
  mstrData?: MstrDataProps;
  resetTriggerUpdate: Function;
  attributesSelectedChange: Function;
  closeModal: Function;
  updateDisplayAttrFormOnImport: Function;
  updateDisplayAttrFormOnEdit: Function;
  handlePopupErrors: Function;
  onTriggerUpdate: Function;
  isEdit: boolean;
  importSubtotal: boolean;
  switchImportSubtotalsOnImport: Function;
  switchImportSubtotalsOnEdit: Function;
  displayAttrFormNames: string;
  chosenObject: MstrDataProps;
  editedObject: EditedObjectProps;
  supportForms: boolean;
}

export interface MstrDataProps {
  id: string;
  envUrl: string;
  authToken: string;
  chosenObjectId: string;
  chosenProjectId: string;
  chosenObjectName: string;
  objectType: ObjectTypeProps;
  preparedInstanceId: string;
  chosenSubtype: number;
  isPrompted: boolean;
  promptsAnswers: Array<Object>;
  mstrObjectType: {
    name: string;
  };
}

export interface EditedObjectProps {
  name: string;
  objectWorkingId: number;
  chosenObjectId: string;
  chosenObjectName: string;
  displayAttrFormNames: DisplayAttrFormNames;
  subtotalsInfo: SubtotalsInfoProps;
  objectId: string;
  projectId: string;
  instanceId: string;
  promptsAnswers: Array<Object>;
  mstrObjectType: {
    name: string;
  };
  chosenObjectType: ChosenObjectType;
  chosenObjectSubtype: number;
  selectedAttributes: string[];
  selectedMetrics: string[];
  selectedFilters: Record<string, number[] | string[]>;
  selectedAttrForms: string[];
  pageByData: PageByData;
  importType: ObjectImportType;
}

export interface ChosenObjectType {
  name: string;
  request: string;
  subtypes: number[] | string;
  type: number;
}

export interface SessionProps {
  envUrl: string;
  authToken: string;
  attrFormPrivilege: boolean;
}

export interface SubtotalsInfoProps {
  importSubtotal: boolean;
}

// TODO: fix any types
export interface MstrError {
  status: any;
  response: any;
}

// TODO: fix any types
export interface AttributeSelectorWindowNotConnectedProps {
  chosenObject: MstrDataProps;
  objectName: string;
  importType: ObjectImportType;
  mstrData: MstrDataProps;
  handleBack: NonNullable<boolean | ((...args: any[]) => any)>;
  importSubtotal: boolean;
  displayAttrFormNames: DisplayAttrFormNames;
  editedObject: EditedObjectProps;
  requestPageByModalOpen: (data: RequestPageByModalOpenData) => void;
}

export interface ObjectTypeProps {
  objectType: string;
}

export interface SubtotalsInfo {
  importSubtotal: boolean;
}
