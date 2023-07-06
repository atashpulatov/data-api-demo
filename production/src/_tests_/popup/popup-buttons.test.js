// TODO: Rewrite tests
/* eslint-disable jest/no-disabled-tests */
import React from 'react';
import { shallow, mount } from 'enzyme';
import { PopupButtonsNotConnected } from '../../popup/popup-buttons/popup-buttons';

describe('PopupButtons', () => {
  it('should NOT display prepare data when secondary action NOT provided',
    () => {
      // given
      const secondaryAction = jest.fn();
      // when
      const buttonsWrapped = shallow(<PopupButtonsNotConnected />);
      // then
      expect(buttonsWrapped.exists('#prepare')).not.toBeTruthy();
    });

  it('should display prepare data when secondary action provided', () => {
    // given
    const secondaryAction = jest.fn();
    // when
    const buttonsWrapped = mount(<PopupButtonsNotConnected
      handleSecondary={secondaryAction}
      hideSecondary={false}
    />);
    // thenfix
    expect(buttonsWrapped.exists('#prepare')).toBeTruthy();
  });

  it('should display back button when handleBack provided', () => {
    // given
    const handleBack = jest.fn();
    // when
    const buttonsWrapped = mount(<PopupButtonsNotConnected
      handleBack={handleBack}
    />);
    // thenfix
    expect(buttonsWrapped.exists('#back')).toBeTruthy();
  });

  it('should NOT display back button with cancel action when handleBack NOT provided', () => {
    // given
    const handleBack = jest.fn();
    // when
    const buttonsWrapped = shallow(<PopupButtonsNotConnected />);
    // thenfix
    expect(buttonsWrapped.exists('#backCancel')).toBeFalsy();
  });

  it.skip('should call secondary action when prepare data clicked', () => {
    // given
    const secondaryAction = jest.fn();
    const buttonsWrapped = mount(<PopupButtonsNotConnected
      handleSecondary={secondaryAction}
    />);
    const secondaryButton = buttonsWrapped.find('Button#prepare');
    // when
    secondaryButton.simulate('click');
    // then
    expect(secondaryAction).toBeCalled();
  });
  it.skip('should render a tooltip span if the buttons are disabled', () => {
    // given
    const disableActiveActions = true;
    // when
    const buttonsWrapped = mount(<PopupButtonsNotConnected
      disableActiveActions={disableActiveActions}
    />);
    const tooltipSpan = buttonsWrapped.find('Popover.button-tooltip');
    // then
    expect(tooltipSpan).toHaveLength(2);
  });

  it.skip('should render a tooltip span if the cube Isn’t  published', () => {
    // when
    const buttonsWrapped = mount(<PopupButtonsNotConnected
      isPublished={false}
    />);
    const tooltipSpan = buttonsWrapped.find('Popover.button-tooltip');
    // then
    expect(tooltipSpan).toHaveLength(2);
  });
  it('should not render a tooltip span if the buttons are enabled', () => {
    // given
    const disableActiveActions = false;
    // when
    const buttonsWrapped = shallow(<PopupButtonsNotConnected
      disableActiveActions={disableActiveActions}
    />);
    const tooltipSpan = buttonsWrapped.find('.button-tooltip');
    // then
    expect(tooltipSpan).toHaveLength(0);
  });

  it('should NOT display secondary button when hideSecondary prop is provided',
    () => {
      // when
      const buttonsWrapped = mount(<PopupButtonsNotConnected hideSecondary />);
      // then
      expect(buttonsWrapped.exists('#data-preview')).not.toBeTruthy();
      expect(buttonsWrapped.exists('#import')).toBeTruthy();
    });

  it('should display secondary button when hideSecondary prop is not provided',
    () => {
      // when
      const buttonsWrapped = mount(<PopupButtonsNotConnected hideSecondary={false} />);
      // then
      expect(buttonsWrapped.exists('#data-preview')).toBeTruthy();
      expect(buttonsWrapped.exists('#import')).toBeTruthy();
    });

  it.skip('should display only secondary button tooltip when disableSecondary prop is provided ',
    () => {
      // when
      const buttonsWrapped = mount(<PopupButtonsNotConnected handleSecondary disableSecondary />);
      const tooltipSpan = buttonsWrapped.find('Popover.button-tooltip');
      // then
      expect(tooltipSpan).toHaveLength(1);
    });

  it.skip('should display primary button tooltip CHECKING_SELECTION when isChecking is provided ',
    () => {
      // given
      // when
      const buttonsWrapped = mount(<PopupButtonsNotConnected
        hideSecondary
        checkingSelection
      />);
      const tooltipSpan = buttonsWrapped.find('Popover.button-tooltip');
      // then
      expect(tooltipSpan).toHaveLength(1);
      // TODO expect('text of tooltip').toBe(CHECKING_SELECTION);
    });

  it.skip('should display primary button tooltip NOT_SUPPORTED_VIZ when isChecking is provided ',
    () => {
      // given
      // when
      const buttonsWrapped = mount(<PopupButtonsNotConnected
        hideSecondary
        isPublished={false}
        disableSecondary
      />);
      const tooltipSpan = buttonsWrapped.find('Popover.button-tooltip');
      // then
      expect(tooltipSpan).toHaveLength(1);
      // TODO expect('text of tooltip').toBe(NOT_SUPPORTED_VIZ);
    });

  it('should display primary button as Run when useImportAsRunButton is provided ',
    () => {
      // given
      // when
      const buttonsWrapped = mount(<PopupButtonsNotConnected
        useImportAsRunButton
      />);
      // then
      expect(buttonsWrapped.exists('#data-preview')).toBeTruthy();
      expect(buttonsWrapped.exists('#run')).toBeTruthy();
      expect(buttonsWrapped.exists('#cancel')).toBeTruthy();
    });
});
