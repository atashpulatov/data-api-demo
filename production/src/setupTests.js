// setup file
import React from 'react';
import 'regenerator-runtime';

import overviewHelper from './dialog/overview/overview-helper';
import { sidePanelHelper } from './right-side-panel/side-panel-services/side-panel-helper';
import { sidePanelNotificationHelper } from './right-side-panel/side-panel-services/side-panel-notification-helper';
import { sidePanelService } from './right-side-panel/side-panel-services/side-panel-service';

import '@testing-library/jest-dom';
import { operationBus } from './operation/operation-bus';
import subscribeSteps from './operation/operation-subscribe-steps';

import 'jest-localstorage-mock';

jest.mock('@mstr/connector-components', () => {
  const originalModule = jest.requireActual('@mstr/connector-components');

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
  };
});

global.ResizeObserver = require('resize-observer-polyfill');

global.Excel = {
  SheetVisibility: {
    visible: 'visible',
    hidden: 'hidden',
    veryHidden: 'veryHidden',
  },
};

// There should be better way of doing this, but we are getting too much noise from console while running tests
console.info = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();
console.time = jest.fn();
console.timeEnd = jest.fn();
console.group = jest.fn();
console.groupEnd = jest.fn();
console.groupCollapsed = jest.fn();

operationBus.init();
subscribeSteps.init();
overviewHelper.init(sidePanelService, sidePanelHelper, sidePanelNotificationHelper);
