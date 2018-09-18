/* eslint-disable */
import React, { Component } from 'react';
import { breadcrumbsService } from './breadcrumb-service';
import { CustomBreadcrumb } from './breadcrumb.jsx';
import { Breadcrumb } from 'antd';
import './breadcrumbs.css';
import { connect } from 'react-redux';
/* eslint-enable */

export class _Breadcrumbs extends Component {
    render() {
        const historyObjects = breadcrumbsService.getHistoryObjects();
        return (
            historyObjects.length > 0
                ?
                <div>
                    <header className='mstr-objects'>
                        All Files
                    </header>
                    <hr />
                    <Breadcrumb
                        style={{ marginLeft: '25px', marginRight: '25px' }}>
                        {historyObjects
                            .map((object) => (
                                <CustomBreadcrumb
                                    key={object.dirId || object.projectId}
                                    object={object}
                                    onClick={breadcrumbsService.navigateToDir} />
                            ))}
                    </Breadcrumb>
                    <hr />
                </div>
                : null
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
