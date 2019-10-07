import React from 'react';
import { shallow } from 'enzyme';
import { _NavigationTree, mapStateToProps } from '../../navigation/navigation-tree';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { Office } from '../mockOffice';
import * as mstrObjectRestService from '../../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';

describe('NavigationTree', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render with props given', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    // when
    const wrappedComponent = shallow(<_NavigationTree mstrData={mstrData} />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(wrappedComponent.find('FolderBrowser').get(0)).toBeDefined();
  });

  it('should call proper method on secondary action', async () => {
    // given
    const propsMethod = jest.fn();
    const mstrData = {
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
      mstrData={mstrData}
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
    const stopLoadingMocked = jest.fn();
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const resultAction = { command: selectorProperties.commandCancel, };
    const office = jest.spyOn(Office.context.ui, 'messageParent');
    const wrappedComponent = shallow(<_NavigationTree
      mstrData={mstrData}
      stopLoading={stopLoadingMocked}
    />);
    // when
    wrappedComponent.instance().handleCancel();
    // then
    expect(office).toHaveBeenCalledWith(JSON.stringify(resultAction));
  });

  it('should call proper method on trigger update', () => {
    // given
    const mstrData = {
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
      mstrData={mstrData}
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
      officeReducer: { preLoadReport: { name: 'Some name', }, },
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
    const givenObjectTypeName = 'report';
    const givenSubtype = 768;
    const givenIsPrompted = 'customPromptAnswer';
    const givenObjectType = mstrObjectEnum.mstrObjectType.report;
    const selectObject = jest.fn();
    const isPromptedResponse = jest.spyOn(mstrObjectRestService, 'isPrompted')
      .mockImplementationOnce(async () => givenIsPrompted);
    const wrappedComponent = shallow(<_NavigationTree selectObject={selectObject} mstrData={{}} />);
    // when
    await wrappedComponent.instance().onObjectChosen(givenObjectId, givenProjectId, givenSubtype);
    // then
    expect(isPromptedResponse).toBeCalledWith(givenObjectId, givenProjectId, givenObjectTypeName);
    expect(selectObject).toBeCalledTimes(2);
    expect(selectObject.mock.calls[0][0]).toEqual({
      chosenObjectId: null,
      chosenProjectId: null,
      chosenSubtype: null,
      isPrompted: null,
      objectType: null,
    });
    expect(selectObject.mock.calls[1][0]).toEqual({
      chosenObjectId: givenObjectId,
      chosenProjectId: givenProjectId,
      chosenSubtype: givenSubtype,
      isPrompted: givenIsPrompted,
      objectType: givenObjectType,
    });
  });

  it('should call requestDossierOpen on handleOk if provided objectType is dossier', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const objectType = { name: mstrObjectEnum.mstrObjectType.dossier.name };
    const mockRequestImport = jest.fn();
    const mockRequestDossierOpen = jest.fn();
    const wrappedComponent = shallow(<_NavigationTree mstrData={mstrData} objectType={objectType} requestImport={mockRequestImport} requestDossierOpen={mockRequestDossierOpen} />);
    // when
    wrappedComponent.instance().handleOk();
    // then
    expect(mockRequestImport).not.toHaveBeenCalled();
    expect(mockRequestDossierOpen).toHaveBeenCalled();
  });

  it('should call requestImport on handleOk if provided objectType is not dossier', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const objectType = { name: mstrObjectEnum.mstrObjectType.report.name };
    const mockRequestImport = jest.fn();
    const mockHandleDossierOpen = jest.fn();
    const wrappedComponent = shallow(<_NavigationTree mstrData={mstrData} objectType={objectType} requestImport={mockRequestImport} handleDossierOpen={mockHandleDossierOpen} />);
    // when
    wrappedComponent.instance().handleOk();
    // then
    expect(mockRequestImport).toHaveBeenCalled();
    expect(mockHandleDossierOpen).not.toHaveBeenCalled();
  });
});
