import React from 'react';
import { Provider } from 'react-redux';

import { reduxStore } from '../store';

import { Popup } from '../popup/popup';

export default function DialogEntryPoint() {
  return (
    <Provider store={reduxStore}>
      <Popup />
    </Provider>
  );
}
