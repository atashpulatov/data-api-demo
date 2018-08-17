/* eslint-disable */
import React, {Component} from 'react';
import { historyProperties } from '../history/history-properties';
import { breadcrumbsService } from './breadcrumb-service';
import { Breadcrumb } from './breadcrumb.jsx';
import './breadcrumbs.css';
import { reduxStore } from '../store';
/* eslint-enable */

export class Breadcrumbs extends Component {

    constructor(props) {
        super(props);

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
        return (
            <ul className='breadcrumb'>
                {breadcrumbsService.getHistoryObjects()
                    .map((object) => (
                        <Breadcrumb key={object.dirId}
                            object={object}
                            onClick={this.navigateToDir} />
                    ))}
            </ul>
        );
    }
}
