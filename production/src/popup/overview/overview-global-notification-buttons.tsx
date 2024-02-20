import React, { ReactElement } from 'react';

export interface NotificationButton {
  label: string;
  onClick: () => void;
}
export type NotificationButtonsProps = {
  buttons: [NotificationButton];
};

export const OverviewGlobalNotificationButtons = (props: NotificationButtonsProps): ReactElement => {
  const { buttons } = props;
  return (
    <>
      {buttons.map((button: NotificationButton) => (
        <button type="button" onClick={button.onClick} key={button.label}>
          {button.label}
        </button>
      ))}
    </>
  );
};
