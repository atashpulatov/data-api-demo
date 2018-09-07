/* eslint-disable */
import React, { Component } from 'react';
import { historyProperties } from '../history/history-properties';
import { breadcrumbsService } from './breadcrumb-service';
import { Breadcrumb } from './breadcrumb.jsx';
import './breadcrumbs.css';
import { reduxStore } from '../store';
import { connect } from 'react-redux';
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
                    {historyObjects
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


function mapStateToProps(state) {
    return {
        project: state.historyReducer.project,
        directoryArray: state.historyReducer.directoryArray,
    };
}

export const Breadcrumbs = connect(mapStateToProps)(_Breadcrumbs);
