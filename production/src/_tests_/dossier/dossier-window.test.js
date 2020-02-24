import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import DossierWindowNotConnected, { DossierWindow } from '../../dossier/dossier-window';
import { PopupButtons } from '../../popup/popup-buttons/popup-buttons';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { Office } from '../mockOffice';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { officeContext } from '../../office/office-context';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';
import { authenticationHelper } from '../../authentication/authentication-helper';

describe('Dossierwindow', () => {
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
    const cancelObject = { command: selectorProperties.commandCancel, };
    const office = jest.spyOn(Office.context.ui, 'messageParent');
    const wrappedComponent = shallow(<DossierWindowNotConnected />);
    // when
    wrappedComponent.instance().handleCancel();
    // then
    expect(office).toHaveBeenCalledWith(JSON.stringify(cancelObject));
  });

  it('should use handleSelection as unselection', () => {
    // given
    const dossierData = { chapterKey: 'C40', visualizationKey: '' };
    const componentWrapper = shallow(<DossierWindowNotConnected />);
    // when
    componentWrapper.instance().handleSelection(dossierData);
    // then
    expect(componentWrapper.instance().state.isVisualizationSelected).toBeFalsy();
  });

  it('should use handleSelection as selection', async () => {
    // given
    const dossierData = { chapterKey: 'C40', visualizationKey: 'V78' };
    const componentWrapper = shallow(<DossierWindowNotConnected />);
    mstrObjectRestService.fetchVisualizationDefinition = jest.fn();
    // when
    await componentWrapper.instance().handleSelection(dossierData);
    // then
    expect(componentWrapper.instance().state.isVisualizationSelected).toBeTruthy();
  });

  it('validateSession should call validateAuthToken', async () => {
    // given
    const componentWrapper = shallow(<DossierWindowNotConnected />);
    const validateTokenSpy = jest.spyOn(authenticationHelper, 'validateAuthToken');
    // when
    await componentWrapper.instance().validateSession();
    // then
    expect(validateTokenSpy).toHaveBeenCalled();
  });

  it('handleInstanceIdChange set new instanceId and clear viz data in state', async () => {
    // given
    const newInstanceId = 'newInstanceId';
    const componentWrapper = shallow(<DossierWindowNotConnected />);
    // when
    componentWrapper.instance().handleInstanceIdChange(newInstanceId);
    // then
    expect(componentWrapper.instance().state.preparedInstanceId).toBe(newInstanceId);
    expect(componentWrapper.instance().state.isVisualizationSelected).toBe(false);
    expect(componentWrapper.instance().state.chapterKey).toBe('');
    expect(componentWrapper.instance().state.visualizationKey).toBe('');
  });

  it('handlePromptAnswer setup correct state', async () => {
    // given
    const newAnswers = 'newAnswers';
    const componentWrapper = shallow(<DossierWindowNotConnected />);
    // when
    componentWrapper.instance().handlePromptAnswer(newAnswers);
    // then
    expect(componentWrapper.instance().state.promptsAnswers).toBe(newAnswers);
  });

  it('should use handleOk and run messageParent with given parameters', () => {
    // given
    const messageParentMock = jest.fn();
    const getOfficeSpy = jest.spyOn(officeContext, 'getOffice').mockImplementation(() => ({ context: { ui: { messageParent: messageParentMock, }, }, }));

    const componentState = { isVisualizationSelected: true, chapterKey: 'C40', visualizationKey: 'V78', promptsAnswers: [] };
    const componentProps = { chosenObjectName: 'selectedObject', chosenObjectId: 'ABC123', chosenProjectId: 'DEF456' };

    const mockupOkObject = {
      command: 'command_ok',
      chosenObjectName: 'selectedObject',
      chosenObject: 'ABC123',
      chosenProject: 'DEF456',
      chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
      isPrompted: false,
      promptsAnswers: [],
      visualizationInfo: {
        chapterKey: 'C40',
        visualizationKey: 'V78',
      },
      preparedInstanceId: '',
      isEdit: false,
    };
    const componentWrapper = shallow(<DossierWindowNotConnected />);
    componentWrapper.setProps(componentProps);
    componentWrapper.setState(componentState);
    // when
    componentWrapper.instance().handleOk();
    // then
    expect(getOfficeSpy).toHaveBeenCalled();
    expect(messageParentMock).toHaveBeenCalledWith(JSON.stringify(mockupOkObject));
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
  describe.skip('DossierWindow.js mapStateToProps with edited object test', () => {
    // TODO: unskip when we find out why jenkinf is failling to run test
    const mockStore = configureMockStore([thunk]);
    let store;
    let componentWrapper;
    beforeEach(() => {
      const initialState = {
        popupReducer:{
          editedObject:{
            chosenObjectName: 'editedObjectName',
            chosenObjectId: 'editedObjectId',
            projectId: 'editedProjectId',
          }
        },
        navigationTree:{
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

    it('should use mapStateToProps with editedObject', () => {
      // given
      const childrenProps = componentWrapper.props().children.props;
      // when
      // then
      expect(childrenProps.chosenObjectName).toBe('editedObjectName');
      expect(childrenProps.chosenObjectId).toBe('editedObjectId');
      expect(childrenProps.chosenProjectId).toBe('editedProjectId');
    });
  });
});
