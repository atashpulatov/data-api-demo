/* eslint-disable */
import {reduxStore} from './store';
import {officeApiHelper, OfficeApiHelper} from './office/office-api-helper';
import {officeStoreService} from './office/store/office-store-service';
import {errorService} from './error/error-handler';
import {sessionHelper} from './storage/session-helper';
import {notificationService} from './notification/notification-service';
import {authenticationHelper} from './authentication/authentication-helper';
import {homeHelper} from './home/home-helper';
import {mstrObjectRestService} from './mstr-object/mstr-object-rest-service';
import {popupController} from './popup/popup-controller';
import {officeDisplayService} from './office/office-display-service';
import {mstrListRestService} from './mstr-object/mstr-list-rest-service';
import {popupHelper} from './popup/popup-helper';
import {popupActions} from './popup/popup-actions';
import {actionCreator} from './notification/action-creator';

export class DIContainer {
  constructor(autoInitialize) {
    if (autoInitialize) this.initializeAll();
  }

  initializeAll = () => {
    console.log('________INITIALIZING________');
    console.log('________DI CONTAINER________');
    this.officeApiHelper = officeApiHelper;
    this.officeApiHelper.init(reduxStore);
    this.officeStoreService = officeStoreService;
    this.officeStoreService.init(reduxStore);
    this.notificationService = notificationService;
    this.notificationService.init(reduxStore, actionCreator);
    this.sessionHelper = sessionHelper;
    this.sessionHelper.init(reduxStore);
    this.errorHandler = errorService;
    this.errorHandler.init(this.sessionHelper, this.notificationService);
    this.authenticationHelper = authenticationHelper;
    this.authenticationHelper.init(reduxStore, this.sessionHelper);
    this.homeHelper = homeHelper;
    this.homeHelper.init(reduxStore, this.sessionHelper);
    this.mstrObjectRestService = mstrObjectRestService
    this.mstrObjectRestService.init(reduxStore);
    this.popupController = popupController;
    this.popupController.init(reduxStore, this.sessionHelper, popupActions);
    this.officeDisplayService = officeDisplayService;
    this.officeDisplayService.init(reduxStore, this.popupController);
    this.mstrListRestService = mstrListRestService;
    this.mstrListRestService.init(reduxStore);
    this.popupHelper = popupHelper;
    this.popupHelper.init(this.popupController);
    this.popupActions = popupActions;
    this.popupActions.init(
      this.authenticationHelper,
      this.errorHandler,
      this.officeApiHelper,
      this.officeStoreService,
      this.popupHelper,
      this.mstrObjectRestService,
      this.popupController);
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
