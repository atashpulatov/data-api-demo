import React from 'react';
import { shallow } from 'enzyme';
import { default as _DossierWindow } from '../../dossier/dossier-window';
import { PopupButtons } from '../../popup/popup-buttons/popup-buttons';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { Office } from '../mockOffice';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';
import { officeContext } from '../../office/office-context';

describe('Dossierwindow', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render PopupButtons', () => {
    // given
    // when
    const componentWrapper = shallow(<_DossierWindow />);
    // then
    const popupButtonsWrapped = componentWrapper.find(PopupButtons);
    expect(popupButtonsWrapped.get(0)).toBeDefined();
  });

  it('should call proper method on cancel action', () => {
    // given
    const cancelObject = { command: selectorProperties.commandCancel, };
    const office = jest.spyOn(Office.context.ui, 'messageParent');
    const wrappedComponent = shallow(<_DossierWindow />);
    // when
    wrappedComponent.instance().handleCancel();
    // then
    expect(office).toHaveBeenCalledWith(JSON.stringify(cancelObject));
  });

  it('should use handleSelection as unselection', () => {
    // given
    const dossierData = { chapterKey: 'C40', visualizationKey: '' };
    const componentWrapper = shallow(<_DossierWindow />);
    // when
    componentWrapper.instance().handleSelection(dossierData);
    // then
    expect(componentWrapper.instance().state.isVisualizationSelected).toBeFalsy();
  });

  it('should use handleSelection as selection', () => {
    // given
    const dossierData = { chapterKey: 'C40', visualizationKey: 'V78' };
    const componentWrapper = shallow(<_DossierWindow />);
    // when
    componentWrapper.instance().handleSelection(dossierData);
    // then
    expect(componentWrapper.instance().state.isVisualizationSelected).toBeTruthy();
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
    const componentWrapper = shallow(<_DossierWindow />);
    componentWrapper.setProps(componentProps);
    componentWrapper.setState(componentState);
    // when
    componentWrapper.instance().handleOk();
    // then
    expect(getOfficeSpy).toHaveBeenCalled();
    expect(messageParentMock).toHaveBeenCalledWith(JSON.stringify(mockupOkObject));
  });
});
