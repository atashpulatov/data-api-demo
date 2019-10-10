import React from 'react';
import { mount } from 'enzyme';
import { _Confirmation } from '../../home/confirmation';
import { officeApiHelper } from '../../office/office-api-helper';

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
    const mockGetTable = jest.spyOn(officeApiHelper, 'getTable').mockImplementation(() => ({
      showHeaders: null,
      showFilterButton: null,
      getHeaderRowRange: () => ({
        format: { font: { color: null, }, },
      }),
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
    await expect(mockGetTable).toBeCalled();
    expect(mockClearEmptyRow).toBeCalled();
    await expect(mockSync).toBeCalled();
    await expect(mockDeleteTableBody).toBeCalled();
    expect(mockToggleIsClearingFlag).toBeCalled();
    expect(mockToggleSecuredFlag).toBeCalledWith(true);
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
