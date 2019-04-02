import React, {Component} from 'react';
import {notification, message} from 'antd';
import {connect} from 'react-redux';
import './Notifications.css';
import {withTranslation} from 'react-i18next';

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
  };

  displayNotification = () => {
    const {notificationType, title, content, t} = this.props;
    notification[notificationType]({
      message: t(title),
      description: t(content),
    });
  };

  displayMessage = () => {
    const {messageType, content, t} = this.props;
    message[messageType](t(content));
  };

  render() {
    return (
      <div>
      </div>
    );
  }
}

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

export const Notifications = connect(mapStateToProps)(withTranslation('notifications')(NotificationsWithoutRedux));
