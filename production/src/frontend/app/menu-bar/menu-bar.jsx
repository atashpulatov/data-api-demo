/* eslint-disable */
import React, { Component } from 'react';
import { menuBarService } from './menu-bar-service';
import { connect } from 'react-redux';
import { Icon, Tooltip } from 'antd';
import './menu-bar.css';
/* eslint-enable */

export class _MenuBar extends Component {
    render() {
        return (
            this.props.project
                ?
                <div className='menu-bar-container'>
                    <div className='menu-bar-nav-container'>
                        <Tooltip placement="bottomLeft" title='Back'>
                            <button
                                className='menu menu-nav'
                                id='goBack'
                                onClick={menuBarService.goUp}>
                                <Icon type='left' />
                            </button>
                        </Tooltip>
                        <Tooltip placement="bottom" title='Go top'>
                            <button
                                className='menu menu-nav'
                                id='goTop'
                                onClick={menuBarService.goProjects}>
                                <Icon type='double-left' />
                            </button>
                        </Tooltip>
                    </div>
                    <div className='menu-bar-options-container'>
                        <Tooltip placement="bottom" title='Log out'>
                            <button
                                className='menu menu-options'
                                id='logOut'
                                onClick={menuBarService.logOut}>
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
