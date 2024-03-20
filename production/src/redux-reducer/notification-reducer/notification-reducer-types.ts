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
interface Notification {
  type: string;
  title: string;
  details: string;
  percentage: number;
  dismissNotification: () => void;
}

export type Notifications = Notification[];
