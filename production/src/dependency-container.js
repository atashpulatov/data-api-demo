import { authenticationService } from "./authentication/auth-rest-service";
import { authenticationHelper } from "./authentication/authentication-helper";
import { homeHelper } from "./home/home-helper";
import { userRestService } from "./home/user-rest-service";
import { mstrObjectRestService } from "./mstr-object/mstr-object-rest-service";
import { visualizationInfoService } from "./mstr-object/visualization-info-service";
import { notificationService } from "./notification-v2/notification-service";
import { officeApiHelper } from "./office/api/office-api-helper";
import officeReducerHelper from "./office/store/office-reducer-helper";
import officeStoreHelper from "./office/store/office-store-helper";
import overviewHelper from "./popup/overview/overview-helper";
import { popupHelper } from "./popup/popup-helper";
import { sidePanelNotificationHelper } from "./right-side-panel/side-panel-notification-helper";
import { sidePanelService } from "./right-side-panel/side-panel-service";
import { sessionHelper } from "./storage/session-helper";

import officeStoreObject from "./office/store/office-store-object";
import officeStoreRestoreObject from "./office/store/office-store-restore-object";
import stepSaveObjectInExcel from "./office/store/step-save-object-in-excel";
import { reduxStore } from "./store";

import { errorService } from "./error/error-handler";
import stepGetDuplicateName from "./office/step-get-duplicate-name";
import { operationBus } from "./operation/operation-bus";
import operationErrorHandler from "./operation/operation-error-handler";
import operationStepDispatcher from "./operation/operation-step-dispatcher";
import subscribeSteps from "./operation/operation-subscribe-steps";
import { popupController } from "./popup/popup-controller";
import { popupActions } from "./redux-reducer/popup-reducer/popup-actions";
import { sessionActions } from "./redux-reducer/session-reducer/session-actions";

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
    this.errorService.init(
      sessionActions,
      sessionHelper,
      notificationService,
      popupController,
      reduxStore,
    );

    this.authenticationHelper = authenticationHelper;
    this.authenticationHelper.init(
      reduxStore,
      sessionActions,
      authenticationService,
      errorService,
    );

    this.homeHelper = homeHelper;
    this.homeHelper.init(reduxStore, sessionActions, sessionHelper);

    this.mstrObjectRestService = mstrObjectRestService;
    this.mstrObjectRestService.init(reduxStore);

    this.userRestService = userRestService;
    this.userRestService.init(reduxStore);

    this.visualizationInfoService = visualizationInfoService;
    this.visualizationInfoService.init(mstrObjectRestService);

    this.sidePanelService = sidePanelService;
    this.sidePanelService.init(reduxStore);

    this.popupController = popupController;
    this.popupController.init(
      reduxStore,
      sessionActions,
      popupActions,
      overviewHelper,
    );

    this.overviewHelper = overviewHelper;
    this.overviewHelper.init(reduxStore, sidePanelService, notificationService);

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
      visualizationInfoService,
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

    this.stepGetDuplicateName = stepGetDuplicateName;
    this.stepGetDuplicateName.init(reduxStore);

    this.operationErrorHandler = operationErrorHandler;
    this.operationErrorHandler.init(reduxStore);
  }
}

export const diContainer = new DIContainer(false);
