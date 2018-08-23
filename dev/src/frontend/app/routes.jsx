/* eslint-disable */
import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, Switch } from 'react-router-dom';
import { routeContainer } from './routeContainer.js';

import { Error } from './error.jsx';
import { pathEnum } from './path-enum';
import { Navigator } from './navigator/navigator.jsx';
/* eslint-enable */

export const Routes = () => (
    <Switch>
        <Route exact path='/' component={Navigator} />
        {pathEnum.map((path) => {
            return (
                <Route key={path.component}
                    path={path.pathName}
                    component={routeContainer[path.component]} />
            );
        })}
        <Route component={Error} />
    </Switch>
);
