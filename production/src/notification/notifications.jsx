import React, {Component} from 'react';
import {notification, message, Icon, Button} from 'antd';
import {connect} from 'react-redux';
import './Notifications.css';
import {withTranslation} from 'react-i18next';

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
  };

  displayNotification = () => {
    const {notificationType, title, content, t} = this.props;
    let icon;
    const key = `open${Date.now()}`;
    let btn = <Button type="primary" size="small" onClick={() => notification.close(key)} >{t('OK')}</Button>;
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
        notification.config({
          duration: 5,
        });
        btn = null;
        break;
      case 'success':
        icon = <Icon type="check-circle" theme="filled" style={{color: '#52c41a'}} />;
        notification.config({
          duration: 2,
        });
        btn = null;
        break;
      default:
        break;
    }
    notification.open({
      message: t(title),
      description: this.translateContent(content, t),
      icon,
      btn: btn,
      key,
    });
  };

  translateContent = (content, t) => content.includes('Excel returned error') ? `${t('Excel returned error')}: ${content.split(':')[1]}` : t(content);

  displayMessage = () => {
    const {messageType, content, t} = this.props;
    message[messageType](this.translateContent(content, t));
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

NotificationsWithoutRedux.defaultProps = {
  t: (text) => text,
};

export const Notifications = connect(mapStateToProps)(withTranslation('common')(NotificationsWithoutRedux));
