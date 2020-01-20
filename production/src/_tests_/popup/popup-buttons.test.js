import React from 'react';
import { shallow } from 'enzyme';
import { PopupButtonsNotConnected } from '../../popup/popup-buttons/popup-buttons';


describe.skip('PopupButtons', () => {
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
    const buttonsWrapped = shallow(<PopupButtonsNotConnected
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
    const buttonsWrapped = shallow(<PopupButtonsNotConnected
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

  it('should call secondary action when prepare data clicked', () => {
    // given
    const secondaryAction = jest.fn();
    const buttonsWrapped = shallow(<PopupButtonsNotConnected
      handleSecondary={secondaryAction}
    />);
    const secondaryButton = buttonsWrapped.find('#prepare');
    // when
    secondaryButton.simulate('click');
    // then
    expect(secondaryAction).toBeCalled();
  });
  it('should render a tooltip span if the buttons are disabled', () => {
    // given
    const disableActiveActions = true;
    // when
    const buttonsWrapped = shallow(<PopupButtonsNotConnected
      disableActiveActions={disableActiveActions}
    />);
    const tooltipSpan = buttonsWrapped.find('.button-tooltip');
    // then
    expect(tooltipSpan).toHaveLength(2);
  });

  it('should render a tooltip span if the cube Isn’t  published', () => {
    // given
    // when
    const buttonsWrapped = shallow(<PopupButtonsNotConnected
      isPublished={false}
    />);
    const tooltipSpan = buttonsWrapped.find('.button-tooltip');
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
      // given
      // when
      const buttonsWrapped = shallow(<PopupButtonsNotConnected hideSecondary />);
      // then
      expect(buttonsWrapped.exists('#data-preview')).not.toBeTruthy();
      expect(buttonsWrapped.exists('#import')).toBeTruthy();
    });

  it('should display secondary button when hideSecondary prop is not provided',
    () => {
      // given
      // when
      const buttonsWrapped = shallow(<PopupButtonsNotConnected hideSecondary={false} />);
      // then
      expect(buttonsWrapped.exists('#data-preview')).toBeTruthy();
      expect(buttonsWrapped.exists('#import')).toBeTruthy();
    });

  it('should display only secondary button tooltip when disableSecondary prop is provided ',
    () => {
      // given
      // when
      const buttonsWrapped = shallow(<PopupButtonsNotConnected handleSecondary disableSecondary />);
      const tooltipSpan = buttonsWrapped.find('.button-tooltip');
      // then
      expect(tooltipSpan).toHaveLength(1);
    });
});
