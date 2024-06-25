import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeRemoveHelper } from '../../office/remove/office-remove-helper';
import { pageByHelper } from '../../page-by/page-by-helper';

import officeStoreObject from '../../office/store/office-store-object';
import { reduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';

import { removeRequested, updateOperation } from './operation-actions';

class OperationService {
  /**
   * Dispatches new data to redux in order to repeat step of the operation.
   *
   * @param objectWorkingId  Unique id of source object for duplication.
   * @param activeCellAddress  Address of selected cell in excel.
   * @param insertNewWorksheet  specify if the object will be imported on new worksheet
   */
  importInNewRange = (
    objectWorkingId: number,
    activeCellAddress: string,
    insertNewWorksheet: boolean
  ): void => {
    reduxStore.dispatch(
      updateOperation({
        objectWorkingId,
        startCell: insertNewWorksheet ? 'A1' : activeCellAddress,
        repeatStep: true,
        tableChanged: true,
        insertNewWorksheet,
      })
    );
  };

  /**
   * Revert PageBy Import: If already imported, removes from the Excel worksheet; if not yet imported, deletes from the Redux store.
   *
   * @param objectWorkingId Contains unique Id of the object, allowing to reference source object.
   */
  async revertPageByImportForSiblings(objectWorkingId: number): Promise<void> {
    const excelContext = await officeApiHelper.getExcelContext();
    const { pageBySiblings } = pageByHelper.getAllPageByObjects(objectWorkingId);
    pageBySiblings.forEach(async (pageByObject: ObjectData) => {
      const objectExist = await officeRemoveHelper.checkIfObjectExist(pageByObject, excelContext);
      if (objectExist) {
        reduxStore.dispatch(
          removeRequested(pageByObject.objectWorkingId, pageByObject?.importType)
        );
      } else {
        officeStoreObject.removeObjectFromStore(pageByObject.objectWorkingId);
      }
    });
  }
}

export const operationService = new OperationService();
