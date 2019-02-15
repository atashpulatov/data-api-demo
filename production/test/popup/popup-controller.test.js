import React from 'react';
import { shallow } from 'enzyme';
import { selectorProperties } from '../../src/attribute-selector/selector-properties';
import { popupController } from '../../src/popup-controller';
import { officeContext } from '../../src/office/office-context';

describe('PopupController', () => {
    const oldDialog = {};
    const newDialog = {};
    const excelRun = jest.fn();

    beforeAll(() => {
        // excelRun.mockImplementation(async (func) => {
        //     console.log('this is crazy');

        //     await func({
        //         sync: async () => { },
        //     });
        // })
        jest.spyOn(officeContext, 'getExcel')
            .mockReturnValue({
                run: excelRun,
            })
        // jest.spyOn(officeContext, 'getOffice').mockReturnValue({
        //     context: {
        //         ui: {
        //             displayDialogAsync: (par1, par2, parFunc) => {
        //                 console.log('this one tooo');

        //                 parFunc({
        //                     value: newDialog,
        //                 });
        //             }
        //         }
        //     }
        // })
        oldDialog.close = jest.fn();
        // newDialog.addEventHandler = jest.fn();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should close popup and call another when secondary action provided',
        async () => {
            // given
            const actionObject = {
                command: selectorProperties.commandSecondary,
                chosenObject: 'objectId',
                chosenProject: 'projectId',
            };
            const arg = {
                message: JSON.stringify(actionObject),
            }
            // when
            await popupController.onMessageFromPopup(oldDialog, arg);
            // then
            expect(oldDialog.close).toBeCalled();
            expect(excelRun).toBeCalled();
            const runParams = excelRun.mock.calls[0][0];
            expect(typeof runParams).toEqual('function');
            // expect(newDialog.addEventHandler).toBeCalled();
        })

    // Excel.run(async (context) => {
    //     Office.context.ui.displayDialogAsync(
    //         `${environment.scheme}://${environment.host}:${environment.port}/popup.html`
    //         + '?envUrl=' + session.url
    //         + '&token=' + session.authToken
    //         + '&projectId=' + session.projectId
    //         + '&reportId=' + reportId,
    //         { height: 62, width: 50, displayInIframe: true },
    //         (asyncResult) => {
    //             this.dialog = asyncResult.value;
    //             this.dialog.addEventHandler(
    //                 Office.EventType.DialogMessageReceived,
    //                 this.onMessageFromPopup);
    //         });
    //     await context.sync();
    // });
});