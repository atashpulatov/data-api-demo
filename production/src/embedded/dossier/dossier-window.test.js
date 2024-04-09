import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';

import { popupHelper } from '../../popup/popup-helper';
import { sessionHelper } from '../../storage/session-helper';

import { reduxStore } from '../../store';

import { selectorProperties } from '../../attribute-selector/selector-properties';
import { DossierWindowNotConnected } from './dossier-window';

jest.mock('../../popup/popup-helper');

describe('Dossierwindow', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render PopupButtons', () => {
    // given
    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <DossierWindowNotConnected />
      </Provider>
    );

    // then
    expect(getByText('Import')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should call proper method on cancel action', () => {
    // given
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel };
    jest.spyOn(popupHelper, 'officeMessageParent');

    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <DossierWindowNotConnected />
      </Provider>
    );
    fireEvent.click(getByText('Cancel'));

    // then
    expect(popupHelper.officeMessageParent).toHaveBeenCalledWith(message);
  });

  it('should call installSessionProlongingHandler on mount', () => {
    // given
    jest.spyOn(sessionHelper, 'installSessionProlongingHandler');

    // when
    render(
      <Provider store={reduxStore}>
        <DossierWindowNotConnected />
      </Provider>
    );

    // then
    expect(sessionHelper.installSessionProlongingHandler).toHaveBeenCalled();
  });
});
