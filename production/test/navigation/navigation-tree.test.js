/* eslint-disable */
import React from 'react';
import {_NavigationTree} from '../../src/navigation/navigation-tree';
import {shallow, mount} from 'enzyme';
import {selectorProperties} from '../../src/attribute-selector/selector-properties';
import {officeContext} from '../../src/office/office-context';
import {PopupButtons} from '../../src/popup/popup-buttons';
/* eslint-enable */

describe('NavigationTree', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should (full)render with props given', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    // when
    const wrappedComponent = mount(<_NavigationTree parsed={parsed} />);
    // then
    expect(wrappedComponent.instance()).toBeDefined();
    expect(wrappedComponent.find('SmartFolders').get(0)).toBeDefined();
    expect(wrappedComponent.find('PopupButtons').length).toBe(1);
  });

  it('should have buttons with secondary action', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    // when
    const wrappedComponent = mount(<_NavigationTree parsed={parsed} />);
    // then
    const popupButtonsWrapped = wrappedComponent.find('PopupButtons');
    expect(popupButtonsWrapped.exists('#prepare')).toBeTruthy();
  });

  it('should call secondary action on prepare button clicked', () => {
    // given
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const propsMethod = jest.fn();
    const wrappedComponent = mount(<_NavigationTree
      parsed={parsed}
      chosenObjectId={true}
      selectObject={propsMethod}/>);
    const secondaryAction = jest.spyOn(wrappedComponent.instance(), 'handleSecondary')
        .mockReturnValueOnce({});
    wrappedComponent.update();
    wrappedComponent.instance().forceUpdate();
    const popupButtonsWrapped = wrappedComponent.find(PopupButtons);
    const secondaryButton = popupButtonsWrapped.find('button')
        .find('#prepare');
    // when
    secondaryButton.simulate('click');
    // then
    expect(secondaryAction).toBeCalled();
  });

  it('should call proper method on secondary action', () => {
    // given
    const propsMethod = jest.fn();
    const parsed = {
      envUrl: 'env',
      token: 'token',
      projectId: 'projectId',
    };
    const actionObject = {
      command: selectorProperties.commandSecondary,
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      chosenSubtype: 'subtype',
    };
    const wrappedComponent = shallow(<_NavigationTree
      parsed={parsed}
      handlePrepare={propsMethod}
      {...actionObject}
    />);
    // when
    wrappedComponent.instance().handleSecondary();
    // then
    expect(propsMethod).toBeCalled();
    expect(propsMethod).toBeCalledWith(actionObject.chosenProjectId, actionObject.chosenObjectId, actionObject.chosenSubtype);
  });
});
