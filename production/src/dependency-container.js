import { reduxStore } from './store';
import { officeApiHelper } from './office/api/office-api-helper';
import { officeStoreService } from './office/store/office-store-service';
import { errorService } from './error/error-handler';
import { sessionHelper } from './storage/session-helper';
import { notificationService } from './notification/notification-service';
import { authenticationHelper } from './authentication/authentication-helper';
import { homeHelper } from './home/home-helper';
import { mstrObjectRestService } from './mstr-object/mstr-object-rest-service';
import { popupController } from './popup/popup-controller';
import { officeDisplayService } from './office/office-display-service';
import { mstrListRestService } from './mstr-object/mstr-list-rest-service';
import { popupHelper } from './popup/popup-helper';
import { popupActions } from './popup/popup-actions';
import { actionCreator } from './notification/action-creator';
import { authenticationService } from './authentication/auth-rest-service';
import { operationBus } from './operation/operation-bus';
import mstrObjectInstance from './mstr-object/mstr-object-instance';
import officeTableService from './office/table/office-table-service';
import officeFormatData from './office/format/office-format-data';
import officeImportService from './office/import/office-import-service';
import officeFormatSubtotals from './office/format/office-format-subtotals';
import officeFormatTable from './office/format/office-format-table';

class DIContainer {
  constructor(autoInitialize) {
    if (autoInitialize) { this.initializeAll(); }
  }

  initializeAll = () => {
    console.log('________INITIALIZING________');
    console.log('________DI CONTAINER________');
    this.operationBus = operationBus;
    this.operationBus.init(reduxStore);
    this.officeApiHelper = officeApiHelper;
    this.officeApiHelper.init(reduxStore);
    this.officeStoreService = officeStoreService;
    this.officeStoreService.init(reduxStore);
    this.notificationService = notificationService;
    this.notificationService.init(reduxStore, actionCreator);
    this.sessionHelper = sessionHelper;
    this.sessionHelper.init(reduxStore);
    this.errorHandler = errorService;
    this.errorHandler.init(sessionHelper, notificationService);
    this.authenticationHelper = authenticationHelper;
    this.authenticationHelper.init(reduxStore, sessionHelper, authenticationService, errorService);
    this.homeHelper = homeHelper;
    this.homeHelper.init(reduxStore, sessionHelper);
    this.mstrObjectRestService = mstrObjectRestService;
    this.mstrObjectRestService.init(reduxStore);
    this.popupController = popupController;
    this.popupController.init(reduxStore, sessionHelper, popupActions);
    this.officeDisplayService = officeDisplayService;
    this.officeDisplayService.init(reduxStore, operationBus);
    this.mstrListRestService = mstrListRestService;
    this.mstrListRestService.init(reduxStore);
    this.mstrObjectInstance = mstrObjectInstance;
    this.mstrObjectInstance.init(reduxStore);
    this.officeTableService = officeTableService;
    this.officeTableService.init(reduxStore);
    this.officeFormatData = officeFormatData;
    this.officeFormatData.init(reduxStore);
    this.officeImportService = officeImportService;
    this.officeImportService.init(reduxStore);
    this.officeFormatSubtotals = officeFormatSubtotals;
    this.officeFormatSubtotals.init(reduxStore);
    this.officeFormatTable = officeFormatTable;
    this.officeFormatTable.init(reduxStore);

    this.popupHelper = popupHelper;
    this.popupHelper.init(popupController, reduxStore);
    this.popupActions = popupActions;
    this.popupActions.init(
      this.authenticationHelper,
      this.errorHandler,
      this.officeApiHelper,
      this.officeStoreService,
      this.popupHelper,
      this.mstrObjectRestService,
      this.popupController
    );
    this.initialized = true;
  }

  initilizeSingle = (ClassToInitialize, dependencies) => {
    this[ClassToInitialize.constructor.name] = new ClassToInitialize();
    this[ClassToInitialize.constructor.name].init(...dependencies);
    return this[ClassToInitialize.constructor.name];
  }

  get = (dependency) => this[dependency]
}

export const diContainer = new DIContainer(false);
