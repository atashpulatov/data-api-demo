import overviewHelper from './dialog/overview/overview-helper';
import { sidePanelHelper } from './right-side-panel/side-panel-services/side-panel-helper';
import { sidePanelNotificationHelper } from './right-side-panel/side-panel-services/side-panel-notification-helper';
import { sidePanelService } from './right-side-panel/side-panel-services/side-panel-service';

import { dialogController } from './dialog/dialog-controller';
import { errorService } from './error/error-handler';
import { operationBus } from './operation/operation-bus';
import subscribeSteps from './operation/operation-subscribe-steps';

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

    this.dialogController = dialogController;
    this.dialogController.init(errorService);

    this.overviewHelper = overviewHelper;
    this.overviewHelper.init(sidePanelService, sidePanelHelper, sidePanelNotificationHelper);

    this.initialized = true;
  };
}

export const diContainer = new DIContainer(false);
