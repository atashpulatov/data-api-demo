import { reduxStore } from './store';
import { officeApiHelper } from './office/api/office-api-helper';
import officeReducerHelper from './office/store/office-reducer-helper';
import officeStoreObject from './office/store/office-store-object';
import officeStoreRestoreObject from './office/store/office-store-restore-object';
import { errorService } from './error/error-handler';
import { sessionHelper } from './storage/session-helper';
import { notificationService } from './notification-v2/notification-service';
import { authenticationHelper } from './authentication/authentication-helper';
import { homeHelper } from './home/home-helper';
import { mstrObjectRestService } from './mstr-object/mstr-object-rest-service';
import { popupController } from './popup/popup-controller';
import { mstrListRestService } from './mstr-object/mstr-list-rest-service';
import { popupHelper } from './popup/popup-helper';
import { popupActions } from './popup/popup-actions';
import { authenticationService } from './authentication/auth-rest-service';
import { operationBus } from './operation/operation-bus';
import { sidePanelService } from './right-side-panel/side-panel-service';
import subscribeSteps from './operation/operation-subscribe-steps';
import operationStepDispatcher from './operation/operation-step-dispatcher';
import stepSaveObjectInExcel from './office/store/step-save-object-in-excel';
import operationErrorHandler from './operation/operation-error-handler';

class DIContainer {
  constructor(autoInitialize) {
    if (autoInitialize) {
      this.initializeAll();
    }
  }

  initializeAll = () => {
    this.operationBus = operationBus;
    this.operationBus.init(reduxStore);
    this.officeApiHelper = officeApiHelper;
    this.officeApiHelper.init(reduxStore);
    this.officeReducerHelper = officeReducerHelper;
    this.officeReducerHelper.init(reduxStore);
    this.officeStoreObject = officeStoreObject;
    this.officeStoreObject.init(reduxStore);
    this.officeStoreRestoreObject = officeStoreRestoreObject;
    this.officeStoreRestoreObject.init(reduxStore);
    this.notificationService = notificationService;
    this.notificationService.init(reduxStore);
    this.sessionHelper = sessionHelper;
    this.sessionHelper.init(reduxStore);
    this.errorService = errorService;
    this.errorService.init(sessionHelper, notificationService);
    this.authenticationHelper = authenticationHelper;
    this.authenticationHelper.init(reduxStore, sessionHelper, authenticationService, errorService);
    this.homeHelper = homeHelper;
    this.homeHelper.init(reduxStore, sessionHelper);
    this.mstrObjectRestService = mstrObjectRestService;
    this.mstrObjectRestService.init(reduxStore);
    this.popupController = popupController;
    this.popupController.init(reduxStore, sessionHelper, popupActions);
    this.sidePanelService = sidePanelService;
    this.sidePanelService.init(reduxStore);

    this.initializeOperationSteps();

    this.popupActions = popupActions;
    this.popupActions.init(
      errorService,
      officeApiHelper,
      officeReducerHelper,
      popupHelper,
      mstrObjectRestService,
      popupController
    );

    this.initialized = true;
  };

  initilizeSingle = (ClassToInitialize, dependencies) => {
    this[ClassToInitialize.constructor.name] = new ClassToInitialize();
    this[ClassToInitialize.constructor.name].init(...dependencies);
    return this[ClassToInitialize.constructor.name];
  };

  get = (dependency) => this[dependency];

  initializeOperationSteps() {
    this.subscribeSteps = subscribeSteps;
    this.subscribeSteps.init(reduxStore, operationBus);

    this.operationStepDispatcher = operationStepDispatcher;
    this.operationStepDispatcher.init(reduxStore);

    this.stepSaveObjectInExcel = stepSaveObjectInExcel;
    this.stepSaveObjectInExcel.init(reduxStore);

    this.mstrListRestService = mstrListRestService;
    this.mstrListRestService.init(reduxStore);

    this.operationErrorHandler = operationErrorHandler;
    this.operationErrorHandler.init(reduxStore);
  }
}

export const diContainer = new DIContainer(false);
