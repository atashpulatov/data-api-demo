import React, { useState, useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @ts-ignore
import { Empty } from '@mstr/connector-components/';
import { popupHelper } from '../../popup/popup-helper';
import scriptInjectionHelper from '../utils/script-injection-helper';
import { EmbeddedLibraryTypes } from './embedded-library-types';
import { handleLoginExcelDesktopInWindows } from '../utils/embedded-helper';
import { navigationTreeActions } from '../../redux-reducer/navigation-tree-reducer/navigation-tree-actions';
import './library.css';

const { microstrategy, Office } = window;

export const EmbeddedLibraryNotConnected = (props: EmbeddedLibraryTypes) => {
  const {
    handleSelection, handleIframeLoadEvent, updateSelectedMenu, switchSearchPageShown, updateSearchType, mstrData, selectedMenu
  } = props;
  const container = useRef(null);
  const [msgRouter, setMsgRouter] = useState(null);
  const [loadingFrame, setLoadingFrame] = useState(true);

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
            EventType.ON_LIBRARY_SEARCH_RESULTS_TOGGLED,
            switchSearchPageShown
        );
        msgRouter.registerEventHandler(
            EventType.ON_LIBRARY_SEARCH_TYPE_SWITCHED,
            updateSearchType
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
   * @param {Object} error - payload throwed by embedded.api after the error occured
   */
  const onEmbeddedError = (error: any) => {
    const { title } = error;
    if (title !== 'Notification') {
      popupHelper.handlePopupErrors(error);
    }
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

    const { pageKey, groupId } = selectedMenu;

    let targetGroup = {};

    if (groupId) {
      targetGroup = { targetGroup: { id: groupId } };
    }

    try {
      const embedProps = {
        serverUrl,
        enableCustomAuthentication: true,
        customAuthenticationType: CustomAuthenticationType.AUTH_TOKEN,
        enableResponsive: true,
        currentPage: { key: pageKey, ...targetGroup },
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
            EventType.ON_LIBRARY_SEARCH_RESULTS_TOGGLED,
            switchSearchPageShown
          );
          MsgRouter.registerEventHandler(
            EventType.ON_LIBRARY_SEARCH_TYPE_SWITCHED,
            updateSearchType
          );
          MsgRouter.registerEventHandler(EventType.ON_ERROR, onEmbeddedError);
        },
      };

      if (microstrategy && microstrategy.embeddingContexts) {
        await microstrategy.embeddingContexts.embedLibraryPage(embedProps);
        setLoadingFrame(false);
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
    <>
      {loadingFrame && <Empty isLoading />}
      <div ref={container} className="library-iframe" />
    </>
  );
};

EmbeddedLibraryNotConnected.propTypes = {
  mstrData: PropTypes.shape({
    envUrl: PropTypes.string,
    authToken: PropTypes.string,
  }),
  selectedMenu: PropTypes.shape({
    pageKey: PropTypes.string,
    groupId: PropTypes.string,
  }),
  handleIframeLoadEvent: PropTypes.func,
  handleSelection: PropTypes.func,
  updateSelectedMenu: PropTypes.func,
  switchSearchPageShown: PropTypes.func,
  updateSearchType: PropTypes.func
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
  navigationTree: {
    selectedMenu: object;
  }
}) => {
  const { sessionReducer: { envUrl, authToken } } = state;
  const { navigationTree: { selectedMenu } } = state;
  const mstrData = {
    envUrl,
    authToken,
  };
  return { mstrData, selectedMenu };
};

const mapActionsToProps = {
    updateSelectedMenu: navigationTreeActions.updateSelectedMenu,
    switchSearchPageShown: navigationTreeActions.switchSearchPageShown,
    updateSearchType: navigationTreeActions.updateSearchType,
};

export const EmbeddedLibrary = connect(mapStateToProps, mapActionsToProps)(
  EmbeddedLibraryNotConnected
);
