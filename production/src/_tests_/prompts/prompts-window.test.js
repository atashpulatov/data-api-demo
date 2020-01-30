import React from 'react';
import { shallow } from 'enzyme';
import { _PromptsWindow } from '../../prompts/prompts-window';
import { notificationService } from '../../notification/notification-service';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { popupHelper } from '../../popup/popup-helper';

jest.mock('../../popup/popup-helper');

describe('_PromptsWindow', () => {
  const mstrData = {
    envUrl: 'env',
    token: 'token',
    projectId: 'projectId',
    chosenObjectId: 'chosenObjectId',
  };

  const popupState = {
    isReprompt: false
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render with props given', () => {
    // given
    // when
    const wrappedComponent = shallow(<_PromptsWindow mstrData={mstrData} popupState={popupState} />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(wrappedComponent.find('PromptsContainer').get(0)).toBeDefined();
  });

  it('addEventListener should be called on mount', () => {
    // given
    const addEventListener = jest.spyOn(window, 'addEventListener');
    // when
    shallow(<_PromptsWindow mstrData={mstrData} popupState={popupState} />);
    // then
    expect(addEventListener).toHaveBeenCalled();
  });

  it('removeEventListener should be called on unmount', () => {
    // given
    const removeEventListener = jest.spyOn(window, 'removeEventListener');
    // when
    const wrappedComponent = shallow(<_PromptsWindow mstrData={mstrData} popupState={popupState} />);
    wrappedComponent.unmount();
    // then
    expect(removeEventListener).toHaveBeenCalled();
  });

  it('watchForIframeAddition,loadEmbeddedDossier should be called on onPromptsContainerMount with proper params', () => {
    // given
    const ref = React.createRef();
    // when
    const wrappedComponent = shallow(<_PromptsWindow mstrData={mstrData} popupState={popupState} />);
    const watchForIframeAddition = jest.spyOn(wrappedComponent.instance(), 'watchForIframeAddition').mockImplementation(() => true);
    const loadEmbeddedDossier = jest.spyOn(wrappedComponent.instance(), 'loadEmbeddedDossier').mockImplementation(() => true);
    const onIframeLoad = jest.spyOn(wrappedComponent.instance(), 'onIframeLoad').mockImplementation(() => true);
    wrappedComponent.instance().onPromptsContainerMount(ref);
    // then
    expect(watchForIframeAddition).toHaveBeenCalledWith(ref, onIframeLoad);
    expect(loadEmbeddedDossier).toHaveBeenCalledWith(ref);
  });

  it('displayNotification should be called on proper messageReceived', () => {
    // given
    const givenMessage = { data: { value: { iServerErrorCode: 1234, message: 'test' } } };
    const displayNotificationSpy = jest.spyOn(notificationService, 'displayNotification');
    // when
    const wrappedComponent = shallow(<_PromptsWindow mstrData={mstrData} popupState={popupState} />);
    wrappedComponent.instance().messageReceived(givenMessage);
    // then
    const expectedObject = {
      type: 'warning',
      content: 'This object cannot be imported.',
      details: givenMessage.data.value.message
    };
    expect(displayNotificationSpy).toBeCalledWith(expectedObject);
  });

  it('displayNotification should not be called on diffrent messageReceived', () => {
    // given
    const displayNotificationSpy = jest.spyOn(notificationService, 'displayNotification');
    // when
    const wrappedComponent = shallow(<_PromptsWindow mstrData={mstrData} popupState={popupState} />);
    wrappedComponent.instance().messageReceived();
    // then
    expect(displayNotificationSpy).not.toBeCalled();
  });

  it('handleRun should call handlePopupErrors on not valid auth token ', async () => {
    // given
    popupHelper.handlePopupErrors = jest.fn();
    authenticationHelper.validateAuthToken = jest
      .fn()
      .mockImplementation(() => {
        throw Error();
      });
    // when
    const wrappedComponent = shallow(<_PromptsWindow
      mstrData={mstrData}
      popupState={popupState}
    />);
    await wrappedComponent.instance().handleRun();
    // then
    expect(authenticationHelper.validateAuthToken).toBeCalled();
    expect(popupHelper.handlePopupErrors).toBeCalled();
  });
});
