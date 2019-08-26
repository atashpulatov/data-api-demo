import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {toggleRenderSettingsFlag} from '../office/office-actions';

export class SettingsComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        SETTINGS WILL BE HERE
      </div>
    );
  }
}


