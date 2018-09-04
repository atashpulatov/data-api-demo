/* eslint-disable */
import React, { Component } from 'react';
import { navigationService } from './navigation-service';
import { pathEnum } from '../path-enum';
import { NavigationError } from './navigation-error';
import { connect } from 'react-redux';
/* eslint-enable */

const ROOT_COMPONENT_DATA = { pathName: '/', component: 'Projects' };

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
            if (pathToProperComponent.pathname
                === ROOT_COMPONENT_DATA.pathName) {
                this.conditionallyRenavigateToRoot(pathToProperComponent);
            } else {
                this.conditionallyRenavigateToOther(pathToProperComponent);
            }
        };

        conditionallyRenavigateToRoot(pathToProperComponent) {
            const expectedComponentName = '_' + ROOT_COMPONENT_DATA.component;
            if (WrappedComponent.name !== expectedComponentName) {
                this.props.history.push(pathToProperComponent);
            }
        }

        conditionallyRenavigateToOther(pathToProperComponent) {
            const pathComponentData = pathEnum.find((path) => {
                return path.pathName === pathToProperComponent.pathname;
            });
            if (!pathComponentData) {
                throw new NavigationError(`Component `
                    + `'${pathToProperComponent.pathname}'`
                    + ` is not defined in routes.`);
            }
            const expectedComponentName = '_' + pathComponentData.component;
            if (WrappedComponent.name !== expectedComponentName) {
                this.props.history.push(pathToProperComponent);
            }
        }

        /**
         * Hence all history operations should be done in withNavigation HOC,
         * we don't want to pass history to wrapped component.
         * @return {React.Component}
         */
        render() {
            /* eslint-disable no-unused-vars*/
            const { history, ...passThroughProps } = this.props;
            /* eslint-enable */
            return <WrappedComponent {...passThroughProps} />;
        }
    };

    function mapStateToProps(state) {
        return {
            authToken: state.sessionReducer.authToken,
            project: state.historyReducer.project,
        };
    }

    return connect(mapStateToProps)(WithNavigation);
}
