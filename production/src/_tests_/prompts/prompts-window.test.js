import React from 'react';
import { shallow, mount } from 'enzyme';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PromptsWindowNotConnected } from '../../prompts/prompts-window';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { popupHelper } from '../../popup/popup-helper';
import { sessionHelper, EXTEND_SESSION } from '../../storage/session-helper';
import { reduxStore } from '../../store';

jest.mock('../../popup/popup-helper');

describe('PromptsWindowNotConnected', () => {
  const mstrData = {
    envUrl: 'env',
    token: 'token',
    projectId: 'projectId',
    chosenObjectId: 'chosenObjectId',
    promptsAnswers: [{}],
  };

  const editedObject = {
    promptsAnswers: ['promptsAnswers'],
  };

  const session = {
    envUrl: 'url/test',
    authToken: 'd3d3d3'
  };

  const popupState = { isReprompt: false };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render with props given', () => {
    // given
    // when
    const wrappedComponent = mount(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session} />
    </Provider>);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(wrappedComponent.find('PromptsContainer').get(0)).toBeDefined();
  });

  it('addEventListener should be called on mount', async () => {
    // given
    const addEventListener = jest.spyOn(window, 'addEventListener');
    // when
    mount(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session} />
    </Provider>);
    // then
    await waitFor(() => {
      expect(addEventListener).toHaveBeenCalled();
    });
  });

  it('removeEventListener should be called on unmount', async () => {
    // given
    const removeEventListener = jest.spyOn(window, 'removeEventListener');
    // when
    const wrappedComponent = render(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session} />
    </Provider>);
    wrappedComponent.unmount();
    // then
    await waitFor(() => {
      expect(removeEventListener).toHaveBeenCalled();
    });
  });

  it('handlePopupErrors should be called on proper messageReceived', () => {
    // given
    popupHelper.handlePopupErrors = jest.fn();
    const givenMessage = { data: { value: { statusCode: 201, iServerErrorCode: 1234, message: 'test' } } };

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

    // when
    const wrappedComponent = render(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session} />
    </Provider>);

    fireEvent(window, new MessageEvent('message', givenMessage));
    // then
    expect(popupHelper.handlePopupErrors).toBeCalledWith(expectedObject);
  });

  it('handlePopupErrors should not be called on different messageReceived', () => {
    // given
    popupHelper.handlePopupErrors = jest.fn();
    const givenMessage = { data: 'test' };

    // when
    const wrappedComponent = render(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session} />
    </Provider>);

    fireEvent(window, new MessageEvent('message', givenMessage));
    // then
    expect(popupHelper.handlePopupErrors).not.toBeCalled();
  });

  it('keepSessionAlive should be called on EXTEND_SESSION message', () => {
    // given
    // usually origin is added by the browser which is executing the code, but in test we need to add it manualy
    const message = { data: EXTEND_SESSION, origin: 'http://localhost' };
    global.Office = {
      context: {
        ui: { messageParent: () => { }, },
        diagnostics: { host: 'host', platform: 'platform', version: 'version' },
        requirements: { isSetSupported: jest.fn() }
      }
    };

    // when
    const wrappedComponent = render(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session} />
    </Provider>);

    const keepSessionAlive = jest.spyOn(sessionHelper, 'keepSessionAlive').mockImplementation(() => {});
    fireEvent(window, new MessageEvent('message', message));

    // then
    expect(keepSessionAlive).toHaveBeenCalled();
  });

  it('keepSessionAlive should not be called on different messages', () => {
    // given
    const message = {};

    // when
    const wrappedComponent = render(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session} />
    </Provider>);

    const keepSessionAlive = jest.spyOn(sessionHelper, 'keepSessionAlive').mockImplementation(() => {});
    fireEvent(window, new MessageEvent('message', message));

    // then
    expect(keepSessionAlive).not.toBeCalled();
  });

  it('should call installSessionProlongingHandler on mount', () => {
    // given
    jest.spyOn(sessionHelper, 'installSessionProlongingHandler');

    // when
    mount(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session} />
    </Provider>);
    // then
    expect(sessionHelper.installSessionProlongingHandler).toHaveBeenCalled();
  });
});
