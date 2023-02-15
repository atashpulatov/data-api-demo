import React from 'react';
import { shallow } from 'enzyme';
import { AttributeMetricFilter } from '@mstr/mstr-react-library';
import { AttributeSelectorNotConnected } from '../../attribute-selector/attribute-selector';
import { errorMessages, errorCodes } from '../../error/constants';

jest.mock('../../office/office-context');

describe('AttributeSelectorNotConnected', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass mstr to its children', () => {
    // given
    const chosenObject = {
      chosenObjectId: 'id',
      mstrObjectType: { name: 'dossier' },
      chosenSubtype: 'chosenSubtype',
      chosenObjectName: 'chosenObjectName',
      projectId: 'projectId',
      isPrompted: false,

    };
    const session = {
      envUrl: 'envUrl',
      authToken: 'authToken'
    };
    const editedObject = {
      instanceId: 'instanceId',
      promptsAnswers: 'promptsAnswers',
      selectedAttributes: null,
      selectedMetrics: null,
      selectedFilters: null,
    };
    const supportForms = true;
    const mstrData = {
      supportForms,
      reportId: chosenObject.chosenObjectId,
      envUrl: session.envUrl,
      projectId: chosenObject.chosenProjectId,
      reportSubtype: chosenObject.chosenSubtype,
      reportType: chosenObject.mstrObjectType.name,
      reportName: chosenObject.chosenObjectName,
      token: session.authToken,
      authToken: session.authToken,
      instanceId: editedObject.instanceId,
      isPrompted: chosenObject.isPrompted,
      promptsAnswers: editedObject.promptsAnswers,
      selectedAttributes: editedObject.selectedAttributes,
      selectedMetrics: editedObject.selectedMetrics,
      selectedFilters: editedObject.selectedFilters,
    };
    // when
    const selectorWrapped = shallow(
      <AttributeSelectorNotConnected
        chosenObject={chosenObject}
        session={session}
        editedObject={editedObject}
        supportForms={supportForms} />
    );
    // then
    const attributeMetricFilterWrapped = selectorWrapped.find(AttributeMetricFilter).first();
    expect(attributeMetricFilterWrapped.prop('mstrData')).toEqual(mstrData);
  });

  it('should call handlePopupErrors with proper object', () => {
    // given
    // const mstrData = { content: 'content' };
    const chosenObject = {
      chosenObjectId: 'id',
      mstrObjectType: { name: 'dossier' }
    };
    const session = { envUrl: 'envUrl' };
    const editedObject = { projectId: 'projectId' };
    const libraryError = { status: 400, response: { key: 'value' } };
    const mockHandlePopupErrors = jest.fn();
    const { ERR009 } = errorCodes;
    const popupExpectedError = {
      status: 400,
      response: {
        key: 'value',
        body: {
          code: ERR009,
          message: errorMessages.SESSION_EXTENSION_FAILURE_MESSAGE,
        },
        text: `{code: ${ERR009}, message: ${errorMessages.SESSION_EXTENSION_FAILURE_MESSAGE}}`,
      },
    };
    // when
    const wrappedComponent = shallow(
      <AttributeSelectorNotConnected
        chosenObject={chosenObject}
        session={session}
        editedObject={editedObject}
        handlePopupErrors={mockHandlePopupErrors} />
    );
    const attributeMetricFilterWrapped = wrappedComponent.find(AttributeMetricFilter).first();
    attributeMetricFilterWrapped.invoke('handleUnauthorized')(libraryError);
    // then
    expect(mockHandlePopupErrors).toBeCalledWith(popupExpectedError);
  });
});
