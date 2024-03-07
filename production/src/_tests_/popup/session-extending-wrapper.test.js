import React from 'react';
import { render } from '@testing-library/react';
import { SessionExtendingWrapper } from '../../popup/session-extending-wrapper';
import { sessionHelper } from '../../storage/session-helper';

describe('SessionExtendingWrapper.js', () => {
  it('should render component and passed child', () => {
    // given
    jest.spyOn(sessionHelper, 'installSessionProlongingHandler');
    const testText = 'test';
    const testId = 'testId';
    const child = <div>{testText}</div>;

    // when
    const { getByText, container } = render(<SessionExtendingWrapper id={testId}>
      {child}
    </SessionExtendingWrapper>);

    // then
    expect(container.querySelector(`#${testId}`)).toBeInTheDocument();
    expect(getByText(testText)).toBeInTheDocument();
    expect(sessionHelper.installSessionProlongingHandler).toHaveBeenCalled();
  });
});
