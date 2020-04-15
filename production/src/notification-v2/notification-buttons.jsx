import React from 'react';
import { Button } from '@mstr/rc';

export const NotificationButtons = ({ buttons }) => buttons.map(
  (button) => <Button title={button.title} type={button.type} onClick={button.onClick}>{button.label}</Button>
);

export const getNotificationButtons = (buttons) => <NotificationButtons buttons={buttons} />;
