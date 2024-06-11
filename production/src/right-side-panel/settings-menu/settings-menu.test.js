import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { createStore } from 'redux';

import { authenticationService } from '../../authentication/authentication-service';
import overflowHelper from '../../helpers/helpers';

import { rootReducer } from '../../store';

import { errorService } from '../../error/error-handler';
import { popupController } from '../../popup/popup-controller';
import { sessionActions } from '../../redux-reducer/session-reducer/session-actions';
import { SettingsMenuNotConnected } from './settings-menu';

import { mockReports } from '../../../__mocks__/mockData';

describe('Settings Menu', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const initialState = {
    officeReducer: {
      isOverviewWindowAPISupported: true,
      isSettings: true,
      isSecured: false,
      isSettingsPanelLoaded: false,
    },
  };

  // @ts-expect-error
  const store = createStore(rootReducer, initialState);

  it('should open Imported Data Overview popup on proper menu element click', () => {
    // given
    const runImportedDataOverviewPopupSpy = jest
      .spyOn(popupController, 'runImportedDataOverviewPopup')
      .mockImplementation(() => {});
    const toggleIsSettingsFlag = jest.fn();
    const setIsDataOverviewOpen = jest.fn();

    const { getByText } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected
          toggleIsSettingsFlag={toggleIsSettingsFlag}
          setIsDataOverviewOpen={setIsDataOverviewOpen}
          isOverviewWindowAPISupported
        />
      </Provider>
    );
    const importedDataOverviewMenuOption = getByText('Overview');

    // when
    fireEvent.click(importedDataOverviewMenuOption);

    // then
    expect(runImportedDataOverviewPopupSpy).toBeCalled();
    expect(toggleIsSettingsFlag).toBeCalledWith(false);
  });

  it('should open Confirm popup on proper menu element click', () => {
    // given
    const toggleIsConfirmFlag = jest.fn();
    const toggleIsSettingsFlag = jest.fn();

    const { getByText } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected
          toggleIsConfirmFlag={toggleIsConfirmFlag}
          toggleIsSettingsFlag={toggleIsSettingsFlag}
          isSecured={false}
          objects={mockReports}
        />
      </Provider>
    );
    const clearDataMenuOption = getByText('Clear Data');

    // when
    fireEvent.click(clearDataMenuOption);

    // then
    expect(toggleIsConfirmFlag).toBeCalledWith(true);
    expect(toggleIsSettingsFlag).toBeCalledWith(false);
  });

  it('should log out on element logout click', async () => {
    // given
    const logOutRestSpy = jest
      .spyOn(authenticationService, 'logOutRest')
      .mockImplementation(() => {});
    const logOutSpy = jest.spyOn(sessionActions, 'logOut');
    const logOutRedirectSpy = jest.spyOn(authenticationService, 'logOutRedirect');

    const { getByText } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected
          toggleIsSettingsFlag={jest.fn()}
          clearSavedPromptAnswers={jest.fn()}
        />
      </Provider>
    );
    // when
    fireEvent.click(getByText('Log Out'));
    // then
    await expect(logOutRestSpy).toBeCalled();
    await expect(logOutSpy).toBeCalled();
    await expect(logOutRedirectSpy).toBeCalled();
  });

  it('should handle error on logout', () => {
    // given
    const logOutRestSpy = jest.spyOn(authenticationService, 'logOutRest').mockImplementation(() => {
      throw new Error();
    });
    const handleErrorSpy = jest.spyOn(errorService, 'handleError').mockImplementation();
    const { getByText } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected toggleIsSettingsFlag={jest.fn()} />
      </Provider>
    );

    // when
    fireEvent.click(getByText('Log Out'));

    // then
    expect(logOutRestSpy).toThrowError();
    expect(handleErrorSpy).toBeCalledTimes(1);
    expect(handleErrorSpy).toBeCalledWith(new Error());
  });

  it('component should be wrapped with settings-list classname', () => {
    // given
    window.Office = {
      context: {
        ui: { messageParent: () => {} },
        diagnostics: { host: 'host', platform: 'platform', version: 'version' },
        requirements: { isSetSupported: jest.fn() },
      },
    };
    // when
    const { getByRole } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected userFullName='userFullName' userInitials={null} userID={1} />
      </Provider>
    );
    // then
    expect(getByRole('list')).toHaveClass('settings-list');
  });

  it('component should render settings menu item in the settings menu context', () => {
    // given
    window.Office = {
      context: {
        ui: { messageParent: () => {} },
        diagnostics: { host: 'host', platform: 'platform', version: 'version' },
        requirements: { isSetSupported: jest.fn() },
      },
    };
    // when
    const { getByRole } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected userFullName='userFullName' userInitials={null} userID={1} />
      </Provider>
    );
    // then
    expect(getByRole('menuitem', { name: 'Settings' })).toBeInTheDocument();
  });

  it('toggleSettingsPanelLoadedFlag action should be dispatched on settings menu item click', () => {
    // given
    window.Office = {
      context: {
        ui: { messageParent: () => {} },
        diagnostics: { host: 'host', platform: 'platform', version: 'version' },
        requirements: { isSetSupported: jest.fn() },
      },
    };

    const toggleSettingsPanelLoadedFlag = jest.fn();
    const toggleIsSettingsFlag = jest.fn();

    // when
    const { getByRole } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected
          userFullName='userFullName'
          userInitials={null}
          userID={1}
          toggleSettingsPanelLoadedFlag={toggleSettingsPanelLoadedFlag}
          toggleIsSettingsFlag={toggleIsSettingsFlag}
        />
      </Provider>
    );

    // then
    fireEvent.click(getByRole('menuitem', { name: 'Settings' }));

    expect(toggleSettingsPanelLoadedFlag).toBeCalledTimes(1);
  });

  it('toggleSettingsPanelLoadedFlag action should be dispatched on enter key up', () => {
    // given
    window.Office = {
      context: {
        ui: { messageParent: () => {} },
        diagnostics: { host: 'host', platform: 'platform', version: 'version' },
        requirements: { isSetSupported: jest.fn() },
      },
    };

    const toggleSettingsPanelLoadedFlag = jest.fn();
    const toggleIsSettingsFlag = jest.fn();

    // when
    const { getByRole } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected
          userFullName='userFullName'
          userInitials={null}
          userID={1}
          toggleSettingsPanelLoadedFlag={toggleSettingsPanelLoadedFlag}
          toggleIsSettingsFlag={toggleIsSettingsFlag}
        />
      </Provider>
    );

    // then
    const element = getByRole('menuitem', { name: 'Settings' });
    fireEvent.keyUp(element, { key: 'Enter' });
    expect(toggleSettingsPanelLoadedFlag).toBeCalledTimes(1);
  });
  it('should attach event listeners for outside of settings menu click and esc button', () => {
    // given
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    // when
    render(
      <Provider store={store}>
        <SettingsMenuNotConnected isSettings />
      </Provider>
    );
    // then
    const spyCalls = addEventListenerSpy.mock.calls;
    expect(spyCalls[spyCalls.length - 1][0]).toEqual('click');
    expect(spyCalls[spyCalls.length - 1][1].name).toEqual('closeSettingsOnClick');
    expect(spyCalls[spyCalls.length - 2][0]).toEqual('keyup');
    expect(spyCalls[spyCalls.length - 2][1].name).toEqual('closeSettingsOnEsc');
  });
  it('should remove event listeners for outside of settings menu click and esc button', () => {
    // given
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    const updatedStore = createStore(rootReducer, {
      ...initialState,
      officeReducer: { ...initialState.officeReducer, isSettings: false },
    });

    const { rerender } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected />
      </Provider>
    );
    // when
    rerender(
      <Provider store={updatedStore}>
        <SettingsMenuNotConnected />
      </Provider>
    );
    // then
    const spyCalls = removeEventListenerSpy.mock.calls;
    expect(spyCalls[spyCalls.length - 1][0]).toEqual('click');
    expect(spyCalls[spyCalls.length - 1][1].name).toEqual('closeSettingsOnClick');
    expect(spyCalls[spyCalls.length - 2][0]).toEqual('keyup');
    expect(spyCalls[spyCalls.length - 2][1].name).toEqual('closeSettingsOnEsc');
  });
  it('should hide settings menu when clicking outside of it', () => {
    // given
    const toggleIsSettingsFlagMock = jest.fn();
    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    const { rerender } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected isSettings toggleIsSettingsFlag={toggleIsSettingsFlagMock} />
      </Provider>
    );
    // when
    const mockEvent = {
      target: document.createElement('div'),
      stopPropagation: jest.fn(),
    };
    map.click(mockEvent);
    rerender(
      <Provider store={store}>
        <SettingsMenuNotConnected isSettings toggleIsSettingsFlag={toggleIsSettingsFlagMock} />
      </Provider>
    );
    // then
    expect(toggleIsSettingsFlagMock).toHaveBeenCalledWith(false);
  });
  it('should hide settings menu when pressing ESC', () => {
    // given
    const toggleIsSettingsFlagMock = jest.fn();
    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    const { rerender } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected isSettings toggleIsSettingsFlag={toggleIsSettingsFlagMock} />
      </Provider>
    );
    // when
    map.keyup({ key: 'Escape' });
    rerender(
      <Provider store={store}>
        <SettingsMenuNotConnected isSettings toggleIsSettingsFlag={toggleIsSettingsFlagMock} />
      </Provider>
    );
    // then
    expect(toggleIsSettingsFlagMock).toHaveBeenCalledWith(false);
  });
  it('should not hide settings menu when pressing key other than ESC', () => {
    // given
    const toggleIsSettingsFlagMock = jest.fn();
    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    const { rerender } = render(
      <Provider store={store}>
        <SettingsMenuNotConnected isSettings toggleIsSettingsFlag={toggleIsSettingsFlagMock} />
      </Provider>
    );
    // when
    map.keyup({ keyCode: 26 });
    rerender(
      <Provider store={store}>
        <SettingsMenuNotConnected isSettings toggleIsSettingsFlag={toggleIsSettingsFlagMock} />
      </Provider>
    );
    // then
    expect(toggleIsSettingsFlagMock).toHaveBeenCalledTimes(0);
  });
  it('should return true on throw error', () => {
    // given
    Object.defineProperty(global, 'document', {
      writable: true,
      value: {
        createElement: () => ({
          style: {},
          focus: jest.fn(),
          select: jest.fn(),
          parentNode: { removeChild: jest.fn() },
        }),
        parentNode: { removeChild: jest.fn() },
        execCommand: jest.fn(),
        body: {
          appendChild: () => {
            throw new Error();
          },
          removeChild: jest.fn(),
        },
      },
    });

    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    // when
    const returnValue = overflowHelper.isOverflown();
    // then
    expect(returnValue).toBe(true);
  });
});
