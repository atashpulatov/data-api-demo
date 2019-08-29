import React from 'react';
import { shallow } from 'enzyme';
import { default as _DossierWindow } from '../../dossier/dossier-window';
import { PopupButtons } from '../../popup/popup-buttons';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { Office } from '../mockOffice';

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
});
