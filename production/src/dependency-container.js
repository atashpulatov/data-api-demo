import overviewHelper from './popup/overview/overview-helper';
import { sidePanelHelper } from './right-side-panel/side-panel-services/side-panel-helper';
import { sidePanelNotificationHelper } from './right-side-panel/side-panel-services/side-panel-notification-helper';
import { sidePanelService } from './right-side-panel/side-panel-services/side-panel-service';

import { errorService } from './error/error-handler';
import { operationBus } from './operation/operation-bus';
import subscribeSteps from './operation/operation-subscribe-steps';
import { popupController } from './popup/popup-controller';
import { popupActions } from './redux-reducer/popup-reducer/popup-actions';

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
    this.subscribeSteps.init();

    this.popupController = popupController;
    this.popupController.init(errorService);

    this.overviewHelper = overviewHelper;
    this.overviewHelper.init(sidePanelService, sidePanelHelper, sidePanelNotificationHelper);

    this.popupActions = popupActions;
    this.popupActions.init(errorService, popupController);

    this.initialized = true;
  };
}

export const diContainer = new DIContainer(false);
