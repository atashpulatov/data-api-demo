import React, { ReactElement } from "react";

export interface NotificationButton {
  label: string;
  onClick: () => void;
}
export type NotificationButtonsProps = {
  buttons: NotificationButton[];
};

export const OverviewGlobalNotificationButtons = (
  props: NotificationButtonsProps,
): ReactElement => {
  const { buttons } = props;
  return (
    <>
      {buttons.map(({ label, onClick }) => (
        <button type="button" onClick={onClick} key={label}>
          {label}
        </button>
      ))}
    </>
  );
};
