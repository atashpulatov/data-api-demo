import React, {Component} from 'react';
import {LoadingText} from '@mstr/mstr-react-library';
import {Popover} from 'antd';
import {MSTRIcon} from '@mstr/mstr-react-library';
import {ReactComponent as WarningIcon} from './assets/icon_conflict.svg';
import {withTranslation} from 'react-i18next';
import {helper} from '../helpers/helpers';

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
    if (ua.indexOf('MSIE ') > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)) {
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
      return (<WarningIcon width='17px' height='17px'/>);
    }
    return <span className="result-icon"></span>;
  }

  getTooltipContent = (refreshData) => {
    const excel = 'Excel returned error';
    const {t} = this.props;
    if (refreshData.isError) {
      return (
        <div className="tooltip-content">
          <div className="tooltip-header">
            <WarningIcon width='17px' height='17px'/>
          </div>
          <div className="tooltip-message">
            <div className="tooltip-message-title">{this.props.t('{{report}} could not be refreshed', {report: refreshData.name})}</div>
            <div className="tooltip-message-text">{refreshData.result.includes(excel) ? `${t(excel)}: ${refreshData.result.split(':')[1]}` : t(refreshData.result)}</div>
          </div>
        </div>
      );
    } else {
      return refreshData.name;
    }
  }

  render() {
    const {t} = this.props;
    const displayName = this.state.name || 'data';
    return (<div role="dialog" aria-labelledby="refresh-title" aria-describedby="refresh-report" className='refreshing-page dialog-style'>
      <div id="refresh-title" className="refresh-title">{t('Refresh All Data')}</div>
      <div className="refresh-header">
        {!this.state.finished
          ?
          <div className='refresh-progress'>
            <h1 id="refresh-report" title={displayName} className={'titleStyle'}>{`${displayName}`}</h1>
            <h1 className={'progressStyle'}>{` (${this.state.currentNumber}/${this.state.allNumber})`}</h1>
            <LoadingText text={t('Loading data...')} />
          </div>
          :
          <span className="finished-header">{t('Refreshing complete!')}</span>}
      </div>
      <div className='results-container'>
        {this.state.results &&
          this.state.results.map((res) =>
            <div className="result-container" key={res.key}>
              {this.getIcon(res)}
              {(res.isError || helper.isOverflown(res.name, window.innerWidth - 90))
                ? <Popover placement="topLeft" overlayClassName={res.isError === true ? 'tooltip-card' : ''} content={this.getTooltipContent(res)}>
                  <span className="report-name">{res.name}</span>
                </Popover>
                : <span className="report-name">{res.name}</span>}
            </div>)
        }
      </div>
      { // TODO: Find a way to make button ok work properly
        /* <Button id="prepare" type="primary"
        className={ !this.state.finished ? 'hidden' : ''}
        onClick={this.finished}>
          Ok
      </Button> */}
    </div>);
  }
};

_RefreshAllPage.defaultProps = {
  t: (text) => text,
};

export const RefreshAllPage = withTranslation('common')(_RefreshAllPage);
