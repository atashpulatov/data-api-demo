import React, { useEffect, useState } from 'react';
import { Popover } from 'antd';
import PropTypes from 'prop-types';

export const ButtonPopover = (props) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverTimeoutId, setPopoverTimeoutId] = useState(null);

  useEffect(() => function cleanup() {
    clearTimeout(popoverTimeoutId);
  }, [popoverTimeoutId]);

  const showPopover = () => {
    const { mouseEnterDelay } = props;
    setPopoverTimeoutId(setTimeout(() => setPopoverVisible(true), mouseEnterDelay * 1000));
  };

  const hidePopover = () => {
    clearTimeout(popoverTimeoutId);
    setPopoverVisible(false);
  };

  const { placement, content, children } = props;

  return (
    <Popover
      visible={popoverVisible}
      placement={placement}
      content={content}
      onMouseEnter={() => showPopover()}
      onMouseLeave={() => hidePopover()}
      onClick={() => hidePopover()}>
      {children}
    </Popover>
  );
};

ButtonPopover.propTypes = {
  mouseEnterDelay: PropTypes.number,
  placement: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
};
