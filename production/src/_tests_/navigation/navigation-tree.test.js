import React from 'react';
import { shallow } from 'enzyme';
import i18n from '../../i18n';
import { NavigationTreeNotConnected, mapStateToProps } from '../../navigation/navigation-tree';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { Office } from '../mockOffice';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { DEFAULT_STATE as CACHE_STATE } from '../../cache/cache-reducer';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { popupHelper } from '../../popup/popup-helper';
import DB from '../../cache/cache-db';

jest.mock('../../mstr-object/mstr-object-rest-service');
jest.mock('../../authentication/authentication-helper', () => ({ authenticationHelper: { validateAuthToken: jest.fn().mockImplementation(() => Promise.resolve('Magic')) } }));

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
    handlePopupErrors: jest.fn(),
  };

  it('should render with props given', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      authToken: 'authToken',
      projectId: 'projectId',
    };
    // when

    const wrappedComponent = shallow(<NavigationTreeNotConnected
      mstrData={mstrData}
      {...mockFunctionsAndProps} />);
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
      authToken: 'authToken',
      projectId: 'projectId',
    };
    const actionObject = {
      command: selectorProperties.commandSecondary,
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      chosenSubtype: mstrObjectEnum.mstrObjectType.report.subtypes[0],
      chosenObjectName: 'Prepare Data',
      chosenType: 'Data',
      setObjectData: jest.fn(),
    };
    const givenIsPrompted = 'customPromptAnswer';
    jest.spyOn(mstrObjectRestService, 'isPrompted')
      .mockImplementationOnce(async () => givenIsPrompted);
    const wrappedComponent = shallow(
      <NavigationTreeNotConnected
        mstrData={mstrData}
        handlePrepare={mockHandlePrepare}
        {...actionObject}
        {...mockFunctionsAndProps}
      />
    );
    // when
    await wrappedComponent.instance().handleSecondary();
    // then
    expect(mockHandlePrepare).toBeCalled();
    expect(wrappedComponent.state('previewDisplay')).toEqual(true);
  });

  it('should call handlePopupErrors on checkIfPrompted bad response in handleSecondary', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      authToken: 'authToken',
      projectId: 'projectId',
    };
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenSubtype = mstrObjectEnum.mstrObjectType.dossier.subtypes[0];
    popupHelper.handlePopupErrors = jest.fn();
    jest.spyOn(mstrObjectRestService, 'isPrompted')
      .mockImplementationOnce(() => { throw new Error(); });
    const wrappedComponent = shallow(
      <NavigationTreeNotConnected
        mstrData={mstrData}
        chosenObjectId={givenObjectId}
        chosenProjectId={givenProjectId}
        chosenSubtype={givenSubtype}
        {...mockFunctionsAndProps}
      />
    );
    // when
    wrappedComponent.instance().handleSecondary();
    // then
    expect(popupHelper.handlePopupErrors).toBeCalled();
  });

  it('should call proper method on cancel action', () => {
    // given
    const stopLoadingMocked = jest.fn();
    const mstrData = {
      envUrl: 'env',
      authToken: 'authToken',
      projectId: 'projectId',
    };
    const resultAction = { command: selectorProperties.commandCancel, };
    const office = jest.spyOn(Office.context.ui, 'messageParent');
    const wrappedComponent = shallow(<NavigationTreeNotConnected
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
      authToken: 'authToken',
      projectId: 'projectId',
    };
    const body = {};
    const resultAction = {
      command: selectorProperties.commandOnUpdate,
      body,
    };
    const mockMessageParent = jest.spyOn(Office.context.ui, 'messageParent');
    const wrappedComponent = shallow(<NavigationTreeNotConnected
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

    const givenObject = {
      id: givenObjectId,
      projectId: givenProjectId,
      subtype: givenSubtype,
      name: givenObjectName,
      targetId: givenTargetId,
      myLibrary: givenMyLibrary,
    };

    const wrappedComponent = shallow(<NavigationTreeNotConnected
      {...mockFunctionsAndProps}
      selectObject={mockSelectObject}
    />);
    // when
    wrappedComponent.instance().onObjectChosen(givenObject);
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

    const givenObject = {
      id: givenObjectId,
      projectId: givenProjectId,
      subtype: givenSubtype,
      name: givenObjectName,
      targetId: givenTargetId,
      myLibrary: givenMyLibrary,
    };

    const wrappedComponent = shallow(<NavigationTreeNotConnected
      {...mockFunctionsAndProps}
      selectObject={mockSelectObject}
    />);
    // when
    wrappedComponent.instance().onObjectChosen(givenObject);
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
      authToken: 'authToken',
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
      <NavigationTreeNotConnected
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
      authToken: 'authToken',
      projectId: 'projectId',
    };
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenSubtype = mstrObjectEnum.mstrObjectType.dataset.subtypes[0];
    const mockRequestImport = jest.fn();
    const mockRequestDossierOpen = jest.fn();
    const wrappedComponent = shallow(
      <NavigationTreeNotConnected
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
      authToken: 'authToken',
      projectId: 'projectId',
    };
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenSubtype = mstrObjectEnum.mstrObjectType.report.subtypes[0];
    popupHelper.handlePopupErrors = jest.fn();
    jest.spyOn(mstrObjectRestService, 'isPrompted')
      .mockImplementationOnce(() => { throw new Error(); });
    const wrappedComponent = shallow(
      <NavigationTreeNotConnected
        mstrData={mstrData}
        chosenObjectId={givenObjectId}
        chosenProjectId={givenProjectId}
        chosenSubtype={givenSubtype}
        {...mockFunctionsAndProps}
      />
    );
    // when
    wrappedComponent.instance().handleOk();
    // then
    expect(popupHelper.handlePopupErrors).toBeCalled();
  });

  it('should connect on DB when navigation-tree is mounted', () => {
    // given
    const connectToDB = jest.fn().mockReturnValue(Promise.resolve());
    const mstrData = {
      envUrl: 'env',
      authToken: 'authToken',
      projectId: 'projectId'
    };
    DB.getIndexedDBSupport = jest.fn();
    DB.getIndexedDBSupport.mockReturnValue(true);
    // when
    shallow(<NavigationTreeNotConnected
      mstrData={mstrData}
      {...mockFunctionsAndProps}
      connectToDB={connectToDB}
    />);
    // then
    expect(connectToDB).toHaveBeenCalled();
  });

  it('should fetch from network when navigation-tree is mounted and db is not supported', () => {
    // given
    const connectToDB = jest.fn().mockReturnValue(Promise.resolve());
    const mstrData = {
      envUrl: 'env',
      authToken: 'authToken',
      projectId: 'projectId'
    };
    DB.getIndexedDBSupport = jest.fn();
    DB.getIndexedDBSupport.mockReturnValue(false);
    // when
    shallow(<NavigationTreeNotConnected
      mstrData={mstrData}
      {...mockFunctionsAndProps}
      connectToDB={connectToDB}
    />);
    // then
    expect(mockFunctionsAndProps.fetchObjectsFromNetwork).toHaveBeenCalled();
  });

  it('should not send error and call functionality properly', async () => {
    // given
    const connectToDB = jest.fn().mockReturnValue(Promise.resolve());
    popupHelper.handlePopupErrors = jest.fn();
    const wrappedComponent = shallow(<NavigationTreeNotConnected {...mockFunctionsAndProps} connectToDB={connectToDB} />);
    // when
    await wrappedComponent.instance().refresh();
    // then
    expect(mockFunctionsAndProps.resetDBState).toHaveBeenCalledWith(true);
  });

  it('should send error message on refresh when no session', async () => {
    // given
    // const asyncMock = jest.fn().mockRejectedValue(new Error('Async error'));
    const connectToDB = jest.fn().mockReturnValue(Promise.resolve());
    const givenError = new Error('Session error');
    authenticationHelper.validateAuthToken.mockRejectedValue(givenError);
    popupHelper.handlePopupErrors = jest.fn();
    const wrappedComponent = shallow(<NavigationTreeNotConnected {...mockFunctionsAndProps} connectToDB={connectToDB} />);
    // when
    await wrappedComponent.instance().refresh();
    // then
    await expect(popupHelper.handlePopupErrors).toBeCalled();
  });
});
