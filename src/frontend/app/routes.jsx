import React from 'react'; // eslint-disable-line no-unused-vars
import { Switch } from 'react-router-dom';
import di from './root-di.js';
import Error from './error.jsx';
import PathEnum from './path-enum';

const Route = di.Route; // eslint-disable-line no-unused-vars

const Routes = () => (
    <Switch>
        <Route exact path='/' component={di.Navigator} />
        {PathEnum.map((path) => {
            return (
                <Route key={path.component}
                        path={path.pathName}
                        component={di[path.component]} />
            );
        })}
        <Route component={Error} />
    </Switch>
);

export default Routes;
