import React, { Component } from 'react';
import { notification, message } from 'antd';
import { connect } from 'react-redux';

export class NotificationsWithoutRedux extends Component {

    componentDidUpdate = () => {
        if (this.props.currentObject === 'message') {
            this.displayMessage();
        }
        if (this.props.currentObject === 'notification') {
            this.displayNotification();
        }
    }

    displayNotification = () => {
        const { notificationType, title, content } = this.props;
        notification[notificationType]({
            message: title,
            description: content,
        });
    }

    displayMessage = () => {
        const { messageType, content } = this.props;
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
