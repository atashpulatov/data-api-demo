export interface AttributeSelectorNotConnectedProps {
  title: string;
  triggerUpdate: Boolean;
  openModal: Boolean;
  session: SessionProps;
  mstrData?: MstrDataProps;
  resetTriggerUpdate: Function;
  attributesSelectedChange: Function;
  closeModal: Function;
  updateDisplayAttrFormOnImport: Function;
  updateDisplayAttrFormOnEdit: Function;
  handlePopupErrors: Function;
  onTriggerUpdate: Function;
  isEdit: Boolean;
  importSubtotal: Boolean;
  switchImportSubtotalsOnImport: Function;
  switchImportSubtotalsOnEdit: Function;
  displayAttrFormNames: string;
  chosenObject: MstrDataProps;
  editedObject: EditedObjectProps;
  supportForms: Boolean;
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
    chosenSubtype: any;
    isPrompted: boolean;
    promptsAnswers: Array<Object>;
    mstrObjectType: {
        name: string;
    };
}

export interface EditedObjectProps {
    chosenObjectId: string;
    chosenObjectName: string;
    displayAttrFormNames: string;
    subtotalsInfo: SubtotalsInfoProps;
    projectId: string;
    instanceId: string;
    promptsAnswers: Array<Object>;
    mstrObjectType: {
        name: string;
    };
    chosenObjectType: any;
    chosenObjectSubtype: any;
    selectedAttributes: any;
    selectedMetrics: any;
    selectedFilters: any;
    selectedAttrForms: any;
}

export interface SessionProps {
    envUrl: string;
    authToken: string;
    attrFormPrivilege: any;
}

export interface SubtotalsInfoProps {
    importSubtotal: Boolean;
}

export interface MstrError {
    status: any;
    response: any;
}

export interface AttributeSelectorWindowNotConnectedProps {
    chosenObject: MstrDataProps;
    objectName: string;
    mstrData: MstrDataProps;
    handleBack: NonNullable<boolean | ((...args: any[]) => any)>;
    importSubtotal: Boolean;
    displayAttrFormNames: string;
    editedObject: EditedObjectProps;
}

export interface ObjectTypeProps {
    objectType: string;
}

export interface SubtotalsInfo {
    importSubtotal: Boolean;
}
