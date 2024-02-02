import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { DataOverview } from '@mstr/connector-components';
import PropTypes from 'prop-types';
import { reduxStore } from '../../store';
import { refreshRequested, removeRequested } from '../../redux-reducer/operation-reducer/operation-actions';
import { restoreAllObjects } from '../../redux-reducer/object-reducer/object-actions';
import { restoreAllNotifications } from '../../redux-reducer/notification-reducer/notification-action-creators';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { ApplicationTypeEnum } from '../../office-constants';

import './overview-window.scss';

const OverviewWindowNotConnected = (props) => {
  const {
    objects, onRefresh, onDelete, onDuplicate
  } = props;

  useEffect(() => {
    // Get Message from Right side panel
    Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, (msg) => {
      const message = JSON.parse(msg.message);
      const { popupType } = message;

      if (popupType === PopupTypeEnum.importedDataOverview) {
        const { objects: objectsToSync, notifications: notificationsToSync } = message;

        reduxStore.dispatch(restoreAllObjects(objectsToSync));
        reduxStore.dispatch(restoreAllNotifications(notificationsToSync));
      }
    });
  }, []);

  return (
    <div className="data-overview-wrapper">
      <DataOverview
        loadedObjects={objects}
        applicationType={ApplicationTypeEnum.Excel}
        onRefresh={onRefresh}
        onDelete={onDelete}
        onDuplicate={onDuplicate} />
    </div>
  );
};

OverviewWindowNotConnected.propTypes = {
  onRefresh: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  objects: PropTypes.arrayOf(PropTypes.shape({})),
};

export const mapStateToProps = ({ objectReducer, notificationReducer }) => {
  const { objects } = objectReducer;
  const { notifications } = notificationReducer;

  return { objects, notifications };
};

export const mapActionsToProps = {
  refreshRequested, removeRequested, restoreAllObjects, restoreAllNotifications
};
export const OverviewWindow = connect(mapStateToProps, mapActionsToProps)(OverviewWindowNotConnected);
