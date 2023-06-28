import { reduxStore } from './store';
import { officeApiHelper } from './office/api/office-api-helper';
import officeReducerHelper from './office/store/office-reducer-helper';
import officeStoreObject from './office/store/office-store-object';
import officeStoreRestoreObject from './office/store/office-store-restore-object';
import { errorService } from './error/error-handler';
import { sessionHelper } from './storage/session-helper';
import { sessionActions } from './redux-reducer/session-reducer/session-actions';
import { notificationService } from './notification-v2/notification-service';
import { authenticationHelper } from './authentication/authentication-helper';
import { homeHelper } from './home/home-helper';
import { mstrObjectRestService } from './mstr-object/mstr-object-rest-service';
import { userRestService } from './home/user-rest-service';
import { popupController } from './popup/popup-controller';
import { mstrListRestService } from './mstr-object/mstr-list-rest-service';
import { popupHelper } from './popup/popup-helper';
import { popupActions } from './redux-reducer/popup-reducer/popup-actions';
import { authenticationService } from './authentication/auth-rest-service';
import { operationBus } from './operation/operation-bus';
import { sidePanelService } from './right-side-panel/side-panel-service';
import { sidePanelNotificationHelper } from './right-side-panel/side-panel-notification-helper';
import subscribeSteps from './operation/operation-subscribe-steps';
import operationStepDispatcher from './operation/operation-step-dispatcher';
import stepSaveObjectInExcel from './office/store/step-save-object-in-excel';
import stepGetDuplicateName from './office/step-get-duplicate-name';
import operationErrorHandler from './operation/operation-error-handler';
import officeStoreHelper from './office/store/office-store-helper';
import { visualizationInfoService } from './mstr-object/visualization-info-service';

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

    this.officeStoreHelper = officeStoreHelper;
    this.officeStoreHelper.init(errorService);

    this.officeStoreObject = officeStoreObject;
    this.officeStoreObject.init(reduxStore);

    this.officeStoreRestoreObject = officeStoreRestoreObject;
    this.officeStoreRestoreObject.init(reduxStore);

    this.notificationService = notificationService;
    this.notificationService.init(reduxStore);

    this.sessionHelper = sessionHelper;
    this.sessionHelper.init(reduxStore);

    this.sessionActions = sessionActions;
    this.sessionActions.init(reduxStore);

    this.errorService = errorService;
    this.errorService.init(sessionActions, sessionHelper, notificationService);

    this.authenticationHelper = authenticationHelper;
    this.authenticationHelper.init(reduxStore, sessionActions, authenticationService, errorService);

    this.homeHelper = homeHelper;
    this.homeHelper.init(reduxStore, sessionActions, sessionHelper);

    this.mstrObjectRestService = mstrObjectRestService;
    this.mstrObjectRestService.init(reduxStore);

    this.userRestService = userRestService;
    this.userRestService.init(reduxStore);

    this.visualizationInfoService = visualizationInfoService;
    this.visualizationInfoService.init(mstrObjectRestService);

    this.popupController = popupController;
    this.popupController.init(reduxStore, sessionActions, popupActions);

    this.sidePanelService = sidePanelService;
    this.sidePanelService.init(reduxStore);

    this.sidePanelNotificationHelper = sidePanelNotificationHelper;
    this.sidePanelNotificationHelper.init(reduxStore);

    this.initializeOperationSteps();

    this.popupActions = popupActions;
    this.popupActions.init(
      errorService,
      officeApiHelper,
      officeReducerHelper,
      popupHelper,
      mstrObjectRestService,
      popupController,
      visualizationInfoService
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

    this.stepGetDuplicateName = stepGetDuplicateName;
    this.stepGetDuplicateName.init(reduxStore);

    this.operationErrorHandler = operationErrorHandler;
    this.operationErrorHandler.init(reduxStore);
  }
}

export const diContainer = new DIContainer(false);
