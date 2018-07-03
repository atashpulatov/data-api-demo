import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import './menu-bar.css';
import { historyProperties } from './history/history-properties';
import { withRouter } from 'react-router'

const back = '‹';
const settings = '⏣';
const logout = '⏏';
const goTop = '«';

const goUpObject = {
    pathname: '/',
    historyObject: {},
};
goUpObject.historyObject[historyProperties.command] = historyProperties.goUp;

class MenuBar extends Component {
    constructor(props) {
        super(props);

        this.pushHistory = this.pushHistory.bind(this);
    }

    pushHistory() {
        this.props.history.push(goUpObject);
    }

    render() {
        return (
            <div className='menu-bar-container'>
                <div className='menu-bar-nav-container'>
                    <button className='menu-button menu-button-nav'
                        onClick={this.pushHistory}>
                        <div className='button-with-tooltip'>
                            {back}
                            <span className='button-tooltip-right'>Back</span>
                        </div>
                    </button>
                    <button className='menu-button menu-button-nav'>
                        <div className='button-with-tooltip'>
                            {goTop}
                            <span className='button-tooltip-right'>Go top</span>
                        </div>
                    </button>
                </div>
                <div className='menu-bar-options-container'>
                    {/* <button className='menu-button menu-button-nav'>{forward}</button> */}
                    <button className='menu-button menu-button-options'>
                        <div className='button-with-tooltip'>
                            {logout}
                            <span className='button-tooltip-left'>Log out</span>
                        </div>
                    </button>
                    <button className='menu-button menu-button-options'>
                        <div className='button-with-tooltip'>
                            {settings}
                            <span className='button-tooltip-left'>Settings</span>
                        </div>
                    </button>
                </div>
            </div>
        );
    }
};


export default withRouter(MenuBar);
