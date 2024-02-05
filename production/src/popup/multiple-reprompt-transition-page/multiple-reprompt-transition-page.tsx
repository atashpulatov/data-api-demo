import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Empty, ObjectWindowTitle } from '@mstr/connector-components';
import { MultipleRepromptTransitionPageTypes } from './multiple-reprompt-transition-page-types';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import officeReducerHelper from '../../office/store/office-reducer-helper';
import i18n from '../../i18n';

import './multiple-reprompt-transition-page.scss';

/**
 * This component is used as a transition page for the Multiple Reprompt workflow.
 * It will display the title and a loading icon, allowing the user to understand
 * that the application is working on the next object in the list. We use index + 1
 * since at the time of rendering, the following object has not been processed yet and is
 * next in the queue.
 * @returns string customized text for the popup window title (e.g. Report/Dossier workflows)
 */
export const MultipleRepromptTransitionPageNotConnected: FC<MultipleRepromptTransitionPageTypes> = ({
  nextObjectBindId,
  nextObjectIndex,
  total
}) => {
  const nextObject: any = officeReducerHelper.getObjectFromObjectReducerByBindId(nextObjectBindId) || {};
  // retrieve object name based on next object type. reports vs dossiers have different name properties
  const nextObjectName = nextObject.objectType?.name === mstrObjectEnum.mstrObjectType.visualization.name
    ? nextObject.definition?.sourceName
    : nextObject.name;

  return (
    <div className="multiple-reprompt-transition-page">
      <ObjectWindowTitle
        locale={i18n.language}
        objectType="" // not needed since multiple reprompt title doesn't show type
        objectName={nextObjectName}
        isReprompt
        isEdit={false}
        index={nextObjectIndex}
        total={total}
      />
      <div className="loading-section">
        <Empty isLoading />
      </div>
    </div>
  );
};

const mapStateToProps = (state: {
  repromptsQueueReducer: {
    repromptsQueue: { bindId: string }[];
    index: number;
    total: number;
  }
}) => {
  const { repromptsQueueReducer } = state;

  return {
    nextObjectBindId: repromptsQueueReducer.repromptsQueue[0]?.bindId || '',
    // + 1 since the next obj has not been processed yet, so index is behind 1
    nextObjectIndex: repromptsQueueReducer.index + 1,
    total: repromptsQueueReducer.total,
  };
};

export const MultipleRepromptTransitionPage = connect(mapStateToProps)(MultipleRepromptTransitionPageNotConnected);
