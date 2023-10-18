import React from 'react';
import { shallow } from 'enzyme';
import { waitFor } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { LibraryWindow, LibraryWindowNotConnected } from '../../../embedded/library/library-window';
import { PopupButtons } from '../../../popup/popup-buttons/popup-buttons';
import { selectorProperties } from '../../../attribute-selector/selector-properties';
import { popupHelper } from '../../../popup/popup-helper';
import { authenticationHelper } from '../../../authentication/authentication-helper';
import { sessionHelper } from '../../../storage/session-helper';
import { EmbeddedLibrary } from '../../../embedded/library/embedded-library';
import mstrObjectEnum from '../../../mstr-object/mstr-object-type-enum';
import { mstrObjectRestService } from '../../../mstr-object/mstr-object-rest-service';

jest.mock('../../../popup/popup-helper');
jest.mock('../../../mstr-object/mstr-object-rest-service');

describe('Librarywindow', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render PopupButtons', () => {
    // given
    // when
    const componentWrapper = shallow(<LibraryWindowNotConnected />);

    // then
    const popupButtonsWrapped = componentWrapper.find(PopupButtons);
    expect(popupButtonsWrapped.get(0)).toBeDefined();
  });

  it('should render EmbeddedLibrary', () => {
    // given
    // when
    const componentWrapper = shallow(<LibraryWindowNotConnected />);

    // then
    const embeddedLibraryWrapped = componentWrapper.find(EmbeddedLibrary);
    expect(embeddedLibraryWrapped.get(0)).toBeDefined();
  });

  it('should render Title bar', () => {
    // given
    // when
    const componentWrapper = shallow(<LibraryWindowNotConnected />);

    // then
    const embeddedLibraryTitleBarWrapped = componentWrapper.find('div.title-bar');
    expect(embeddedLibraryTitleBarWrapped.get(0)).toBeDefined();
  });

  it('should call proper method on cancel action', () => {
    // given
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    const wrappedComponent = shallow(<LibraryWindowNotConnected />);
    const office = jest.spyOn(popupHelper, 'officeMessageParent');
    // when
    wrappedComponent.find(PopupButtons).first().invoke('handleCancel')();
    // then
    expect(office).toHaveBeenCalledWith(message);
  });

  it('should call proper methods on handleSecondary action', async () => {
    // given
    const handlePrepareMock = jest.fn().mockReturnValue('MockedPrepareResult');
    const setObjectDataMock = jest.fn().mockReturnValue('MockedObjectResult');

    const wrappedComponent = shallow(<LibraryWindowNotConnected
      handlePrepare={handlePrepareMock}
      setObjectData={setObjectDataMock}
    />);

    const getMstrTypeBySubtypeSpy = jest.spyOn(mstrObjectEnum, 'getMstrTypeBySubtype').mockReturnValue(mstrObjectEnum.mstrObjectType.report);

    wrappedComponent.requestImport = jest.fn().mockImplementationOnce(() => Promise.resolve());
    wrappedComponent.requestDossierOpen = jest.fn().mockImplementationOnce(() => Promise.resolve());

    const isPromptedSpy = jest.spyOn(mstrObjectRestService, 'isPrompted').mockResolvedValueOnce(true);

    // when
    wrappedComponent.find(PopupButtons).first().invoke('handleSecondary')();

    // then
    expect(getMstrTypeBySubtypeSpy).toHaveBeenCalled();

    await waitFor(() => expect(isPromptedSpy).toHaveBeenCalled());

    expect(setObjectDataMock).toBeCalled();
    expect(handlePrepareMock).toBeCalled();
  });

  describe('handleOk action', () => {
    let wrappedComponent;

    const requestImportMock = jest.fn().mockReturnValue('MockedImportResult');
    const requestDossierOpenMock = jest.fn().mockReturnValue('MockedImportResult');

    beforeEach(() => {
      jest.restoreAllMocks();

      wrappedComponent = shallow(<LibraryWindowNotConnected
        requestImport={requestImportMock}
        requestDossierOpen={requestDossierOpenMock}
      />);

      wrappedComponent.requestImport = jest.fn().mockImplementationOnce(() => Promise.resolve());
      wrappedComponent.requestDossierOpen = jest.fn().mockImplementationOnce(() => Promise.resolve());
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const isPromptedSpy = jest.spyOn(mstrObjectRestService, 'isPrompted').mockResolvedValueOnce({
      promptObjects: [],
      isPrompted: true,
    });

    it('should call proper requestImport method', async () => {
      // given
      const getMstrTypeBySubtypeSpy = jest.spyOn(mstrObjectEnum, 'getMstrTypeBySubtype').mockReturnValue(mstrObjectEnum.mstrObjectType.report);

      // when
      wrappedComponent.find(PopupButtons).first().invoke('handleOk')();

      // then
      expect(getMstrTypeBySubtypeSpy).toHaveBeenCalled();

      await waitFor(() => expect(isPromptedSpy).toHaveBeenCalled());

      expect(requestImportMock).toBeCalled();
      expect(requestDossierOpenMock).not.toBeCalled();
    });

    it('should call proper requestDossierOpen method', async () => {
      // given
      const getMstrTypeBySubtypeSpy = jest.spyOn(mstrObjectEnum, 'getMstrTypeBySubtype').mockReturnValue(mstrObjectEnum.mstrObjectType.dossier);
      const createDossierInstance = jest.spyOn(mstrObjectRestService, 'createDossierInstance').mockResolvedValueOnce({
        mid: 'mid',
        status: 2,
      });
      const getObjectPrompts = jest.spyOn(mstrObjectRestService, 'getObjectPrompts').mockResolvedValueOnce({
        promptObjects: [],
        isPrompted: true,
      });
      const deleteDossierInstance = jest.spyOn(mstrObjectRestService, 'deleteDossierInstance');

      // when
      wrappedComponent.find(PopupButtons).first().invoke('handleOk')();

      // then
      expect(getMstrTypeBySubtypeSpy).toHaveBeenCalled();

      await waitFor(() => expect(createDossierInstance).toHaveBeenCalled());
      await waitFor(() => expect(getObjectPrompts).toHaveBeenCalled());
      await waitFor(() => expect(deleteDossierInstance).toHaveBeenCalled());

      expect(requestImportMock).not.toBeCalled();
      expect(requestDossierOpenMock).toBeCalled();
    });
  });

  it('validateSession should call validateAuthToken', async () => {
    // given
    const componentWrapper = shallow(<LibraryWindowNotConnected />);
    const validateTokenSpy = jest.spyOn(authenticationHelper, 'validateAuthToken');
    // when
    componentWrapper.find(EmbeddedLibrary).first().invoke('handleIframeLoadEvent')();
    // then
    expect(validateTokenSpy).toHaveBeenCalled();
  });

  it('handleOk should call getMstrTypeBySubtype', async () => {
    // given
    const componentWrapper = shallow(<LibraryWindowNotConnected />);
    const getMstrTypeBySubtypeSpy = jest.spyOn(mstrObjectEnum, 'getMstrTypeBySubtype');
    // when
    componentWrapper.find(PopupButtons).first().invoke('handleOk')();
    // then
    expect(getMstrTypeBySubtypeSpy).toHaveBeenCalled();
  });

  it('should call installSessionProlongingHandler on mount', async () => {
    // given
    jest.spyOn(sessionHelper, 'installSessionProlongingHandler');

    // when
    shallow(<LibraryWindowNotConnected />);

    // then
    expect(sessionHelper.installSessionProlongingHandler).toHaveBeenCalled();
  });

  describe('LibraryWindow.js mapStateToProps and mapActionsToProps test', () => {
    const mockStore = configureMockStore([thunk]);
    let store;
    let componentWrapper;

    beforeEach(() => {
      const initialState = {
        navigationTree: {
          chosenObjectName: 'objectName',
          chosenObjectId: 'id',
          chosenProjectId: 'projectId',
          chosenSubtype: 'subtype',
          mstrObjectType: mstrObjectEnum.mstrObjectType.dossier
        }
      };
      store = mockStore(initialState);
      componentWrapper = shallow(<LibraryWindow store={store} />);
    });

    it('should use mapStateToProps', () => {
      // given
      const childrenProps = componentWrapper.props().children.props;
      // when
      // then
      expect(childrenProps.chosenObjectId).toBe('id');
      expect(childrenProps.chosenProjectId).toBe('projectId');
      expect(childrenProps.chosenObjectName).toBe('objectName');
      expect(childrenProps.chosenSubtype).toBe('subtype');
      expect(childrenProps.mstrObjectType).toBe(mstrObjectEnum.mstrObjectType.dossier);
    });

    it('should use mapActionsToProps', () => {
      // given
      const childrenProps = componentWrapper.props().children.props;
      // when
      // then
      expect(childrenProps.selectObject).toBeDefined();
      expect(childrenProps.setObjectData).toBeDefined();
      expect(childrenProps.requestImport).toBeDefined();
      expect(childrenProps.requestDossierOpen).toBeDefined();
      expect(childrenProps.handlePrepare).toBeDefined();
    });
  });
});
