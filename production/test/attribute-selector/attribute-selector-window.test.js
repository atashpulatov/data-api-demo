/* eslint-disable */
import React from 'react';
import {Provider} from 'react-redux';
import {reduxStore} from '../../src/store';
import {shallow, mount} from 'enzyme';
import {AttributeSelectorWindow} from '../../src/attribute-selector/attribute-selector-window';
import {AttributeSelector} from '../../src/attribute-selector/attribute-selector';
import {attributeSelectorHelpers} from '../../src/attribute-selector/attribute-selector-helpers';
import {selectorProperties} from '../../src/attribute-selector/selector-properties';

jest.mock('../../src/attribute-selector/attribute-selector-helpers');
/* eslint-enable */

describe('AttributeSelectorWindow', () => {
  it('should contain attribute selector', () => {
    // given
    const parsed = {};
    // when
    const componentWrapper = shallow(<AttributeSelectorWindow
      parsed={parsed} />);
    // then
    const selectorWrapper = componentWrapper.find(AttributeSelector);
    expect(selectorWrapper.get(0)).toBeDefined();
  });

  it('should parse props correctly', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
    };
    // when
    const componentWrapper = shallow(<AttributeSelectorWindow
      parsed={parsed} />);
    // then
    expect(componentWrapper.state('session').url)
        .toEqual(parsed.envUrl);
    expect(componentWrapper.state('session').authToken)
        .toEqual(parsed.token);
    expect(componentWrapper.state('session').projectId)
        .toEqual(parsed.projectId);
  });

  it('should call setState if handleOk is called', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow parsed={parsed} />);
    const spyMethod = jest.spyOn(componentWrapper.instance(), 'setState');

    // when
    componentWrapper.instance().handleOk();

    // then
    expect(spyMethod).toHaveBeenCalledWith({triggerUpdate: true, loading: true});
  });

  it('should call attributeSelectorHelpers.officeMessageParent if onTriggerUpdate is called without report name', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
      reportName: '55',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow parsed={parsed} />);
    const spyMethod = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');

    // when
    componentWrapper.instance().onTriggerUpdate(1, 2, 3, 4);

    // then
    expect(spyMethod).toHaveBeenCalledWith(selectorProperties.commandOnUpdate, 1, 2, 3, 4, parsed.reportName);
  });

  it('should call attributeSelectorHelpers.officeMessageParent if onTriggerUpdate is called with report name', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
      reportName: '55',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow parsed={parsed} />);
    const spyMethod = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');

    // when
    componentWrapper.instance().onTriggerUpdate(1, 2, 3, 4, 5);

    // then
    expect(spyMethod).toHaveBeenCalledWith(selectorProperties.commandOnUpdate, 1, 2, 3, 4, 5);
  });

  it('should trigger handleCancel when Cancel was clicked', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = mount(
        <Provider store={reduxStore}>
          <AttributeSelectorWindow
            parsed={parsed} />
        </Provider>);
    const spyMethod = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');

    const wrappedCancelButton = componentWrapper.find('Button #cancel');

    // when
    wrappedCancelButton.simulate('click');

    // then
    expect(spyMethod).toBeCalled();
  });

  it('should trigger handleBack when Back was clicked', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };
    const handleBack = jest.fn();

    const componentWrapper = mount(
        <Provider store={reduxStore}><AttributeSelectorWindow
          parsed={parsed} handleBack={handleBack} />
        </Provider>);

    const wrappedCancelButton = componentWrapper.find('Button #back');

    // when
    wrappedCancelButton.simulate('click');

    // then
    expect(handleBack).toBeCalled();
  });

  it('should trigger attribute-selector-helpers: officeMessageParent when Cancel is clicked', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow
      parsed={parsed} />);

    const officeMessageParentSpy = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');
    officeMessageParentSpy.mockClear();

    // when
    componentWrapper.instance().handleCancel();

    // then
    expect(officeMessageParentSpy).toHaveBeenCalledTimes(1);
  });

  it('should change value of attributesSelected if attributesBeingSelected is being invoked', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow parsed={parsed} />);

    const attributesBeingSelectedSpy = jest.spyOn(componentWrapper.instance(), 'attributesBeingSelected');
    expect(componentWrapper.instance().state.attributesSelected).toBeFalsy();

    // when
    componentWrapper.instance().attributesBeingSelected(true);

    // then
    expect(componentWrapper.instance().state.attributesSelected).toBeTruthy();
  });
  it('should change values if resetTriggerUpdate is being invoked', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow parsed={parsed} />);

    const resetTriggerUpdateSpy = jest.spyOn(componentWrapper.instance(), 'resetTriggerUpdate');

    // when
    componentWrapper.instance().resetTriggerUpdate();
    // then
    expect(componentWrapper.instance().state.triggerUpdate).toBeFalsy();
    expect(componentWrapper.instance().state.loading).toBeFalsy();
  });
  it('should change value of openModal if openModal is being invoked', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow parsed={parsed} />);
    const openModalSpy = jest.spyOn(componentWrapper.instance(), 'openModal');

    // when
    componentWrapper.instance().openModal();
    // then
    expect(componentWrapper.instance().state.openModal).toBeTruthy();
  });
  it('should change value of openModal if closeModal is being invoked', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow parsed={parsed} />);
    const attributesBeingSelectedSpy = jest.spyOn(componentWrapper.instance(), 'closeModal');

    // when
    componentWrapper.instance().closeModal();

    // then
    expect(componentWrapper.instance().state.openModal).toBeFalsy();
  });
});
