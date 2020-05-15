import React from 'react';
import { shallow } from 'enzyme';
import { PromptsWindowNotConnected } from '../../prompts/prompts-window';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { popupHelper } from '../../popup/popup-helper';
import { sessionHelper, EXTEND_SESSION } from '../../storage/session-helper';

jest.mock('../../popup/popup-helper');

describe('PromptsWindowNotConnected', () => {
  const mstrData = {
    envUrl: 'env',
    token: 'token',
    projectId: 'projectId',
    chosenObjectId: 'chosenObjectId',
    promptsAnswers: 'promptsAnswers',
  };

  const popupState = { isReprompt: false };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render with props given', () => {
    // given
    // when
    const wrappedComponent = shallow(<PromptsWindowNotConnected mstrData={mstrData} popupState={popupState} />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(wrappedComponent.find('PromptsContainer').get(0)).toBeDefined();
  });

  it('addEventListener should be called on mount', () => {
    // given
    const addEventListener = jest.spyOn(window, 'addEventListener');
    // when
    shallow(<PromptsWindowNotConnected mstrData={mstrData} popupState={popupState} />);
    // then
    expect(addEventListener).toHaveBeenCalled();
  });

  it('removeEventListener should be called on unmount', () => {
    // given
    const removeEventListener = jest.spyOn(window, 'removeEventListener');
    // when
    const wrappedComponent = shallow(<PromptsWindowNotConnected mstrData={mstrData} popupState={popupState} />);
    wrappedComponent.unmount();
    // then
    expect(removeEventListener).toHaveBeenCalled();
  });

  it('watchForIframeAddition,loadEmbeddedDossier should be called on onPromptsContainerMount with proper params', () => {
    // given
    const ref = React.createRef();
    // when
    const wrappedComponent = shallow(<PromptsWindowNotConnected mstrData={mstrData} popupState={popupState} />);
    const watchForIframeAddition = jest.spyOn(wrappedComponent.instance(), 'watchForIframeAddition').mockImplementation(() => true);
    const loadEmbeddedDossier = jest.spyOn(wrappedComponent.instance(), 'loadEmbeddedDossier').mockImplementation(() => true);
    const onIframeLoad = jest.spyOn(wrappedComponent.instance(), 'onIframeLoad').mockImplementation(() => true);
    wrappedComponent.instance().onPromptsContainerMount(ref);
    // then
    expect(watchForIframeAddition).toHaveBeenCalledWith(ref, onIframeLoad);
    expect(loadEmbeddedDossier).toHaveBeenCalledWith(ref);
  });

  it('handlePopupErrors should be called on proper messageReceived', () => {
    // given
    popupHelper.handlePopupErrors = jest.fn();
    const givenMessage = { data: { value: { statusCode: 201, iServerErrorCode: 1234, message: 'test' } } };
    // when
    const wrappedComponent = shallow(<PromptsWindowNotConnected mstrData={mstrData} popupState={popupState} />);
    wrappedComponent.instance().messageReceived(givenMessage);
    // then
    const expectedObject = {
      status: givenMessage.data.value.statusCode,
      response: {
        body: {
          code: givenMessage.data.value.errorCode,
          iServerCode: givenMessage.data.value.iServerErrorCode,
          message: givenMessage.data.value.message,
        },
        text: JSON.stringify({
          code: givenMessage.data.value.errorCode,
          iServerCode: givenMessage.data.value.iServerErrorCode,
          message: givenMessage.data.value.message
        }),
      }
    };
    expect(popupHelper.handlePopupErrors).toBeCalledWith(expectedObject);
  });

  it('handlePopupErrors should not be called on different messageReceived', () => {
    // given
    popupHelper.handlePopupErrors = jest.fn();
    // when
    const wrappedComponent = shallow(<PromptsWindowNotConnected mstrData={mstrData} popupState={popupState} />);
    wrappedComponent.instance().messageReceived();
    // then
    expect(popupHelper.handlePopupErrors).not.toBeCalled();
  });

  it('prolongSession should be called on EXTEND_SESSION message', () => {
    // given
    const message = { data: EXTEND_SESSION };
    const stopLoading = jest.fn();
    window.Office = {
      context: {
        ui: { messageParent: () => { }, },
        diagnostics: { host: 'host', platform: 'platform', version: 'version' },
        requirements: { isSetSupported: jest.fn() }
      }
    };

    // when
    const wrappedComponent = shallow(<PromptsWindowNotConnected
      mstrData={mstrData}
      popupState={popupState}
      stopLoading={stopLoading} />);
    const prolongSession = jest.spyOn(wrappedComponent.instance(), 'prolongSession');
    wrappedComponent.instance().messageReceived(message);

    // then
    expect(prolongSession).toHaveBeenCalled();
  });

  it('prolongSession should not be called on different messages', () => {
    // given
    const message = {};
    const stopLoading = jest.fn();

    // when
    const wrappedComponent = shallow(<PromptsWindowNotConnected
      mstrData={mstrData}
      popupState={popupState}
      stopLoading={stopLoading} />);
    const prolongSession = jest.spyOn(wrappedComponent.instance(), 'prolongSession');
    wrappedComponent.instance().messageReceived(message);

    // then
    expect(prolongSession).not.toBeCalled();
  });

  it('should call installSessionProlongingHandler on mount', () => {
    // given
    jest.spyOn(sessionHelper, 'installSessionProlongingHandler');

    // when
    shallow(<PromptsWindowNotConnected mstrData={mstrData} popupState={popupState} />);

    // then
    expect(sessionHelper.installSessionProlongingHandler).toHaveBeenCalled();
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
    const wrappedComponent = shallow(<PromptsWindowNotConnected
      mstrData={mstrData}
      popupState={popupState}
    />);
    await wrappedComponent.instance().handleRun();
    // then
    expect(authenticationHelper.validateAuthToken).toBeCalled();
    expect(popupHelper.handlePopupErrors).toBeCalled();
  });
});
