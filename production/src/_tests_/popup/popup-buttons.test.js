import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { PopupButtonsNotConnected } from '../../popup/popup-buttons/popup-buttons';
import { objectImportType } from '../../mstr-object/constants';

describe('PopupButtons', () => {
  it('should NOT display prepare data when secondary action NOT provided',
    () => {
      // given
      const secondaryAction = jest.fn();
      // when
      const { queryByText } = render(<PopupButtonsNotConnected />);
      // then
      expect(queryByText('Prepare Data')).not.toBeInTheDocument();
    });

  it('should display prepare data when secondary action provided', () => {
    // given
    const secondaryAction = jest.fn();
    // when
    const { getByText } = render(<PopupButtonsNotConnected
      handleSecondary={secondaryAction}
      hideSecondary={false}
    />);
    // then
    expect(getByText('Prepare Data')).toBeInTheDocument();
  });

  it('should display back button when handleBack provided', () => {
    // given
    const handleBack = jest.fn();
    // when
    const { getByText } = render(<PopupButtonsNotConnected
      handleBack={handleBack}
    />);
    // then
    expect(getByText('Back')).toBeInTheDocument();
  });

  it('should NOT display back button with cancel action when handleBack NOT provided', () => {
    // given
    const handleBack = jest.fn();
    // when
    const { queryByText } = render(<PopupButtonsNotConnected />);
    // then
    expect(queryByText('Back')).not.toBeInTheDocument();
  });

  it('should call secondary action when prepare data clicked', () => {
    // given
    const secondaryAction = jest.fn();
    const { getByText } = render(<PopupButtonsNotConnected
      handleSecondary={secondaryAction}
    />);
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
    const { container } = render(<PopupButtonsNotConnected
      disableActiveActions={disableActiveActions}
    />);
    // then
    expect(container.querySelector('span.mstr-rc-tooltip-source')).toBeInTheDocument();
  });

  it('should render a tooltip span if the cube Isn’t  published', () => {
    // when
    const { container } = render(<PopupButtonsNotConnected
      isPublished={false}
    />);
    // then
    expect(container.querySelector('span.mstr-rc-tooltip-source')).toBeInTheDocument();
  });

  it('should NOT display secondary button when hideSecondary prop is provided',
    () => {
      // when
      const { queryByText } = render(<PopupButtonsNotConnected hideSecondary />);
      // then
      expect(queryByText('Data Preview')).not.toBeInTheDocument();
    });

  it('should display secondary button when hideSecondary prop is not provided',
    () => {
      // when
      const { getByText } = render(<PopupButtonsNotConnected hideSecondary={false} />);
      // then
      expect(getByText('Data Preview')).toBeInTheDocument();
    });

  it('should display primary button as Apply when useImportAsRunButton is provided ',
    () => {
      // given
      // when
      const { getByText } = render(<PopupButtonsNotConnected
        useImportAsRunButton
      />);
      // then
      expect(getByText('Data Preview')).toBeInTheDocument();
      expect(getByText('Apply')).toBeInTheDocument();
      expect(getByText('Cancel')).toBeInTheDocument();
    });

  it('should display primary button as "Import Data" when primaryImportType is "table" ',
    () => {
      // given
      // when
      const { getByText } = render(<PopupButtonsNotConnected
        primaryImportType={objectImportType.TABLE}
      />);
      // then
      expect(getByText('Import Data')).toBeInTheDocument();
      expect(getByText('Cancel')).toBeInTheDocument();
    });

  it('should display primary button as "Import Image" when primaryImportType is "image" ',
    () => {
      // given
      // when
      const { getByText } = render(<PopupButtonsNotConnected
        primaryImportType={objectImportType.IMAGE}
      />);
      // then
      expect(getByText('Import Image')).toBeInTheDocument();
      expect(getByText('Cancel')).toBeInTheDocument();
    });

  it(`should display primary button as "Import Data" and secondary button as "Import Image"
    when primaryImportType is "table" and shouldShowImportImage is true`,
  () => {
    // when
    const { getByText } = render(<PopupButtonsNotConnected
      primaryImportType={objectImportType.TABLE}
      shouldShowImportImage
      handleSecondary={jest.fn()}
    />);
    // then
    expect(getByText('Import Data')).toBeInTheDocument();
    expect(getByText('Import Image')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
  });
});
