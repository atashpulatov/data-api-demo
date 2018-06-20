import React from 'react'; // eslint-disable-line no-unused-vars
import { Switch } from 'react-router-dom';
import di from './root-di.js';

const Route = di.Route; // eslint-disable-line no-unused-vars

const Routes = () => (
    <Switch>
        <Route exact path="/" component={di.Navigator} />
        <Route path="/auth" component={di.Auth} />
        <Route path="/projects" component={di.Projects} />
        <Route path="/objects" component={di.MstrObjects} />
    </Switch>
);

export default Routes;
