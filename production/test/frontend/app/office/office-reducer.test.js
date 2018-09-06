/* eslint-disable */
import { createStore } from 'redux';
import { officeReducer } from '../../../../src/frontend/app/office/office-reducer';
import { officeProperties } from '../../../../src/frontend/app/office/office-properties';
import { OfficeError } from '../../../../src/frontend/app/office/office-error';
/* eslint-enable */

describe('officeReducer', () => {
    const officeStore = createStore(officeReducer);

    const reportArrayMock = [
        {
            id: 'firstTestId',
            name: 'firstTestName',
            bindId: 'firstBindId',
        },
        {
            id: 'secondTestId',
            name: 'secondTestName',
            bindId: 'secondBindId',
        },
        {
            id: 'thirdTestId',
            name: 'thirdTestName',
            bindId: 'thirdBindId',
        },
    ];

    beforeEach(() => {
        // default state should be empty
        expect(officeStore.getState()).toEqual({});
    });

    afterEach(() => {
        officeStore.dispatch({
            type: officeProperties.actions.removeAllReports,
        });
    });

    it('should throw an error on missing report.id', () => {
        // given
        const report = {
            name: 'testName',
            bindId: 'missingBindId',
        };
        // when
        const wrongDispatch = () => {
            officeStore.dispatch({
                type: officeProperties.actions.loadReport,
                report,
            });
        };
        // then
        expect(wrongDispatch).toThrowError(OfficeError);
        expect(wrongDispatch).toThrowError('Missing report.id');
    });

    it('should throw an error on missing report.name', () => {
        // given
        const report = {
            id: 'testId',
            bindId: 'missingBindId',
        };
        // when
        const wrongDispatch = () => {
            officeStore.dispatch({
                type: officeProperties.actions.loadReport,
                report,
            });
        };
        // then
        expect(wrongDispatch).toThrowError(OfficeError);
        expect(wrongDispatch).toThrowError('Missing report.name');
    });

    it('should throw an error on missing report.bindId', () => {
        // given
        const report = {
            id: 'testId',
            name: 'testName',
        };
        // when
        const wrongDispatch = () => {
            officeStore.dispatch({
                type: officeProperties.actions.loadReport,
                report,
            });
        };
        // then
        expect(wrongDispatch).toThrowError(OfficeError);
        expect(wrongDispatch).toThrowError('Missing report.bindId');
    });

    it('should save report data to store', () => {
        // given
        const report = reportArrayMock[0];
        // when
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report,
        });
        // then
        const officeStoreState = officeStore.getState();
        const storedReport = officeStoreState.reportArray[0];
        expect(storedReport).toBeDefined();
        expect(storedReport).toBe(report);
    });

    it('should remove reports stored', () => {
        // given
        const firstReport = reportArrayMock[0];
        const secondReport = reportArrayMock[1];
        // when
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: firstReport,
        });
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: secondReport,
        });
        officeStore.dispatch({
            type: officeProperties.actions.removeAllReports,
        });
        // then
        const officeStoreState = officeStore.getState();
        const storedReport = officeStoreState.reportArray;
        expect(storedReport).toBeUndefined();
    });

    it('should save next report data to store', () => {
        // given
        const firstReport = reportArrayMock[0];
        const secondReport = reportArrayMock[1];
        // when
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: firstReport,
        });
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: secondReport,
        });
        // then
        const officeStoreState = officeStore.getState();
        const storedReport = officeStoreState.reportArray[1];
        expect(storedReport).toBeDefined();
        expect(storedReport).toBe(secondReport);
    });

    it('should remove report with given bindId', () => {
        // given
        const firstReport = reportArrayMock[0];
        const secondReport = reportArrayMock[1];
        const thirdReport = reportArrayMock[2];
        // when
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: firstReport,
        });
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: secondReport,
        });
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: thirdReport,
        });
        officeStore.dispatch({
            type: officeProperties.actions.removeReport,
            reportBindId: secondReport.bindId,
        });
        // then
        const officeStoreState = officeStore.getState().reportArray;
        expect(officeStoreState.length).toEqual(2);
        expect(officeStoreState[0]).toEqual(firstReport);
        expect(officeStoreState[1]).toEqual(thirdReport);
    });

    it('should throw an error on missing report.bindId when removing report', () => {
        // given
        // when
        const wrongDispatch = () => {
            officeStore.dispatch({
                type: officeProperties.actions.removeReport,
            });
        };
        // then
        expect(wrongDispatch).toThrowError(OfficeError);
        expect(wrongDispatch).toThrowError('Missing reportBindId');
    });

    it('should overwrite reports array with given one', () => {
        // given
        const firstReport = reportArrayMock[0];
        const secondReport = reportArrayMock[1];
        const thirdReport = reportArrayMock[2];
        const reportArrayNew = [
            {
                id: 'NEWfirstTestId',
                name: 'NEWfirstTestName',
                bindId: 'NEWfirstBindId',
            },
            {
                id: 'NEWsecondTestId',
                name: 'NEWsecondTestName',
                bindId: 'NEWsecondBindId',
            },
        ];
        // when
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: firstReport,
        });
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: secondReport,
        });
        officeStore.dispatch({
            type: officeProperties.actions.loadReport,
            report: thirdReport,
        });
        officeStore.dispatch({
            type: officeProperties.actions.loadAllReports,
            reportArray: reportArrayNew,
        });
        // then
        const officeStoreState = officeStore.getState().reportArray;
        expect(officeStoreState.length).toEqual(2);
        expect(officeStoreState[0]).toEqual(reportArrayNew[0]);
        expect(officeStoreState[1]).toEqual(reportArrayNew[1]);
    });
    it('should throw an error on missing reportArray', () => {
        // given
        // when
        const wrongDispatch = () => {
            officeStore.dispatch({
                type: officeProperties.actions.loadAllReports,
            });
        };
        // then
        expect(wrongDispatch).toThrowError(OfficeError);
        expect(wrongDispatch).toThrowError('Missing reportArray');
    });
    it('should throw an error on missing property in one of items in reportArray', () => {
        // given
        const originalId = reportArrayMock[1];
        reportArrayMock[1].id = undefined;
        // when
        const wrongDispatch = () => {
            officeStore.dispatch({
                type: officeProperties.actions.loadAllReports,
                reportArray: reportArrayMock,
            });
        };
        // then
        expect(wrongDispatch).toThrowError(OfficeError);
        expect(wrongDispatch).toThrowError('Missing report.id');

        reportArrayMock[1].id = originalId;
    });
});
