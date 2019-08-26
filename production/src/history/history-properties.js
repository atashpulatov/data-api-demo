import { propsProxy } from '../home/enum-props-proxy';

export const historyProperties = new Proxy({
  /**
     * propertyAlias: propertyName,
     */
  directoryId: 'mstr-directoryid',
  directoryName: 'mstr-directory-name',
  directoryArray: 'history-directory-array',
  projectId: 'x-mstr-projectid',
  projectName: 'mstr-project-name',
  command: 'history-command',
  // Reducer actions' types. Don't need to be wrapped into Proxy
  actions: {
    goUp: 'HISTORY_GO_UP',
    goUpTo: 'HISTORY_GO_UP_TO',
    goToProjects: 'HISTORY_GO_PROJECTS',
    goInsideProject: 'HISTORY_GO_INSIDE_PROJECTS',
    goInside: 'HISTORY_GO_INSIDE',
  },
}, propsProxy);
