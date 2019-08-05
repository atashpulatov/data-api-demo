import React from 'react';
import {shallow} from 'enzyme';
import {_PromptWindowButtons} from '../../src/prompts/prompts-window-buttons';

describe('PromptWindowButtons', () => {
  it('should render 2 buttons - Run and Cancel', () => {
    // given
    // when
    const buttonsWrapper = shallow(<_PromptWindowButtons />);
    const runButton = buttonsWrapper.find('#run');
    const cancelButton = buttonsWrapper.find('#cancel');
    // then
    expect(runButton.get(0)).toBeDefined();
    expect(cancelButton.get(0)).toBeDefined();
  });

  it('should call handleRun when clicking run button', () => {
    // given
    const handleRunMock = jest.fn();
    const buttonsWrapper = shallow(<_PromptWindowButtons handleRun={handleRunMock} />);
    const runButton = buttonsWrapper.find('#run');
    // when
    runButton.simulate('click');
    // then
    expect(handleRunMock).toBeCalled();
  });

  it('should call cancelImportRequest when clicking Cancel if not reprompted', () => {
    // given
    const cancelImportRequestMock = jest.fn();
    const buttonsWrapper = shallow(<_PromptWindowButtons isReprompt={false} cancelImportRequest={cancelImportRequestMock} />);
    const cancelButton = buttonsWrapper.find('#cancel');
    // when
    cancelButton.simulate('click');
    // then
    expect(cancelImportRequestMock).toBeCalled();
  });

  it('should call closePopup when clicking Cancel if reprompted', () => {
    // given
    const closePopupMock = jest.fn();
    const buttonsWrapper = shallow(<_PromptWindowButtons isReprompt={true} closePopup={closePopupMock} />);
    const cancelButton = buttonsWrapper.find('#cancel');
    // when
    cancelButton.simulate('click');
    // then
    expect(closePopupMock).toBeCalled();
  });
});
