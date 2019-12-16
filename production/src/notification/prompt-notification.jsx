import React from 'react';
import { Notification } from './common-component/notification';

export const OK = 'ok';
export const CANCEL = 'cancel';

export function showNotification(buttons) {
  let notificationWithDefaultIcon = null;
  Notification.newInstance({ maxCount: 3 }, (n) => { notificationWithDefaultIcon = n; }); // Change how we return the instance
  const notificationConfig = {
    content:(
      <div>
        <div>The columns in this table changed. If you continue with the refresh those changes will be lost. Do you want to continue?</div>
      </div>),
    buttons,
    duration: null,
    key: 1,
    onClose() {
      console.log('simple close');
    },

  };
  notificationWithDefaultIcon.warning(notificationConfig);
  return notificationWithDefaultIcon;
}

export default function PromptNotification(strings) {
  return new Promise((resolve, reject) => {
    showNotification([{
      label: 'Refresh away!',
      type: 'default',
      action: () => {
        resolve(OK);
      }
    },
    {
      label: 'Cancel',
      type: 'default',
      action: () => {
        // removeNotice
        reject(CANCEL);
      }
    }]);
  });
}
