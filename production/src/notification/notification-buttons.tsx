import React from 'react';

type NotificationButtonsType = { type: string; label: string; onClick: () => void };

interface NotificationButtonsProps {
  buttons: NotificationButtonsType[];
}

export const NotificationButtons: React.FC<NotificationButtonsProps> = ({ buttons }) =>
  buttons.map(button => (
    <button type='button' onClick={button.onClick} key={button.label}>
      {button.label}
    </button>
  ));

export const getNotificationButtons = (buttons: NotificationButtonsType[]): React.ReactNode => (
  <NotificationButtons buttons={buttons} />
);
