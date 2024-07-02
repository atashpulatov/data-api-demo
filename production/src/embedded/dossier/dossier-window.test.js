import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';

import { dialogHelper } from '../../dialog/dialog-helper';
import { sessionHelper } from '../../storage/session-helper';

import { reduxStore } from '../../store';

import { DialogCommands } from '../../dialog/dialog-controller-types';

import { DossierWindowNotConnected } from './dossier-window';

jest.mock('../../dialog/dialog-helper');

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
    const message = { command: DialogCommands.COMMAND_CANCEL };
    jest.spyOn(dialogHelper, 'officeMessageParent');

    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <DossierWindowNotConnected />
      </Provider>
    );
    fireEvent.click(getByText('Cancel'));

    // then
    expect(dialogHelper.officeMessageParent).toHaveBeenCalledWith(message);
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
