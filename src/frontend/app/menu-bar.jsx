import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import './menu-bar.css';
import { historyProperties } from './history/history-properties';
import { withRouter } from 'react-router';

const back = '‹';
const settings = '⏣';
const logout = '⏏';
const goTop = '«';

class MenuBar extends Component {
    constructor(props) {
        super(props);

        this.pushHistory = this.pushHistory.bind(this);

        this.goUpObject = {
            pathname: '/',
            historyObject: {},
        };
        this.goUpObject.historyObject[historyProperties.command] =
            historyProperties.goUp;

        this.goProjectsObject = {
            pathname: '/',
            historyObject: {},
        };
        this.goUpObject.historyObject[historyProperties.command] =
            historyProperties.goToProject;

        this.logOutObject = {
            pathname: '/',
            historyObject: {},
        };
        this.logOutObject.historyObject[historyProperties.command] =
            historyProperties.logOut;
    }

    pushHistory(historyObject) {
        console.log(this);

        this.props.history.push(historyObject);
    }

    render() {
        return (
            <div className='menu-bar-container'>
                <div className='menu-bar-nav-container'>
                    <button className='menu-button menu-button-nav'
                        onClick={this.pushHistory.bind(this, this.goUpObject)}>
                        <div className='button-with-tooltip'>
                            {back}
                            <span className='button-tooltip-right'>Back</span>
                        </div>
                    </button>
                    <button className='menu-button menu-button-nav'
                        onClick={this.pushHistory.bind(this,
                            this.goProjectsObject)}>
                        <div className='button-with-tooltip'>
                            {goTop}
                            <span className='button-tooltip-right'>Go top</span>
                        </div>
                    </button>
                </div>
                <div className='menu-bar-options-container'>
                    {/* <button className='menu-button menu-button-nav'>{forward}</button> */}
                    <button className='menu-button menu-button-options'
                        onClick={this.pushHistory.bind(this,
                            this.logOutObject)}>
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
