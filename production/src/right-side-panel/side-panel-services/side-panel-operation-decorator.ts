import { authenticationHelper } from '../../authentication/authentication-helper';
import officeReducerHelper from '../../office/store/office-reducer-helper';

import { errorService } from '../../error/error-handler';

class SidePanelOperationDecorator {
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
        errorService.handleSidePanelActionError(error);
      }
    };

    return descriptor;
  }
}

const sidePanelOperationDecorator = new SidePanelOperationDecorator();
export default sidePanelOperationDecorator;
