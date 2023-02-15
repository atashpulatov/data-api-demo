import React from 'react';
import { shallow } from 'enzyme';
import { ObjectTable, TopFilterPanel } from '@mstr/connector-components';
import i18n from '../../i18n';
import { NavigationTreeNotConnected, mapStateToProps } from '../../navigation/navigation-tree';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { DEFAULT_STATE as CACHE_STATE } from '../../redux-reducer/cache-reducer/cache-reducer';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { popupHelper } from '../../popup/popup-helper';
import { Office } from '../mockOffice'; // This import is required for mocking office in tests
import { PopupButtons } from '../../popup/popup-buttons/popup-buttons';

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
    await wrappedComponent.find(PopupButtons).first().invoke('handleSecondary')();
    const buttonWrapper = wrappedComponent.find(PopupButtons).first();
    // then
    expect(mockHandlePrepare).toBeCalled();
    expect(buttonWrapper.prop('previewDisplay')).toEqual(true);
  });

  it('should call handlePopupErrors on checkIfPrompted bad response in handleSecondary', async () => {
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
    await wrappedComponent.find(PopupButtons).first().invoke('handleSecondary')();
    // then
    expect(popupHelper.handlePopupErrors).toBeCalled();
  });

  it('should call proper method on cancel action', () => {
    // given
    const mstrData = {
      envUrl: 'env',
      authToken: 'authToken',
      projectId: 'projectId',
    };
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    const wrappedComponent = shallow(<NavigationTreeNotConnected
      mstrData={mstrData}
      cache={CACHE_STATE}
      {...mockFunctionsAndProps}
    />);
    const office = jest.spyOn(popupHelper, 'officeMessageParent');
    // when
    wrappedComponent.find(PopupButtons).first().invoke('handleCancel')();
    // then
    expect(office).toHaveBeenCalledWith(message);
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
    wrappedComponent.find(ObjectTable).first().invoke('onSelect')(givenObject);
    // then
    const expectedObject = {
      chosenObjectId: givenObjectId,
      chosenObjectName: givenObjectName,
      chosenProjectId: givenProjectId,
      chosenSubtype: givenSubtype,
      mstrObjectType: mstrObjectEnum.mstrObjectType.report,
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
    };

    const wrappedComponent = shallow(<NavigationTreeNotConnected
      {...mockFunctionsAndProps}
      selectObject={mockSelectObject}
      myLibrary={givenMyLibrary}
    />);
    // when
    wrappedComponent.find(ObjectTable).first().invoke('onSelect')(givenObject);
    // then
    const expectedObject = {
      chosenObjectId: givenTargetId,
      chosenObjectName: givenObjectName,
      chosenProjectId: givenProjectId,
      chosenSubtype: givenSubtype,
      mstrObjectType: mstrObjectEnum.mstrObjectType.dossier,
      chosenLibraryDossier: givenObjectId
    };
    expect(mockSelectObject).toBeCalledWith(expectedObject);
  });

  it('should return proper values for intial states on mount', () => {
    // given
    const givenMyLibrary = false;
    const mockSelectObject = jest.fn();

    const wrappedComponent = shallow(<NavigationTreeNotConnected
      {...mockFunctionsAndProps}
      selectObject={mockSelectObject}
      myLibrary={givenMyLibrary}
    />);

    // then
    const wrapperButtons = wrappedComponent.find(PopupButtons).first();
    expect(wrapperButtons.prop('isPublished')).toEqual(true);
  });

  it('should call setState twice and change states according to parameters', () => {
    // given
    const givenObjectId = 'objectId';
    const givenProjectId = 'projectId';
    const givenSubtype = mstrObjectEnum.mstrObjectType.dossier.subtypes[0];
    const givenObjectName = 'objectName';
    const givenTargetId = 'LibraryObjectId';
    const givenMyLibrary = false;
    const mockSelectObject = jest.fn();

    const givenObject = {
      id: givenObjectId,
      projectId: givenProjectId,
      subtype: givenSubtype,
      name: givenObjectName,
      targetId: givenTargetId,
    };

    const wrappedComponent = shallow(<NavigationTreeNotConnected
      {...mockFunctionsAndProps}
      selectObject={mockSelectObject}
      myLibrary={givenMyLibrary}
    />);

    // when
    wrappedComponent.find(ObjectTable).first().invoke('onSelect')(givenObject);
    // then
    expect(wrappedComponent.find(PopupButtons).first().prop('isPublished')).toEqual(true);
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
    await wrappedComponent.find(PopupButtons).first().invoke('handleOk')();
    // then
    expect(mockRequestImport).not.toBeCalled();
    expect(mockRequestDossierOpen).toBeCalled();
  });

  it('should call requestImport on handleOk if provided objectType is dataset', async () => {
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
    await wrappedComponent.find(PopupButtons).first().invoke('handleOk')();
    // then
    expect(mockRequestImport).toBeCalled();
    expect(mockRequestDossierOpen).not.toBeCalled();
  });

  it('should call handlePopupErrors on checkIfPrompted bad response in handleOk', async () => {
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
    await wrappedComponent.find(PopupButtons).first().invoke('handleOk')();
    // then
    expect(popupHelper.handlePopupErrors).toBeCalled();
  });

  it('should send error message on refresh when no session', async () => {
    // given
    const connectToDB = jest.fn().mockReturnValue(Promise.resolve());
    const givenError = new Error('Session error');
    authenticationHelper.validateAuthToken.mockRejectedValue(givenError);
    popupHelper.handlePopupErrors = jest.fn();
    const wrappedComponent = shallow(
      <NavigationTreeNotConnected
        {...mockFunctionsAndProps}
        connectToDB={connectToDB} />
    );
    // when
    await wrappedComponent.find(TopFilterPanel).first().invoke('onRefresh')();

    // then
    await expect(popupHelper.handlePopupErrors).toBeCalled();
  });
});
