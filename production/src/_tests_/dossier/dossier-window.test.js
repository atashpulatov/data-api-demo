import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DossierWindow, DossierWindowNotConnected } from '../../embedded/dossier/dossier-window';
import { PopupButtons } from '../../popup/popup-buttons/popup-buttons';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { popupHelper } from '../../popup/popup-helper';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { authenticationHelper } from '../../authentication/authentication-helper';
import { sessionHelper } from '../../storage/session-helper';
import { EmbeddedDossier } from '../../embedded/dossier/embedded-dossier';

jest.mock('../../popup/popup-helper');

describe('Dossierwindow', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render PopupButtons', () => {
    // given
    // when
    const componentWrapper = shallow(<DossierWindowNotConnected />);

    // then
    const popupButtonsWrapped = componentWrapper.find(PopupButtons);
    expect(popupButtonsWrapped.get(0)).toBeDefined();
  });

  it('should call proper method on cancel action', () => {
    // given
    const { commandCancel } = selectorProperties;
    const message = { command: commandCancel, };
    const wrappedComponent = shallow(<DossierWindowNotConnected />);
    const office = jest.spyOn(popupHelper, 'officeMessageParent');
    // when
    wrappedComponent.find(PopupButtons).first().invoke('handleCancel')();
    // then
    expect(office).toHaveBeenCalledWith(message);
  });

  it('should not change state on handleSelection if instance is not provided', async () => {
    // given
    const dossierData = { chapterKey: 'C40', visualizationKey: 'W50', promptsAnswers: [], };
    const componentWrapper = shallow(<DossierWindowNotConnected />);
    const SpyFetchVisualizationDefinition = jest
      .spyOn(mstrObjectRestService, 'fetchVisualizationDefinition')
      .mockImplementationOnce(() => {});
    // when
    componentWrapper.find(EmbeddedDossier).first().invoke('handleSelection')(dossierData);
    // then
    expect(SpyFetchVisualizationDefinition).not.toHaveBeenCalled();
    expect(componentWrapper.find(PopupButtons).first().prop('disableSecondary')).toEqual(false);
  });

  it('should change state on handleSelection and store viz as supported one', async () => {
    // given
    const dossierData = { chosenChapterKey: 'C40', visualizationKey: 'W50', promptsAnswers: [], instanceId: 'instanceId', };
    const componentWrapper = shallow(<DossierWindowNotConnected />);

    const SpyFetchVisualizationDefinition = jest
      .spyOn(mstrObjectRestService, 'fetchVisualizationDefinition')
      .mockImplementationOnce(() => {});

    // when
    componentWrapper.find(EmbeddedDossier).first().invoke('handleSelection')(dossierData);
    // then
    expect(componentWrapper.find(PopupButtons).first().prop('isPublished')).toEqual(true);
    expect(SpyFetchVisualizationDefinition).toHaveBeenCalled();
  });

  it('should change state on handleSelection and store viz as not supported one because of get viz def error', async () => {
    // given
    const dossierData = { chapterKey: 'C40', visualizationKey: 'W50', promptsAnswers: [], instanceId: 'instanceId', };
    const componentWrapper = shallow(<DossierWindowNotConnected />);

    const SpyFetchVisualizationDefinition = jest
      .spyOn(mstrObjectRestService, 'fetchVisualizationDefinition')
      .mockImplementationOnce(() => { throw new Error(); });

    // when
    await componentWrapper.find(EmbeddedDossier).first().invoke('handleSelection')(dossierData);
    // then
    expect(SpyFetchVisualizationDefinition).toHaveBeenCalled();
    expect(componentWrapper.find(PopupButtons).first().prop('disableSecondary')).toEqual(true);
  });

  it('validateSession should call validateAuthToken', async () => {
    // given
    const componentWrapper = shallow(<DossierWindowNotConnected />);
    const validateTokenSpy = jest.spyOn(authenticationHelper, 'validateAuthToken');
    // when
    componentWrapper.find(EmbeddedDossier).first().invoke('handleIframeLoadEvent')();
    // then
    expect(validateTokenSpy).toHaveBeenCalled();
  });

  it('should use handleOk and run messageParent with given parameters', async () => {
    // given
    const officeMessageParentSpy = jest.spyOn(popupHelper, 'officeMessageParent').mockImplementation();
    const componentState = {
      lastSelectedViz: {
        chapterKey: 'C40',
        visualizationKey: 'V78',
      },
      promptsAnswers: [],
      instanceId: 'instanceId'
    };
    const dossierData = { chosenChapterKey: 'C40', visualizationKey: 'W50', promptsAnswers: [], instanceId: 'instanceId', };
    const componentProps = { chosenObjectName: 'selectedObject', chosenObjectId: 'ABC123', chosenProjectId: 'DEF456' };
    const mockupOkObject = {
      command: 'command_ok',
      chosenObjectName: 'selectedObject',
      chosenObject: 'ABC123',
      chosenProject: 'DEF456',
      chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
      isPrompted: false,
      promptsAnswers: [],
      visualizationInfo: {},
      preparedInstanceId: '',
      isEdit: false,
    };
    const componentWrapper = shallow(<DossierWindowNotConnected />);
    componentWrapper.setProps(componentProps);

    // when
    componentWrapper.find(PopupButtons).first().invoke('handleOk')();
    // then
    expect(officeMessageParentSpy).toHaveBeenCalled();
    expect(officeMessageParentSpy).toHaveBeenCalledWith(mockupOkObject);
  });

  it('handleEmbeddedDossierLoad setup correct state', () => {
    // given
    const componentWrapper = shallow(<DossierWindowNotConnected />);
    // then
    expect(componentWrapper.exists('.dossier-window-information-frame')).toBe(false);
    // when
    componentWrapper.find(EmbeddedDossier).first().invoke('handleEmbeddedDossierLoad')(true);
    // then
    expect(componentWrapper.exists('.dossier-window-information-frame')).toBe(true);
  });

  it('should call installSessionProlongingHandler on mount', async () => {
    // given
    jest.spyOn(sessionHelper, 'installSessionProlongingHandler');

    // when
    shallow(<DossierWindowNotConnected />);

    // then
    expect(sessionHelper.installSessionProlongingHandler).toHaveBeenCalled();
  });

  describe('DossierWindow.js mapStateToProps and mapActionsToProps test', () => {
    const mockStore = configureMockStore([thunk]);
    let store;
    let componentWrapper;

    beforeEach(() => {
      const initialState = {
        popupReducer: {},
        officeReducer: { supportForms: true },
        sessionReducer: { attrFormPrivilege: true },
        navigationTree: {
          chosenObjectName: 'objectName',
          chosenObjectId: 'objectId',
          chosenProjectId: 'projectId',
        },
        popupStateReducer: {
          popupType: 'testPopupType',
          otherDefinedProperty: 'testOtherProperty'
        }
      };
      store = mockStore(initialState);
      componentWrapper = shallow(<DossierWindow store={store} />);
    });

    it('should use mapStateToProps', () => {
      // given
      const childrenProps = componentWrapper.props().children.props;
      // when
      // then
      expect(childrenProps.chosenObjectName).toBe('objectName');
      expect(childrenProps.chosenObjectId).toBe('objectId');
      expect(childrenProps.chosenProjectId).toBe('projectId');
    });

    it('should use mapActionsToProps', () => {
      // given
      const childrenProps = componentWrapper.props().children.props;
      // when
      // then
      expect(childrenProps.handleBack).toBeDefined();
    });
  });
  // TODO check if needed
  // describe.skip('DossierWindow.js mapStateToProps with edited object test', () => {
  //   // TODO: unskip when we find out why jenkinf is failling to run test
  //   const mockStore = configureMockStore([thunk]);
  //   let store;
  //   let componentWrapper;
  //   beforeEach(() => {
  //     const initialState = {
  //       popupReducer: {
  //         editedObject: {
  //           chosenObjectName: 'editedObjectName',
  //           chosenObjectId: 'editedObjectId',
  //           projectId: 'editedProjectId',
  //         }
  //       },
  //       navigationTree: {
  //         chosenObjectName: 'objectName',
  //         chosenObjectId: 'objectId',
  //         chosenProjectId: 'projectId',
  //       },
  //       popupStateReducer: {
  //         popupType: 'testPopupType',
  //         otherDefinedProperty: 'testOtherProperty'
  //       }
  //     };
  //     store = mockStore(initialState);
  //     componentWrapper = shallow(<DossierWindow store={store} />);
  //   });

  //   it('should use mapStateToProps with editedObject', () => {
  //     // given
  //     const childrenProps = componentWrapper.props().children.props;
  //     // when
  //     // then
  //     expect(childrenProps.chosenObjectName).toBe('editedObjectName');
  //     expect(childrenProps.chosenObjectId).toBe('editedObjectId');
  //     expect(childrenProps.chosenProjectId).toBe('editedProjectId');
  //   });
  // });
});
