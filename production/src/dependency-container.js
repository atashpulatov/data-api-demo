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
import { mstrListRestService } from './mstr-object/mstr-list-rest-service';
import { popupHelper } from './popup/popup-helper';
import { popupActions } from './popup/popup-actions';
import { actionCreator } from './notification/action-creator';
import { authenticationService } from './authentication/auth-rest-service';
import { operationBus } from './operation/operation-bus';
import officeFormatSubtotals from './office/format/office-format-subtotals';
import stepGetInstanceDefinition from './mstr-object/step-get-instance-definition';
import stepApplyFormatting from './office/format/step-apply-formatting';
import stepFormatTable from './office/format/step-format-table';
import stepFetchInsertDataIntoExcel from './office/import/step-fetch-insert-data-into-excel';
import stepBindOfficeTable from './office/table/step-bind-office-table';
import stepGetOfficeTableEditRefresh from './office/table/step-get-office-table-edit-refresh';
import stepGetOfficeTableImport from './office/table/step-get-office-table-import';
import stepSaveReportWithParams from './popup/step-save-report-with-params';
import stepApplySubtotalFormatting from './office/format/step-apply-subtotal-formatting';
import subscribeSteps from './operation/operation-subscribe-steps';

class DIContainer {
  constructor(autoInitialize) {
    if (autoInitialize) {
      this.initializeAll();
    }
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

    this.initializeOfficeDisplayServices();

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
  };

  initilizeSingle = (ClassToInitialize, dependencies) => {
    this[ClassToInitialize.constructor.name] = new ClassToInitialize();
    this[ClassToInitialize.constructor.name].init(...dependencies);
    return this[ClassToInitialize.constructor.name];
  };

  get = (dependency) => this[dependency];

  initializeOfficeDisplayServices() {
    this.subscribeSteps = subscribeSteps;
    this.subscribeSteps.init(reduxStore, operationBus);
    this.mstrListRestService = mstrListRestService;
    this.mstrListRestService.init(reduxStore);

    this.stepGetInstanceDefinition = stepGetInstanceDefinition;
    this.stepGetInstanceDefinition.init(reduxStore);
    this.stepApplyFormatting = stepApplyFormatting;
    this.stepApplyFormatting.init(reduxStore);
    this.stepFormatTable = stepFormatTable;
    this.stepFormatTable.init(reduxStore);
    this.stepFetchInsertDataIntoExcel = stepFetchInsertDataIntoExcel;
    this.stepFetchInsertDataIntoExcel.init(reduxStore);
    this.stepBindOfficeTable = stepBindOfficeTable;
    this.stepBindOfficeTable.init(reduxStore);
    this.stepGetOfficeTableEditRefresh = stepGetOfficeTableEditRefresh;
    this.stepGetOfficeTableEditRefresh.init(reduxStore);
    this.stepGetOfficeTableImport = stepGetOfficeTableImport;
    this.stepGetOfficeTableImport.init(reduxStore);
    this.stepSaveReportWithParams = stepSaveReportWithParams;
    this.stepSaveReportWithParams.init(reduxStore);
    this.stepApplySubtotalFormatting = stepApplySubtotalFormatting;
    this.stepApplySubtotalFormatting.init(reduxStore);

    this.officeFormatData = stepApplyFormatting;
    this.officeFormatData.init(reduxStore);
    this.officeFormatSubtotals = officeFormatSubtotals;
    this.officeFormatSubtotals.init(reduxStore);
  }
}

export const diContainer = new DIContainer(false);
