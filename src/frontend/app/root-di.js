import {
    HashRouter as Router,
    Route,
} from 'react-router-dom';

import './app.css';
import './index.css';

import Main from './navigator.jsx';
import Auth from './authentication/auth-component.jsx';
import Projects from './project/project-list.jsx';
//import App from './app.jsx';
import registerServiceWorker from './registerServiceWorker';

export default {
    'Router': Router,
    Route,
    Main,
    Auth,
    Projects,
    //App,
    registerServiceWorker,
};
    // The thing is that we cannot throw into one basked all views and logic.
    // This will couse circular dependencies and WebPack won't tell you, it will just throw undefined somewhere.
    // We could use some kind of ViewService which will see ALL available views
    // And render the one that is being requested by Event or some other Message.
