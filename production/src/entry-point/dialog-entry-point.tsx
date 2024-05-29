import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import { reduxStore } from '../store';

import {
  DialogType,
  PopupStateActionTypes,
} from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';

import { Popup } from '../popup/popup';

const DialogEntryPoint: React.FC = () => {
  useEffect(() => {
    // DE291188: Initialize popup type from URL to tacle Redux Re-hydration issue
    // which causes popup type's value to be out-of-sync with SidePane's state
    // on dialog reload for imported data overview or overview's reprompt dialog type.
    if (window.location?.href?.includes('popupType')) {
      const url = new URL(window.location.href);
      const popupType = url.searchParams.get('popupType') as DialogType;
      if (popupType) {
        reduxStore.dispatch({
          type: PopupStateActionTypes.SET_POPUP_TYPE,
          popupType,
        });
      }
    }
  }, []);

  return (
    <Provider store={reduxStore}>
      <Popup />
    </Provider>
  );
};

export default DialogEntryPoint;
