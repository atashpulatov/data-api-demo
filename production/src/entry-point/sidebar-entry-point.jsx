// issue with PersistGate import
// eslint-disable-next-line simple-import-sort/imports
import React from "react";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/lib/integration/react";
import { reduxPersistor, reduxStore } from "../store";

import { Home } from "../home/home";

const SidebarEntryPoint = () => (
  <Provider store={reduxStore}>
    <PersistGate persistor={reduxPersistor}>
      <Home loading={false} />
    </PersistGate>
  </Provider>
);

export default SidebarEntryPoint;
