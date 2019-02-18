import React, {Component} from 'react';
import {AttributeSelectorWindow} from '../attribute-selector/attribute-selector-window';
import {PopupTypeEnum} from '../home/popup-type-enum';
import {NavigationTree} from '../navigation/navigation-tree';
import * as queryString from 'query-string';

export class Popup extends Component {
  constructor(props) {
    super(props);
    const parsed = queryString.parse(this.props.location.search);
    this.state = {
      parsed,
    };
  }
  handlePrepare = (projectId, reportId, reportSubtype) => {
    this.setState({
      parsed: {
        ...this.state.parsed,
        popupType: undefined,
        projectId,
        reportId,
        reportSubtype,
      },
    });
  };
  render() {
    const {popupType, ...propsToPass} = this.state.parsed;
    if (!popupType) {
      return (<AttributeSelectorWindow parsed={propsToPass} />);
    } else if (popupType === PopupTypeEnum.navigationTree) {
      return (<NavigationTree handlePrepare={this.handlePrepare} parsed={propsToPass} />);
    }
  }
}
