import { propsProxy } from './enum-props-proxy';

export const PopupTypeEnum = new Proxy({
  /**
     * propertyAlias: propertyName,
     */
  navigationTree: 'navigation-tree',
  dataPreparation: 'data-preparation',
  editFilters: 'edit-filters',
  loadingPage: 'loading-page',
  refreshAllPage: 'refresh-all-page',
  promptsWindow: 'prompts-window',
  repromptingWindow: 'reprompting-window',
  dossierWindow: 'dossier-window',
  obtainInstanceHelper: 'obtain-instance-helper',
  emptyDiv: 'empty-div',
}, propsProxy);
