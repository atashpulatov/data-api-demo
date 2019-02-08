/* eslint-disable */
import React, { Component } from 'react';
import '../index.css';
import '../home/home.css';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { AttributeSelector } from '../attribute-selector/attribute-selector.jsx';
import { PopupButtons } from '../popup-buttons.jsx';
/* eslint-enable */

export class AttributeSelectorWindow extends Component {
    constructor(props) {
        super(props);
        debugger;
        this.state = {
            session: {
                USE_PROXY: false,
                url: this.props.parsed.envUrl,
                authToken: this.props.parsed.token,
                projectId: this.props.parsed.projectId,
            },
            reportId: this.props.parsed.reportId,
            triggerUpdate: false,
        };
    }

    handleOk = () => {
        this.setState({ triggerUpdate: true });
    }

    handleCancel = () => {
        const cancelObject = {
            command: selectorProperties.commandCancel,
        };
        Office.context.ui.messageParent(JSON.stringify(cancelObject));
    }

    onTriggerUpdate = (body) => {
        const updateObject = {
            command: selectorProperties.commandOnUpdate,
            body,
        };
        Office.context.ui.messageParent(JSON.stringify(updateObject));
    };

    render() {
        return (
            <div
                style={{ padding: '20px' }}>
                <AttributeSelector
                    session={this.state.session}
                    reportId={this.state.reportId}
                    triggerUpdate={this.state.triggerUpdate}
                    onTriggerUpdate={this.onTriggerUpdate}
                />
                <PopupButtons
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel} />
            </div >
        );
    }
}
