import React from 'react';
import {_NavigationTree, mapStateToProps, mapDispatchToProps} from '../../src/navigation/navigation-tree';
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

  it('should render with props given', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    // when
    const wrappedComponent = shallow(<_NavigationTree parsed={parsed} />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(wrappedComponent.find('FolderBrowser').get(0)).toBeDefined();
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
    const wrappedComponent = shallow(
        <_NavigationTree
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

  it('should call proper method on request import', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const mockRequestImport = jest.fn();
    const wrappedComponent = shallow(<_NavigationTree
      parsed={parsed}
      requestImport={mockRequestImport}
    />);
    // when
    wrappedComponent.instance().handleOk();
    // then
    expect(mockRequestImport).toHaveBeenCalled();
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

  it('should take proper data from state for name defined', () => {
    // given
    const initialState = {
      navigationTree: {},
      officeReducer: {
        preLoadReport: {
          name: 'Some name',
        },
      },
    };
    // then
    expect(mapStateToProps(initialState)).toEqual({
      ...initialState.navigationTree,
      title: initialState.officeReducer.preLoadReport.name,
    });
  });

  it('should take proper data from state for name NOT defined', () => {
    // given
    const initialState = {
      navigationTree: {},
      officeReducer: {},
    };
    // then
    expect(mapStateToProps(initialState)).toEqual({
      ...initialState.navigationTree,
      title: undefined,
    });
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
    expect(isPromptedResponse).toBeCalledWith(givenObjectId, givenProjectId);
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
