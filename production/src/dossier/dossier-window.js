import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { PopupButtons } from '../popup/popup-buttons.jsx';
import { selectorProperties } from '../attribute-selector/selector-properties';

const Office = window.Office;

class _DossierWindow extends Component {

    handleCancel = () => {
        const cancelObject = {
            command: selectorProperties.commandCancel,
        };
        Office.context.ui.messageParent(JSON.stringify(cancelObject));
    };

    render() {
        const { dossierId, dossierName, handleBack, t } = this.props;
        return <div>
            <h1 title={dossierName} className="ant-col folder-browser-title">{`${t('Importing')} ${dossierName} with id = ${dossierId}`}</h1>
            <p>DossierWindowComponent</p>
            <PopupButtons
                handleBack={handleBack}
                handleCancel={this.handleCancel}
            />
        </div>
    }
}

_DossierWindow.defaultProps = {
    t: (text) => text,
};

export const DossierWindow = connect()(withTranslation('common')(_DossierWindow));  