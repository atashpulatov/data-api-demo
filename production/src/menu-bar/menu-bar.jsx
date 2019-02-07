/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Tooltip } from 'antd';
import './menu-bar.css';
import { sessionHelper } from '../storage/session-helper';
/* eslint-enable */

export class _MenuBar extends Component {
    render() {
        return (
            <div className='menu-bar-container'>
                <div className='menu-bar-options-container'>
                    <Tooltip placement="bottom" title='Log out'>
                        <button
                            className='menu menu-options'
                            id='logOut'
                            onClick={sessionHelper.logOut}>
                            <Icon type='logout' />
                        </button>
                    </Tooltip>
                    <Tooltip placement="bottomRight" title='Settings'>
                        <button
                            className='menu menu-options'
                            id='settings'>
                            <Icon type='setting' />
                        </button>
                    </Tooltip>
                </div>
            </div >
        );
    }
};

function mapStateToProps(state) {
    return {
        project: state.historyReducer.project,
    };
}

export const MenuBar = connect(mapStateToProps)(_MenuBar);
