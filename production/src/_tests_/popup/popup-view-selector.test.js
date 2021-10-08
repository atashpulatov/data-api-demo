import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { PopupViewSelector, PopupViewSelectorNotConnected } from '../../popup/popup-view-selector';
import { PromptsWindow } from '../../prompts/prompts-window';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { NavigationTree } from '../../navigation/navigation-tree';
import { AttributeSelectorWindow } from '../../attribute-selector/attribute-selector-window';
import { DossierWindow } from '../../dossier/dossier-window';
import { ObtainInstanceHelper } from '../../popup/obtain-instance-helper';
import { popupViewSelectorHelper } from '../../popup/popup-view-selector-helper';
import { popupHelper } from '../../popup/popup-helper';
import { popupActions, SET_PREPARED_REPORT } from '../../redux-reducer/popup-reducer/popup-actions';

jest.mock('../../popup/popup-helper');
jest.mock('../../popup/popup-view-selector-helper');

describe('PopupViewSelectorNotConnected', () => {
  it('should not render anything when no authToken provided', () => {
    // given
    const setPopupType = jest.spyOn(popupViewSelectorHelper, 'setPopupType');

    // when
    const componentWrapper = shallow(<PopupViewSelectorNotConnected />);

    // then
    expect(setPopupType).not.toBeCalled();
    expect(componentWrapper.find(PopupViewSelectorNotConnected).get(0)).not.toBeDefined();
  });

  it('should not render anything when authToken provided and popupType not known', () => {
    // given
    const setPopupType = jest.spyOn(popupViewSelectorHelper, 'setPopupType');

    // when
    const componentWrapper = shallow(<PopupViewSelectorNotConnected authToken="testAuthToken" />);

    // then
    expect(setPopupType).toBeCalled();
    expect(componentWrapper.find(PopupViewSelectorNotConnected).get(0)).not.toBeDefined();
  });

  it.each`
  popupType                             | expectedComponent
  ${PopupTypeEnum.dataPreparation}      | ${AttributeSelectorWindow}
  ${PopupTypeEnum.editFilters}          | ${AttributeSelectorWindow}
  ${PopupTypeEnum.navigationTree}       | ${NavigationTree}
  ${PopupTypeEnum.promptsWindow}        | ${PromptsWindow}
  ${PopupTypeEnum.repromptingWindow}    | ${PromptsWindow}
  ${PopupTypeEnum.dossierWindow}        | ${DossierWindow}
  ${PopupTypeEnum.obtainInstanceHelper} | ${ObtainInstanceHelper}
  `('should render $expectedComponent when setPopupType returns $popupType', ({ popupType, expectedComponent }) => {
  // given
    const setPopupType = jest.spyOn(popupViewSelectorHelper, 'setPopupType').mockImplementation(() => popupType);

    // when
    const componentWrapper = shallow(<PopupViewSelectorNotConnected authToken="testAuthToken" />);

    // then
    expect(setPopupType).toBeCalled();
    expect(componentWrapper.find(expectedComponent).get(0)).toBeDefined();
  });
});

describe('PopupViewSelectorNotConnected mapStateToProps and mapDispatchToProps test', () => {
  const mockStore = configureMockStore([thunk]);
  let store;
  let componentWrapper;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(popupHelper, 'parsePopupState').mockReturnValue({ sth: 42 });

    const initialState = {
      popupReducer: {
        editedObject: { mstrObjectType: { name: 'report' } },
        preparedInstance: 'testPreparedInstance'
      },
      popupStateReducer: {
        popupType: 'testPopupType',
        otherDefinedProperty: 'testOtherProperty',
        otherPopupStateReducerProperty: 'testOtherValue'
      },
      navigationTree: {
        promptsAnswers: 'testPromptsAnswers',
        otherNavigationTreeProperty: 'testOtherNavigationTreeProperty'
      },
      sessionReducer: {
        authToken: 'testAuthToken',
        attrFormPrivilege: true
      },
      officeReducer: { supportForms: true }
    };

    store = mockStore(initialState);

    componentWrapper = shallow(
      <PopupViewSelector store={store} />
    ).find(PopupViewSelectorNotConnected);
  });

  it('should use mapStateToProps', () => {
    // given
    // when
    const componentWrapperProps = componentWrapper.props();

    // then
    expect(componentWrapperProps.authToken).toEqual('testAuthToken');
    expect(componentWrapperProps.otherNavigationTreeProperty).toEqual('testOtherNavigationTreeProperty');
    expect(popupHelper.parsePopupState).toBeCalledWith({ mstrObjectType: { name: 'report' } }, 'testPromptsAnswers', true);
    expect(componentWrapperProps.editedObject).toEqual({ sth: 42 });
    expect(componentWrapperProps.preparedInstance).toEqual('testPreparedInstance');
    expect(componentWrapperProps.propsToPass).toHaveProperty('otherPopupStateReducerProperty', 'testOtherValue');
    expect(componentWrapperProps.popupType).toEqual('testPopupType');
  });

  it('should use mapDispatchToProps', () => {
    // given
    // when
    store.dispatch(popupActions.preparePromptedReport('testInstanceId', 'testChosenObjectData'));

    // then
    const actions = store.getActions();

    expect(actions[0]).toEqual({
      instanceId: 'testInstanceId',
      chosenObjectData: 'testChosenObjectData',
      type: SET_PREPARED_REPORT
    });
  });
});
