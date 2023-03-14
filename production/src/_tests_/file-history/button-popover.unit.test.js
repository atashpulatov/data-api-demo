import React from 'react';
import { mount } from 'enzyme';
import { Button } from 'antd';
import { ButtonPopover } from '../../file-history/button-popover';

describe('ButtonPopover', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render home component and its children', () => {
    // given
    // when
    const componentWrapper = mount(
      <ButtonPopover>
        <Button />
      </ButtonPopover>
    );
    // then
    expect(componentWrapper.children().length).toBeGreaterThan(0);
  });
  it('should clear timeout when unmounting component', () => {
    // given
    global.clearTimeout = jest.fn();
    const componentWrapper = mount(
      <ButtonPopover>
        <Button />
      </ButtonPopover>
    );
    // when
    componentWrapper.unmount();
    // then
    expect(clearTimeout).toHaveBeenCalled();
  });

  // TODO
  it.skip('should set popoverVisible to true after mouseEnter event', () => {
    // given
    ButtonPopover.prototype.setState = jest.fn(ButtonPopover.prototype.setState);
    const componentWrapper = mount(
      <ButtonPopover mouseEnterDelay={1}>
        <Button />
      </ButtonPopover>
    );
    // when
    componentWrapper.simulate('mouseEnter');
    jest.advanceTimersByTime(1000);
    // then
    expect(ButtonPopover.prototype.setState).toHaveBeenCalled();
    expect(componentWrapper.instance().state.popoverVisible).toBe(true);
  });
  it('should clear timeout on mouseLeave event', () => {
    // given
    global.clearTimeout = jest.fn();
    const componentWrapper = mount(
      <ButtonPopover>
        <Button />
      </ButtonPopover>
    );
    // when
    componentWrapper.simulate('mouseLeave');
    // then
    expect(clearTimeout).toHaveBeenCalledTimes(1);
  });
});
