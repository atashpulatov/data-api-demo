import React from 'react';
import {mount} from 'enzyme';
import {_Confirmation} from '../../src/home/confirmation';
import {Office} from '../mockOffice';
import {officeApiHelper} from '../../src/office/office-api-helper';

describe('Confirmation', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call proper methods from secureData when Ok button is clicked', async () => {
    // given
    const mockSync = jest.fn();
    const mockGetContext = jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementation(() => {
      return {
        sync: mockSync,
      };
    });
    const mockDeleteTableBody = jest.spyOn(officeApiHelper, 'deleteObjectTableBody').mockImplementation(() => {});
    const mockGetTable = jest.spyOn(officeApiHelper, 'getTable').mockImplementation(() => {
      return {
        showHeaders: null,
        showFilterButton: null,
        getHeaderRowRange: () => {
          return {
            format: {
              font: {
                color: null,
              },
            },
          };
        },
      };
    });
    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsSettingsFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<_Confirmation
      reportArray={mockReportArray}
      isSecured={false}
      toggleIsConfirmFlag={mockToggleIsConfirmFlag}
      toggleIsSettingsFlag={mockToggleIsSettingsFlag}
      toggleSecuredFlag={mockToggleSecuredFlag} />);
    const okWrapper = confirmationWrapper.find('#confirm-btn');
    // when
    okWrapper.simulate('click');
    // then
    await expect(mockGetContext).toBeCalled();
    await expect(mockGetTable).toBeCalled();
    await expect(mockSync).toBeCalled();
    await expect(mockDeleteTableBody).toBeCalled();
    await expect(mockToggleIsConfirmFlag).toBeCalledWith(false);
    await expect(mockToggleIsSettingsFlag).toBeCalledWith(false);
    await expect(mockToggleSecuredFlag).toBeCalledWith(true);
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
      id: 'mockId_' + i,
      name: 'mockName_' + i,
      bindId: 'mockBindId_' + i,
    });
  }
  return mockArray;
};

