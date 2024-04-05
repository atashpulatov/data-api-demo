import React from 'react';
import { Provider } from 'react-redux';

import { reduxStore } from '../store';

import { Popup } from '../popup/popup';

const DialogEntryPoint: React.FC = () => (
  <Provider store={reduxStore}>
    <Popup />
  </Provider>
);

export default DialogEntryPoint;