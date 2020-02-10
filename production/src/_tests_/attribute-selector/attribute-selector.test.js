import React from 'react';
import { shallow } from 'enzyme';
import { AttributeMetricFilter } from '@mstr/mstr-react-library';
import { AttributeSelectorNotConnected } from '../../attribute-selector/attribute-selector';

describe('AttributeSelectorNotConnected', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass mstr to its children', () => {
    // given
    const chosenObject = {
      chosenObjectId: 'id',
      objectType: { name: 'dossier' },
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
      reportType: chosenObject.objectType.name,
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
    const selectorWrapped = shallow(<AttributeSelectorNotConnected chosenObject={chosenObject} session={session} editedObject={editedObject} supportForms={supportForms} />);
    // then
    const attributeMetricFilterWrapped = selectorWrapped.find(AttributeMetricFilter).at(0);
    expect(attributeMetricFilterWrapped.prop('mstrData')).toEqual(mstrData);
    // expect(attributeMetricFilterWrapped.key()).toEqual(mstrData.chosenObjectId);
  });

  it('should call handlePopupErrors with proper object', () => {
    // given
    // const mstrData = { content: 'content' };
    const chosenObject = {
      chosenObjectId: 'id',
      objectType: { name: 'dossier' }
    };
    const session = { envUrl: 'envUrl' };
    const editedObject = { projectId: 'projectId' };
    const libraryError = { status: 400, response: { key: 'value' } };
    const mockHandlePopupErrors = jest.fn();
    const pupupExpectedError = {
      status: 400,
      response: {
        key: 'value',
        body: {
          code: 'ERR009',
          message: 'The user\'s session has expired, please reauthenticate',
        },
        text: '{"code":"ERR009","message":"The user\'s session has expired, please reauthenticate"}',
      },
    };
    // when
    const wrappedComponent = shallow(<AttributeSelectorNotConnected chosenObject={chosenObject} session={session} editedObject={editedObject} handlePopupErrors={mockHandlePopupErrors} />);
    wrappedComponent.instance().handleUnauthorized(libraryError);
    // then
    expect(mockHandlePopupErrors).toBeCalledWith(pupupExpectedError);
  });
});
