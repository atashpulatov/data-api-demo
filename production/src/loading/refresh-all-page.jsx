import React, {Component} from 'react';
import {connect} from 'react-redux';
import {LoadingText} from 'mstr-react-library';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {Button, Tooltip} from 'antd';
import {MSTRIcon} from 'mstr-react-library';
import uuid from 'uuid/v4';

import './refresh-all-page.css';

const dialogStyle = {
  position: 'fixed',
  top: '50%',
  color: '#444A50',
  transform: 'translateY(-50%) translateY(-15px)',
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

    setIcon = (result) => {
      if (result === false) {
        return <MSTRIcon type='refresh-success' />;
      } else if (result === true) {
        return <MSTRIcon type='refresh-fail' />;
      } else {
        return;
      }
    }

    render() {
      console.log('results in render', this.state.results[0].key);
      const displayName = this.state.name || 'data';
      return (<dialog className='loading-page' style={dialogStyle}>
        {!this.state.finished
            ?
            <div>
              <h1 style={titleStyle}>{`${displayName} (${this.state.currentNumber}/${this.state.allNumber})`}</h1>
              <LoadingText text={'Loading data...'} />
            </div>
            :
             <span>Refresh done!</span>}
        <div className='results-container'>
          {this.state.results ?
                this.state.results.map((res) => <Tooltip title={res.result} key={res.key}>
                  <div className="result-container">
                    <span>{this.setIcon(res.isError)}</span> <span>{res.name}</span>
                  </div></Tooltip>) : null}
        </div>
        <Button id="prepare" type="primary"
          className={ !this.state.finished ? 'hidden' : ''}
          onClick={this.finished}>
          Ok
        </Button>
        {/* {this.state.finished ? <button onClick={this.finished}>Ok</button> : null} */}
      </dialog>);
    }
};

const mapStateToProps = ({popupReducer}) => {
  return {
    name: popupReducer.refreshingReport,
  };
};

export const RefreshAllPage = connect(mapStateToProps)(_RefreshAllPage);
