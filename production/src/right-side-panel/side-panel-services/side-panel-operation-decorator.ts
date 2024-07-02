import { authenticationHelper } from '../../authentication/authentication-helper';
import { errorService } from '../../error/error-service';
import { browserHelper } from '../../helpers/browser-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';

import { IncomingErrorStrings } from '../../error/constants';

const CONNECTION_CHECK_TIMEOUT = 3000;

export class SidePanelOperationDecorator {
  /**
   * Wraps functions with try-catch. All throw error will be pass and handled by handleError function.
   *
   * @param target Target of the decorator
   * @param propertyKey Name of the original method
   * @param descriptor Data about original method
   * @returns  Descriptor with modified method
   */
  operationWrapper(
    target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: unknown[]) => {
      try {
        const { onLine } = window.navigator;

        if (onLine) {
          await authenticationHelper.checkStatusOfSessions();
          if (officeReducerHelper.noOperationInProgress()) {
            return await originalMethod.apply(target, args);
          }
        }
      } catch (error) {
        SidePanelOperationDecorator.handleSidePanelActionError(error);
      }
    };

    return descriptor;
  }

  /**
   * Handles error thrown during invoking side panel actions like refresh, edit etc.
   * For Webkit based clients (Safari, Excel for Mac)
   * it checks for network connection with custom implementation
   * This logic allows us to provide user with connection lost notification
   *
   * @param error Plain error object thrown by method calls.
   */
  static handleSidePanelActionError = (error: any): void => {
    const castedError = String(error);
    const { CONNECTION_BROKEN } = IncomingErrorStrings;
    if (castedError.includes(CONNECTION_BROKEN)) {
      if (browserHelper.isMacAndSafariBased()) {
        const connectionCheckerLoop = (): void => {
          const checkInterval = setInterval(() => {
            authenticationHelper.doesConnectionExist(checkInterval);
          }, CONNECTION_CHECK_TIMEOUT);
        };

        connectionCheckerLoop();
      }
      return;
    }
    errorService.handleError(error);
  };
}

const sidePanelOperationDecorator = new SidePanelOperationDecorator();
export default sidePanelOperationDecorator;
