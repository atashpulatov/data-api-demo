/* eslint-disable */
import { createStore } from 'redux';
import { officeReducer } from '../../../../src/frontend/app/office/office-reducer';
import { officeProperties } from '../../../../src/frontend/app/office/office-properties';
/* eslint-enable */

describe('officeReducer', () => {
    const officeStore = createStore(officeReducer);

    beforeEach(() => {
        // default state should be empty
        expect(officeStore.getState()).toEqual({});
    });

    afterEach(() => {
        officeStore.dispatch({
            type: officeProperties.actions.removeReports,
        });
    });

    it('should save report data to store', () => {
        // given
        const report = {
            id: 'testId',
            name: 'testName',
            bindId: 'testBindId',
        };
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
        const firstReport = {
            id: 'firstTestId',
            name: 'firstTestName',
            bindId: 'firstBindId',
        };
        const secondReport = {
            id: 'secondTestId',
            name: 'secondTestName',
            bindId: 'secondBindId',
        };
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
            type: officeProperties.actions.removeReports,
        });
        // then
        const officeStoreState = officeStore.getState();
        const storedReport = officeStoreState.reportArray;
        expect(storedReport).toBeUndefined();
    });
    it('should save next report data to store', () => {
        // given
        const firstReport = {
            id: 'firstTestId',
            name: 'firstTestName',
            bindId: 'firstBindId',
        };
        const secondReport = {
            id: 'secondTestId',
            name: 'secondTestName',
            bindId: 'secondBindId',
        };
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
        const firstReport = {
            id: 'firstTestId',
            name: 'firstTestName',
            bindId: 'firstBindId',
        };
        const secondReport = {
            id: 'secondTestId',
            name: 'secondTestName',
            bindId: 'secondBindId',
        };
        const thirdReport = {
            id: 'thirdTestId',
            name: 'thirdTestName',
            bindId: 'thirdBindId',
        };
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
});
