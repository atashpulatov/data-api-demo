import request from 'superagent';

class ModuleProxy {
  constructor() {
    this.request = request;
  }
}

export const moduleProxy = new ModuleProxy();
