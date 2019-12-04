// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-localstorage-mock';
import 'regenerator-runtime/runtime';

jest.mock('@mstr/rc', () => ({
  // eslint-disable-next-line react/react-in-jsx-scope
  ObjectTable: () => <div />,
  // eslint-disable-next-line react/react-in-jsx-scope,react/no-multi-comp
  TopFilterPanel: () => <div />,
}));

configure({ adapter: new Adapter() });
