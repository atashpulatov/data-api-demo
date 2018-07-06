export const propsProxy = {
    get: (target, name) => {
        if (name in target) {
            return target[name];
        } else {
            throw new Error(`Property '${name}'
             does not exist in '${target}'.`);
        }
    },
};
