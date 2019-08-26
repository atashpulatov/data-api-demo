import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {toggleIsSettingsFlag, toggleRenderSettingsFlag} from '../office/office-actions';

export class _SettingsComponent extends Component {
  constructor(props) {
    super(props);
  }

  closeSettingsComponent = () => {
    this.props.toggleIsSettingsFlag(!this.props.isSettings);
    this.props.toggleRenderSettingsFlag(!this.props.shouldRenderSettings);
  }

  render() {
    const {t} = this.props;
    return (
      <div>
        {t('SETTINGS WILL BE HERE')}
        <button onClick={this.closeSettingsComponent}>{t('BACK')}</button>
      </div>
    );
  }
}

_SettingsComponent.defaultProps = {
  t: (text) => text,
};

function mapStateToProps({officeReducer}) {
  const {isSettings, shouldRenderSettings} = officeReducer;
  return {isSettings, shouldRenderSettings};
}

const mapDispatchToProps = {
  toggleIsSettingsFlag,
  toggleRenderSettingsFlag,
};

export const SettingsComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslation('common')(_SettingsComponent));
