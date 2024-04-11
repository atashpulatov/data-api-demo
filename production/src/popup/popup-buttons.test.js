import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';

import { reduxStore } from '../store';

import { officeActions } from '../redux-reducer/office-reducer/office-actions';
import { PopupButtons } from './popup-buttons/popup-buttons';

describe('PopupButtons', () => {
  it('should NOT display prepare data when secondary action NOT provided', () => {
    // when
    const { queryByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons />
      </Provider>
    );
    // then
    expect(queryByText('Prepare Data')).not.toBeInTheDocument();
  });

  it('should display prepare data when secondary action provided', () => {
    // given
    const secondaryAction = jest.fn();
    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons handleSecondary={secondaryAction} hideSecondary={false} />
      </Provider>
    );
    // then
    expect(getByText('Prepare Data')).toBeInTheDocument();
  });

  it('should display back button when handleBack provided', () => {
    // given
    const handleBack = jest.fn();
    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons handleBack={handleBack} />
      </Provider>
    );
    // then
    expect(getByText('Back')).toBeInTheDocument();
  });

  it('should NOT display back button with cancel action when handleBack NOT provided', () => {
    // when
    const { queryByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons />
      </Provider>
    );
    // then
    expect(queryByText('Back')).not.toBeInTheDocument();
  });

  it('should call secondary action when prepare data clicked', () => {
    // given
    const secondaryAction = jest.fn();
    const { getByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons handleSecondary={secondaryAction} />
      </Provider>
    );
    const secondaryButton = getByText('Prepare Data');
    // when
    fireEvent.click(secondaryButton);
    // then
    expect(secondaryAction).toBeCalled();
  });
  it('should render a tooltip span if the buttons are disabled', () => {
    // given
    const disableActiveActions = true;
    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons disableActiveActions={disableActiveActions} />
      </Provider>
    );

    const button = getByText('Import');
    fireEvent.focus(button);

    // then
    expect(document.querySelector('.mstr-rc-3-tooltip__content')).toBeInTheDocument();
  });

  it('should render a tooltip span if the cube isn’t  published', () => {
    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons isPublished={false} />
      </Provider>
    );

    const button = getByText('Import');
    fireEvent.focus(button);

    // then
    expect(document.querySelector('.mstr-rc-3-tooltip__content')).toBeInTheDocument();
  });

  it('should NOT display secondary button when hideSecondary prop is provided', () => {
    // when
    const { queryByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons hideSecondary />
      </Provider>
    );
    // then
    expect(queryByText('Data Preview')).not.toBeInTheDocument();
  });

  it('should display secondary button when hideSecondary prop is not provided', () => {
    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons hideSecondary={false} />
      </Provider>
    );
    // then
    expect(getByText('Data Preview')).toBeInTheDocument();
  });

  it('should display ButtonWithOptions when shouldShowImportAsVisualization is provided ', () => {
    // given
    reduxStore.dispatch(officeActions.toggleImportAsPivotTableFlag(true));
    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons shouldShowImportAsVisualization />
      </Provider>
    );
    // then
    expect(getByText('Import')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should display import button when isImportReport is provided ', () => {
    // given
    reduxStore.dispatch(officeActions.toggleImportAsPivotTableFlag(true));
    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons isImportReport />
      </Provider>
    );
    // then
    expect(getByText('Import')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should display import button when hideSecondary and handleSecondary are not provided', () => {
    // given
    reduxStore.dispatch(officeActions.toggleImportAsPivotTableFlag(true));
    // when
    const { getByText } = render(
      <Provider store={reduxStore}>
        <PopupButtons />
      </Provider>
    );
    // then
    expect(getByText('Import')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });
});
