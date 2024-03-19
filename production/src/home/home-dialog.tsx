import React from 'react';

// TODO replace with mstr-icon
// @ts-expect-error
import { ReactComponent as InfoIcon } from './assets/icon-info.svg';

interface HomeDialogProps {
  show: boolean;
  text: string;
}

export const HomeDialog: React.FC<HomeDialogProps> = ({ show = false, text }) =>
  show ? (
    <div className='dialog-container'>
      <dialog open>
        <InfoIcon />
        <span>{text}</span>
      </dialog>
    </div>
  ) : null;
