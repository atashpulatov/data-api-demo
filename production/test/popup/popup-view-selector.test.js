import React from 'react';
import {shallow, mount} from 'enzyme';
import {Office} from '../mockOffice';
import {selectorProperties} from '../../src/attribute-selector/selector-properties';
import {_PopupViewSelector} from '../../src/popup/popup-view-selector';
import {PromptsWindow} from '../../src/prompts/prompts-window';
import {PopupTypeEnum} from '../../src/home/popup-type-enum';
import {NavigationTree} from '../../src/navigation/navigation-tree';

describe('PopupViewSelector', () => {
  it('should render navigation tree when requested', () => {
    // // given
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.navigationTree,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<_PopupViewSelector
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    expect(componentWrapper.find(NavigationTree).get(0)).toBeDefined();
  });

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

  it('should navigate to prompts window request import when prompted', () => {
    // given
    const location = {
      search: {},
    };
    const propsToPass = {
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      startImport: jest.fn(),
      startLoading: jest.fn(),
      importRequested: true,
      isPrompted: true,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<_PopupViewSelector
      location={location}
      {...propsToPass}
      propsToPass={propsToPass}
      methods={{}}
    />);
    // then
    expect(selectorWrapped.find(PromptsWindow).get(0)).toBeTruthy();
  });

  it('should handle request import when prompted and got dossierData', () => {
    // given
    const location = {
      search: {},
    };
    const propsToPass = {
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      chosenSubtype: 'subtype',
      startImport: jest.fn(),
      startLoading: jest.fn(),
      importRequested: true,
      isPrompted: true,
      dossierData: {
        instanceId: 'instanceId',
        whatever: 'whatever',
      },
    };
    const resultAction = {
      command: selectorProperties.commandOk,
      chosenObject: propsToPass.chosenObjectId,
      chosenProject: propsToPass.chosenProjectId,
      chosenSubtype: propsToPass.chosenSubtype,
      isPrompted: propsToPass.isPrompted,
      dossierData: propsToPass.dossierData,
    };
    const mockMessageParent = jest.spyOn(Office.context.ui, 'messageParent');
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    shallow(<_PopupViewSelector
      location={location}
      {...propsToPass}
      methods={{}}
    />);
    // then
    expect(propsToPass.startLoading).toHaveBeenCalled();
    expect(propsToPass.startImport).toHaveBeenCalled();
    expect(mockMessageParent).toHaveBeenCalledWith(JSON.stringify(resultAction));
  });
});
