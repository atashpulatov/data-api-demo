import React from 'react';
import { shallow } from 'enzyme';
import { NotConnectedPopupButtons } from '../../popup/popup-buttons';


describe('PopupButtons', () => {
  it('should NOT display prepare data when secondary action NOT provided',
    () => {
      // given
      const secondaryAction = jest.fn();
      // when
      const buttonsWrapped = shallow(<NotConnectedPopupButtons />);
      // then
      expect(buttonsWrapped.exists('#prepare')).not.toBeTruthy();
    });

  it('should display prepare data when secondary action provided', () => {
    // given
    const secondaryAction = jest.fn();
    // when
    const buttonsWrapped = shallow(<NotConnectedPopupButtons
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
    const buttonsWrapped = shallow(<NotConnectedPopupButtons
      handleBack={handleBack}
    />);
    // thenfix
    expect(buttonsWrapped.exists('#back')).toBeTruthy();
  });

  it('should NOT display back button with cancel action when handleBack NOT provided', () => {
    // given
    const handleBack = jest.fn();
    // when
    const buttonsWrapped = shallow(<NotConnectedPopupButtons />);
    // thenfix
    expect(buttonsWrapped.exists('#backCancel')).toBeFalsy();
  });

  it('should call secondary action when prepare data clicked', () => {
    // given
    const secondaryAction = jest.fn();
    const buttonsWrapped = shallow(<NotConnectedPopupButtons
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
    const buttonsWrapped = shallow(<NotConnectedPopupButtons
      disableActiveActions={disableActiveActions}
    />);
    const tooltipSpan = buttonsWrapped.find('.button-tooltip');
    // then
    expect(tooltipSpan.length).toBe(2);
  });

  it('should render a tooltip span if the cube Isn’t  published', () => {
    // given
    // when
    const buttonsWrapped = shallow(<NotConnectedPopupButtons
      isPublished={false}
    />);
    const tooltipSpan = buttonsWrapped.find('.button-tooltip');
    // then
    expect(tooltipSpan.length).toBe(2);
  });
  it('should not render a tooltip span if the buttons are enabled', () => {
    // given
    const disableActiveActions = false;
    // when
    const buttonsWrapped = shallow(<NotConnectedPopupButtons
      disableActiveActions={disableActiveActions}
    />);
    const tooltipSpan = buttonsWrapped.find('.button-tooltip');
    // then
    expect(tooltipSpan.length).toBe(0);
  });

  it('should NOT display secondary button when hideSecondary prop is provided',
    () => {
      // given
      // when
      const buttonsWrapped = shallow(<NotConnectedPopupButtons hideSecondary />);
      // then
      expect(buttonsWrapped.exists('#data-preview')).not.toBeTruthy();
      expect(buttonsWrapped.exists('#import')).toBeTruthy();
    });

  it('should display secondary button when hideSecondary prop is not provided',
    () => {
      // given
      // when
      const buttonsWrapped = shallow(<NotConnectedPopupButtons hideSecondary={false} />);
      // then
      expect(buttonsWrapped.exists('#data-preview')).toBeTruthy();
      expect(buttonsWrapped.exists('#import')).toBeTruthy();
    });

  it('should display only secondary button tooltip when disableSecondary prop is provided ',
    () => {
      // given
      // when
      const buttonsWrapped = shallow(<NotConnectedPopupButtons handleSecondary disableSecondary />);
      const tooltipSpan = buttonsWrapped.find('.button-tooltip');
      // then
      expect(tooltipSpan.length).toBe(1);
    });
});
