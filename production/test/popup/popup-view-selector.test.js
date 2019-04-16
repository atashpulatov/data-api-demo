import React from 'react';
import {shallow, mount} from 'enzyme';
import {Office} from '../mockOffice';
import {selectorProperties} from '../../src/attribute-selector/selector-properties';
import {_PopupViewSelector} from '../../src/popup/popup-view-selector';

describe('PopupViewSelector', () => {
  it('should handle request import when not prompted', () => {
    // given
    const location = {
      search: {},
    };
    const resultAction = {
      command: selectorProperties.commandOk,
      chosenObject: 'objectId',
      chosenProject: 'projectId',
      chosenSubtype: 'subtype',
    };
    const reduxMethods = {
      startImport: jest.fn(),
      startLoading: jest.fn(),
    };
    const mockMessageParent = jest.spyOn(Office.context.ui, 'messageParent');
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    shallow(<_PopupViewSelector
      location={location}
      importRequested={true}
      {...reduxMethods}
      {...resultAction}
      methods={{}}
      chosenObjectId={resultAction.chosenObject}
      chosenProjectId={resultAction.chosenProject}
    />);
    // then
    expect(reduxMethods.startLoading).toHaveBeenCalled();
    expect(reduxMethods.startImport).toHaveBeenCalled();
    expect(mockMessageParent).toHaveBeenCalledWith(JSON.stringify(resultAction));
  });
});
