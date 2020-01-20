import React from 'react';
import { shallow } from 'enzyme';
import { AttributeMetricFilter } from '@mstr/mstr-react-library';
import { AttributeSelectorNotConnected } from '../../attribute-selector/attribute-selector';

describe.skip('AttributeSelectorNotConnected', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass mstr to its children', () => {
    // given
    const mstrData = {
      chosenObjectId: 'id',
      content: 'content',
      supportForms: true,
    };
    // when
    const selectorWrapped = shallow(<AttributeSelectorNotConnected mstrData={mstrData} />);
    // then
    const attributeMetricFilterWrapped = selectorWrapped.find(AttributeMetricFilter).at(0);
    expect(attributeMetricFilterWrapped.prop('mstrData')).toEqual(mstrData);
    expect(attributeMetricFilterWrapped.key()).toEqual(mstrData.chosenObjectId);
  });

  it('should call handlePopupErrors with proper object', () => {
    // given
    const mstrData = {
      chosenObjectId: 'id',
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
    const wrappedComponent = shallow(<AttributeSelectorNotConnected mstrData={mstrData} handlePopupErrors={mockHandlePopupErrors} />);
    wrappedComponent.instance().handleUnauthorized(libraryError);
    // then
    expect(mockHandlePopupErrors).toBeCalledWith(pupupExpectedError);
  });
});
