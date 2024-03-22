// TODO: refactor this type.
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
  type: string;
  title: string;
  details: string;
  percentage: number;
  callback?: () => void;
  dismissNotification: () => void;
}
