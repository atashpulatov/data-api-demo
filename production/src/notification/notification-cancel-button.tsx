import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { OperationTypes } from '../operation/operation-type-names';
import { dismissSingleNotification } from '../redux-reducer/notification-reducer/notification-action-creators';
import { removeObject } from '../redux-reducer/object-reducer/object-actions';
import { cancelOperationByOperationId } from '../redux-reducer/operation-reducer/operation-actions';

type NotificationCancelButtonProps = {
  objectWorkingId: number;
  operationType: OperationTypes;
  operationId: string;
};

export const NotificationCancelButton: React.FC<NotificationCancelButtonProps> = ({
  objectWorkingId,
  operationType,
  operationId,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onClick = (): void => {
    if (operationType === OperationTypes.IMPORT_OPERATION) {
      // @ts-expect-error
      dispatch(removeObject(objectWorkingId));
    }
    // @ts-expect-error
    dispatch(cancelOperationByOperationId(operationId));
    // @ts-expect-error
    dispatch(dismissSingleNotification(objectWorkingId));
  };

  return (
    <button type='button' onClick={onClick} key={t('Cancel')}>
      {t('Cancel')}
    </button>
  );
};

export const getNotificationCancelButton = (
  objectWorkingId: number,
  operationType: OperationTypes,
  operationId: string
): React.ReactNode => (
  <NotificationCancelButton
    objectWorkingId={objectWorkingId}
    operationType={operationType}
    operationId={operationId}
  />
);
