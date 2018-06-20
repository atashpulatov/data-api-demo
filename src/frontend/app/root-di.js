import {
    HashRouter as Router,
    Route,
} from 'react-router-dom';

import './app.css';
import './index.css';

import Navigator from './navigator/navigator.jsx';
import Auth from './authentication/auth-component.jsx';
import Projects from './project/project-list.jsx';
import MstrObjects from './mstr-object/mstr-object-list.jsx';

import registerServiceWorker from './registerServiceWorker';

export default {
    Router,
    Route,
    Navigator,
    'Authenticate': Auth,
    Projects,
    MstrObjects,
    registerServiceWorker,
};
