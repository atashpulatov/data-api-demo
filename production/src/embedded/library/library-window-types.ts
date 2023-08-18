export interface ItemType {
  id: string,
  name: string,
  projectId: string,
  type: number,
  subtype?: number,
  docId?: string,
}
export interface LibraryWindowProps {
  chosenObjectId: string,
  chosenProjectId: string,
  chosenObjectName: string,
  chosenSubtype: number,
  selectObject: Function,
  requestImport: Function,
  requestDossierOpen: Function,
  handlePrepare: Function,
  setObjectData: Function,
  updateSelectedMenu: Function,
  mstrObjectType: {
    type: number,
    subtypes: Array<number>,
    name: string,
    request: string,
  }
}
