import React, { useLayoutEffect, useRef, useState } from "react";
import { connect } from "react-redux";

import { popupHelper } from "../../popup/popup-helper";
import { handleLoginExcelDesktopInWindows } from "../utils/embedded-helper";
import scriptInjectionHelper from "../utils/script-injection-helper";

import { EmbeddedLibraryTypes } from "./embedded-library-types";

import { navigationTreeActions } from "../../redux-reducer/navigation-tree-reducer/navigation-tree-actions";

import "./library.css";

const { microstrategy, Office } = window;

export const EmbeddedLibraryNotConnected: React.FC<EmbeddedLibraryTypes> = (
  props,
) => {
  const {
    handleSelection,
    handleIframeLoadEvent,
    updateSelectedMenu,
    selectObject,
    mstrData,
    showHidden,
  } = props;
  const container = useRef(null);
  const [msgRouter, setMsgRouter] = useState(null);

  /**
   * Registers a load event handler for embedded library iframe
   * after it is added into the DOM
   *
   * @param {HTMLIFrameElement} iframe
   */
  const onIframeLoad = (iframe: HTMLIFrameElement): void => {
    iframe.addEventListener("load", () => {
      const { contentDocument } = iframe;
      // DE160793 - Throw session expired error when library redirects to login (iframe 'load' event)
      handleIframeLoadEvent();
      handleLoginExcelDesktopInWindows(contentDocument, Office);
    });
  };

  /**
   * Handles the event thrown after new error in embedded library.
   * Retrives the error type (based on title).
   * If error type is not a notification - handles it by closing the window
   *
   * @param {Object} error - payload throwed by embedded.api after the error occured
   */
  const onEmbeddedError = (error: any): void => {
    const { title } = error;
    if (title !== "Notification") {
      popupHelper.handlePopupErrors(error);
    }
  };

  /**
   * Clears out the list of selected library items.
   */
  const clearSelection = (): void => {
    selectObject({});
  };

  /**
   * Initializes and Loads embedded library into the specified container element
   *
   * @param {HTMLElement} containerElement
   */
  const loadEmbeddedLibrary = async (
    containerElement: HTMLElement,
  ): Promise<any> => {
    const { envUrl, authToken } = mstrData;

    // delete last occurence of '/api' from the enviroment url
    const serverUrl = envUrl.slice(0, envUrl.lastIndexOf("/api"));

    const { CustomAuthenticationType, EventType } = microstrategy.dossier;

    try {
      const embedProps = {
        serverUrl,
        enableCustomAuthentication: true,
        customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
        enableResponsive: true,
        libraryItemSelectMode: "single",
        getLoginToken() {
          return Promise.resolve(authToken);
        },
        placeholder: containerElement,
        onMsgRouterReadyHandler: ({ MsgRouter }: any) => {
          setMsgRouter(MsgRouter);
          MsgRouter.registerEventHandler(
            EventType.ON_LIBRARY_ITEM_SELECTED,
            handleSelection,
          );
          MsgRouter.registerEventHandler(
            EventType.ON_LIBRARY_MENU_SELECTED,
            updateSelectedMenu,
          );
          MsgRouter.registerEventHandler(
            EventType.ON_LIBRARY_ITEM_SELECTION_CLEARED,
            clearSelection,
          );
          MsgRouter.registerEventHandler(EventType.ON_ERROR, onEmbeddedError);
        },
        settings: { library: { _showHiddenObjects: showHidden } },
      };

      if (microstrategy && microstrategy.embeddingContexts) {
        await microstrategy.embeddingContexts.embedLibraryPage(embedProps);
      } else {
        console.warn(
          "Cannot find microstrategy.embeddingContexts, please check embeddinglib.js is present in your environment",
        );
      }
    } catch (error) {
      popupHelper.handlePopupErrors(error);
    }
  };

  useLayoutEffect(() => {
    // set user agent so that the embedded library can identify source
    const origUserAgent = window.navigator.userAgent;
    Object.defineProperty(window.navigator, "userAgent", {
      get() {
        return `${origUserAgent} MSTRExcel/1.0`;
      },
      configurable: true,
    });
    scriptInjectionHelper.watchForIframeAddition(
      container.current,
      onIframeLoad,
    );
    loadEmbeddedLibrary(container.current);

    return () => {
      if (msgRouter) {
        const { EventType } = microstrategy.dossier;
        msgRouter.removeEventhandler(
          EventType.ON_LIBRARY_ITEM_SELECTED,
          handleSelection,
        );
        msgRouter.removeEventhandler(
          EventType.ON_LIBRARY_MENU_SELECTED,
          updateSelectedMenu,
        );
        msgRouter.removeEventhandler(
          EventType.ON_LIBRARY_ITEM_SELECTION_CLEARED,
          clearSelection,
        );
        msgRouter.removeEventhandler(EventType.ON_ERROR, onEmbeddedError);
      }
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return <div ref={container} className="library-iframe" />;
};

const mapStateToProps = (state: {
  sessionReducer: {
    envUrl: string;
    authToken: string;
  };
  configReducer: {
    showHidden: boolean;
  };
}): any => {
  const {
    sessionReducer: { envUrl, authToken },
  } = state;
  const mstrData = {
    envUrl,
    authToken,
  };
  const {
    configReducer: { showHidden },
  } = state;
  return { mstrData, showHidden };
};

const mapActionsToProps = {
  updateSelectedMenu: navigationTreeActions.updateSelectedMenu,
  selectObject: navigationTreeActions.selectObject,
};

export const EmbeddedLibrary = connect(
  mapStateToProps,
  mapActionsToProps,
)(EmbeddedLibraryNotConnected);
