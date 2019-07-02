import React from 'react';
import {shallow} from 'enzyme';
import {_PopupButtons} from '../../src/popup/popup-buttons';

describe('PopupButtons', () => {
  it('should NOT display prepare data when secondary action NOT provided',
      () => {
      // given
        const secondaryAction = jest.fn();
        // when
        const buttonsWrapped = shallow(<_PopupButtons />);
        // then
        expect(buttonsWrapped.exists('#prepare')).not.toBeTruthy();
      });

  it('should display prepare data when secondary action provided', () => {
    // given
    const secondaryAction = jest.fn();
    // when
    const buttonsWrapped = shallow(<_PopupButtons
      handleSecondary={secondaryAction} />);
    // thenfix
    expect(buttonsWrapped.exists('#prepare')).toBeTruthy();
  });

  it('should display back button when handleBack provided', () => {
    // given
    const handleBack = jest.fn();
    // when
    const buttonsWrapped = shallow(<_PopupButtons
      handleBack={handleBack} />);
    // thenfix
    expect(buttonsWrapped.exists('#back')).toBeTruthy();
  });

  it('should NOT display back button with cancel action when handleBack NOT provided', () => {
    // given
    const handleBack = jest.fn();
    // when
    const buttonsWrapped = shallow(<_PopupButtons />);
    // thenfix
    expect(buttonsWrapped.exists('#backCancel')).toBeFalsy();
  });

  it('should call secondary action when prepare data clicked', () => {
    // given
    const secondaryAction = jest.fn();
    const buttonsWrapped = shallow(<_PopupButtons
      handleSecondary={secondaryAction} />);
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
    const buttonsWrapped = shallow(<_PopupButtons
      disableActiveActions={disableActiveActions} />);
    const tooltipSpan = buttonsWrapped.find('.button-tooltip');
    // then
    expect(tooltipSpan.length).toBe(2);
  });
  it('should not render a tooltip span if the buttons are enabled', () => {
    // given
    const disableActiveActions = false;
    // when
    const buttonsWrapped = shallow(<_PopupButtons
      disableActiveActions={disableActiveActions} />);
    const tooltipSpan = buttonsWrapped.find('.button-tooltip');
    // then
    expect(tooltipSpan.length).toBe(0);
  });
});
