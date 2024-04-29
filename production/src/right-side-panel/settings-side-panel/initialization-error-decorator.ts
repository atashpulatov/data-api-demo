class InitializationErrorDecorator {
  /**
   * Wraps functions with try-catch. For the errors caught, it logs the error and continues with the execution.
   *
   * @param target Target of the decorator
   * @param propertyKey Name of the original method
   * @param descriptor Data about original method
   * @returns  Descriptor with modified method
   */
  initializationWrapper(
    target: unknown,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async (...args: unknown[]) => {
      try {
        return await originalMethod.apply(target, args);
      } catch (error) {
        // TODO: For now we are just logging the error - as to not stop other initialization operations,
        // but we should handle it properly
        console.error('Error during plugin initialization', error);
      }
    };

    return descriptor;
  }
}

const initializationErrorDecorator = new InitializationErrorDecorator();
export default initializationErrorDecorator;
