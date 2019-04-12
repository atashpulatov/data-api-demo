import React, {Component} from 'react';
import {notification, message, Icon, Button} from 'antd';
import {connect} from 'react-redux';
import './Notifications.css';

export class NotificationsWithoutRedux extends Component {
  constructor(props) {
    super(props);
    message.config({
      duration: 5,
      maxCount: 1,
    });
    notification.config({
      duration: 0,
      maxCount: 1,
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
    switch (notificationType) {
      case 'warning':
        icon = <Icon type="exclamation-circle" theme="filled" style={{color: '#faad14'}} />;
        break;
      case 'error':
        icon = <Icon type="close-circle" theme="filled" style={{color: '#f5222d'}} />;
        break;
      case 'info':
        icon = <Icon type="info-circle" theme="filled" style={{color: '#1890ff'}} />;
        break;
      case 'success':
        icon = <Icon type="check-circle" theme="filled" style={{color: '#52c41a'}} />;
        break;
      default:
        break;
    }
    notification.open({
      message: title,
      description: content,
      icon,
      btn,
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
