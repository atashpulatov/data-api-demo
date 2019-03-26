import React from 'react';
import {_NavigationTree, mapStateToProps, mapDispatchToProps} from '../../src/navigation/navigation-tree';
import {SELECT_OBJECT, SET_DATA_SOURCE, SELECT_FOLDER, START_IMPORT} from '../../src/navigation/navigation-tree-actions';
import {shallow, mount} from 'enzyme';
import {selectorProperties} from '../../src/attribute-selector/selector-properties';
import {PopupButtons} from '../../src/popup/popup-buttons';
import {Office} from '../mockOffice';

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
      selectObject={propsMethod}/>);
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
    const mockMessageParent = jest.spyOn(Office.context.ui, 'messageParent');
    const wrappedComponent = shallow(<_NavigationTree
      parsed={parsed}
      startImport={mockStartImport}
      {...actionObject}
    />);
    // when
    wrappedComponent.instance().handleOk();
    // then
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

  it('should send proper action when selectObject is called', () => {
    // given
    const dispatch = jest.fn();
    const data = {};
    // when
    mapDispatchToProps(dispatch).selectObject(data);
    // then
    expect(dispatch).toHaveBeenCalledWith({type: SELECT_OBJECT, data: {}});
  });

  it('should send proper action when setDataSource is called', () => {
    // given
    const dispatch = jest.fn();
    const data = {};
    // when
    mapDispatchToProps(dispatch).setDataSource(data);
    // then
    expect(dispatch).toHaveBeenCalledWith({type: SET_DATA_SOURCE, data: {}});
  });

  it('should send proper action when selectFolder is called', () => {
    // given
    const dispatch = jest.fn();
    const data = {};
    // when
    mapDispatchToProps(dispatch).selectFolder(data);
    // then
    expect(dispatch).toHaveBeenCalledWith({type: SELECT_FOLDER, data: {}});
  });

  it('should send proper action when startImport is called', () => {
    // given
    const dispatch = jest.fn();
    // when
    mapDispatchToProps(dispatch).startImport();
    // then
    expect(dispatch).toHaveBeenCalledWith({type: START_IMPORT});
  });

  it('should take data from state wwew', () => {
    // given
    const initialState = {
      navigationTree: {},
    };
    // then
    expect(mapStateToProps(initialState)).toEqual(initialState.navigationTree);
  });
});
