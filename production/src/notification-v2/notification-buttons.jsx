import React from 'react';
import { Button } from '@mstr/rc';

export const NotificationButtons = ({ buttons }) => buttons.map(
  (button) => (
    <Button
      key={button.title}
      title={button.title}
      type={button.type}
      onClick={button.onClick}>{button.label}
    </Button>
  )
);

export const getNotificationButtons = (buttons) => <NotificationButtons buttons={buttons} />;
