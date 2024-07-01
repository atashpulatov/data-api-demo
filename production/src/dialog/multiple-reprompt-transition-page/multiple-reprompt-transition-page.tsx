import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ObjectWindowTitle, Popup } from '@mstr/connector-components';
import { Spinner } from '@mstr/rc';

import officeReducerHelper from '../../office/store/office-reducer-helper';
import overviewHelper from '../overview/overview-helper';

import { MultipleRepromptTransitionPageTypes } from './multiple-reprompt-transition-page-types';

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
export const MultipleRepromptTransitionPageNotConnected: FC<
  MultipleRepromptTransitionPageTypes
> = ({ nextObjectBindId, nextObjectIndex, total, popupData, editedObject }) => {
  const nextObject: any =
    officeReducerHelper.getObjectFromObjectReducerByBindId(nextObjectBindId) || {};

  // retrieve object name based on next object type. reports vs dossiers have different name properties
  const getNextObjectName = (): string => {
    if (editedObject?.pageByData) {
      return editedObject.definition?.sourceName;
    }

    if (editedObject?.name) {
      return editedObject?.name;
    }

    return nextObject.definition?.sourceName;
  };

  const [t] = useTranslation('common', { i18n });
  const [dialogPopup, setDialogPopup] = React.useState(null);
  useEffect(() => {
    if (popupData) {
      overviewHelper.setRangeTakenPopup({
        objectWorkingIds: [popupData.objectWorkingId],
        setDialogPopup,
      });
    } else {
      setDialogPopup(null);
    }
  }, [popupData]);

  return (
    <div className='multiple-reprompt-transition-page'>
      <ObjectWindowTitle
        objectType='' // not needed since multiple reprompt title doesn't show type
        objectName={getNextObjectName()}
        isReprompt
        isEdit={false}
        index={nextObjectIndex}
        total={total}
      />
      <div className='loading-section'>
        <Spinner className='loading-spinner' type='large'>
          {t('Loading...')}
        </Spinner>
      </div>
      {!!dialogPopup && (
        <div className='standalone-popup'>
          <Popup {...dialogPopup} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: {
  officeReducer: any;
  repromptsQueueReducer: {
    repromptsQueue: { bindId: string }[];
    index: number;
    total: number;
  };
  popupReducer: any;
}): MultipleRepromptTransitionPageTypes => {
  const { repromptsQueueReducer, officeReducer, popupReducer } = state;
  const { total, repromptsQueue } = repromptsQueueReducer;
  return {
    nextObjectBindId: repromptsQueue[0]?.bindId || '',
    nextObjectIndex: total - repromptsQueue.length,
    total,
    popupData: officeReducer.popupData,
    editedObject: popupReducer.editedObject,
  };
};

export const MultipleRepromptTransitionPage = connect(mapStateToProps)(
  MultipleRepromptTransitionPageNotConnected
);
