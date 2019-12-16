import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Animate from 'rc-animate';
import classnames from 'classnames';
import { SuccessIcon } from './icon/success.jsx.js.js.js';
import { ConflictIcon } from './icon/conflict.jsx.js.js.js';
import { InfoIcon } from './icon/info.jsx.js.js.js';
import { createNoticeNodes, getTransitionName, getUuid } from './notification-helper';
import { CloseTimer } from './close-timer.js.js.js.js';
import './styles/notification.css';

export class Notification extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    transitionName: PropTypes.string,
    animation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    style: PropTypes.object,
    maxCount: PropTypes.number,
    closeIcon: PropTypes.node,
  };

  static defaultProps = {
    prefixCls: 'mstr-notification',
    animation: 'fade',
    style: { top: 65,  },
  };

  state = { notices: [],  };

  add = (notice) => {
    const key = notice.key = notice.key || getUuid();
    const { maxCount } = this.props;
    notice.closeTimer = new CloseTimer();
    this.setState((previousState) => this.addNotice(previousState, key, notice, maxCount));
  }

  remove = (key) => {
    this.setState((previousState) => ({notices: previousState.notices.filter((notice) => notice.key !== key),}));
  }

  addNotice(previousState, key, notice, maxCount) {
    const { notices } = previousState;
    const noticeIndex = notices.map((v) => v.key).indexOf(key);
    const updatedNotices = notices.concat();
    if (noticeIndex !== -1) {
      updatedNotices.splice(noticeIndex, 1, notice);
    } else {
      if (maxCount && notices.length >= maxCount) {
        // XXX, use key of first item to update new added (let React to move exsiting
        // instead of remove and mount). Same key was used before for both a) external
        // manual control and b) internal react 'key' prop , which is not that good.
        notice.updateKey = updatedNotices[0].updateKey || updatedNotices[0].key;
        updatedNotices.shift();
      }
      updatedNotices.push(notice);
    }
    return { notices: updatedNotices,  };
  }

  render() {
    const { props } = this;
    const { notices } = this.state;
    const noticeNodes = createNoticeNodes(notices, props, this.remove);
    const className = {
      [props.prefixCls]: 1,
      [props.className]: !!props.className,
    };
    return (
      <div className={classnames(className)} style={props.style}>
        <Animate transitionName={getTransitionName(props)}>{noticeNodes}</Animate>
      </div>
    );
  }

  static newInstance = (properties, callback) => {
    const { getContainer, ...props } = properties || {};
    const div = document.createElement('div');
    Notification.appendNotificationContainer(getContainer, div);
    const notificationState = { isCalled: false };
    const ref = Notification.createRef(notificationState, div, callback);
    ReactDOM.render(<Notification {...props} ref={ref} />, div);
  };

  static appendNotificationContainer(getContainer, div) {
    if (getContainer) {
      const root = getContainer();
      root.appendChild(div);
    } else {
      document.body.appendChild(div);
    }
  }

  static getCallbackMethods = (notification) => ({
    notice(noticeProps) {
      notification.add(noticeProps);
    },
    removeNotice(key) {
      notification.remove(key);
    },
    info(noticeProps) {
      noticeProps.className = 'mstr-notification-info';
      noticeProps.icon = <InfoIcon />;
      notification.add(noticeProps);
    },
    warning(noticeProps) {
      noticeProps.className = 'mstr-notification-warning';
      noticeProps.icon = <ConflictIcon />;
      notification.add(noticeProps);
    },
    success(noticeProps) {
      noticeProps.className = 'mstr-notification-success';
      noticeProps.icon = <SuccessIcon />;
      notification.add(noticeProps);
    },
  })

  static createRef = (notificationState, div, callback) => (notification) => {
    if (notificationState.isCalled) return;
    notificationState.isCalled = true;
    const callbackMethods = Notification.getCallbackMethods(notification);
    callback({
      ...callbackMethods,
      component: notification,
      destroy() {
        ReactDOM.unmountComponentAtNode(div);
        div.parentNode.removeChild(div);
      },
    });
  };
}
