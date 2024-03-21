import { notificationService } from '../notification/notification-service';
import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { sidePanelService } from './side-panel-service';

import { officeContext } from '../office/office-context';

class SidePanelEventHelper {
  eventRemove: any;

  /**
   * Depending of the version of supported Excel Api creates an event listener,
   * allowing us to detect and handle removal of the Excel table
   *
   */
  async addRemoveObjectListener(): Promise<void> {
    try {
      const excelContext = await officeApiHelper.getExcelContext();

      if (officeContext.isSetSupported(1.9)) {
        this.eventRemove = excelContext.workbook.tables.onDeleted.add(this.setOnDeletedTablesEvent);
      } else if (officeContext.isSetSupported(1.7)) {
        this.eventRemove = excelContext.workbook.worksheets.onDeleted.add(() =>
          this.setOnDeletedWorksheetEvent(excelContext)
        );
      }
      await excelContext.sync();
    } catch (error) {
      console.warn('Cannot add onDeleted event listener');
    }
  }

  /**
   * Gets initial active cell address and stores it state of RightSidePanel via callback.
   * Creates event listener for cell selection change and passes a state setter callback to event handler.
   *
   * @param {Function} setActiveCellAddress Callback to modify the activeCellAddress in state of RightSidePanel
   */
  async initializeActiveCellChangedListener(setActiveCellAddress: Function): Promise<void> {
    const excelContext = await officeApiHelper.getExcelContext();
    const initialCellAddress = await officeApiHelper.getSelectedCell(excelContext);
    setActiveCellAddress(initialCellAddress);
    await officeApiHelper.addOnSelectionChangedListener(excelContext, setActiveCellAddress);
  }

  /**
   * Removed an object connected to removed Excel table
   *
   * @param event Contains information about deleted object
   */
  async setOnDeletedTablesEvent(event: Excel.TableDeletedEventArgs): Promise<void> {
    const ObjectToDelete = officeReducerHelper.getObjectFromObjectReducerByBindId(event.tableId);
    notificationService.removeExistingNotification(ObjectToDelete.objectWorkingId);
    await officeApiHelper.checkStatusOfSessions();
    sidePanelService.remove([ObjectToDelete.objectWorkingId]);
  }

  /**
   * Removes all objects which were imported on deleted worksheet
   *
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  async setOnDeletedWorksheetEvent(excelContext: Excel.RequestContext): Promise<void> {
    await officeApiHelper.checkStatusOfSessions();
    excelContext.workbook.tables.load('items');
    await excelContext.sync();

    const objectsOfSheets = excelContext.workbook.tables.items;
    const objectsList = officeReducerHelper.getObjectsListFromObjectReducer();
    const objectsToDelete = objectsList.filter(
      object => !objectsOfSheets.find(officeTable => officeTable.id === object.bindId)
    );

    objectsToDelete.forEach(object => {
      notificationService.removeExistingNotification(object.objectWorkingId);
    });

    const objectWorkingIds = objectsToDelete.map(object => object.objectWorkingId);
    sidePanelService.remove(objectWorkingIds);
  }
}

export const sidePanelEventHelper = new SidePanelEventHelper();
