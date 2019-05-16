import {popupController} from '../../src/popup/popup-controller';
import {popupHelper} from '../../src/popup/popup-helper';

describe('Popup actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('runRefreshAllPopup should run proper helpers', () => {
    // given
    const mockGetPopupHeight = jest.spyOn(popupHelper, 'getPopupHeight').mockImplementation(() => {
      console.log('wewewe')
      ;
    });
    const mockRunPopup = jest.spyOn(popupController, 'runPopup').mockImplementation(() => {});
    const reportArray = [{
      bindId: 'testBinding1',
      name: 'testNamne1',
    },
    {
      bindId: 'testBinding2',
      name: 'testNamne2',
    }];
    // when
    popupHelper.runRefreshAllPopup(reportArray, 10);
    // then
    expect(mockGetPopupHeight).toHaveBeenCalled();
    expect(mockRunPopup).toHaveBeenCalled();
  });
  it('storagePrepareRefreshAllData should write all rrefreshed eports data to localstorage', () => {
    // given
    const mockStorageRemoveItem = jest.spyOn(localStorage, 'removeItem').mockImplementation(() => { });
    const mockStorageSetItem = jest.spyOn(localStorage, 'setItem').mockImplementation(() => { });
    const reportArray = [{
      bindId: 'testBinding1',
      name: 'testNamne1',
    },
    {
      bindId: 'testBinding2',
      name: 'testNamne2',
    }];
    // when
    popupHelper.storagePrepareRefreshAllData(reportArray);
    // then
    expect(mockStorageRemoveItem).toHaveBeenCalledWith('refreshData');
    expect(mockStorageSetItem).toHaveBeenCalledWith('refreshData', JSON.stringify({
      data: [
        {
          key: 'testBinding1',
          name: 'testNamne1',
          result: false,
          isError: null},
        {
          key: 'testBinding2',
          name: 'testNamne2',
          result: false,
          isError: null},
      ],
      allNumber: reportArray.length,
      finished: false,
      currentNumber: 1,
    }));
  });
  it('storageReportRefreshStart should write report refresh data to localstorage', () => {
    // given
    const mockStorageGetItem = jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
      return JSON.stringify({});
    });
    const mockStorageSetItem = jest.spyOn(localStorage, 'setItem').mockImplementation(() => { });
    const refreshReport = {
      name: 'testName',
    };
    const index = 0;
    // when
    popupHelper.storageReportRefreshStart(refreshReport, index);
    // then
    expect(mockStorageGetItem).toHaveBeenCalled();
    expect(mockStorageSetItem).toHaveBeenCalledWith('refreshData', JSON.stringify({
      currentName: 'testName',
      currentNumber: 1,
    }));
  });
  it('storageReportRefreshFinish should write report refresh data to localstorage', () => {
    // given
    const refreshData = {
      data: [
        {
          key: 'testBinding1',
          name: 'testNamne1',
          result: false,
          isError: null,
        },
        {
          key: 'testBinding2',
          name: 'testNamne2',
          result: false,
          isError: null,
        },
      ],
      allNumber: 2,
      finished: false,
      currentNumber: 1,
    };
    const index = 0;
    const mockStorageGetItem = jest.spyOn(localStorage, 'getItem').mockImplementation(() => {
      return JSON.stringify(refreshData);
    });
    const mockStorageSetItem = jest.spyOn(localStorage, 'setItem').mockImplementation(() => { });
    // when
    popupHelper.storageReportRefreshFinish('ok', false, index, refreshData.data.length);
    // then
    expect(mockStorageGetItem).toHaveBeenCalled();
    expect(mockStorageSetItem).toHaveBeenCalledWith('refreshData',
        JSON.stringify({
          data: [
            {
              key: 'testBinding1',
              name: 'testNamne1',
              result: 'ok',
              isError: false,
            },
            {
              key: 'testBinding2',
              name: 'testNamne2',
              result: false,
              isError: null,
            },
          ],
          allNumber: 2,
          finished: false,
          currentNumber: 1,
        })
    );
  });
});
