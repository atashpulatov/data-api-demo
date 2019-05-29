import {propsProxy} from './enum-props-proxy';

export const PopupTypeEnum = new Proxy({
  /**
     * propertyAlias: propertyName,
     */
  navigationTree: 'navigation-tree',
  dataPreparation: 'data-preparation',
  loadingPage: 'loading-page',
  refreshAllPage: 'refresh-all-page',
  promptsWindow: 'prompts-window',
}, propsProxy);
