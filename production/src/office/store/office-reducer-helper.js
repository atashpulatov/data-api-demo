class OfficeReducerHelper {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  getObjectsListFromObjectReducer = () => this.reduxStore.getState().objectReducer.objects;

  getOperationsListFromOperationReducer = () => this.reduxStore.getState().operationReducer.operations;

  getObjectFromObjectReducer = (bindId) => {
    const { objects } = this.reduxStore.getState().objectReducer;
    return objects.find((object) => object.bindId === bindId);
  };
}

const officeReducerHelper = new OfficeReducerHelper();
export default officeReducerHelper;
