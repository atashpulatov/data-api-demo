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
  constructor(props) {
    super(props);
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

    setIcon = (isError) => {
      if (isError === true) {
        return <MSTRIcon type='refresh-success' />;
      } else if (isError === false) {
        return <img width='17px' height='17px' src={warningIcon} alt='Refresh failed icon' />;
      } else {
        return;
      }
    }

  getTooltipContent = (refreshData) => {
    return (
      <div className="tooltip-content">
        <div className="tooltip-header">
          <span className="tooltip-header-icon"><img width='14px' height='14px' src={warningIcon} alt='Refresh failed icon' /></span>
          {/* <div className="tooltip-message-header"> */}
          <span>{refreshData.name} could not be refreshed.</span>
          {/* </div> */}
        </div>
        <div className="tooltip-message">
          <div className="tooltip-message-text">
            <span>{refreshData.result} qwekjhwqe qw eewriwerhj weriwejr werweij rweir jwe</span>
          </div>
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
                    <div className="result-container">
                      <Popover overlayClassName="tooltip-card" placement="topLeft" content={this.getTooltipContent(res)} key={res.key}>
                        <span className="result-icon">{this.setIcon(res.isError)}</span>
                      </Popover>
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
