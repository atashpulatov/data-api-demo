import React from 'react';
import { mount } from 'enzyme';
import { SessionExtendingWrapper } from '../../popup/session-extending-wrapper';
import { sessionHelper } from '../../storage/session-helper';

describe('SessionExtendingWrapper.js', () => {
  it('should contain all assigned props and should return true on toBeDefined', () => {
    // given
    const popupWrapperId = 'popup-wrapper';
    const givenProps = {
      children: <section />,
      id: popupWrapperId,
      onSessionExpire: jest.fn(),
      t: (t) => t,
    };
    // when
    const wrappedComponent = mount(<SessionExtendingWrapper {...givenProps} />);
    // then
    const overlayWrapper = wrappedComponent.find(`#${popupWrapperId}`).at(1);
    expect(overlayWrapper.props().id).toEqual(popupWrapperId);
    expect(overlayWrapper.props().onClick).toBeDefined();
    expect(overlayWrapper.props().onKeyDown).toBeDefined();
  });

  it('should call installSessionProlongingHandler on mount', () => {
    // given
    sessionHelper.installSessionProlongingHandler = jest.fn();
    const givenProps = {
      children: <div />,
      id: 'popup-wrapper',
      onSessionExpire: 'onSessionExpire',
      t: (t) => t
    };
    // when
    const componentWrapper = mount(<SessionExtendingWrapper {...givenProps} />);
    // then
    expect(componentWrapper.find('#popup-wrapper').exists()).toEqual(true);
    expect(sessionHelper.installSessionProlongingHandler).toHaveBeenCalled();
  });

  it('should contain id and have one child', () => {
    // given
    sessionHelper.installSessionProlongingHandler = jest.fn();
    const givenProps = {
      children: <div />,
      id: 'popup-wrapper',
      onSessionExpire: jest.fn(),
      t: (t) => t
    };
    // when
    const wrappedComponent = mount(<SessionExtendingWrapper {...givenProps} />);
    // then
    expect(wrappedComponent.exists(`#${givenProps.id}`)).toBeTruthy();
    expect(wrappedComponent.props().onSessionExpire).toEqual(givenProps.onSessionExpire);
    expect(wrappedComponent.children()).toHaveLength(1);
  });
});
