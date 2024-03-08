import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { DossierWindowNotConnected } from '../../../embedded/dossier/dossier-window';
import { selectorProperties } from '../../../attribute-selector/selector-properties';
import { popupHelper } from '../../../popup/popup-helper';
import { sessionHelper } from '../../../storage/session-helper';
import { reduxStore } from '../../../store';

jest.mock('../../../popup/popup-helper');

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
    expect(getByText('Back')).toBeInTheDocument();
    expect(getByText('Import Data')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should call proper method on cancel action', () => {
    // given
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
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
