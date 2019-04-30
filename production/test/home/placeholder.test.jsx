import React from 'react';
import {Placeholder} from '../../src/home/placeholder';
import {sessionHelper} from '../../src/storage/session-helper';
import {mount} from 'enzyme';
import {popupController} from '../../src/popup/popup-controller';
jest.mock('../../src/storage/session-helper');

describe('Placeholder', () => {
  it('should render and element', () => {
    // given
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    sessionHelperSpy.mockClear();

    // when
    const wrappedComponent = mount(<Placeholder />);

    // then
    expect(wrappedComponent).toBeDefined();
    expect(sessionHelperSpy).toHaveBeenCalled();
  });
  it('should open popup on button click', () => {
    // given
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    sessionHelperSpy.mockClear();
    const clickSpy = jest.spyOn(popupController, 'runPopupNavigation');
    const wrappedComponent = mount(<Placeholder />);
    const wrappedButton = wrappedComponent.find('button');

    // when
    wrappedButton.simulate('click');
    // then
    expect(wrappedButton).toBeDefined();
    expect(clickSpy).toHaveBeenCalled();
  });
});
