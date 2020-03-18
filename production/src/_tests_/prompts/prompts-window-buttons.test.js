import React from 'react';
import { shallow } from 'enzyme';
import { PromptWindowButtonsNotConnected } from '../../prompts/prompts-window-buttons';

describe('PromptWindowButtons', () => {
  it('should render 2 buttons - Run and Cancel', () => {
    // given
    // when
    const buttonsWrapper = shallow(<PromptWindowButtonsNotConnected />);
    const runButton = buttonsWrapper.find('#run');
    const cancelButton = buttonsWrapper.find('#cancel');
    // then
    expect(runButton.get(0)).toBeDefined();
    expect(cancelButton.get(0)).toBeDefined();
  });

  it('should call handleRun when clicking run button', () => {
    // given
    const handleRunMock = jest.fn();
    const buttonsWrapper = shallow(<PromptWindowButtonsNotConnected handleRun={handleRunMock} />);
    const runButton = buttonsWrapper.find('#run');
    // when
    runButton.simulate('click');
    // then
    expect(handleRunMock).toBeCalled();
  });

  it('should call cancelImportRequest and handleBack when clicking Back', () => {
    // given
    const cancelImportRequestMock = jest.fn().mockImplementation(() => true);
    const handleBack = jest.fn();
    const buttonsWrapper = shallow(
      <PromptWindowButtonsNotConnected
        isReprompt={false}
        cancelImport={cancelImportRequestMock}
        handleBack={handleBack}
      />
    );
    const cancelButton = buttonsWrapper.find('#back');
    // when
    cancelButton.simulate('click');
    // then
    expect(cancelImportRequestMock).toBeCalled();
    expect(handleBack).toBeCalled();
  });

  it('should call closePopup when clicking Cancel if reprompted', () => {
    // given
    const closePopupMock = jest.fn();
    const buttonsWrapper = shallow(<PromptWindowButtonsNotConnected closePopup={closePopupMock} />);
    const cancelButton = buttonsWrapper.find('#cancel');
    // when
    cancelButton.simulate('click');
    // then
    expect(closePopupMock).toBeCalled();
  });
});
