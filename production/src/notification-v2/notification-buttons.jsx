import React from 'react';

export const NotificationButtons = ({ buttons }) => buttons.map(
  (button) => (
    <button
      type="button"
      onClick={button.onClick}
      key={button.label}>
      {button.label}
    </button>
  )
);

export const getNotificationButtons = (buttons) => <NotificationButtons buttons={buttons} />;
