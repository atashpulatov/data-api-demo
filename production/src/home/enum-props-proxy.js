export const propsProxy = {
  get: (target, name) => {
    if (name in target) {
      return target[name];
    }
    throw new Error(`Property '${name}'
             does not exist in '${target}'.`);
  },
};
