import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PromptsWindowTitle } from '../../prompts/prompts-window-title';
import { reduxStore } from '../../store';

describe('PromptsWindowTitleNotConnected', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render with props given', () => {
    // given showLoading, showTitle, index, total, objectName,
    const props = { showTitle: false, index: 0, total: 0, objectName: 'objectName', };
    // when
    const { container } = render(<Provider store={reduxStore}>
      <PromptsWindowTitle {...props} />
    </Provider>);
    // then
    expect(container.firstChild).toBeNull();
  });

  it('should render reprompt title with props given', () => {
    // given showLoading, showTitle, index, total, objectName,
    const props = { showTitle: true, index: 0, total: 0, objectName: 'objectName', };
    // when
    const { getByText } = render(<Provider store={reduxStore}>
      <PromptsWindowTitle {...props} />
    </Provider>);
    // then
    expect(getByText(`Reprompt ${props.index}/${props.total} > ${props.objectName}`)).toBeDefined();
  });
});
