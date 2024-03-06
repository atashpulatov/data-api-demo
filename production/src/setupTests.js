// setup file
import React from "react";
import "regenerator-runtime";

import "@testing-library/jest-dom";
import { diContainer } from "./dependency-container";

import "jest-localstorage-mock";

jest.mock("@mstr/connector-components", () => {
  const originalModule = jest.requireActual("@mstr/connector-components");

  return {
    ...originalModule,
    // eslint-disable-next-line react/react-in-jsx-scope
    ObjectTable: () => <div />,
    // eslint-disable-next-line react/react-in-jsx-scope,react/no-multi-comp
    TopFilterPanel: () => <div />,
    // eslint-disable-next-line react/no-multi-comp,react/react-in-jsx-scope
    SidePanel: () => <div />,
    // eslint-disable-next-line react/no-multi-comp,react/react-in-jsx-scope
    Empty: () => <div />,
    objectNotificationTypes: {
      PROGRESS: "PROGRESS",
      WARNING: "WARNING",
      SUCCESS: "SUCCESS",
    },
  };
});

global.ResizeObserver = require("resize-observer-polyfill");

diContainer.initializeAll();
