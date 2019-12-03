/* eslint-disable */
import { reduxStore } from './store';
import { OfficeApiHelper } from './office/office-api-helper';
import { OfficeStoreService } from './office/store/office-store-service';
import { ErrorService } from './error/error-handler';
import { SessionHelper } from './storage/session-helper';
import { NotificationService } from './notification/notification-service';
import { AuthenticationHelper } from './authentication/authentication-helper';
import { HomeHelper } from './home/home-helper';
import { MstrObjectRestService } from './mstr-object/mstr-object-rest-service';
import { PopupController } from './popup/popup-controller';
import { OfficeDisplayService } from './office/office-display-service';
import { MstrListRestService } from './mstr-object/mstr-list-rest-service';
import { PopupHelper } from './popup/popup-helper';
import * as popupActionsModule from './popup/popup-actions';

export class DIContainer {
  constructor() {
    if (DIContainer.instance) {
      return DIContainer.instance;
    }
    DIContainer.instance = this;
    return this;
  }

  initializeDependencies = () => {
    console.log(Excel);
    this.officeApiHelper = new OfficeApiHelper();
    this.officeApiHelper.init(reduxStore);
    this.officeStoreService = new OfficeStoreService();
    this.officeStoreService.init(reduxStore);
    this.notificationService = new NotificationService();
    this.notificationService.init(reduxStore);
    this.sessionHelper = new SessionHelper();
    this.sessionHelper.init(reduxStore);
    this.errorHandler = new ErrorService();
    this.errorHandler.init(this.sessionHelper, this.notificationService);
    this.authenticationHelper = new AuthenticationHelper();
    this.authenticationHelper.init(reduxStore, this.sessionHelper);
    this.homeHelper = new HomeHelper();
    this.homeHelper.init(reduxStore, this.sessionHelper);
    this.mstrObjectRestService = new MstrObjectRestService();
    this.mstrObjectRestService.init(reduxStore);
    this.popupController = new PopupController();
    this.popupController.init(reduxStore, this.sessionHelper, popupActionsModule);
    this.officeDisplayService = new OfficeDisplayService();
    this.officeDisplayService.init(reduxStore, this.popupController);
    this.mstrListRestService = new MstrListRestService();
    this.mstrListRestService.init(reduxStore);
    this.popupHelper = new PopupHelper();
    this.popupHelper.init(this.popupController);
  }

  get = (dependency) => this[dependency]
}

export const diContainer = new DIContainer();
