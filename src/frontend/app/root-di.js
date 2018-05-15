import {
    HashRouter as Router,
    Route,
} from 'react-router-dom';

import './app.css';

import Main from './navigator.jsx';
import Login from './authentication/login-component.jsx';
import Projects from './project/project-list.jsx';

export default {
    Router,
    Route,
    Main,
    Login,
    Projects,
};
