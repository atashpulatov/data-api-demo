export interface AttributeSelectorNotConnectedProps {
  title: String;
  triggerUpdate: Boolean;
  openModal: Boolean;
  session: sessionProps;
  mstrData?: mstrDataProps;
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
  displayAttrFormNames: String;
  chosenObject: mstrDataProps;
  editedObject: editedObjectProps;
  supportForms: Boolean;
}

export interface mstrDataProps {
    id: String;
    envUrl: String;
    authToken: String;
    chosenObjectId: String;
    chosenProjectId: String;
    chosenObjectName: String;
    objectType: objectTypeProps;
    preparedInstanceId: String;
    chosenSubtype: any;
    isPrompted: boolean;
    promptsAnswers: Array<Object>;
    mstrObjectType: {
        name: String;
    };
}

export interface editedObjectProps {
    chosenObjectId: String;
    chosenObjectName: String;
    displayAttrFormNames: String;
    subtotalsInfo: subtotalsInfoProps;
    projectId: String;
    instanceId: String;
    promptsAnswers: Array<Object>;
    mstrObjectType: {
        name: String;
    };
    chosenObjectType: any;
    chosenObjectSubtype: any;
    selectedAttributes: any;
    selectedMetrics: any;
    selectedFilters: any;
    selectedAttrForms: any;
}

export interface sessionProps {
    envUrl: String;
    authToken: String;
    attrFormPrivilege: any;
}

export interface subtotalsInfoProps {
    importSubtotal: Boolean;
}

export interface mstrError {
    status: any;
    response: any;
}

export interface AttributeSelectorWindowNotConnectedProps {
    chosenObject: mstrDataProps;
    objectName: String;
    mstrData: mstrDataProps;
    handleBack: NonNullable<boolean | ((...args: any[]) => any)>;
    importSubtotal: Boolean;
    displayAttrFormNames: String;
    editedObject: editedObjectProps;
}

export interface objectTypeProps {
    objectType: String;
}

export interface subtotalsInfo {
    importSubtotal: Boolean;
}
