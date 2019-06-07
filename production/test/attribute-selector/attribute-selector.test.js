import React from 'react';
import {shallow} from 'enzyme';
import {AttributeSelector} from '../../src/attribute-selector/attribute-selector';
import {AttributeMetricFilter} from 'mstr-react-library';

describe('AttributeSelector', () => {
  it('should pass mstr to its children', () => {
    // given
    const mstrData = {
      reportId: 'id',
      content: 'content',
    };
    // when
    const selectorWrapped = shallow(<AttributeSelector mstrData={mstrData} />);
    // then
    const attributeMetricFilterWrapped = selectorWrapped.find(AttributeMetricFilter).at(0);
    expect(attributeMetricFilterWrapped.prop('mstrData')).toEqual(mstrData);
    expect(attributeMetricFilterWrapped.key()).toEqual(mstrData.reportId);
  });
});
