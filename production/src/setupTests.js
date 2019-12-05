// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-localstorage-mock';
import 'regenerator-runtime/runtime';
import {diContainer} from './dependency-container';

configure({ adapter: new Adapter() });
diContainer.initializeAll();
