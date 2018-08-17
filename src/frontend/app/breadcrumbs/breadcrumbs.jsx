/* eslint-disable */
import React from 'react';
import { reduxStore } from '../store';
import { historyProperties } from '../history/history-properties';
import { breadcrumbsService } from './breadcrumb-service';
import { Breadcrumb } from './breadcrumb.jsx';
/* eslint-enable */

export const Breadcrumbs = () => (
    <ul>
        {breadcrumbsService.getHistoryObjects()
            .map((object) => (
                <Breadcrumb key={object.dirId}
                    object={object}
                    onClick={navigateToDir} />
            ))}
    </ul>
);

const navigateToDir = (dirId) => {
    reduxStore.dispatch({
        type: historyProperties.actions.goUpTo,
        dirId: dirId,
    });
};
