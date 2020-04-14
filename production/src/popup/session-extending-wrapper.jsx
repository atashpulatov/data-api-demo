import React from 'react';
import PropTypes from 'prop-types';
import { sessionHelper } from '../storage/session-helper';

export const SessionExtendingWrapper = ({ children, id, onSessionExpire }) => {
  const { installSessionProlongingHandler } = sessionHelper;
  const prolongSession = installSessionProlongingHandler(onSessionExpire);
  return (
    <div
      id={id}
      onClick={prolongSession}
      onKeyDown={prolongSession}
      role="button"
      tabIndex="0"
    >
      {children}
    </div>
  );
};

SessionExtendingWrapper.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  onSessionExpire: PropTypes.func,
};
