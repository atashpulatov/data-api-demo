import React, { useState, useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { popupHelper } from '../../popup/popup-helper';
import scriptInjectionHelper from '../utils/script-injection-helper';
import { EmbeddedLibraryTypes } from './embedded-library-types';
import { handleLoginExcelDesktopInWindows } from '../utils/embedded-helper';
import { navigationTreeActions } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import './library.css';

const { microstrategy, Office } = window;

export const EmbeddedLibraryNotConnected = (props: EmbeddedLibraryTypes) => {
  const {
    handleSelection, handleIframeLoadEvent, updateSelectedMenu, selectObject, mstrData, showHidden
  } = props;
  const container = useRef(null);
  const [msgRouter, setMsgRouter] = useState(null);

  useLayoutEffect(() => {
    // set user agent so that the embedded library can identify source
    const origUserAgent = window.navigator.userAgent;
    Object.defineProperty(window.navigator, 'userAgent', {
      get() {
        return `${origUserAgent} MSTRExcel/1.0`;
      },
      configurable: true,
    });
    scriptInjectionHelper.watchForIframeAddition(
      container.current,
      onIframeLoad
    );
    loadEmbeddedLibrary(container.current);

    return () => {
      if (msgRouter) {
        const { EventType } = microstrategy.dossier;
        msgRouter.removeEventhandler(
          EventType.ON_LIBRARY_ITEM_SELECTED,
          handleSelection
        );
        msgRouter.removeEventhandler(
          EventType.ON_LIBRARY_MENU_SELECTED,
          updateSelectedMenu
        );
        msgRouter.removeEventhandler(
          EventType.ON_LIBRARY_ITEM_SELECTION_CLEARED,
          clearSelection
        );
        msgRouter.removeEventhandler(
          EventType.ON_ERROR,
          onEmbeddedError
        );
      }
    };
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  /**
   * Registers a load event handler for embedded library iframe
   * after it is added into the DOM
   *
   * @param {HTMLIFrameElement} iframe
   */
  const onIframeLoad = (iframe: HTMLIFrameElement) => {
    iframe.addEventListener('load', () => {
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
   * @param {Object} error - payload thrown by embedded.api after the error occured
   */
  const onEmbeddedError = (error: any) => {
    const { title } = error;
    if (title !== 'Notification') {
      popupHelper.handlePopupErrors(error);
    }
  };

  /**
   * Clears out the list of selected library items.
   */
  const clearSelection = () => {
    selectObject({});
  };

  /**
   * Initializes and Loads embedded library into the specified container element
   *
   * @param {HTMLElement} containerElement
   */
  const loadEmbeddedLibrary = async (containerElement: HTMLElement) => {
    const { envUrl, authToken } = mstrData;

    // delete last occurence of '/api' from the enviroment url
    const serverUrl = envUrl.slice(0, envUrl.lastIndexOf('/api'));

    const { CustomAuthenticationType, EventType } = microstrategy.dossier;

    try {
      const embedProps = {
        serverUrl,
        enableCustomAuthentication: true,
        customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
        enableResponsive: true,
        libraryItemSelectMode: 'single',
        getLoginToken() {
          return Promise.resolve(authToken);
        },
        placeholder: containerElement,
        onMsgRouterReadyHandler: ({ MsgRouter }: any) => {
          setMsgRouter(MsgRouter);
          MsgRouter.registerEventHandler(
            EventType.ON_LIBRARY_ITEM_SELECTED,
            handleSelection
          );
          MsgRouter.registerEventHandler(
            EventType.ON_LIBRARY_MENU_SELECTED,
            updateSelectedMenu
          );
          MsgRouter.registerEventHandler(
            EventType.ON_LIBRARY_ITEM_SELECTION_CLEARED,
            clearSelection
          );
          MsgRouter.registerEventHandler(EventType.ON_ERROR, onEmbeddedError);
        },
        settings: { library: { _showHiddenObjects: showHidden } }
      };

      if (microstrategy && microstrategy.embeddingContexts) {
        await microstrategy.embeddingContexts.embedLibraryPage(embedProps);
      } else {
        console.warn(
          'Cannot find microstrategy.embeddingContexts, please check embeddinglib.js is present in your environment'
        );
      }
    } catch (error) {
      popupHelper.handlePopupErrors(error);
    }
  };

  return (
    <div ref={container} className="library-iframe" />
  );
};

EmbeddedLibraryNotConnected.propTypes = {
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
  }),
  showHidden: PropTypes.bool,
  handleIframeLoadEvent: PropTypes.func,
  handleSelection: PropTypes.func,
  updateSelectedMenu: PropTypes.func,
  selectObject: PropTypes.func,
};

EmbeddedLibraryNotConnected.defaultProps = {
  mstrData: {
    envUrl: 'no env url',
    authToken: null,
  },
  handleSelection: () => {},
};

const mapStateToProps = (state: {
  sessionReducer: {
    envUrl: string;
    authToken: string;
  },
  configReducer: {
    showHidden: boolean;
  }
}) => {
  const { sessionReducer: { envUrl, authToken } } = state;
  const mstrData = {
    envUrl,
    authToken,
  };
  const { configReducer: { showHidden } } = state;
  return { mstrData, showHidden };
};

const mapActionsToProps = {
  updateSelectedMenu: navigationTreeActions.updateSelectedMenu,
  selectObject: navigationTreeActions.selectObject,
};

export const EmbeddedLibrary = connect(mapStateToProps, mapActionsToProps)(
  EmbeddedLibraryNotConnected
);
