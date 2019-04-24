import React, {Component} from 'react';
import {connect} from 'react-redux';
import {LoadingText} from 'mstr-react-library';
import {selectorProperties} from '../attribute-selector/selector-properties';
import {Button, Tooltip} from 'antd';

import '../popup/popup-buttons.css';

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

export class _LoadingPage extends Component {
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
      console.log('results in listener', results);
      const name = localStorage.getItem('currentName');
      const currentNumber = JSON.parse(localStorage.getItem('currentNumber'));
      const finished = JSON.parse(localStorage.getItem('finished'));
      // const allNumber = JSON.parse(localStorage.getItem('allNumber'));
      this.setState({
        name: name,
        currentNumber: currentNumber,
        // allNumber: allNumber,
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

  render() {
    console.log('results in render', this.state.results[0].result);
    const displayName = this.state.name || 'data';
    return (<dialog className='loading-page' style={dialogStyle}>
      <h1 style={titleStyle}>{`Importing ${displayName} ${this.state.currentNumber}/${this.state.allNumber}`}</h1>
      <LoadingText text={'Please wait until the import is complete.'} />
      <div className='tables-container'>
        {this.state.results ?
          this.state.results.map((res) => <Tooltip title={res.result}><div>{res.result} {res.name}</div></Tooltip>) : null}
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

export const LoadingPage = connect(mapStateToProps)(_LoadingPage);
