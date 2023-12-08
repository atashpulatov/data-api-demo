import React, { FC } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Empty } from '@mstr/rc';
import i18n from '../../i18n';
import { MultipleRepromptTransitionPageTypes } from './multiple-reprompt-transition-page-types';
import officeReducerHelper from '../../office/store/office-reducer-helper';
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
  nextObjectWorkingId,
  nextObjectIndex,
  total
}) => {
  const [t] = useTranslation('common', { i18n });

  const nextObject = officeReducerHelper.getObjectFromObjectReducerByObjectWorkingId(nextObjectWorkingId) || {};
  const { name: nextObjectName = '' } = JSON.parse(JSON.stringify(nextObject)); // deep copy via JSON
  const pageTitle = `${t('Reprompt')} ${t('{{index}} of {{total}}', { index: nextObjectIndex, total })} > ${nextObjectName}`;

  return (
    <div className="multiple-reprompt-transition-page">
      <div className="title-bar">
        <span className="title">{pageTitle}</span>
      </div>
      <div className="loading-section">
        <Empty isLoading />
      </div>
    </div>
  );
};

const mapStateToProps = (state: {
  repromptsQueueReducer: {
    repromptsQueue: { objectWorkingId: number }[];
    index: number;
    total: number;
  }
}) => {
  const { repromptsQueueReducer } = state;

  return {
    nextObjectWorkingId: repromptsQueueReducer.repromptsQueue[0]?.objectWorkingId || -1,
    // + 1 since the next obj has not been processed yet, so index is behind 1
    nextObjectIndex: repromptsQueueReducer.index + 1,
    total: repromptsQueueReducer.total,
  };
};

export const MultipleRepromptTransitionPage = connect(mapStateToProps)(MultipleRepromptTransitionPageNotConnected);
