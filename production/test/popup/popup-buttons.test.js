import React from 'react';
import {shallow} from 'enzyme';
import {PopupButtons} from '../../src/popup/popup-buttons';

describe('PopupButtons', () => {
  it('should NOT display prepare data when secondary action NOT provided',
      () => {
        // given
        const secondaryAction = jest.fn();
        // when
        const buttonsWrapped = shallow(<PopupButtons />);
        // then
        expect(buttonsWrapped.exists('#prepare')).not.toBeTruthy();
      });

  it('should display prepare data when secondary action provided', () => {
    // given
    const secondaryAction = jest.fn();
    // when
    const buttonsWrapped = shallow(<PopupButtons
      handleSecondary={secondaryAction} />);
    // thenfix
    expect(buttonsWrapped.exists('#prepare')).toBeTruthy();
  });

  it('should display back button when handleBack provided', () => {
    // given
    const handleBack = jest.fn();
    // when
    const buttonsWrapped = shallow(<PopupButtons
      handleBack={handleBack} />);
    // thenfix
    expect(buttonsWrapped.exists('#back')).toBeTruthy();
  });

  it('should display back button with cancel action when handleBack NOT provided', () => {
    // given
    const handleBack = jest.fn();
    // when
    const buttonsWrapped = shallow(<PopupButtons />);
    // thenfix
    expect(buttonsWrapped.exists('#backCancel')).toBeTruthy();
  });

  it('should call secondary action when prepare data clicked', () => {
    // given
    const secondaryAction = jest.fn();
    const buttonsWrapped = shallow(<PopupButtons
      handleSecondary={secondaryAction} />);
    const secondaryButton = buttonsWrapped.find('#prepare');
    // when
    secondaryButton.simulate('click');
    // then
    expect(secondaryAction).toBeCalled();
  });
});
