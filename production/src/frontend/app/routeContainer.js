import './app.css';
import './index.css';

import { Navigator } from './navigator/navigator.jsx';
import { Authenticate } from './authentication/auth-component.jsx';
import { Projects } from './project/project-list.jsx';
import { MstrObjects } from './mstr-object/mstr-object-list.jsx';


export const routeContainer = {
    Navigator,
    Authenticate,
    Projects,
    MstrObjects,
};
