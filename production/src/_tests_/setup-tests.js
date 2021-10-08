// setup file
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'jest-localstorage-mock';

configure({ adapter: new Adapter() });
