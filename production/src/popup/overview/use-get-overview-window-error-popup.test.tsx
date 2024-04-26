import React from 'react';
import { Provider } from 'react-redux';
import { PopupTypes } from '@mstr/connector-components';
import { renderHook } from '@testing-library/react';
import { createStore } from 'redux';

import useGetOverviewWindowErrorPopup from './use-get-overview-window-error-popup';

import overviewHelper from './overview-helper';

import { rootReducer } from '../../store';

describe('useGetOverviewWindowErrorPopup', () => {
  it('should call setRangeTakenPopup when conditions are met', () => {
    // Given
    const setSidePanelPopupMock = jest.fn();

    const initialState = {
      officeReducer: {
        popupData: { type: PopupTypes.RANGE_TAKEN },
      },
    };

    // @ts-expect-error
    const store = createStore(rootReducer, initialState);

    const setRangeTakenPopupMock = jest
      .spyOn(overviewHelper, 'setRangeTakenPopup')
      .mockImplementation(() => {});

    // When
    renderHook(
      () =>
        useGetOverviewWindowErrorPopup({
          setDialogPopup: setSidePanelPopupMock,
        }),
      {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
      }
    );

    // Then
    expect(setRangeTakenPopupMock).toHaveBeenCalled();
  });

  it('should call setPageByRefreshFailedPopup  when conditions are met', () => {
    // Given
    const setSidePanelPopupMock = jest.fn();

    const initialState = {
      officeReducer: {
        popupData: { type: PopupTypes.FAILED_TO_REFRESH_PAGES },
      },
    };

    // @ts-expect-error
    const store = createStore(rootReducer, initialState);

    const setRangeTakenPopupMock = jest
      .spyOn(overviewHelper, 'setRangeTakenPopup')
      .mockImplementation(() => {});

    // When
    renderHook(
      () =>
        useGetOverviewWindowErrorPopup({
          setDialogPopup: setSidePanelPopupMock,
        }),
      {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
      }
    );

    // Then
    expect(setRangeTakenPopupMock).toHaveBeenCalled();
  });
});
