export interface EmbeddedLibraryTypes {
  mstrData: {
    envUrl: string,
    authToken: string
  },
  selectedMenu: {
    key: string,
    groupId: string,
  },
  handleSelection: Function,
  handleMenuSelection: Function,
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
