import React from 'react';
import { shallow } from 'enzyme';
import { default as _DossierWindow } from '../../dossier/dossier-window';
import { PopupButtons } from '../../popup/popup-buttons';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { Office } from '../mockOffice';
import mstrObjectEnum from '../../mstr-object/mstr-object-type-enum';

describe('Dossierwindow', () => {
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
    const cancelObject = {
      command: selectorProperties.commandCancel,
    };
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
    expect(componentWrapper.instance().state.isVisualisationSelected).toBeFalsy();
  });

  it('should use handleSelection as selection', () => {
    // given
    const dossierData = { chapterKey: 'C40', visualizationKey: 'V78' };
    const componentWrapper = shallow(<_DossierWindow />);
    // when
    componentWrapper.instance().handleSelection(dossierData);
    // then
    expect(componentWrapper.instance().state.isVisualisationSelected).toBeTruthy();
  });

  it('should use handleOk and run selectObject with given parameters', () => {
    // given
    const componentState = { isVisualisationSelected: true, chapterKey: 'C40', visualizationKey: 'V78', promptsAnswers: [] };
    const selectObject = jest.fn();
    const requestImport = jest.fn();
    const componentProps = { chosenObjectId: 'ABC123', chosenProjectId: 'DEF456', requestImport, selectObject };
    const mockupVisualisationData = {
      chosenObjectId: 'ABC123',
      chosenProjectId: 'DEF456',
      chosenSubtype: mstrObjectEnum.mstrObjectType.visualization.subtypes,
      objectType: mstrObjectEnum.mstrObjectType.visualization.type,
      chosenChapterKey: 'C40',
      chosenVisualizationKey: 'V78',
      promptsAnswers: [],
    };
    const componentWrapper = shallow(<_DossierWindow />);
    componentWrapper.setProps(componentProps);
    componentWrapper.setState(componentState);
    // when
    componentWrapper.instance().handleOk();
    // then
    expect(selectObject).toHaveBeenCalledWith(mockupVisualisationData);
    expect(requestImport).toHaveBeenCalled();
  });
});
