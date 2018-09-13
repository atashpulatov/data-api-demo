/* eslint-disable */
import React, { Component } from 'react';
import { menuBarService } from './menu-bar-service';
import { connect } from 'react-redux';
import './menu-bar.css';
/* eslint-enable */

const back = '‹';
const settings = '⏣';
const logout = '⏏';
const goTop = '«';

export class _MenuBar extends Component {
    render() {
        return (
            this.props.project
                ?
                <div className='menu-bar-container'>
                    <div className='menu-bar-nav-container'>
                        <button className='menu menu-nav'
                            onClick={menuBarService.goUp}>
                            <div className='with-tooltip'>
                                {back}
                                <span className='tooltip right'>Back</span>
                            </div>
                        </button>
                        <button className='menu menu-nav'
                            onClick={menuBarService.goProjects}>
                            <div className='with-tooltip'>
                                {goTop}
                                <span className='tooltip right'>Go top</span>
                            </div>
                        </button>
                    </div>
                    <div className='menu-bar-options-container'>
                        <button className='menu menu-options'
                            onClick={menuBarService.logOut}>
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
                : null
        );
    }
};

function mapStateToProps(state) {
    return {
        project: state.historyReducer.project,
    };
}

export const MenuBar = connect(mapStateToProps)(_MenuBar);
