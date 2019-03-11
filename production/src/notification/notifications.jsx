import React, {Component} from 'react';
import {notification, message} from 'antd';
import {connect} from 'react-redux';
import './Notifications.css';

export class NotificationsWithoutRedux extends Component {
  constructor(props) {
    super(props);
    message.config({
      duration: 5,
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
    notification[notificationType]({
      message: title,
      description: content,
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
