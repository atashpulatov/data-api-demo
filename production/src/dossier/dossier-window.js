import React, { Component } from 'react';
import { PopupButtons } from '../popup/popup-buttons.jsx';
import { selectorProperties } from '../attribute-selector/selector-properties';

const Office = window.Office;

export default class DossierWindow extends Component {

    handleCancel = () => {
        const cancelObject = {
            command: selectorProperties.commandCancel,
        };
        Office.context.ui.messageParent(JSON.stringify(cancelObject));
    };

    render() {
        const { dossierId, dossierName, handleBack } = this.props;
        return <div>
            {/* {`${t('Importing')} ${displayName}`}*/}
            <h1 title={dossierName} className="ant-col folder-browser-title">{`${'Importing'} ${dossierName} with id = ${dossierId}`}</h1>
            <p>DossierWindowComponent</p>
            <PopupButtons
                handleBack={handleBack}
                handleCancel={this.handleCancel}
            />
        </div>
    }
}