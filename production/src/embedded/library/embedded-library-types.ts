export interface EmbeddedLibraryTypes {
  mstrData: {
    envUrl: string,
    authToken: string
  },
  selectedMenu: {
    pageKey: string,
    groupId: string,
  },
  handleSelection: Function,
  updateSelectedMenu: Function,
  selectObject: Function,
  handleIframeLoadEvent: Function
}
declare global {
  interface Window {
    microstrategy: {
      dossier: any,
      embeddingContexts: any
    },
    Office: {
      context: any
    }
  }
}
