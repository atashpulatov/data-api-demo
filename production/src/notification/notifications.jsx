import React, {Component} from 'react';
import {notification, message, Icon, Button} from 'antd';
import {connect} from 'react-redux';
import './Notifications.css';

export class NotificationsWithoutRedux extends Component {
  constructor(props) {
    super(props);
    message.config({
      duration: 5,
      maxCount: 3,
    });
    notification.config({
      duration: 0,
    });
  }
  componentDidUpdate = () => {
    if (this.props.currentObject === 'message') {
      this.displayMessage();
    }
    if (this.props.currentObject === 'notification') {
      this.displayNotification();
    }
  }

  displayNotification = () => {
    const {notificationType, title, content} = this.props;
    let icon;
    const key = `open${Date.now()}`;
    const btn = <Button type="primary" size="small" onClick={() => notification.close(key)} >OK</Button>;
    notification.config({
      duration: 0,
    });
    switch (notificationType) {
      case 'warning':
        icon = <Icon type="warning" theme="filled" style={{color: '#faad14'}} />;
        break;
      case 'error':
        icon = <Icon type="close-circle" theme="filled" style={{color: '#f5222d'}} />;
        break;
      case 'info':
        icon = <Icon type="info-circle" theme="filled" style={{color: '#1890ff'}} />;
        break;
      case 'success':
        icon = <Icon type="check-circle" theme="filled" style={{color: '#52c41a'}} />;
        notification.config({
          duration: 5,
        });
        break;
      default:
        break;
    }
    notification.open({
      message: title,
      description: content,
      icon,
      btn: notificationType !== 'success' ? btn : null,
      key,
    });
  }

  displayMessage = () => {
    const {messageType, content} = this.props;
    message[messageType](content);
  }

  render() {
    return (
      <div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    timeStamp: state.notificationReducer.timeStamp,
    title: state.notificationReducer.title,
    content: state.notificationReducer.content,
    messageType: state.notificationReducer.messageType,
    notificationType: state.notificationReducer.notificationType,
    currentObject: state.notificationReducer.currentObject,
  };
};

export const Notifications = new connect(mapStateToProps)(NotificationsWithoutRedux);
