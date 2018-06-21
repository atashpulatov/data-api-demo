import {
    HashRouter as Router,
    Route,
} from 'react-router-dom';

import './app.css';
import './index.css';

import Navigator from './navigator/navigator.jsx';
import Authenticate from './authentication/auth-component.jsx';
import Projects from './project/project-list.jsx';
import MstrObjects from './mstr-object/mstr-object-list.jsx';

import Header from './header.jsx';
import Footer from './footer.jsx';
import Error from './error.jsx';
import registerServiceWorker from './registerServiceWorker';

export default {
    Router,
    Route,
    Navigator,
    Authenticate,
    Projects,
    MstrObjects,
    Header,
    Footer,
    Error,
    registerServiceWorker,
};
