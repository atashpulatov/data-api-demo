import React from 'react';
import { render } from '@testing-library/react';
import { PromptsContainer } from '../../prompts/prompts-container';

describe('PromptsContainer', () => {
  it('should render with props', () => {
    // given
    const postMount = jest.fn();

    // when
    const { container } = render(<PromptsContainer postMount={postMount} />);
    // then
    expect(postMount).toBeCalled();
    expect(container.querySelector('.promptsContainer')).toBeInTheDocument();
  });
});
