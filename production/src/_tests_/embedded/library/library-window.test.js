import React from 'react';
import { shallow } from 'enzyme';
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

jest.mock('../../../popup/popup-helper');

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

  it('validateSession should call validateAuthToken', async () => {
    // given
    const componentWrapper = shallow(<LibraryWindowNotConnected />);
    const validateTokenSpy = jest.spyOn(authenticationHelper, 'validateAuthToken');
    // when
    componentWrapper.find(EmbeddedLibrary).first().invoke('handleIframeLoadEvent')();
    // then
    expect(validateTokenSpy).toHaveBeenCalled();
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
