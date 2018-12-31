/* eslint-disable */
import React, { Component } from 'react';
import '../index.css';
import '../home/home.css';
import { selectorProperties } from '../attribute-selector/selector-properties';
import { PopupButtons } from '../popup-buttons.jsx';
import 'mstr-react-library/src/css/mstr-react.css';
import { FolderBrowser } from 'mstr-react-library';
/* eslint-enable */

export class NavigationTree extends Component {
    constructor(props) {
        super(props);

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

    onTriggerUpdate = (body) => {
        const updateObject = {
            command: selectorProperties.commandOnUpdate,
            body,
        };
        Office.context.ui.messageParent(JSON.stringify(updateObject));
    };

    handleOk = () => {
        const okObject = {
            command: selectorProperties.commandOk,
            chosenObject: this.state.chosenObjectId,
        };
        Office.context.ui.messageParent(JSON.stringify(okObject));
    }

    handleCancel = () => {
        const cancelObject = {
            command: selectorProperties.commandCancel,
        };
        Office.context.ui.messageParent(JSON.stringify(cancelObject));
    }

    // TODO: temporary solution
    onObjectChosen = (id) => {
        this.setState({
            chosenObjectId: id,
        })
    }

    render() {
        return (
            <div
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <FolderBrowser
                    session={this.state.session}
                    triggerUpdate={this.state.triggerUpdate}
                    onTriggerUpdate={this.onTriggerUpdate}
                    onObjectChosen={this.onObjectChosen}
                />
                <PopupButtons
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                />
            </div >
        );
    }
}
