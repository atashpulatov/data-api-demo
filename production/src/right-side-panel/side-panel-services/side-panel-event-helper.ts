import { Dispatch, SetStateAction } from 'react';
import { ObjectNotificationTypes } from '@mstr/connector-components';

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
    setActiveCellAddress: (cellAddress: string) => void,
    setActiveSheetIndex: Dispatch<SetStateAction<number>>,
    isAnyPopupOrSettingsDisplayedRef: React.MutableRefObject<boolean>
  ): Promise<void> {
    const excelContext = await officeApiHelper.getExcelContext();
    // only read + init active sheet index when no popup (notifications, Office dialog, etc.) or settings visible
    if (!isAnyPopupOrSettingsDisplayedRef.current) {
      const activeWorksheet = officeApiHelper.getCurrentExcelSheet(excelContext);

      activeWorksheet.load('position');
      await excelContext.sync();

      activeWorksheet.position !== undefined &&
        activeWorksheet.position !== null &&
        setActiveSheetIndex(activeWorksheet.position);
    }
    // initiatilize active cell address
    const initialCellAddress = await officeApiHelper.getSelectedCell(excelContext);

    setActiveCellAddress(initialCellAddress);

    await officeApiHelper.addOnSelectionChangedListener(
      excelContext,
      setActiveCellAddress,
      setActiveSheetIndex,
      isAnyPopupOrSettingsDisplayedRef
    );
  }

  /**
   * Initializes listeners for tracking object worksheet changes (e.g. adding, removing, renaming, etc.).
   * The listeners applied vary based on API support, with improved support available in ExcelAPI versions 1.17+.
   */
  @initializationErrorDecorator.initializationWrapper
  async initObjectWorksheetTrackingListeners(): Promise<void> {
    const { isAdvancedWorksheetTrackingSupported } = reduxStore.getState().officeReducer;
    const excelContext = await officeApiHelper.getExcelContext();
    const { workbook: { worksheets } = {} } = excelContext;

    if (isAdvancedWorksheetTrackingSupported) {
      // assign object tracking event listeners for worksheet name change, move, add, and delete
      this.setObjectTrackingOnNameChangedWorksheetEvent(worksheets);
      this.setObjectTrackingOnMovedWorksheetEvent(worksheets, excelContext);
      this.setObjectTrackingOnAddedWorksheetEvent(worksheets, excelContext);
      this.setObjectTrackingOnDeletedWorksheetEvent(worksheets, excelContext);
      // sync context after adding event listeners, helper functions don't sync individually to avoid multiple syncs
      await excelContext.sync();
    } else {
      // only basic event listener supported
      // assign object tracking event listener for document selection change
      this.setObjectTrackingDocumentSelectionChangedEvent(worksheets, excelContext);
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

  /**
   * Assigns callback used to track object locations, for worksheet name change event.
   * Does not sync Excel context after adding event listener.
   * Requires ExcelApi 1.17 or higher.
   *
   * @param worksheets Excel worksheet collection
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  setObjectTrackingOnNameChangedWorksheetEvent(worksheets: Excel.WorksheetCollection): void {
    worksheets?.onNameChanged?.add?.(async eventParams => {
      try {
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

          if (updatedObjects.length > 0) {
            reduxStore.dispatch(updateObjects(updatedObjects));
            officeStoreObject.saveObjectsInExcelStore();
          }
        }
      } catch (e) {
        console.warn('Error in onNameChanged event listener');
      }
    });
  }

  /**
   * Assigns callback used to track object locations, for worksheet move event.
   * Does not sync Excel context after adding event listener.
   * Requires ExcelApi 1.17 or higher.
   *
   * @param worksheets Excel worksheet collection
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  setObjectTrackingOnMovedWorksheetEvent(
    worksheets: Excel.WorksheetCollection,
    excelContext: Excel.RequestContext
  ): void {
    worksheets?.onMoved?.add?.(async eventParams => {
      try {
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

          if (updatedObjects.length > 0) {
            reduxStore.dispatch(updateObjects(updatedObjects));
            officeStoreObject.saveObjectsInExcelStore();
          }
        }
      } catch (e) {
        console.warn('Error in onMoved event listener');
      }
    });
  }

  /**
   * Assigns callback used to track object locations, for worksheet added event.
   * Does not sync Excel context after adding event listener.
   * Requires ExcelApi 1.7 or higher.
   *
   * @param worksheets Excel worksheet collection
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  setObjectTrackingOnAddedWorksheetEvent(
    worksheets: Excel.WorksheetCollection,
    excelContext: Excel.RequestContext
  ): void {
    worksheets?.onAdded?.add?.(async eventParams => {
      try {
        // validate correct event type
        if (eventParams?.type === Excel.EventType.worksheetAdded) {
          const newWorksheet = worksheets.getItemOrNullObject(eventParams.worksheetId);
          const objects = officeReducerHelper.getObjectsListFromObjectReducer();
          const updatedObjects: ObjectData[] = [];

          newWorksheet.load(['id', 'position', 'isNullObject']);
          await excelContext.sync();

          if (!newWorksheet.isNullObject) {
            // update worksheet index fields for affected objects
            for (const object of objects) {
              const objectNotification = officeReducerHelper.getNotificationFromNotificationReducer(
                object?.objectWorkingId
              );

              if (objectNotification?.type === ObjectNotificationTypes.PROGRESS) {
                // ignore objects with progress notifications, they will be set properly when finished processing
              } else if (
                object?.worksheet?.id &&
                object.worksheet.id !== newWorksheet.id &&
                object.worksheet.index >= newWorksheet.position
              ) {
                // if object's worksheet index is >= the added one, update its index
                const objectWorksheet = worksheets.getItemOrNullObject(object.worksheet.id);

                // read latest affected object's worksheet position if valid
                objectWorksheet.load(['position', 'isNullObject']);
                await excelContext.sync();

                if (
                  !objectWorksheet.isNullObject &&
                  object.worksheet.index !== objectWorksheet.position
                ) {
                  // update object's worksheet index and groupData key if changed
                  updatedObjects.push({
                    ...object,
                    worksheet: { ...object.worksheet, index: objectWorksheet.position },
                    groupData: { ...object.groupData, key: objectWorksheet.position },
                  });
                }
              }
            }

            if (updatedObjects.length > 0) {
              reduxStore.dispatch(updateObjects(updatedObjects));
              officeStoreObject.saveObjectsInExcelStore();
            }
          }
        }
      } catch (e) {
        console.warn('Error in onAdded event listener');
      }
    });
  }

  /**
   * Assigns callback used to track object locations, for worksheet deleted event.
   * Does not sync Excel context after adding event listener.
   * Requires ExcelApi 1.7 or higher.
   *
   * @param worksheets Excel worksheet collection
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  setObjectTrackingOnDeletedWorksheetEvent(
    worksheets: Excel.WorksheetCollection,
    excelContext: Excel.RequestContext
  ): void {
    worksheets?.onDeleted?.add?.(async eventParams => {
      try {
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

          if (updatedObjects.length > 0) {
            reduxStore.dispatch(updateObjects(updatedObjects));
            officeStoreObject.saveObjectsInExcelStore();
          }
        }
      } catch (e) {
        console.warn('Error in onDeleted event listener');
      }
    });
  }

  /**
   * Assigns callback used to track object locations, for document selection change event.
   * The event is triggered when the user makes a selection in the document, whether by click or arrow key.
   * This event listener exists in all ExcelApi versions (1.1+), thus is compatible with any Excel version.
   *
   * @param worksheets Excel worksheet collection
   * @param excelContext Reference to Excel Context used by Excel API functions
   */
  setObjectTrackingDocumentSelectionChangedEvent(
    worksheets: Excel.WorksheetCollection,
    excelContext: Excel.RequestContext
  ): void {
    Office.context.document.addHandlerAsync?.(
      Office.EventType.DocumentSelectionChanged,
      async (selectionChangedResult: Office.DocumentSelectionChangedEventArgs) => {
        try {
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

            if (updatedObjects.length > 0) {
              reduxStore.dispatch(updateObjects(updatedObjects));
              officeStoreObject.saveObjectsInExcelStore();
            }
          }
        } catch (e) {
          console.warn('Error in onDocumentSelectionChanged event listener');
        }
      }
    );
  }
}

export const sidePanelEventHelper = new SidePanelEventHelper();
