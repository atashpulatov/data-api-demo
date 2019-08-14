import React from 'react';
import {Popover} from 'antd';

export class ButtonPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverVisible: false,
    };
  }

  componentWillUnmount = () => {
    this.refreshAllPopoverTimeout && clearTimeout(this.refreshAllPopoverTimeout);
  }

  showPopover = () => {
    this.refreshAllPopoverTimeout = setTimeout(() => this.setState({popoverVisible: true}), this.props.mouseEnterDelay * 1000);
    console.log('popover shown');
  }

  hidePopover = () => {
    this.refreshAllPopoverTimeout && clearTimeout(this.refreshAllPopoverTimeout);
    this.refreshAllPopoverTimeout = null;
    this.setState({popoverVisible: false});
  }

  render() {
    return (
      <Popover visible={this.state.popoverVisible} placement={this.props.placement} content={this.props.content} onMouseEnter={this.showPopover} onMouseLeave={this.hidePopover} onClick={this.hidePopover}>
        {this.props.children}
      </Popover>
    );
  }
}
