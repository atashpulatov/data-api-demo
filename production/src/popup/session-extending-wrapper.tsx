import React from 'react';

import { sessionHelper } from '../storage/session-helper';

interface SessionExtendingWrapperProps {
  children: React.ReactNode;
  id: string;
  onSessionExpire?: () => void;
}

export const SessionExtendingWrapper: React.FC<SessionExtendingWrapperProps> = ({
  children,
  id,
  onSessionExpire,
}) => {
  const { installSessionProlongingHandler } = sessionHelper;
  const prolongSession = installSessionProlongingHandler(onSessionExpire);
  return (
    <div id={id} onClick={prolongSession} onKeyDown={prolongSession} role='none'>
      {children}
    </div>
  );
};
