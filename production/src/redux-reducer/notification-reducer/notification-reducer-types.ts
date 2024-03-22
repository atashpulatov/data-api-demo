import { ObjectNotificationTypes } from '@mstr/connector-components';

import { OperationTypes } from '../../operation/operation-type-names';

// TODO: check and refactor this type if needed.
// example notification from the console:
// {
//     'objectWorkingId': 1710849226424,
//     'title': 'Refreshing',
//     'type': 'progress',
//     'operationType': 'REFRESH_OPERATION',
//     'isIndeterminate': false,
//     'isFetchingComplete': true,
// };
export interface Notification {
  objectWorkingId: number; // number?
  title: string;
  type: ObjectNotificationTypes;
  operationType: OperationTypes;
  percentage: number;
  details: string;
  callback?: () => void;
  dismissNotification: () => void;
}
