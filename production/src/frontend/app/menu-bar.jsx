/* eslint-disable */
import React, { Component } from 'react';
import './menu-bar.css';
import { historyProperties } from './history/history-properties';
import { sessionProperties } from './storage/session-properties';
import { reduxStore } from './store';
/* eslint-enable */

const back = '‹';
const settings = '⏣';
const logout = '⏏';
const goTop = '«';

// TODO: to be refactored
export class MenuBar extends Component {
    constructor(props) {
        super(props);

        this.goUp = this.goUp.bind(this);
        this.goProjects = this.goProjects.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    goUp() {
        reduxStore.dispatch({
            type: historyProperties.actions.goUp,
        });
    };

    goProjects() {
        reduxStore.dispatch({
            type: historyProperties.actions.goToProjects,
        });
    };

    logOut() {
        reduxStore.dispatch({
            type: sessionProperties.actions.logOut,
        });
    };

    render() {
        return (
            <div className='menu-bar-container'>
                <div className='menu-bar-nav-container'>
                    <button className='menu menu-nav'
                        onClick={this.goUp}>
                        <div className='with-tooltip'>
                            {back}
                            <span className='tooltip right'>Back</span>
                        </div>
                    </button>
                    <button className='menu menu-nav'
                        onClick={this.goProjects}>
                        <div className='with-tooltip'>
                            {goTop}
                            <span className='tooltip right'>Go top</span>
                        </div>
                    </button>
                </div>
                <div className='menu-bar-options-container'>
                    <button className='menu menu-options'
                        onClick={this.logOut}>
                        <div className='with-tooltip'>
                            {logout}
                            <span className='tooltip left'>Log out</span>
                        </div>
                    </button>
                    <button className='menu menu-options'>
                        <div className='with-tooltip'>
                            {settings}
                            <span className='tooltip left'>Settings</span>
                        </div>
                    </button>
                </div>
            </div>
        );
    }
};
