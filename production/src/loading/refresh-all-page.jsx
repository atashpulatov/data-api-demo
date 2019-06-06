import React, {Component} from 'react';
import {connect} from 'react-redux';
import {LoadingText} from 'mstr-react-library';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {Button, Popover} from 'antd';
import {MSTRIcon} from 'mstr-react-library';
import warningIcon from './assets/icon_conflict.svg';
import {withTranslation} from 'react-i18next';

import './refresh-all-page.css';

export class _RefreshAllPage extends Component {
  constructor() {
    super();
    const fromStorage = JSON.parse(localStorage.getItem('refreshData'));
    this.state = {
      name: fromStorage.data[0].name,
      currentNumber: 1,
      allNumber: fromStorage.allNumber,
      results: fromStorage.data,
      finished: false,
    };
  }
  componentDidMount() {
    // in IE we get local storage each 500ms as event listener doesn't work
    const ua = window.navigator.userAgent;
    if (ua.indexOf('MSIE ') > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      this.intervalId = setInterval(() => {
        try {
          const fromStorage = JSON.parse(localStorage.getItem('refreshData'));
          this.setState({
            name: fromStorage.currentName,
            currentNumber: fromStorage.currentNumber,
            results: [...fromStorage.data],
            finished: fromStorage.finished,
          });
        } catch (e) {
          console.error(e);
        }
      }, 500);
    }
    window.addEventListener('storage', (e) => {
      try {
        const fromStorage = JSON.parse(localStorage.getItem('refreshData'));
        this.setState({
          name: fromStorage.currentName,
          currentNumber: fromStorage.currentNumber,
          results: [...fromStorage.data],
          finished: fromStorage.finished,
        });
      } catch (e) {
        return;
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  // TODO: This will be used when button Ok will be added
  // finished = () => {
  //   localStorage.removeItem('refreshData');
  //   const okObject = {
  //     command: selectorProperties.commandOk,
  //   };
  //   Office.context.ui.messageParent(JSON.stringify(okObject));
  // }

  getIcon = (res) => {
    if (res.isError === false) {
      return <span className="result-icon"><MSTRIcon type='refresh-success' /></span>;
    }
    if (res.isError === true) {
      return (<Popover overlayClassName="tooltip-card" placement="topLeft" content={this.getTooltipContent(res)}>
        <span className="result-icon"><img width='17px' height='17px' src={warningIcon} alt='Refresh failed icon' /></span>
      </Popover>);
    }
    return <span className="result-icon"></span>;
  }

  getTooltipContent = (refreshData) => {
    return (
      <div className="tooltip-content">
        <div className="tooltip-header">
          <span className="tooltip-header-icon"><img width='14px' height='14px' src={warningIcon} alt='Refresh failed icon' /></span>
        </div>
        <div className="tooltip-message">
          <div className="tooltip-message-title">{refreshData.name} could not be refreshed.</div>
          <div className="tooltip-message-text">{refreshData.result}</div>
        </div>
      </div>
    );
  }

  render() {
    const {t} = this.props;
    const displayName = this.state.name || 'data';
    return (<dialog className='refreshing-page dialogStyle'>
      <div className="refresh-title">{t('Refresh All Data')}</div>
      <div className="refresh-header">
        {!this.state.finished
          ?
          <div className='refresh-progress'>
            <h1 title={displayName} className={'titleStyle'}>{`${displayName}`}</h1>
            <h1 className={'progressStyle'}>{` (${this.state.currentNumber}/${this.state.allNumber})`}</h1>
            <LoadingText text={'Loading data...'} />
          </div>
          :
          <span className="finished-header">{t('Refreshing complete!')}</span>}
      </div>
      <div className='results-container'>
        {this.state.results &&
          this.state.results.map((res) =>
            <div className="result-container" key={res.key}>
              {this.getIcon(res)}
              <span title={res.name} className="report-name">{res.name}</span>
            </div>)
        }
      </div>
      { // TODO: Find a way to make button ok work properly
        /* <Button id="prepare" type="primary"
        className={ !this.state.finished ? 'hidden' : ''}
        onClick={this.finished}>
          Ok
      </Button> */}
    </dialog>);
  }
}

_RefreshAllPage.defaultProps = {
  t: (text) => text,
};

export const RefreshAllPage = withTranslation('common')(_RefreshAllPage);
