// setup file
import React from 'react';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'jest-localstorage-mock';
import 'regenerator-runtime';
import { SideInfoPanel } from '@mstr/connector-components';
import { diContainer } from './dependency-container';
import '@testing-library/jest-dom';

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
    objectNotificationTypes: {
      PROGRESS: 'PROGRESS',
      WARNING: 'WARNING',
      SUCCESS: 'SUCCESS',
    }
  };
});

//   return {
//   // eslint-disable-next-line react/react-in-jsx-scope
//   ObjectTable: () => <div />,
//   // eslint-disable-next-line react/react-in-jsx-scope,react/no-multi-comp
//   TopFilterPanel: () => <div />,
//   // eslint-disable-next-line react/no-multi-comp,react/react-in-jsx-scope
//   SidePanel: () => <div />,
//   objectNotificationTypes: {
//     PROGRESS: 'PROGRESS',
//     WARNING: 'WARNING',
//     SUCCESS: 'SUCCESS',
//   }
// }));
global.ResizeObserver = require('resize-observer-polyfill');

configure({ adapter: new Adapter() });
diContainer.initializeAll();
