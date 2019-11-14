import React from 'react';
import { mount } from 'enzyme';
import { _Confirmation } from '../../home/confirmation';
import { officeApiHelper } from '../../office/office-api-helper';
import { errorService } from '../../error/error-handler';

describe('Confirmation', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call proper methods from secureData when Ok button is clicked', async () => {
    // given
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => ({ sync: mockSync, }));
    const mockDeleteTableBody = jest.spyOn(officeApiHelper, 'deleteObjectTableBody').mockImplementation(() => { });
    const mockClearEmptyRow = jest.spyOn(officeApiHelper, 'clearEmptyCrosstabRow').mockImplementation(() => { });
    const mockIfAnyProtected = jest.spyOn(officeApiHelper, 'checkIfAnySheetProtected').mockImplementation(() => false);
    const mockCheckObject = jest.spyOn(officeApiHelper, 'checkIfObjectExist').mockImplementation(() => true);
    const mockGetTable = jest.spyOn(officeApiHelper, 'getTable').mockImplementation(() => ({
      showHeaders: null,
      showFilterButton: null,
      getHeaderRowRange: () => ({ format: { font: { color: null, }, }, }),
    }));
    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsClearingFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<_Confirmation
      reportArray={mockReportArray}
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

  it('should fill clearErrors when secureData fails in ok button click', async () => {
    // given
    const mockSync = jest.fn();
    const error = new Error('test error');
    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementationOnce(() => ({ sync: mockSync, }));
    jest.spyOn(officeApiHelper, 'checkIfObjectExist').mockImplementationOnce(() => true);
    jest.spyOn(officeApiHelper, 'getTable').mockImplementationOnce(() => { throw error; });
    jest.spyOn(errorService, 'handleError').mockImplementationOnce(() => { });
    const clearErrors = [];
    const reportName = 'Test';
    const returnValue = {};
    errorService.handleError.mockReturnValueOnce(() => returnValue);
    clearErrors.push({ reportName, returnValue });

    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsClearingFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<_Confirmation
      reportArray={mockReportArray}
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
    const mockDeleteTableBody = jest.spyOn(officeApiHelper, 'deleteObjectTableBody').mockImplementation(() => { });
    const mockClearEmptyRow = jest.spyOn(officeApiHelper, 'clearEmptyCrosstabRow').mockImplementation(() => { });
    const mockIfAnyProtected = jest.spyOn(officeApiHelper, 'checkIfAnySheetProtected').mockImplementation(() => false);
    const mockCheckObject = jest.spyOn(officeApiHelper, 'checkIfObjectExist').mockImplementation(() => false);
    const mockGetTable = jest.spyOn(officeApiHelper, 'getTable').mockImplementation(() => ({
      showHeaders: null,
      showFilterButton: null,
      getHeaderRowRange: () => ({ format: { font: { color: null, }, }, }),
    }));
    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsClearingFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<_Confirmation
      reportArray={mockReportArray}
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
    const mockIfAnyProtected = jest.spyOn(officeApiHelper, 'checkIfAnySheetProtected').mockImplementationOnce(() => { throw new Error(); });
    const mockHandleError = jest.spyOn(errorService, 'handleError').mockImplementation(() => { });

    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsClearingFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<_Confirmation
      reportArray={mockReportArray}
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
    const confirmationWrapper = mount(<_Confirmation
      isSecured={false}
      toggleIsConfirmFlag={mockToggleIsConfirmFlag}
    />);
    const okWrapper = confirmationWrapper.find('#cancel-btn');
    // when
    okWrapper.simulate('click');
    // then
    await expect(mockToggleIsConfirmFlag).toBeCalledWith(false);
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
