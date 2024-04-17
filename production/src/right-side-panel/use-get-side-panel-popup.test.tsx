import React from 'react';
import { Provider } from 'react-redux';
import { PopupTypes } from '@mstr/connector-components';
import { renderHook } from '@testing-library/react';
import { createStore } from 'redux';

import { useGetSidePanelPopup } from './use-get-side-panel-popup';

import officeReducerHelper from '../office/store/office-reducer-helper';
import { sidePanelNotificationHelper } from './side-panel-notification-helper';

import { rootReducer } from '../store';

describe('useGetSidePanelPopup', () => {
  it('should call sidePanelNotificationHelper.setDuplicatePopup when conditions are met', () => {
    // Given
    const sidePanelPopupMock = { type: PopupTypes.RANGE_TAKEN };
    const setSidePanelPopupMock = jest.fn();

    const initialState = {
      officeReducer: {
        popupData: { type: PopupTypes.RANGE_TAKEN },
        activeCellAddress: 'A1',
        isSecured: false,
        isClearDataFailed: false,
      },
      popupStateReducer: {
        isDataOverviewOpen: false,
      },
      repromptsQueueReducer: {
        repromptsQueue: [] as any,
      },
    };

    // @ts-expect-error
    const store = createStore(rootReducer, initialState);

    const setRangeTakenPopupMock = jest
      .spyOn(sidePanelNotificationHelper, 'setRangeTakenPopup')
      .mockImplementation(() => {});

    const objectData = {
      mstrObjectType: {
        name: 'visualization',
      },
    };
    jest
      .spyOn(officeReducerHelper, 'getObjectFromObjectReducerByObjectWorkingId')
      .mockReturnValue(objectData as any);

    // When
    renderHook(
      () =>
        useGetSidePanelPopup({
          sidePanelPopup: sidePanelPopupMock,
          setSidePanelPopup: setSidePanelPopupMock,
        }),
      {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
      }
    );

    // Then
    expect(setRangeTakenPopupMock).toHaveBeenCalled();
  });
});
