export interface EmbeddedLibraryTypes {
  mstrData: {
    envUrl: string,
    authToken: string
  },
  showHidden: boolean,
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
