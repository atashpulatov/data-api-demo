import { RequestPageByModalOpenData } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-reducer-types';

import { ObjectImportType } from '../../mstr-object/constants';

export interface ItemType {
  id: string;
  name: string;
  projectId: string;
  type: number;
  subtype?: number;
  docId?: string;
}
export interface LibraryWindowProps {
  chosenObjectId: string;
  chosenProjectId: string;
  chosenObjectName: string;
  chosenSubtype: number;
  selectObject: Function;
  requestImport: Function;
  requestDossierOpen: Function;
  handlePrepare: Function;
  setObjectData: Function;
  importType: ObjectImportType;
  requestPageByModalOpen: (data: RequestPageByModalOpenData) => void;
  mstrObjectType: {
    type: number;
    subtypes: Array<number>;
    name: string;
    request: string;
  };
}
