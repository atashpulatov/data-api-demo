import React, {Component} from 'react';
import {connect} from 'react-redux';
import {LoadingText} from 'mstr-react-library';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {Button, Popover} from 'antd';
import {MSTRIcon} from 'mstr-react-library';
import warningIcon from './assets/icon_conflict.svg';

import './refresh-all-page.css';

const dialogStyle = {
  height: '100%',
  position: 'fixed',
  top: '50%',
  color: '#444A50',
  transform: 'translateY(-50%) translateY(-25px)',
  border: 'none',
  textAlign: 'center',
  fontFamily: `"HelveticaNeue", "Helvetica Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", sans-serif`,
  width: '100%',
};


const titleStyle = {
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#444649',
  padding: '0.5em',
};

export class _RefreshAllPage extends Component {
  constructor() {
    super();
    this.state = {
      name: JSON.parse(localStorage.getItem('results'))[0].name,
      currentNumber: 1,
      allNumber: JSON.parse(localStorage.getItem('allNumber')),
      results: JSON.parse(localStorage.getItem('results')),
      finished: false,
    };
  }
  componentDidMount() {
    window.addEventListener('storage', (e) => {
      try {
        const results = JSON.parse(localStorage.getItem('results'));
        const name = localStorage.getItem('currentName');
        const currentNumber = JSON.parse(localStorage.getItem('currentNumber'));
        const finished = JSON.parse(localStorage.getItem('finished'));

        this.setState({
          name: name,
          currentNumber: currentNumber,
          results: [...results],
          finished: finished,
        });
      } catch (e) {
        return;
      }
    });
  }

  finished = () => {
    localStorage.removeItem('results');
    localStorage.removeItem('currentName');
    localStorage.removeItem('currentNumber');
    localStorage.removeItem('allNumber');
    localStorage.removeItem('finished');
    const okObject = {
      command: selectorProperties.commandOk,
    };
    Office.context.ui.messageParent(JSON.stringify(okObject));
  }

  getIcon = (res) => {
    if (res.isError === false) {
      return <span className="result-icon"><MSTRIcon type='refresh-success' /></span>;
    }
    if (res.isError === true) {
      return (<Popover overlayClassName="tooltip-card" placement="topLeft" content={this.getTooltipContent(res)}>
        <span className="result-icon"><img width='17px' height='17px' src={warningIcon} alt='Refresh failed icon' /></span>
      </Popover>);
    }
    return;
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
    const displayName = this.state.name || 'data';
    return (<dialog className='refreshing-page' style={dialogStyle}>
      <div className="refresh-title">Refresh All Data</div>
      <div className="refresh-header">
        {!this.state.finished
                ?
                <div>
                  <h1 style={titleStyle}>{`${displayName} (${this.state.currentNumber}/${this.state.allNumber})`}</h1>
                  <LoadingText text={'Loading data...'} />
                </div>
                :
                 <span className="finished-header">Refresh done!</span>}
      </div>
      <div className='results-container'>
        {this.state.results
                  ?
                  this.state.results.map((res) =>
                    <div className="result-container" key={res.key}>
                      {this.getIcon(res)}
                      <span className="report-name">{res.name}</span>
                    </div>)

                  :
                  null}
      </div>
      { // TODO: Find a way to make button ok work properly
        /* <Button id="prepare" type="primary"
        className={ !this.state.finished ? 'hidden' : ''}
        onClick={this.finished}>
          Ok
      </Button> */}
    </dialog>);
  }
};

const mapStateToProps = ({popupReducer}) => {
  return {
    name: popupReducer.refreshingReport,
  };
};

export const RefreshAllPage = connect(mapStateToProps)(_RefreshAllPage);
