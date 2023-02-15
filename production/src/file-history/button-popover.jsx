import React from 'react';
import { Popover } from 'antd';
import PropTypes from 'prop-types';

export class ButtonPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = { popoverVisible: false, };
  }

  componentWillUnmount = () => {
    clearTimeout(this.popoverTimeoutId);
  };

  showPopover = () => {
    const { mouseEnterDelay } = this.props;
    this.popoverTimeoutId = setTimeout(() => this.setState({ popoverVisible: true }), mouseEnterDelay * 1000);
  };

  hidePopover = () => {
    clearTimeout(this.popoverTimeoutId);
    this.setState({ popoverVisible: false });
  };

  render() {
    const { placement, content, children } = this.props;
    const { popoverVisible } = this.state;
    return (
      <Popover
        visible={popoverVisible}
        placement={placement}
        content={content}
        onMouseEnter={this.showPopover}
        onMouseLeave={this.hidePopover}
        onClick={this.hidePopover}>
        {children}
      </Popover>
    );
  }
}

ButtonPopover.propTypes = {
  mouseEnterDelay: PropTypes.number,
  placement: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
};
