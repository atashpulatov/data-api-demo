import { mstrObjectRestService } from './mstr-object/mstr-object-rest-service';
import { visualizationInfoService } from './mstr-object/visualization-info-service';
import { notificationService } from './notification/notification-service';
import officeReducerHelper from './office/store/office-reducer-helper';
import overviewHelper from './popup/overview/overview-helper';
import { popupHelper } from './popup/popup-helper';
import { sidePanelHelper } from './right-side-panel/side-panel-services/side-panel-helper';
import { sidePanelNotificationHelper } from './right-side-panel/side-panel-services/side-panel-notification-helper';
import { sidePanelService } from './right-side-panel/side-panel-services/side-panel-service';

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

    this.subscribeSteps = subscribeSteps;
    this.subscribeSteps.init(operationBus);

    this.notificationService = notificationService;
    this.notificationService.init(reduxStore, officeReducerHelper);

    this.popupController = popupController;
    this.popupController.init(sessionActions, popupActions, overviewHelper, errorService);

    this.overviewHelper = overviewHelper;
    this.overviewHelper.init(
      sidePanelService,
      notificationService,
      sidePanelHelper,
      sidePanelNotificationHelper
    );

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
}

export const diContainer = new DIContainer(false);
