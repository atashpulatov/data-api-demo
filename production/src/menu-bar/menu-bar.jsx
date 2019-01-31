/* eslint-disable */
import React, { Component } from 'react';
import { menuBarService } from './menu-bar-service';
import { connect } from 'react-redux';
import { Icon, Tooltip } from 'antd';
import './menu-bar.css';
import { PopupTypeEnum } from '../home/popup-type-enum';
import { sessionHelper } from '../storage/session-helper';
import { environment } from '../global-definitions';
import { officeContext } from '../office/office-context';
/* eslint-enable */

export class _MenuBar extends Component {
    runPopupNavigation = () => {
        const session = sessionHelper.getSession();
        const excelObject = officeContext.getExcel();
        Excel.run(async (context) => {
            const officeObject = officeContext.getOffice();
            officeObject.context.ui.displayDialogAsync(
                `${environment.scheme}://${environment.host}:${environment.port}/popup.html`
                + '?popupType=' + PopupTypeEnum.navigationTree
                + '&envUrl=' + session.url
                + '&token=' + session.authToken
                + '&projectId=' + session.projectId,
                { height: 62, width: 50, displayInIframe: true },
                (asyncResult) => {
                    this.dialog = asyncResult.value;
                    this.dialog.addEventHandler(
                        officeObject.EventType.DialogMessageReceived,
                        // this.onMessageFromPopup);
                        () => { });
                });
            await context.sync();
        });
    }

    render() {
        return (
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
                    {/* TODO: temporary solution below */}
                    <Tooltip placement="bottom" title='Go popup!'>
                        <button
                            className='menu menu-options'
                            id='goPopup'
                            onClick={this.runPopupNavigation}>
                            <Icon type='fullscreen' />
                        </button>
                    </Tooltip>
                    <Tooltip placement="bottom" title='Log out'>
                        <button
                            className='menu menu-options'
                            id='logOut'
                            onClick={sessionHelper.logout}>
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
        )
    }
};

function mapStateToProps(state) {
    return {
        project: state.historyReducer.project,
    };
}

export const MenuBar = connect(mapStateToProps)(_MenuBar);
