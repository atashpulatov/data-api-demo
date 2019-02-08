import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import * as queryString from 'query-string';
import { AttributeSelectorWindow } from './attribute-selector/attribute-selector-window';
import { PopupTypeEnum } from './home/popup-type-enum';
import { NavigationTree } from './navigation/navigation-tree';
import './popup.css';

const Office = window.Office;

function officeInitialize() {
  Office.onReady()
    .then(() => {
      goReact();
    });
}

export class Popup extends Component {
  constructor(props) {
    super(props);
    const parsed = queryString.parse(this.props.location.search);

    this.state = {
      parsed,
    };
  }

  render() {
    const { popupType, ...propsToPass } = this.state.parsed;
    if (!popupType) {
      return (
        <AttributeSelectorWindow parsed={propsToPass} />
      );
    } else if (popupType === PopupTypeEnum.navigationTree) {
      return (
        <NavigationTree handlePrepare={(projectId, reportId) => {
          this.setState({
            parsed: {
              ...this.state.parsed,
              popupType: undefined,
              projectId,
              reportId
            }
          })
        }} parsed={propsToPass} />
      );
    }
  }
}

function goReact() {
  ReactDOM.render(
    <BrowserRouter>
      <Route path="/" component={Popup} />
    </BrowserRouter>,
    document.getElementById('popup')
  );
}

officeInitialize();
