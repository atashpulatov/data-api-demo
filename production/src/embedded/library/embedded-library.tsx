import React, { useState, useRef, useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// @ts-ignore
import { Empty } from '@mstr/connector-components/';
import { popupHelper } from '../../popup/popup-helper';
import scriptInjectionHelper from '../utils/script-injection-helper';
import { EmbeddedLibraryTypes } from './embedded-library-types';
import './library.css';

// @ts-ignore
const { microstrategy, Office } = window;

export const EmbeddedLibraryNotConnected = (props: EmbeddedLibraryTypes) => {
  const { handleSelection, handleIframeLoadEvent, mstrData } = props;
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
          EventType.ON_ERROR,
          onEmbeddedError
        );
      }
    };
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  /**
   * This function is called after the embedded library iframe is added into the DOM
   * @param {*} iframe
   */
  const onIframeLoad = (iframe: HTMLIFrameElement) => {
    iframe.addEventListener('load', () => {
      const { contentDocument } = iframe;
      // DE160793 - Throw session expired error when library redirects to login (iframe 'load' event)
      handleIframeLoadEvent();
      if (!scriptInjectionHelper.isLoginPage(contentDocument)) {
        // DE158588 - Not able to open library in embedding api on excel desktop in windows
        const isOfficeOnline = Office.context
          ? Office.context.platform === Office.PlatformType.OfficeOnline
          : false;
        const isIE = /Trident\/|MSIE /.test(window.navigator.userAgent);
        if (!isOfficeOnline && isIE) {
          scriptInjectionHelper.applyFile(
            contentDocument,
            'javascript/mshtmllib.js'
          );
        }
        scriptInjectionHelper.applyFile(
          contentDocument,
          'javascript/embeddingsessionlib.js'
        );
      }
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
        currentPage: { key: 'all' },
        libraryItemSelectMode: 'single',
        getLoginToken() {
          return Promise.resolve(authToken);
        },
        placeholder: containerElement,
        onMsgRouterReadyHandler: ({ MsgRouter }: any) => {
          setMsgRouter(MsgRouter);
          MsgRouter.registerEventHandler(EventType.ON_LIBRARY_ITEM_SELECTED, handleSelection);
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
      console.log('error', error);
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
  handleIframeLoadEvent: PropTypes.func,
  handleSelection: PropTypes.func,
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
  }
}) => {
  const { sessionReducer: { envUrl, authToken } } = state;
  const mstrData = {
    envUrl,
    authToken,
  };
  return { mstrData };
};

export const EmbeddedLibrary = connect(mapStateToProps)(
  EmbeddedLibraryNotConnected
);
