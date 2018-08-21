/* eslint-disable */
import React, { Component } from 'react';
import { historyProperties } from '../history/history-properties';
import { breadcrumbsService } from './breadcrumb-service';
import { Breadcrumb } from './breadcrumb.jsx';
import './breadcrumbs.css';
import { reduxStore } from '../store';
import { withRouter } from 'react-router';
/* eslint-enable */

class _Breadcrumbs extends Component {

    constructor(props) {
        super(props);

        this.state = {
            displayBreadcrumbs: false,
        };

        this.navigateToDir = this.navigateToDir.bind(this);
    }

    navigateToDir(dirId) {
        console.log('getting back');
        reduxStore.dispatch({
            type: historyProperties.actions.goUpTo,
            dirId: dirId,
        });
        this.props.history.push({
            pathname: '/',
        });
    };

    render() {
        const historyObjects = breadcrumbsService.getHistoryObjects();
        this.state.displayBreadcrumbs = historyObjects.length > 0
            ? true
            : false;
        if (!this.state.displayBreadcrumbs) {
            return null;
        }
        return (
            <div>
                <header className='mstr-objects'>
                    All Files
                </header>
                <hr />
                <ul className='breadcrumb'>
                    {breadcrumbsService.getHistoryObjects()
                        .map((object) => (
                            <Breadcrumb key={object.dirId}
                                object={object}
                                onClick={this.navigateToDir} />
                        ))}
                </ul>
            </div>
        );
    }
}

export const Breadcrumbs = withRouter(_Breadcrumbs);
