// setup file
import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-localstorage-mock';
import 'regenerator-runtime/runtime';
import { diContainer } from './dependency-container';

jest.mock('@mstr/rc', () => ({
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
}));

configure({ adapter: new Adapter() });
diContainer.initializeAll();
