import React from 'react';
import {_NavigationTree, mapStateToProps, mapDispatchToProps, NavigationTree} from '../../src/navigation/navigation-tree';
import {SELECT_OBJECT, SET_DATA_SOURCE, SELECT_FOLDER, START_IMPORT} from '../../src/navigation/navigation-tree-actions';
import {shallow, mount} from 'enzyme';
import {selectorProperties} from '../../src/attribute-selector/selector-properties';
import {PopupButtons} from '../../src/popup/popup-buttons';
import {Office} from '../mockOffice';
import {mstrObjectRestService} from '../../src/mstr-object/mstr-object-rest-service';

describe('NavigationTree', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should (full)render with props given', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    // when
    const wrappedComponent = mount(<_NavigationTree parsed={parsed} />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(wrappedComponent.find('SmartFolders').get(0)).toBeDefined();
    expect(wrappedComponent.find('PopupButtons').length).toBe(1);
  });

  it('should have buttons with secondary action', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    // when
    const wrappedComponent = mount(<_NavigationTree parsed={parsed} />);
    const popupButtonsWrapped = wrappedComponent.find('PopupButtons');
    // then
    expect(popupButtonsWrapped.exists('#prepare')).toBeTruthy();
  });

  it('should block interaction when loading flag is true', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    // when
    const wrappedComponent = mount(<_NavigationTree parsed={parsed} loading={true} />);
    const actionBlock = wrappedComponent.find('#action-block');
    // then
    expect(actionBlock.prop('style')).toHaveProperty('display', 'block');
  });

  it('should NOT block interaction when loading flag is false', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    // when
    const wrappedComponent = mount(<_NavigationTree parsed={parsed} loading={false} />);
    const actionBlock = wrappedComponent.find('#action-block');
    // then
    expect(actionBlock.prop('style')).toHaveProperty('display', 'none');
  });

  it('should call secondary action on prepare button clicked', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const propsMethod = jest.fn();
    const wrappedComponent = mount(<_NavigationTree
      parsed={parsed}
      chosenObjectId={true}
      selectObject={propsMethod} />);
    const secondaryAction = jest.spyOn(wrappedComponent.instance(), 'handleSecondary')
        .mockReturnValueOnce({});
    wrappedComponent.update();
    wrappedComponent.instance().forceUpdate();
    const popupButtonsWrapped = wrappedComponent.find(PopupButtons);
    const secondaryButton = popupButtonsWrapped.find('button')
        .find('#prepare');
    // when
    secondaryButton.simulate('click');
    // then
    expect(secondaryAction).toBeCalled();
  });

  it('should call proper method on secondary action', () => {
    // given
    const propsMethod = jest.fn();
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const actionObject = {
      command: selectorProperties.commandSecondary,
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      chosenSubtype: 'subtype',
      chosenProjectName: 'Prepare Data',
      chosenType: 'Data',
    };
    const wrappedComponent = shallow(<_NavigationTree
      parsed={parsed}
      handlePrepare={propsMethod}
      {...actionObject}
    />);
    // when
    wrappedComponent.instance().handleSecondary();
    // then
    expect(propsMethod).toBeCalled();
    expect(propsMethod).toBeCalledWith(actionObject.chosenProjectId, actionObject.chosenObjectId,
        actionObject.chosenSubtype, actionObject.chosenProjectName, actionObject.chosenType);
    expect(wrappedComponent.state('previewDisplay')).toEqual(true);
  });

  it('should call proper method on cancel action', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const resultAction = {
      command: selectorProperties.commandCancel,
    };
    const office = jest.spyOn(Office.context.ui, 'messageParent');
    const wrappedComponent = shallow(<_NavigationTree
      parsed={parsed}
    />);
    // when
    wrappedComponent.instance().handleCancel();
    // then
    expect(office).toHaveBeenCalledWith(JSON.stringify(resultAction));
  });

  it('should call proper method on import action', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const actionObject = {
      command: selectorProperties.commandOk,
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
    const wrappedComponent = shallow(<_NavigationTree
      parsed={parsed}
      startImport={mockStartImport}
      startLoading={mockStartloading}
      {...actionObject}
    />);
    // when
    wrappedComponent.instance().handleOk();
    // then
    expect(mockStartloading).toHaveBeenCalled();
    expect(mockStartImport).toHaveBeenCalled();
    expect(mockMessageParent).toHaveBeenCalledWith(JSON.stringify(resultAction));
  });

  it('should call proper method on trigger update', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const body = {};
    const resultAction = {
      command: selectorProperties.commandOnUpdate,
      body,
    };
    const mockMessageParent = jest.spyOn(Office.context.ui, 'messageParent');
    const wrappedComponent = shallow(<_NavigationTree
      parsed={parsed}
    />);
    // when
    wrappedComponent.instance().onTriggerUpdate(body);
    // then
    expect(mockMessageParent).toHaveBeenCalledWith(JSON.stringify(resultAction));
  });

  it('should take data from state wwew', () => {
    // given
    const initialState = {
      navigationTree: {},
    };
    // then
    expect(mapStateToProps(initialState)).toEqual(initialState.navigationTree);
  });

  it('should disable buttons until instance id obtained', async () => {
    // given
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenSubtype = 'subtype';
    const givenIsPrompted = 'customPromptAnswer';
    const selectObject = jest.fn();
    const isPromptedResponse = jest.spyOn(mstrObjectRestService, 'isPrompted')
        .mockImplementationOnce(async () => givenIsPrompted);
    const wrappedComponent = shallow(<_NavigationTree selectObject={selectObject} parsed={{}} />);
    // when
    await wrappedComponent.instance().onObjectChosen(givenObjectId, givenProjectId, givenSubtype);
    // then
    expect(isPromptedResponse).toBeCalledWith(givenObjectId);
    expect(selectObject).toBeCalledTimes(2);
    expect(selectObject.mock.calls[0][0]).toEqual({
      chosenObjectId: undefined,
      chosenProjectId: undefined,
      chosenSubtype: undefined,
      isPrompted: undefined,
    });
    expect(selectObject.mock.calls[1][0]).toEqual({
      chosenObjectId: givenObjectId,
      chosenProjectId: givenProjectId,
      chosenSubtype: givenSubtype,
      isPrompted: givenIsPrompted,
    });
  });
});
