import { Dispatch, SetStateAction } from 'react';

import { notificationService } from '../../notification/notification-service';
import { officeApiHelper } from '../../office/api/office-api-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import { sidePanelService } from './side-panel-service';

import officeStoreObject from '../../office/store/office-store-object';
import { reduxStore } from '../../store';

import { ObjectData } from '../../types/object-types';

import { officeContext } from '../../office/office-context';
import { updateObjects } from '../../redux-reducer/object-reducer/object-actions';
import initializationErrorDecorator from '../settings-side-panel/initialization-error-decorator';

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
  @initializationErrorDecorator.initializationWrapper
  async initActiveSelectionChangedListener(
    setActiveCellAddress: Function,
    setActiveSheetIndex: Dispatch<SetStateAction<number>>,
    isAnyPopupOrSettingsDisplayed: boolean
  ): Promise<OfficeExtension.EventHandlerResult<Excel.SelectionChangedEventArgs>> {
    const excelContext = await officeApiHelper.getExcelContext();
    const initialCellAddress = await officeApiHelper.getSelectedCell(excelContext);

    setActiveCellAddress(initialCellAddress);
    // only read + init active sheet index when no popup (notifications, Office dialog, etc.) or settings visible
    if (!isAnyPopupOrSettingsDisplayed) {
      const activeWorksheet = officeApiHelper.getCurrentExcelSheet(excelContext);

      activeWorksheet.load('position');
      await excelContext.sync();

      activeWorksheet.position !== undefined &&
        activeWorksheet.position !== null &&
        setActiveSheetIndex(activeWorksheet.position);
    }

    return officeApiHelper.addOnSelectionChangedListener(
      excelContext,
      setActiveCellAddress,
      setActiveSheetIndex,
      isAnyPopupOrSettingsDisplayed
    );
  }

  /**
   * Initializes listeners for tracking object worksheet changes (e.g. adding, removing, renaming, etc.).
   * The listeners that are applied vary based on API support, with improved support available in ExcelAPI versions 1.17+.
   */
  @initializationErrorDecorator.initializationWrapper
  async initObjectWorksheetTrackingListeners(): Promise<void> {
    const { isAdvancedWorksheetTrackingSupported } = reduxStore.getState().officeReducer;
    const excelContext = await officeApiHelper.getExcelContext();
    const { workbook: { worksheets } = {} } = excelContext;

    if (worksheets && isAdvancedWorksheetTrackingSupported) {
      // advanced event listeners supported
      // worksheet rename listener
      worksheets.onNameChanged?.add(async eventParams => {
        // validate correct event type
        if (eventParams?.type === Excel.EventType.worksheetNameChanged) {
          const objects = officeReducerHelper.getObjectsListFromObjectReducer();
          const updatedObjects: ObjectData[] = [];

          // update worksheet name fields for affected objects
          objects.forEach(object => {
            if (object?.worksheet?.id === eventParams?.worksheetId) {
              updatedObjects.push({
                ...object,
                worksheet: { ...object.worksheet, name: eventParams.nameAfter },
                groupData: { ...object.groupData, title: eventParams.nameAfter },
              });
            }
          });

          reduxStore.dispatch(updateObjects(updatedObjects));
          officeStoreObject.saveObjectsInExcelStore();
        }
      });
      // worksheet moved listener
      worksheets.onMoved?.add(async eventParams => {
        // validate correct event type
        if (eventParams?.type === Excel.EventType.worksheetMoved) {
          const { positionBefore, positionAfter } = eventParams;
          const startIdx = Math.min(positionBefore, positionAfter);
          const endIdx = Math.max(positionBefore, positionAfter);
          const objects = officeReducerHelper.getObjectsListFromObjectReducer();
          const updatedObjects: ObjectData[] = [];

          worksheets.load('items');
          await excelContext.sync();

          for (let i = startIdx; i <= endIdx; i++) {
            const worksheet = worksheets.items[i];

            worksheet.load('id');
            await excelContext.sync();

            // update worksheet index fields for affected objects
            objects.forEach(object => {
              if (object?.worksheet?.id === worksheet?.id) {
                updatedObjects.push({
                  ...object,
                  worksheet: { ...object.worksheet, index: i },
                  groupData: { ...object.groupData, key: i },
                });
              }
            });
          }

          reduxStore.dispatch(updateObjects(updatedObjects));
          officeStoreObject.saveObjectsInExcelStore();
        }
      });
      // worksheet added listener
      worksheets.onAdded?.add(async eventParams => {
        // validate correct event type
        if (eventParams?.type === Excel.EventType.worksheetAdded) {
          const newWorksheet = worksheets.getItemOrNullObject(eventParams.worksheetId);
          const objects = officeReducerHelper.getObjectsListFromObjectReducer();
          const updatedObjects: ObjectData[] = [];

          newWorksheet.load(['position', 'isNullObject']);
          await excelContext.sync();

          if (!newWorksheet.isNullObject) {
            // update worksheet index fields for affected objects
            objects.forEach(object => {
              if (object?.worksheet?.index >= newWorksheet.position) {
                updatedObjects.push({
                  ...object,
                  worksheet: { ...object.worksheet, index: object.worksheet.index + 1 },
                  groupData: { ...object.groupData, key: object.groupData.key + 1 },
                });
              }
            });

            reduxStore.dispatch(updateObjects(updatedObjects));
            officeStoreObject.saveObjectsInExcelStore();
          }
        }
      });
      // worksheet deleted listener
      worksheets.onDeleted?.add(async eventParams => {
        // validate correct event type
        if (eventParams?.type === Excel.EventType.worksheetDeleted) {
          const objects = officeReducerHelper.getObjectsListFromObjectReducer();
          const updatedObjects: ObjectData[] = [];

          worksheets.load('items');
          await excelContext.sync();

          for (let i = 0; i < worksheets.items.length; i++) {
            const worksheet = worksheets.items[i];

            worksheet.load('id');
            await excelContext.sync();

            // update worksheet index fields for affected objects
            objects.forEach(object => {
              // if object's worksheet index is outdated, update it by removing 1 (since 1 worksheet was deleted)
              if (object?.worksheet?.id === worksheet?.id && object?.worksheet?.index > i) {
                updatedObjects.push({
                  ...object,
                  worksheet: { ...object.worksheet, index: object.worksheet.index - 1 },
                  groupData: { ...object.groupData, key: object.groupData.key - 1 },
                });
              }
            });
          }

          reduxStore.dispatch(updateObjects(updatedObjects));
          officeStoreObject.saveObjectsInExcelStore();
        }
      });

      await excelContext.sync();
    } else {
      // only basic event listener supported
      Office.context.document.addHandlerAsync?.(
        Office.EventType.DocumentSelectionChanged,
        async (selectionChangedResult: Office.DocumentSelectionChangedEventArgs) => {
          // validate correct event type
          if (selectionChangedResult.type === Office.EventType.DocumentSelectionChanged) {
            const objects = officeReducerHelper.getObjectsListFromObjectReducer();
            const updatedObjects: ObjectData[] = [];

            worksheets.load('items');
            await excelContext.sync();

            for (let i = 0; i < worksheets.items.length; i++) {
              const worksheet = worksheets.items[i];

              worksheet.load(['id', 'name']);
              await excelContext.sync();

              // update worksheet index fields for affected objects
              objects.forEach(object => {
                // if object's worksheet index/name outdated, update them
                if (
                  object?.worksheet?.id === worksheet?.id &&
                  (object?.worksheet?.index !== i || object?.worksheet?.name !== worksheet.name)
                ) {
                  updatedObjects.push({
                    ...object,
                    worksheet: { ...object.worksheet, index: i, name: worksheet.name },
                    groupData: { ...object.groupData, key: i, title: worksheet.name },
                  });
                }
              });
            }

            reduxStore.dispatch(updateObjects(updatedObjects));
            officeStoreObject.saveObjectsInExcelStore();
          }
        }
      );
    }
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
    sidePanelService.remove(ObjectToDelete.objectWorkingId);
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
    sidePanelService.remove(...objectWorkingIds);
  }
}

export const sidePanelEventHelper = new SidePanelEventHelper();
