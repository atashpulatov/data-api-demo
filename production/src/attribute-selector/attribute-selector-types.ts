export interface attributeSelectorNotConnectedProps {
  title: string;
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
  displayAttrFormNames: string;
  chosenObject: mstrDataProps;
  editedObject: editedObjectProps;
  supportForms: Boolean;
}

export interface mstrDataProps {
    id: string;
    envUrl: string;
    authToken: string;
    chosenObjectId: string;
    chosenProjectId: string;
    chosenObjectName: string;
    objectType: objectTypeProps;
    preparedInstanceId: string;
    chosenSubtype: any;
    isPrompted: boolean;
    promptsAnswers: Array<Object>;
    mstrObjectType: {
        name: string;
    };
}

export interface editedObjectProps {
    chosenObjectId: string;
    chosenObjectName: string;
    displayAttrFormNames: string;
    subtotalsInfo: subtotalsInfoProps;
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

export interface sessionProps {
    envUrl: string;
    authToken: string;
    attrFormPrivilege: any;
}

export interface subtotalsInfoProps {
    importSubtotal: Boolean;
}

export interface mstrError {
    status: any;
    response: any;
}

export interface attributeSelectorWindowNotConnectedProps {
    chosenObject: mstrDataProps;
    objectName: string;
    mstrData: mstrDataProps;
    handleBack: NonNullable<boolean | ((...args: any[]) => any)>;
    importSubtotal: Boolean;
    displayAttrFormNames: string;
    editedObject: editedObjectProps;
}

export interface objectTypeProps {
    objectType: string;
}

export interface subtotalsInfo {
    importSubtotal: Boolean;
}
