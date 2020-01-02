import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { NoticeContent } from './notice-content';
import { NoticeButtons } from './notice-buttons';
import { NoticeCloseButton } from './notice-close-button';

export class Notice extends Component {
  static propTypes = {
    duration: PropTypes.number,
    onClose: PropTypes.func,
    children: PropTypes.any,
    update: PropTypes.bool,
    closeIcon: PropTypes.node,
    closeTimer: PropTypes.object,
    expandable: PropTypes.exact({
      showMoreLabel: PropTypes.string,
      showLessLabel: PropTypes.string,
      content: PropTypes.any,
    }),
  };

  static defaultProps = {
    onEnd() { },
    onClose() { },
    duration: 1.5,
  };

  state = {
    focus: true,
    mouseOver: false,
  }

  onMouseEnter = () => {
    this.setState({ mouseOver: true });
    this.props.closeTimer.clear();
  }

  onFocus = () => {
    this.setState({ focus: true });
    this.props.closeTimer.clear();
  }

  onMouseLeave = () => {
    const { closeTimer, duration, onClose } = this.props;
    this.setState({ mouseOver: false });
    !this.state.focus && closeTimer.start(duration, onClose);
  }

  onBlur = () => {
    const { closeTimer, duration, onClose } = this.props;
    this.setState({ focus: false });
    !this.state.mouseOver && closeTimer.start(duration, onClose);
  }

  restartTimer = () => {
    const { closeTimer, duration, onClose } = this.props;
    closeTimer.restart(duration, onClose);
  }

  componentDidMount() {
    const { closeTimer, duration, onClose } = this.props;
    closeTimer.start(duration, onClose);
    this.setState({ focusCallback: document.activeElement });
    this.notificationRef && this.notificationRef.focus();
  }

  componentDidUpdate(prevProps) {
    const { closeTimer, duration, onClose } = this.props;
    if (this.props.duration !== prevProps.duration
      || this.props.update) {
      closeTimer.restart(duration, onClose);
    }
  }

  componentWillUnmount() {
    this.props.closeTimer.clear();
    this.state.focusCallback.focus();
  }

  onCloseClicked = (event) => {
    if (event) {
      event.stopPropagation();
    }
    this.onMouseEnter();
    this.props.onClose();
  }

  getClassName(componentClass, props) {
    return classNames({
      [`${componentClass}`]: 1,
      [props.className]: !!props.className,
    });
  }

  assignNotification = (notification) => {
    this.notificationRef = notification;
  };

  render() {
    const { props } = this;
    const componentClass = `${props.prefixCls}-notice`;
    const className = this.getClassName(componentClass, props);
    return (
      <dialog
        open
        role="alert"
        tabIndex="0"
        className={className}
        style={props.style}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onClick={props.onClick}
      >
        <NoticeContent props={props} componentClass={componentClass} />
        {props.buttons
          && <NoticeButtons buttons={props.buttons} componentClass={componentClass} />}
        {props.closable
          && <NoticeCloseButton closeIcon={props.closeIcon} componentClass={componentClass} onCloseClicked={this.onCloseClicked} />}
      </dialog>
    );
  }
}
