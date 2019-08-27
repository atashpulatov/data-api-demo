import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {toggleIsSettingsFlag, toggleRenderSettingsFlag} from '../office/office-actions';
import {Icon} from 'antd';
import {Button} from 'antd';
import './settings.css';


export class _SettingsComponent extends Component {


  closeSettingsComponent = () => {
    this.props.toggleIsSettingsFlag(!this.props.isSettings);
    this.props.toggleRenderSettingsFlag(!this.props.shouldRenderSettings);
  }

  render() {
    const {t} = this.props;
    return (
      <div>
        <div className={'settings-bar'}>
          <div className={'back-wrapper'}><Icon type="left" onClick={this.closeSettingsComponent} /></div>
          <div>{t('Settings')}</div>
        </div>
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
