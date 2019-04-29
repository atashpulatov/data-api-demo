import React from 'react';
import {_Placeholder} from '../../src/home/placeholder';
import {sessionHelper} from '../../src/storage/session-helper';
import {shallow} from 'enzyme';
jest.mock('../../src/storage/session-helper');

describe('Placeholder', () => {
  it('should render and element', () => {
    // given
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    sessionHelperSpy.mockClear();

    // when
    const wrappedComponent = shallow(<_Placeholder />);

    // then
    expect(wrappedComponent).toBeDefined();
    expect(sessionHelperSpy).toHaveBeenCalled();
  });
});
