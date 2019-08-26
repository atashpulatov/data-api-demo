import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';

export class _SettingComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {t} = this.props;
    return (<div>
      {t('SETTINGS WILL BE HERE')}
      <button >{t('BACK')}</button>
    </div>);
  }
}
