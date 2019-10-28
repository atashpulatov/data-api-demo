import React from 'react';
import { shallow } from 'enzyme';
import { AttributeMetricFilter } from '@mstr/mstr-react-library';
import { _AttributeSelector } from '../../attribute-selector/attribute-selector';

describe('_AttributeSelector', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass mstr to its children', () => {
    // given
    const mstrData = {
      reportId: 'id',
      content: 'content',
    };
    // when
    const selectorWrapped = shallow(<_AttributeSelector mstrData={mstrData} />);
    // then
    const attributeMetricFilterWrapped = selectorWrapped.find(AttributeMetricFilter).at(0);
    expect(attributeMetricFilterWrapped.prop('mstrData')).toEqual(mstrData);
    expect(attributeMetricFilterWrapped.key()).toEqual(mstrData.reportId);
  });

  it('should call handlePopupErrors with proper object', () => {
    // given
    const mstrData = {
      reportId: 'id',
      content: 'content',
    };
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
    const wrappedComponent = shallow(<_AttributeSelector mstrData={mstrData} handlePopupErrors={mockHandlePopupErrors} />);
    wrappedComponent.instance().handleUnauthorized(libraryError);
    // then
    expect(mockHandlePopupErrors).toBeCalledWith(pupupExpectedError)
  });
});
