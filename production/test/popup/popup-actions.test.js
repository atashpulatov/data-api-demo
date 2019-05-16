import * as actions from '../../src/popup/popup-actions';
import {popupHelper} from '../../src/popup/popup-helper';
import {officeApiHelper} from '../../src/office/office-api-helper';
import {authenticationHelper} from '../../src/authentication/authentication-helper';
import {reduxStore} from '../../src/store';

describe('Popup actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('refreshReportsArray', () => {
    it('should call proper methods', async () => {
      const mockRedux = jest.spyOn(reduxStore, 'dispatch');
      const mockGetExcelSession = jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementation(() => { });
      const mockValidateToken = jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementation(() => { });
      const mockPrepareData = jest.spyOn(popupHelper, 'storagePrepareRefreshAllData').mockImplementation(() => { });
      const mockRunPopup = jest.spyOn(popupHelper, 'runRefreshAllPopup').mockImplementation(() => { });
      const mockPrintReport = jest.spyOn(popupHelper, 'printRefreshedReport').mockImplementation(() => { });
      // given
      const listener = jest.fn();
      const reportArray = [{
        bindId: 'testBinding1',
        objectType: 'report',
        name: 'testNamne1',
      },
      {
        bindId: 'testBinding2',
        objectType: 'report',
        name: 'testNamne2',
      }];
      // when
      await actions.refreshReportsArray(reportArray, true)(listener);
      // then
      expect(mockGetExcelSession).toHaveBeenCalled();
      expect(mockValidateToken).toHaveBeenCalled();
      expect(mockPrepareData).toHaveBeenCalledWith(reportArray);
      expect(mockRunPopup).toHaveBeenCalledWith(reportArray);
      expect(mockRedux).toHaveBeenCalledWith({});
      expect(mockPrintReport).toHaveBeenCalledTimes(2);
    });
    it('should NOT call some methods when isRefreshAll is false', async () => {
      const mockGetExcelSession = jest.spyOn(officeApiHelper, 'getExcelSessionStatus').mockImplementation(() => { });
      const mockValidateToken = jest.spyOn(authenticationHelper, 'validateAuthToken').mockImplementation(() => { });
      const mockPrepareData = jest.spyOn(popupHelper, 'storagePrepareRefreshAllData').mockImplementation(() => { });
      const mockRunPopup = jest.spyOn(popupHelper, 'runRefreshAllPopup').mockImplementation(() => { });
      const mockPrintReport = jest.spyOn(popupHelper, 'printRefreshedReport').mockImplementation(() => { });
      // given
      const listener = jest.fn();
      const reportArray = [
        {
          bindId: 'testBinding1',
          objectType: 'report',
          name: 'testNamne1',
        },
      ];
      // when
      await actions.refreshReportsArray(reportArray, false)(listener);
      // then
      expect(mockGetExcelSession).toHaveBeenCalled();
      expect(mockValidateToken).toHaveBeenCalled();
      expect(mockPrepareData).not.toHaveBeenCalledWith();
      expect(mockRunPopup).not.toHaveBeenCalledWith();
      expect(mockPrintReport).toHaveBeenCalledTimes(1);
    });
  });
  describe('resetState', () => {
    it('should dispatch proper resetState action', () => {
      // given
      const listener = jest.fn();
      // when
      actions.resetState(true)(listener);
      // then
      expect(listener).toHaveBeenCalledWith({type: actions.RESET_STATE});
    });
  });
});
