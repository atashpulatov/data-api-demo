import React from 'react';
import { fireEvent, render, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PromptsWindowNotConnected } from '../../prompts/prompts-window';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { popupHelper } from '../../popup/popup-helper';
import { sessionHelper, EXTEND_SESSION } from '../../storage/session-helper';
import { reduxStore } from '../../store';

jest.mock('../../popup/popup-helper');

describe('PromptsWindowNotConnected', () => {
  const mstrData = {
    chosenProjectId: 'projectId',
    chosenObjectId: 'chosenObjectId',
    promptsAnswers: [{}],
  };

  const popupState = {
    isReprompt: false,
    isEdit: false
  };

  const editedObject = {
    promptsAnswers: ['promptsAnswers'],
  };

  const session = {
    envUrl: 'url/test',
    authToken: 'd3d3d3'
  };

  const repromptsQueue = {
    total: 0,
    index: 0,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render with props given', () => {
    // given
    // when
    const wrappedComponent = render(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session}
        repromptsQueue={repromptsQueue} />
    </Provider>);
    // then
    const promptsContainer = wrappedComponent.container.getElementsByClassName('promptsContainer');
    expect(promptsContainer).toBeDefined();
  });

  it('should render with props given for Reprompt workflow', () => {
    const repromptPopupState = {
      isReprompt: true,
      isEdit: false
    };
    // given
    // when
    const wrappedComponent = render(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={repromptPopupState}
        editedObject={editedObject}
        session={session}
        repromptsQueue={repromptsQueue} />
    </Provider>);
    // then
    const promptsContainer = wrappedComponent.container.getElementsByClassName('promptsContainer');
    expect(promptsContainer).toBeDefined();
  });

  it('addEventListener should be called on render', async () => {
    // given
    const addEventListener = jest.spyOn(window, 'addEventListener');
    // when
    render(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session}
        repromptsQueue={repromptsQueue} />
    </Provider>);
    // then
    await waitFor(() => {
      expect(addEventListener).toHaveBeenCalled();
    });
  });

  it('removeEventListener should be called on unrender', async () => {
    // given
    const removeEventListener = jest.spyOn(window, 'removeEventListener');
    // when
    const wrappedComponent = render(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session}
        repromptsQueue={repromptsQueue} />
    </Provider>);
    cleanup();
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
        session={session}
        repromptsQueue={repromptsQueue} />
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
        session={session}
        repromptsQueue={repromptsQueue} />
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
        session={session}
        repromptsQueue={repromptsQueue} />
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
        session={session}
        repromptsQueue={repromptsQueue} />
    </Provider>);

    const keepSessionAlive = jest.spyOn(sessionHelper, 'keepSessionAlive').mockImplementation(() => {});
    fireEvent(window, new MessageEvent('message', message));

    // then
    expect(keepSessionAlive).not.toBeCalled();
  });

  it('should call installSessionProlongingHandler on render', () => {
    // given
    jest.spyOn(sessionHelper, 'installSessionProlongingHandler');

    // when
    render(<Provider store={reduxStore}>
      <PromptsWindowNotConnected
        mstrData={mstrData}
        popupState={popupState}
        editedObject={editedObject}
        session={session}
        repromptsQueue={repromptsQueue} />
    </Provider>);
    // then
    expect(sessionHelper.installSessionProlongingHandler).toHaveBeenCalled();
  });
});
