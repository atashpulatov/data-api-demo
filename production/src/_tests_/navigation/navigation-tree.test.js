import React from 'react';
import { shallow } from 'enzyme';
import i18n from '../../i18n';
import { _NavigationTree, mapStateToProps } from '../../navigation/navigation-tree';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { Office } from '../mockOffice';
import * as mstrObjectRestService from '../../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { DEFAULT_STATE as CACHE_STATE } from '../../cache/cache-reducer';
import { authenticationHelper } from '../../authentication/authentication-helper';

jest.mock('../../authentication/authentication-helper', () => ({
  authenticationHelper: {
    validateAuthToken: jest.fn().mockImplementation(() => Promise.resolve('Magic'))
  }
}));

describe('NavigationTree', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockFunctionsAndProps = {
    cache: CACHE_STATE,
    i18n,
    resetDBState: jest.fn(),
    fetchObjectsFromNetwork: jest.fn(),
  };

  it('should render with props given', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    // when
    const wrappedComponent = shallow(<_NavigationTree
      mstrData={mstrData}
      {...mockFunctionsAndProps}
    />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(wrappedComponent.find('TopFilterPanel').get(0)).toBeDefined();
    expect(wrappedComponent.find('ObjectTable').get(0)).toBeDefined();
  });

  it('should call proper method on secondary action', async () => {
    // given
    const mockHandlePrepare = jest.fn();
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const actionObject = {
      command: selectorProperties.commandSecondary,
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      chosenSubtype: mstrObjectEnum.mstrObjectType.report.subtypes[0],
      chosenObjectName: 'Prepare Data',
      chosenType: 'Data',
    };
    const givenIsPrompted = 'customPromptAnswer';
    jest.spyOn(mstrObjectRestService, 'isPrompted')
      .mockImplementationOnce(async () => givenIsPrompted);
    const wrappedComponent = shallow(<_NavigationTree
      mstrData={mstrData}
      handlePrepare={mockHandlePrepare}
      {...actionObject}
      {...mockFunctionsAndProps}
    />);
    // when
    await wrappedComponent.instance().handleSecondary();
    // then
    expect(mockHandlePrepare).toBeCalledWith(actionObject.chosenProjectId, actionObject.chosenObjectId,
      actionObject.chosenSubtype, actionObject.chosenObjectName, actionObject.chosenType, givenIsPrompted);
    expect(wrappedComponent.state('previewDisplay')).toEqual(true);
  });

  it('should call handlePopupErrors on checkIfPrompted bad response in handleSecondary', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenSubtype = mstrObjectEnum.mstrObjectType.dossier.subtypes[0];
    const mockHandlePopupErrors = jest.fn();
    jest.spyOn(mstrObjectRestService, 'isPrompted')
      .mockImplementationOnce(() => { throw new Error(); });
    const wrappedComponent = shallow(
      <_NavigationTree
        mstrData={mstrData}
        chosenObjectId={givenObjectId}
        chosenProjectId={givenProjectId}
        chosenSubtype={givenSubtype}
        {...mockFunctionsAndProps}
        handlePopupErrors={mockHandlePopupErrors}
      />
    );
    // when
    wrappedComponent.instance().handleSecondary();
    // then
    expect(mockHandlePopupErrors).toBeCalled();
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
      cache={CACHE_STATE}
      {...mockFunctionsAndProps}
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
      {...mockFunctionsAndProps}
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

  it('should call selectObject on onObjectChosen handler with simple data', () => {
    // given
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenSubtype = mstrObjectEnum.mstrObjectType.report.subtypes[0];
    const givenObjectName = 'objectName';
    const givenTargetId = null;
    const givenMyLibrary = false;
    const mockSelectObject = jest.fn();

    const wrappedComponent = shallow(<_NavigationTree
      {...mockFunctionsAndProps}
      selectObject={mockSelectObject}
    />);
    // when
    wrappedComponent.instance().onObjectChosen(givenObjectId, givenProjectId, givenSubtype, givenObjectName, givenTargetId, givenMyLibrary);
    // then
    const expectedObject = {
      chosenObjectId: givenObjectId,
      chosenObjectName: givenObjectName,
      chosenProjectId: givenProjectId,
      chosenSubtype: givenSubtype,
      objectType: mstrObjectEnum.mstrObjectType.report,
      chosenLibraryDossier: undefined
    };
    expect(mockSelectObject).toBeCalledWith(expectedObject);
  });

  it('should call selectObject on onObjectChosen handler with myLibrary data', () => {
    // given
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenSubtype = mstrObjectEnum.mstrObjectType.dossier.subtypes[0];
    const givenObjectName = 'objectName';
    const givenTargetId = 'LibraryObjectId';
    const givenMyLibrary = true;
    const mockSelectObject = jest.fn();

    const wrappedComponent = shallow(<_NavigationTree
      {...mockFunctionsAndProps}
      selectObject={mockSelectObject}
    />);
    // when
    wrappedComponent.instance().onObjectChosen(givenObjectId, givenProjectId, givenSubtype, givenObjectName, givenTargetId, givenMyLibrary);
    // then
    const expectedObject = {
      chosenObjectId: givenTargetId,
      chosenObjectName: givenObjectName,
      chosenProjectId: givenProjectId,
      chosenSubtype: givenSubtype,
      objectType: mstrObjectEnum.mstrObjectType.dossier,
      chosenLibraryDossier: givenObjectId
    };
    expect(mockSelectObject).toBeCalledWith(expectedObject);
  });

  it('should call requestDossierOpen on handleOk if provided objectType is dossier', async () => {
    // given
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenIsPrompted = 'customPromptAnswer';
    const givenSubtype = mstrObjectEnum.mstrObjectType.dossier.subtypes[0];
    const mockRequestImport = jest.fn();
    const mockRequestDossierOpen = jest.fn();
    jest.spyOn(mstrObjectRestService, 'isPrompted')
      .mockImplementationOnce(async () => givenIsPrompted);
    const wrappedComponent = shallow(
      <_NavigationTree
        mstrData={mstrData}
        chosenObjectId={givenObjectId}
        chosenProjectId={givenProjectId}
        chosenSubtype={givenSubtype}
        {...mockFunctionsAndProps}
        requestImport={mockRequestImport}
        requestDossierOpen={mockRequestDossierOpen}
      />
    );
    // when
    await wrappedComponent.instance().handleOk();
    // then
    expect(mockRequestImport).not.toBeCalled();
    expect(mockRequestDossierOpen).toBeCalled();
  });

  it('should call requestImport on handleOk if provided objectType is dataset', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenSubtype = mstrObjectEnum.mstrObjectType.dataset.subtypes[0];
    const mockRequestImport = jest.fn();
    const mockRequestDossierOpen = jest.fn();
    const wrappedComponent = shallow(
      <_NavigationTree
        mstrData={mstrData}
        chosenObjectId={givenObjectId}
        chosenProjectId={givenProjectId}
        chosenSubtype={givenSubtype}
        {...mockFunctionsAndProps}
        requestImport={mockRequestImport}
        requestDossierOpen={mockRequestDossierOpen}
      />
    );
    // when
    wrappedComponent.instance().handleOk();
    // then
    expect(mockRequestImport).toBeCalled();
    expect(mockRequestDossierOpen).not.toBeCalled();
  });

  it('should call handlePopupErrors on checkIfPrompted bad response in handleOk', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenSubtype = mstrObjectEnum.mstrObjectType.report.subtypes[0];
    const mockHandlePopupErrors = jest.fn();
    jest.spyOn(mstrObjectRestService, 'isPrompted')
      .mockImplementationOnce(() => { throw new Error(); });
    const wrappedComponent = shallow(
      <_NavigationTree
        mstrData={mstrData}
        chosenObjectId={givenObjectId}
        chosenProjectId={givenProjectId}
        chosenSubtype={givenSubtype}
        {...mockFunctionsAndProps}
        handlePopupErrors={mockHandlePopupErrors}
      />
    );
    // when
    wrappedComponent.instance().handleOk();
    // then
    expect(mockHandlePopupErrors).toBeCalled();
  });

  it.skip('should connect on DB when navigation-tree is mounted', () => {
    // given
    const connectToDB = jest.fn();
    const mstrData = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
      connectToDB,
    };
    // when
    shallow(<_NavigationTree
      mstrData={mstrData}
      {...mockFunctionsAndProps}
    />);
    // then
    expect(connectToDB).toHaveBeenCalled();
  });

  it('should not send error and call functionality properly', async () => {
    // given
    const mockHandlePopupErrors = jest.fn();
    const wrappedComponent = shallow(<_NavigationTree {...mockFunctionsAndProps} handlePopupErrors={mockHandlePopupErrors} />);
    // when
    await wrappedComponent.instance().refresh();
    // then
    expect(mockFunctionsAndProps.resetDBState).toHaveBeenCalledWith(true);
  });

  it('should send error message on refresh when no session', async () => {
    // given
    // const asyncMock = jest.fn().mockRejectedValue(new Error('Async error'));
    const givenError = new Error('Session error');
    authenticationHelper.validateAuthToken.mockRejectedValue(givenError);
    const mockHandlePopupErrors = jest.fn();
    const wrappedComponent = shallow(<_NavigationTree {...mockFunctionsAndProps} handlePopupErrors={mockHandlePopupErrors} />);
    // when
    await wrappedComponent.instance().refresh();
    // then
    await expect(mockHandlePopupErrors).toBeCalled();
  });
});
