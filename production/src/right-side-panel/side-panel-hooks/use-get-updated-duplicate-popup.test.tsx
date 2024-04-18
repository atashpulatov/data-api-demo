import React from 'react';
import { Provider } from 'react-redux';
import { PopupTypes } from '@mstr/connector-components';
import { renderHook } from '@testing-library/react';
import { createStore } from 'redux';

import { useGetUpdatedDuplicatePopup } from './use-get-updated-duplicate-popup';

import { sidePanelNotificationHelper } from '../side-panel-services/side-panel-notification-helper';

import { rootReducer } from '../../store';

describe('useGetUpdatedDuplicatePopup', () => {
  it('should call sidePanelNotificationHelper.setDuplicatePopup when conditions are met', () => {
    // Given
    const sidePanelPopup = {
      type: PopupTypes.DUPLICATE,
    };
    const setSidePanelPopup = jest.fn();

    const setStateMock = jest.fn();
    jest.spyOn(React, 'useState').mockReturnValue([123, setStateMock]);

    const duplicatePopupParams = {
      activeCellAddress: 'A1',
      setDuplicatedObjectId: jest.fn(),
      setSidePanelPopup: jest.fn(),
    };
    const setDuplicatePopupMock = jest
      .spyOn(sidePanelNotificationHelper, 'setDuplicatePopup')
      .mockImplementation(() => {});

    const initialState = {
      officeReducer: {
        activeCellAddress: 'A1',
      },
    };
    // @ts-expect-error
    const store = createStore(rootReducer, initialState);

    // When
    const { result } = renderHook(
      () =>
        useGetUpdatedDuplicatePopup({
          sidePanelPopup,
          setSidePanelPopup,
        }),
      {
        wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
      }
    );

    // Then
    expect(setDuplicatePopupMock).toHaveBeenCalled();
    expect(duplicatePopupParams.activeCellAddress).toEqual(result.current.activeCellAddress);
  });
});
