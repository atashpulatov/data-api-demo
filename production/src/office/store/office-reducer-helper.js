class OfficeReducerHelper {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  };

  /**
  * Function return array of objects from objects reducer
  *
  * @return {Array} Contains all currently existing objects
  */
  getObjectsListFromObjectReducer = () => this.reduxStore.getState().objectReducer.objects;

  /**
  * Function return array of operations from operation reducer
  *
  * @return {Array} Contains all currently existing operations
  */
  getOperationsListFromOperationReducer = () => this.reduxStore.getState().operationReducer.operations;

  /**
  * Checks if there are any existing operation in operation reducer
  * return false if number of operations bigger than 0
  * return true if number of operations is equal 0
  *
  * @return {Boolean} Specify if there is no operation in the operation reducer
  */
  noOperationInProgress = () => this.getOperationsListFromOperationReducer().length === 0;

  /**
  * Return object from object Reducer correspongin to passed bindId
  *
  * @param {String} bindId Id of the Office table created on import used for referencing the Excel table
  * @return {Boolean}
  */
  getObjectFromObjectReducerByBindId = (bindId) => {
    const { objects } = this.reduxStore.getState().objectReducer;
    return objects.find((object) => object.bindId === bindId);
  };

  /**
  * Return object from object Reducer corresponding to passed objectWorkingId
  *
  * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
  * @return {Object}
  */
  getObjectFromObjectReducerByObjectWorkingId = (objectWorkingId) => {
    const { objects } = this.reduxStore.getState().objectReducer;
    return objects.find(object => object.objectWorkingId === objectWorkingId);
  };

  /**
  * Return notification from notification Reducer corresponding to passed objectWorkingId
  *
  * @param {Number} objectWorkingId Unique Id of the object allowing to reference specific object
  * @return {Object}
  */
  getNotificationFromNotificationReducer = (objectWorkingId) => {
    const { notifications } = this.reduxStore.getState().notificationReducer;
    return notifications.find(notification => notification.objectWorkingId === objectWorkingId);
  };
}

const officeReducerHelper = new OfficeReducerHelper();
export default officeReducerHelper;
