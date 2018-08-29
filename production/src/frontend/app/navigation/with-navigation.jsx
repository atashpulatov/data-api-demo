/* eslint-disable */
import React, { Component } from 'react';
import { reduxStore } from '../store';
import { navigationService } from '../navigator/navigation-service';
/* eslint-enable */

export function withNavigation(WrappedComponent) {
    return class extends Component {
        constructor(props) {
            super(props);
            this.navigateToProperComponent =
                this.navigateToProperComponent.bind(this);
            if (!reduxStore.getState().sessionReducer.envUrl
                || !reduxStore.getState().sessionReducer.authToken) {
                this.props.history.push({ pathname: '/' });
            }
        }

        navigateToProperComponent() {
            const pathToNextComponent = navigationService.obtainPath();
            this.props.history.push(pathToNextComponent);
        };

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}
