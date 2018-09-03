/* eslint-disable */
import React, { Component } from 'react';
import { navigationService } from './navigation-service';
import { pathEnum } from '../path-enum';
import { NavigationError } from './navigation-error';
import { connect } from 'react-redux';
/* eslint-enable */

/**
 * HOC to wrap a React.Component
 * provides a navigation logic
 * @param {React.Component} WrappedComponent
 * @return {React.Component}
 */
export function withNavigation(WrappedComponent) {
    class WithNavigation extends Component {
        constructor(props) {
            super(props);
            this.conditionallyRenavigate =
                this.conditionallyRenavigate.bind(this);
            this.conditionallyRenavigate();
        }

        componentDidUpdate() {
            this.conditionallyRenavigate();
        };

        /**
         * Below method does:
         * 1) It asks for proper (corresponding to current app state) component
         * 2) Checks if it match wrapped component
         * 3) If not, it renavigates
         */
        conditionallyRenavigate() {
            const pathToProperComponent =
                navigationService.getNavigationRoute();
            const pathComponentData = pathEnum.find((path) => {
                return path.pathName === pathToProperComponent.pathname;
            });
            if (!pathComponentData) {
                throw new NavigationError(
                    `Component '${pathToProperComponent.pathname}'`
                    + ` is not defined in routes.`
                );
            }
            if (WrappedComponent.name !== pathComponentData.component) {
                this.props.history.push(pathToProperComponent);
            }
        };

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };

    function mapStateToProps(state) {
        return { project: state.historyReducer.project };
    }

    return connect(mapStateToProps)(WithNavigation);
}
