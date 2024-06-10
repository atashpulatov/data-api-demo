import React, { ReactElement } from 'react';
import { Tooltip } from '@mstr/rc';

import { SidePanelNotificationButton } from '../../redux-reducer/notification-reducer/notification-reducer-types';

export type SidePanaleNotificationButtonsProps = {
  buttons: [SidePanelNotificationButton];
};

export const SidePanelNotificationButtons = ({
  buttons,
}: SidePanaleNotificationButtonsProps): ReactElement => {
  console.log('buttons', buttons);
  return (
    <>
      {buttons.map((button: SidePanelNotificationButton) => (
        <Tooltip
          placement='top'
          content={button.tooltip}
          className='status-tooltip'
          key={button.label}
        >
          <button
            type='button'
            onClick={button.onClick}
            key={button.label}
            className={button.className}
          >
            <span>{button.label}</span>
          </button>
        </Tooltip>
      ))}
    </>
  );
};
