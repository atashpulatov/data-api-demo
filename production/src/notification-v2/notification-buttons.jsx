import React from 'react';

export const NotificationButtons = ({ buttons }) => buttons.map(
  (button) => (
    <button
      type="button"
      onClick={button.onClick}
      title={button.title}
      key={button.title}>
      {button.label}
    </button>
  )
);

export const getNotificationButtons = (buttons) => <NotificationButtons buttons={buttons} />;
