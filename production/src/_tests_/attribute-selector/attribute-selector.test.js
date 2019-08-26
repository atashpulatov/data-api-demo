import React from 'react';
import {shallow} from 'enzyme';
import {_AttributeSelector} from '../../attribute-selector/attribute-selector';
import {AttributeMetricFilter} from '@mstr/mstr-react-library';

describe('_AttributeSelector', () => {
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
});
