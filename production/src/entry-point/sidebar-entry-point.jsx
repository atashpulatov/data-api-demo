import React from 'react';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import { reduxPersistor, reduxStore } from '../store';
import { Home } from '../home/home';


export default function SidebarEntryPoint() {
  return (
    <Provider store={reduxStore}>
      <PersistGate persistor={reduxPersistor}>
        <Home loading={false} />
      </PersistGate>
    </Provider>
  );
}
