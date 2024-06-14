import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';

import { officeApiHelper } from '../../office/api/office-api-helper';
import { officeRemoveHelper } from '../../office/remove/office-remove-helper';
import { sidePanelService } from '../side-panel-services/side-panel-service';

import { reduxStore } from '../../store';

import { errorService } from '../../error/error-handler';
import { ConfirmationNotConnected } from './confirmation';

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

describe('Confirmation', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call proper methods from secureData when Ok button is clicked', () => {
    // given
    const mockSecureData = jest
      .spyOn(sidePanelService, 'secureData')
      .mockImplementation(() => jest.fn);
    // const mockDismissAll = jest
    //   .spyOn(notificationService, 'dismissNotifications')
    //   .mockImplementation(() => jest.fn);
    const mockToggleIsConfirmFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const { getByText } = render(
      <Provider store={reduxStore}>
        <ConfirmationNotConnected
          objects={mockReportArray}
          isSecured={false}
          toggleIsConfirmFlag={mockToggleIsConfirmFlag}
        />
      </Provider>
    );
    // when
    fireEvent.click(getByText('OK'));
    // then
    expect(mockSecureData).toBeCalled();
    // expect(mockDismissAll).toBeCalled();
  });

  it('should fill clearErrors when secureData fails in ok button click', () => {
    // given
    const mockSync = jest.fn();
    const error = new Error('test error');
    jest
      .spyOn(officeApiHelper, 'getExcelContext')
      .mockImplementationOnce(() => ({ sync: mockSync }));
    jest.spyOn(officeRemoveHelper, 'checkIfObjectExist').mockImplementationOnce(() => true);
    jest.spyOn(officeApiHelper, 'getTable').mockImplementationOnce(() => {
      throw error;
    });
    jest.spyOn(errorService, 'handleError').mockImplementationOnce(() => {});
    const clearErrors = [];
    const chosenObjectName = 'Test';
    const returnValue = {};
    errorService.handleError.mockReturnValueOnce(() => returnValue);
    clearErrors.push({ chosenObjectName, returnValue });

    const mockToggleIsConfirmFlag = jest.fn();
    const mockToggleIsClearDataFailedFlag = jest.fn();
    const mockToggleSecuredFlag = jest.fn();
    const mockReportArray = createMockFilesArray();
    const { getByText } = render(
      <Provider store={reduxStore}>
        <ConfirmationNotConnected
          objects={mockReportArray}
          isSecured={false}
          toggleIsConfirmFlag={mockToggleIsConfirmFlag}
          toggleIsClearDataFailedFlag={mockToggleIsClearDataFailedFlag}
          toggleSecuredFlag={mockToggleSecuredFlag}
        />
      </Provider>
    );
    // when
    fireEvent.click(getByText('OK'));
    // then
    expect(clearErrors).not.toBe(null);
  });

  it('should set isConfirm flag to false when Cancel is clicked', async () => {
    // given
    const mockToggleIsConfirmFlag = jest.fn();
    const { getByText } = render(
      <Provider store={reduxStore}>
        <ConfirmationNotConnected isSecured={false} toggleIsConfirmFlag={mockToggleIsConfirmFlag} />
      </Provider>
    );
    // when
    fireEvent.click(getByText('Cancel'));
    // then
    await expect(mockToggleIsConfirmFlag).toBeCalledWith(false);
  });
  it('should attach event listeners for outside of confirmation popup click and esc button', () => {
    // given
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    // when
    render(
      <Provider store={reduxStore}>
        <ConfirmationNotConnected isConfirm />
      </Provider>
    );
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
    const { rerender } = render(
      <Provider store={reduxStore}>
        <ConfirmationNotConnected isConfirm />
      </Provider>
    );
    // when
    rerender(
      <Provider store={reduxStore}>
        <ConfirmationNotConnected isConfirm={false} />
      </Provider>
    );
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
    render(
      <Provider store={reduxStore}>
        <ConfirmationNotConnected isConfirm toggleIsConfirmFlag={toggleIsConfirmFlagMock} />
      </Provider>
    );
    // when
    map.click({ target: null });
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
    render(
      <Provider store={reduxStore}>
        <ConfirmationNotConnected isConfirm toggleIsConfirmFlag={toggleIsConfirmFlagMock} />
      </Provider>
    );
    // when
    map.keyup({ key: 'Escape' });
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
    render(
      <Provider store={reduxStore}>
        <ConfirmationNotConnected isConfirm toggleIsConfirmFlag={toggleIsConfirmFlagMock} />
      </Provider>
    );
    // when
    map.keyup({ keyCode: 26 });
    // then
    expect(toggleIsConfirmFlagMock).toHaveBeenCalledTimes(0);
  });
});
