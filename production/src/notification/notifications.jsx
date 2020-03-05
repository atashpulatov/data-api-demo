import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  notification, message, Icon, Button,
} from 'antd';
import { connect } from 'react-redux';
import './Notifications.css';
import { withTranslation } from 'react-i18next';
import CustomNotification from './custom-notification';

export class NotificationsNotConnected extends Component {
  constructor(props) {
    super(props);
    message.config({
      duration: 5,
      maxCount: 3,
    });
    notification.config({ duration: 0, });
  }

  componentDidUpdate = () => {
    const { currentObject } = this.props;
    if (currentObject === 'message') {
      this.displayMessage();
    }
    if (currentObject === 'notification') {
      this.displayNotification();
    }
  };

  displayNotification = () => {
    const {
      notificationType, title, content, t, details, translated, onConfirm,
    } = this.props;
    let icon;
    const key = `open${Date.now()}`;

    let btn = (
      <Button
        type="primary"
        size="small"
        onClick={() => {
          notification.close(key);
          onConfirm && onConfirm();
        }}
      >
        {t('OK')}
      </Button>
    );

    notification.config({ duration: 0, });

    switch (notificationType) {
    case 'warning':
      icon = <Icon type="warning" theme="filled" style={{ color: '#faad14' }} />;
      break;
    case 'error':
      icon = <Icon type="close-circle" theme="filled" style={{ color: '#f5222d' }} />;
      break;
    case 'info':
      icon = <Icon type="info-circle" theme="filled" style={{ color: '#1890ff' }} />;
      notification.config({ duration: 5, });
      btn = null;
      break;
    case 'success':
      icon = <Icon type="check-circle" theme="filled" style={{ color: '#52c41a' }} />;
      notification.config({ duration: 2, });
      btn = null;
      break;
    default:
      break;
    }

    const translatedContent = !translated ? this.translateContent(content, t) : content;
    notification.open({
      message: t(title),
      description: <CustomNotification details={details} t={t} translatedContent={translatedContent} />,
      icon,
      btn,
      key,
      className: 'error-notification',
    });
  };

  translateContent = (content, t) => (content.includes('Excel returned error') ? `${t('Excel returned error')}: ${content.split(': ')[1]}` : t(content));

  displayMessage = () => {
    const { messageType, content, t } = this.props;
    message[messageType](this.translateContent(content, t));
  };

  render() {
    return (
      <div />
    );
  }
}

NotificationsNotConnected.propTypes = {
  notificationType: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  t: PropTypes.func,
  details: PropTypes.string,
  translated : PropTypes.bool,
  messageType : PropTypes.string,
  currentObject : PropTypes.string,
  onConfirm:PropTypes.func,
};


const mapStateToProps = (state) => ({
  timeStamp: state.notificationReducer.timeStamp,
  title: state.notificationReducer.title,
  content: state.notificationReducer.content,
  messageType: state.notificationReducer.messageType,
  notificationType: state.notificationReducer.notificationType,
  currentObject: state.notificationReducer.currentObject,
  details: state.notificationReducer.details,
  translated: state.notificationReducer.translated,
  onConfirm: state.notificationReducer.onConfirm,
});

NotificationsNotConnected.defaultProps = { t: (text) => text, };

export const Notifications = connect(mapStateToProps)(withTranslation('common')(NotificationsNotConnected));
