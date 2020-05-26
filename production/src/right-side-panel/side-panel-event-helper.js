import { officeApiHelper } from '../office/api/office-api-helper';
import officeReducerHelper from '../office/store/office-reducer-helper';
import { officeContext } from '../office/office-context';
import { notificationService } from '../notification-v2/notification-service';
import { sidePanelService } from './side-panel-service';

class SidePanelEventHelper {
  /**
   * Depending of the version of supported Excel Api creates an event listener,
   * allowing us to detect and handle removal of the Excel table
   *
   */
  addRemoveObjectListener = async () => {
    try {
      const excelContext = await officeApiHelper.getExcelContext();

      if (officeContext.isSetSupported(1.9)) {
        this.eventRemove = excelContext.workbook.tables.onDeleted.add(async (e) => {
          const ObjectToDelete = officeReducerHelper.getObjectFromObjectReducerByBindId(e.tableId);
          notificationService.removeExistingNotification(ObjectToDelete.objectWorkingId);
          await officeApiHelper.checkStatusOfSessions();
          sidePanelService.remove([ObjectToDelete.objectWorkingId]);
        });
      } else if (officeContext.isSetSupported(1.7)) {
        this.eventRemove = excelContext.workbook.worksheets.onDeleted.add(async () => {
          await officeApiHelper.checkStatusOfSessions();
          excelContext.workbook.tables.load('items');
          await excelContext.sync();

          const objectsOfSheets = excelContext.workbook.tables.items;
          const objectsList = officeReducerHelper.getObjectsListFromObjectReducer();

          const objectsToDelete = objectsList.filter(
            (object) => !objectsOfSheets.find((officeTable) => officeTable.name === object.bindId)
          );
          const objectWorkingIds = objectsToDelete.map((object) => object.objectWorkingId);

          objectsToDelete.forEach((object) => {
            notificationService.removeExistingNotification(object.objectWorkingId);
          });

          sidePanelService.remove(objectWorkingIds);
        });
      }
      await excelContext.sync();
    } catch (error) {
      console.log('Cannot add onDeleted event listener');
    }
  };

  /**
   * Gets initial active cell address and stores it state of RightSidePanel via callback.
   * Creates event listener for cell selection change and passes a state setter callback to event handler.
   *
   * @param {Function} setActiveCellAddress Callback to modify the activeCellAddress in state of RightSidePanel
   */
  initializeActiveCellChangedListener = async (setActiveCellAddress) => {
    const excelContext = await officeApiHelper.getExcelContext();
    const initialCellAddress = await officeApiHelper.getSelectedCell(excelContext);
    setActiveCellAddress(initialCellAddress);
    await officeApiHelper.addOnSelectionChangedListener(excelContext, setActiveCellAddress);
  };
}

export const sidePanelEventHelper = new SidePanelEventHelper();
