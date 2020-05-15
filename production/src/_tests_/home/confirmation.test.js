import React from 'react';
import { mount } from 'enzyme';
import { ConfirmationNotConnected } from '../../home/confirmation';
import { officeApiHelper } from '../../office/api/office-api-helper';
import { errorService } from '../../error/error-handler';
import { officeRemoveHelper } from '../../office/remove/office-remove-helper';
import { homeHelper } from '../../home/home-helper';
import { notificationService } from '../../notification-v2/notification-service';

describe('Confirmation', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call proper methods from secureData when Ok button is clicked', () => {
    // given
    const mockSecureData = jest.spyOn(homeHelper, 'secureData').mockImplementation(() => jest.fn);
    const mockDismissAll = jest.spyOn(notificationService, 'dismissNotifications').mockImplementation(() => jest.fn);
    const mockToggleIsConfirmFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<ConfirmationNotConnected
      objects={mockReportArray}
      isSecured={false}
      toggleIsConfirmFlag={mockToggleIsConfirmFlag} />);
    const okWrapper = confirmationWrapper.find('#confirm-btn');
    // when
    okWrapper.simulate('click');
    // then
    expect(mockSecureData).toBeCalled();
    expect(mockDismissAll).toBeCalled();
  });

  it('should fill clearErrors when secureData fails in ok button click', () => {
    // given
    const mockSync = jest.fn();
    const error = new Error('test error');
    jest.spyOn(officeApiHelper, 'getExcelContext').mockImplementationOnce(() => ({ sync: mockSync, }));
    jest.spyOn(officeRemoveHelper, 'checkIfObjectExist').mockImplementationOnce(() => true);
    jest.spyOn(officeApiHelper, 'getTable').mockImplementationOnce(() => { throw error; });
    jest.spyOn(errorService, 'handleError').mockImplementationOnce(() => { });
    const clearErrors = [];
    const chosenObjectName = 'Test';
    const returnValue = {};
    errorService.handleError.mockReturnValueOnce(() => returnValue);
    clearErrors.push({ chosenObjectName, returnValue });

    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsClearDataFailedFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const confirmationWrapper = mount(<ConfirmationNotConnected
      objects={mockReportArray}
      isSecured={false}
      toggleIsConfirmFlag={mockToggleIsConfirmFlag}
      toggleIsClearDataFailedFlag={mockToggleIsClearDataFailedFlag}
      toggleSecuredFlag={mockToggleSecuredFlag} />);
    const okWrapper = confirmationWrapper.find('#confirm-btn');
    // when
    okWrapper.simulate('click');
    // then
    expect(clearErrors).not.toBe(null);
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
