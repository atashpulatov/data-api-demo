import React from 'react';
import {shallow, mount} from 'enzyme';
import {Office} from '../mockOffice';
import {selectorProperties} from '../../src/attribute-selector/selector-properties';
import {PopupViewSelector} from '../../src/popup/popup-view-selector';

describe('PopupViewSelector', () => {
  it('should handle request import when not prompted', () => {
    // given
    const location = {
      search: {},
    };
    const actionObject = {
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      chosenSubtype: 'subtype',
    };
    const resultAction = {
      command: selectorProperties.commandOk,
      chosenObject: 'objectId',
      chosenProject: 'projectId',
      chosenSubtype: 'subtype',
    };
    const mockStartImport = jest.fn();
    const mockStartloading = jest.fn();
    const mockMessageParent = jest.spyOn(Office.context.ui, 'messageParent');
    // when
    const popupWrapped = shallow(<PopupViewSelector
      location={location}
      requestImport={true}
      startImport={mockStartImport}
      startLoading={mockStartloading}
      methods={{}}
      {...actionObject} />);
    // then
    expect(mockStartloading).toHaveBeenCalled();
    expect(mockStartImport).toHaveBeenCalled();
    expect(mockMessageParent).toHaveBeenCalledWith(JSON.stringify(resultAction));
    expect(true).toBeFalsy();
  });
});
