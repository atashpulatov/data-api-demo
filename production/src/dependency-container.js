import { authenticationService } from './authentication/auth-rest-service';
import { authenticationHelper } from './authentication/authentication-helper';
import { homeHelper } from './home/home-helper';
import { mstrObjectRestService } from './mstr-object/mstr-object-rest-service';
import { visualizationInfoService } from './mstr-object/visualization-info-service';
import { notificationService } from './notification/notification-service';
import officeReducerHelper from './office/store/office-reducer-helper';
import officeStoreHelper from './office/store/office-store-helper';
import overviewHelper from './popup/overview/overview-helper';
import { popupHelper } from './popup/popup-helper';
import { sidePanelHelper } from './right-side-panel/side-panel-services/side-panel-helper';
import { sidePanelService } from './right-side-panel/side-panel-services/side-panel-service';
import { sessionHelper } from './storage/session-helper';

import { reduxStore } from './store';

import { errorService } from './error/error-handler';
import { operationBus } from './operation/operation-bus';
import subscribeSteps from './operation/operation-subscribe-steps';
import { popupController } from './popup/popup-controller';
import { popupActions } from './redux-reducer/popup-reducer/popup-actions';
import { sessionActions } from './redux-reducer/session-reducer/session-actions';

class DIContainer {
  constructor(autoInitialize) {
    if (autoInitialize) {
      this.initializeAll();
    }
  }

  initializeAll = () => {
    this.operationBus = operationBus;
    this.operationBus.init();
    this.officeReducerHelper = officeReducerHelper;
    this.officeReducerHelper.init(reduxStore);

    this.officeStoreHelper = officeStoreHelper;
    this.officeStoreHelper.init(errorService);

    this.notificationService = notificationService;
    this.notificationService.init(reduxStore);

    this.homeHelper = homeHelper;
    this.homeHelper.init(sessionActions, sessionHelper);

    this.errorService = errorService;
    this.errorService.init(
      sessionActions,
      sessionHelper,
      notificationService,
      popupController,
      reduxStore,
      homeHelper
    );

    this.authenticationHelper = authenticationHelper;
    this.authenticationHelper.init(sessionActions, authenticationService, errorService);

    this.visualizationInfoService = visualizationInfoService;
    this.visualizationInfoService.init(mstrObjectRestService);

    this.popupController = popupController;
    this.popupController.init(sessionActions, popupActions, overviewHelper);

    this.overviewHelper = overviewHelper;
    this.overviewHelper.init(sidePanelService, notificationService, sidePanelHelper);

    this.subscribeSteps = subscribeSteps;
    this.subscribeSteps.init(operationBus);

    this.popupActions = popupActions;
    this.popupActions.init(
      errorService,
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
}

export const diContainer = new DIContainer(false);
