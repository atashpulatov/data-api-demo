import React from 'react';
import { shallow, mount } from 'enzyme';
import { SidePanel } from '@mstr/rc/';
import { RightSidePanelNotConnected } from '../../right-side-panel/right-side-panel';

describe('RightSidePanelNotConnected', () => {
  it('should display SidePanel', () => {
    // given
    const mockedProps = { loadedObjects: [], addDataAction: jest.fn() };
    // when
    const shallowedComponent = shallow(<RightSidePanelNotConnected {...mockedProps} />);
    // then
    console.log(shallowedComponent.debug());
    expect(shallowedComponent.find(SidePanel)).toHaveLength(1);
  });
});
