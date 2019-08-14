import { PromptsContainer } from '../../prompts/prompts-container'
import React from 'react';
import {shallow, mount} from 'enzyme';


describe ('PromptsContainer', () => {
    it('should render with props', () => {
        // given
        const postMount = jest.fn();

        // when
        const wrappedComponent = shallow(<PromptsContainer postMount={postMount} />);
        // then
        expect(wrappedComponent.instance()).toBeDefined();
        expect(postMount).toBeCalled();
        expect(wrappedComponent.find('.promptsContainer').get(0)).toBeDefined();
      });

});