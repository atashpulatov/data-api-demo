// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-localstorage-mock';
import 'regenerator-runtime/runtime';

configure({ adapter: new Adapter() });
