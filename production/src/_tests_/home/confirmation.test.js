import React from 'react';
import { mount } from 'enzyme';
import { ConfirmationNotConnected } from '../../home/confirmation';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { errorService } from '../../error/error-handler';
import { officeApiCrosstabHelper } from '../../office/api/office-api-crosstab-helper';
import { officeApiWorksheetHelper } from '../../office/api/office-api-worksheet-helper';
import { officeApiRemoveHelper } from '../../office/api/office-api-remove-helper';

describe('Confirmation', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call proper methods from secureData when Ok button is clicked', async () => {
    // given
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => ({ sync: mockSync, }));
    const mockDeleteTableBody = jest.spyOn(officeApiRemoveHelper, 'removeOfficeTableBody').mockImplementation(() => { });
    const mockClearEmptyRow = jest.spyOn(officeApiCrosstabHelper, 'clearEmptyCrosstabRow').mockImplementation(() => { });
    const mockIfAnyProtected = jest.spyOn(officeApiWorksheetHelper, 'checkIfAnySheetProtected').mockImplementation(() => false);
    const mockCheckObject = jest.spyOn(officeApiRemoveHelper, 'checkIfObjectExist').mockImplementation(() => true);
    const mockGetTable = jest.spyOn(officeApiHelper, 'getTable').mockImplementation(() => ({
      showHeaders: null,
      showFilterButton: null,
      getHeaderRowRange: () => ({ format: { font: { color: null, }, }, }),
    }));
    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsClearingFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<ConfirmationNotConnected
      objects={mockReportArray}
      isSecured={false}
      toggleIsConfirmFlag={mockToggleIsConfirmFlag}
      toggleIsClearingFlag={mockToggleIsClearingFlag}
      toggleSecuredFlag={mockToggleSecuredFlag} />);
    const okWrapper = confirmationWrapper.find('#confirm-btn');
    // when
    okWrapper.simulate('click');
    // then
    await expect(mockGetContext).toBeCalled();
    expect(mockToggleIsClearingFlag).toBeCalled();
    expect(mockToggleIsConfirmFlag).toBeCalled();
    await expect(mockIfAnyProtected).toBeCalled();
    await expect(mockCheckObject).toBeCalled();
    await expect(mockGetTable).toBeCalled();
    expect(mockClearEmptyRow).toBeCalled();
    await expect(mockSync).toBeCalled();
    await expect(mockDeleteTableBody).toBeCalled();
    expect(mockToggleIsClearingFlag).toBeCalled();
    expect(mockToggleSecuredFlag).toBeCalledWith(true);
  });

  it('should fill clearErrors when secureData fails in ok button click', () => {
    // given
    const mockSync = jest.fn();
    const error = new Error('test error');
    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementationOnce(() => ({ sync: mockSync, }));
    jest.spyOn(officeApiRemoveHelper, 'checkIfObjectExist').mockImplementationOnce(() => true);
    jest.spyOn(officeApiHelper, 'getTable').mockImplementationOnce(() => { throw error; });
    jest.spyOn(errorService, 'handleError').mockImplementationOnce(() => { });
    const clearErrors = [];
    const chosenObjectName = 'Test';
    const returnValue = {};
    errorService.handleError.mockReturnValueOnce(() => returnValue);
    clearErrors.push({ chosenObjectName, returnValue });

    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsClearingFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<ConfirmationNotConnected
      objects={mockReportArray}
      isSecured={false}
      toggleIsConfirmFlag={mockToggleIsConfirmFlag}
      toggleIsClearingFlag={mockToggleIsClearingFlag}
      toggleSecuredFlag={mockToggleSecuredFlag} />);
    const okWrapper = confirmationWrapper.find('#confirm-btn');
    // when
    okWrapper.simulate('click');
    // then
    expect(clearErrors).not.toBe(null);
  });

  it('should not call functions if failed to get table in clear data', async () => {
    // given
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => ({ sync: mockSync, }));
    const mockDeleteTableBody = jest.spyOn(officeApiRemoveHelper, 'removeOfficeTableBody').mockImplementation(() => { });
    const mockClearEmptyRow = jest.spyOn(officeApiCrosstabHelper, 'clearEmptyCrosstabRow').mockImplementation(() => { });
    const mockIfAnyProtected = jest.spyOn(officeApiWorksheetHelper, 'checkIfAnySheetProtected').mockImplementation(() => false);
    const mockCheckObject = jest.spyOn(officeApiRemoveHelper, 'checkIfObjectExist').mockImplementation(() => false);
    const mockGetTable = jest.spyOn(officeApiHelper, 'getTable').mockImplementation(() => ({
      showHeaders: null,
      showFilterButton: null,
      getHeaderRowRange: () => ({ format: { font: { color: null, }, }, }),
    }));
    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsClearingFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<ConfirmationNotConnected
      objects={mockReportArray}
      isSecured={false}
      toggleIsConfirmFlag={mockToggleIsConfirmFlag}
      toggleIsClearingFlag={mockToggleIsClearingFlag}
      toggleSecuredFlag={mockToggleSecuredFlag} />);
    const okWrapper = confirmationWrapper.find('#confirm-btn');
    // when
    okWrapper.simulate('click');
    // then
    await expect(mockGetContext).toBeCalled();
    expect(mockToggleIsClearingFlag).toBeCalled();
    expect(mockToggleIsConfirmFlag).toBeCalled();
    await expect(mockIfAnyProtected).toBeCalled();
    await expect(mockCheckObject).toBeCalled();
    await expect(mockGetTable).not.toBeCalled();
    expect(mockClearEmptyRow).not.toBeCalled();
    await expect(mockSync).not.toBeCalled();
    await expect(mockDeleteTableBody).not.toBeCalled();
    expect(mockToggleIsClearingFlag).toBeCalled();
    expect(mockToggleSecuredFlag).not.toBeCalled();
  });

  it('should throw error if checkIfAnySheetProtected fails', async () => {
    // given
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => ({ sync: mockSync, }));
    const mockIfAnyProtected = jest.spyOn(officeApiWorksheetHelper, 'checkIfAnySheetProtected').mockImplementationOnce(() => { throw new Error(); });
    const mockHandleError = jest.spyOn(errorService, 'handleError').mockImplementation(() => { });

    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsClearingFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<ConfirmationNotConnected
      objects={mockReportArray}
      isSecured={false}
      toggleIsConfirmFlag={mockToggleIsConfirmFlag}
      toggleIsClearingFlag={mockToggleIsClearingFlag}
      toggleSecuredFlag={mockToggleSecuredFlag} />);
    const okWrapper = confirmationWrapper.find('#confirm-btn');
    // when
    okWrapper.simulate('click');
    // then
    await expect(mockGetContext).toBeCalled();
    expect(mockToggleIsClearingFlag).toBeCalled();
    expect(mockToggleIsConfirmFlag).toBeCalled();
    await expect(mockIfAnyProtected).toBeCalled();
    expect(mockHandleError).toBeCalled();
  });

  it('should set isConfirm flag to false when Cancel is clicked', async () => {
    // given
    const mockToggleIsConfirmFlag = jest.fn();
    const confirmationWrapper = mount(<ConfirmationNotConnected
      isSecured={false}
      toggleIsConfirmFlag={mockToggleIsConfirmFlag}
    />);
    const okWrapper = confirmationWrapper.find('#cancel-btn');
    // when
    okWrapper.simulate('click');
    // then
    await expect(mockToggleIsConfirmFlag).toBeCalledWith(false);
  });
  it('should attach event listeners for outside of confirmation popup click and esc button', () => {
    // given
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    // when
    mount(<ConfirmationNotConnected isConfirm />);
    // then
    const spyCalls = addEventListenerSpy.mock.calls;
    expect(spyCalls[spyCalls.length - 1][0]).toEqual('click');
    expect(spyCalls[spyCalls.length - 1][1].name).toEqual('closeSettingsOnClick');
    expect(spyCalls[spyCalls.length - 2][0]).toEqual('keyup');
    expect(spyCalls[spyCalls.length - 2][1].name).toEqual('closeSettingsOnEsc');
  });
  it('should remove event listeners for outside of confirmation popup click and esc button', () => {
    // given
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    const wrappedComponent = mount(<ConfirmationNotConnected isConfirm />);
    // when
    wrappedComponent.setProps({ isConfirm: false });
    wrappedComponent.update();
    // then
    const spyCalls = removeEventListenerSpy.mock.calls;
    expect(spyCalls[spyCalls.length - 1][0]).toEqual('click');
    expect(spyCalls[spyCalls.length - 1][1].name).toEqual('closeSettingsOnClick');
    expect(spyCalls[spyCalls.length - 2][0]).toEqual('keyup');
    expect(spyCalls[spyCalls.length - 2][1].name).toEqual('closeSettingsOnEsc');
  });
  it('should hide confirmation popup when clicking outside of it', () => {
    // given
    const toggleIsConfirmFlagMock = jest.fn();
    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    const wrappedComponent = mount(
      <ConfirmationNotConnected isConfirm toggleIsConfirmFlag={toggleIsConfirmFlagMock} />
    );
    // when
    map.click({ target: null });
    wrappedComponent.update();
    // then
    expect(toggleIsConfirmFlagMock).toHaveBeenCalled();
  });
  it('should hide confirmation popup when pressing ESC', () => {
    // given
    const toggleIsConfirmFlagMock = jest.fn();
    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    const wrappedComponent = mount(
      <ConfirmationNotConnected isConfirm toggleIsConfirmFlag={toggleIsConfirmFlagMock} />
    );
    // when
    map.keyup({ keyCode: 27 });
    wrappedComponent.update();
    // then
    expect(toggleIsConfirmFlagMock).toHaveBeenCalled();
  });
  it('should not hide confirmation popup when pressing key other than ESC', () => {
    // given
    const toggleIsConfirmFlagMock = jest.fn();
    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    const wrappedComponent = mount(
      <ConfirmationNotConnected isConfirm toggleIsConfirmFlag={toggleIsConfirmFlagMock} />
    );
    // when
    map.keyup({ keyCode: 26 });
    wrappedComponent.update();
    // then
    expect(toggleIsConfirmFlagMock).toHaveBeenCalledTimes(0);
  });
});

const createMockFilesArray = () => {
  const mockArray = [];
  for (let i = 0; i < 1; i++) {
    mockArray.push({
      refreshDate: new Date(),
      id: `mockId_${i}`,
      name: `mockName_${i}`,
      bindId: `mockBindId_${i}`,
      isCrosstab: true,
    });
  }
  return mockArray;
};
