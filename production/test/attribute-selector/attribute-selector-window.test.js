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
    const mstrData = {};
    // when
    const componentWrapper = shallow(<AttributeSelectorWindow
      mstrData={mstrData} />);
    // then
    const selectorWrapper = componentWrapper.find(AttributeSelector);
    expect(selectorWrapper.get(0)).toBeDefined();
  });

  it('should pass mstr data', () => {
    // given
    const mstrData = {
      reportId: 'id',
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportSubtype: 'subtype',
    };
    // when
    const componentWrapper = shallow(<AttributeSelectorWindow
      mstrData={mstrData} />);
    // then
    const selectorWrapped = componentWrapper.find(AttributeSelector).at(0);
    expect(selectorWrapped.prop('mstrData')).toEqual(mstrData);
    expect(selectorWrapped.prop('session')).toEqual({
      USE_PROXY: false,
      url: mstrData.envUrl,
      authToken: mstrData.token,
      projectId: mstrData.projectId,
    });
    expect(selectorWrapped.prop('reportId')).not.toBeDefined();
    expect(selectorWrapped.prop('reportSubtype')).not.toBeDefined();
  });

  it('should call setState if handleOk is called', () => {
    // given
    const mstrData = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow mstrData={mstrData} />);
    const spyMethod = jest.spyOn(componentWrapper.instance(), 'setState');

    // when
    componentWrapper.instance().handleOk();

    // then
    expect(spyMethod).toHaveBeenCalledWith({triggerUpdate: true, loading: true});
  });

  it('should call attributeSelectorHelpers.officeMessageParent if onTriggerUpdate is called without report name', () => {
    // given
    const mstrData = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
      reportName: '55',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow mstrData={mstrData} />);
    const spyMethod = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');

    // when
    componentWrapper.instance().onTriggerUpdate(1, 2, 3, 4);

    // then
    expect(spyMethod).toHaveBeenCalledWith(selectorProperties.commandOnUpdate, 1, 2, 3, 4, mstrData.reportName);
  });

  it('should call attributeSelectorHelpers.officeMessageParent if onTriggerUpdate is called with report name', () => {
    // given
    const mstrData = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
      reportName: '55',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow mstrData={mstrData} />);
    const spyMethod = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');

    // when
    componentWrapper.instance().onTriggerUpdate(1, 2, 3, 4, 5);

    // then
    expect(spyMethod).toHaveBeenCalledWith(selectorProperties.commandOnUpdate, 1, 2, 3, 4, 5);
  });

  it('should trigger handleCancel when Cancel was clicked', () => {
    // given
    const mstrData = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = mount(
      <Provider store={reduxStore}>
        <AttributeSelectorWindow
          mstrData={mstrData} />
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
    const mstrData = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };
    const handleBack = jest.fn();

    const componentWrapper = mount(
      <Provider store={reduxStore}><AttributeSelectorWindow
        mstrData={mstrData} handleBack={handleBack} />
      </Provider>);

    const wrappedCancelButton = componentWrapper.find('Button #back');

    // when
    wrappedCancelButton.simulate('click');

    // then
    expect(handleBack).toBeCalled();
  });

  it('should trigger attribute-selector-helpers: officeMessageParent when Cancel is clicked', () => {
    // given
    const mstrData = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow
      mstrData={mstrData} />);

    const officeMessageParentSpy = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');
    officeMessageParentSpy.mockClear();

    // when
    componentWrapper.instance().handleCancel();

    // then
    expect(officeMessageParentSpy).toHaveBeenCalledTimes(1);
  });

  it('should change value of attributesSelected if attributesBeingSelected is being invoked', () => {
    // given
    const mstrData = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow mstrData={mstrData} />);

    const attributesBeingSelectedSpy = jest.spyOn(componentWrapper.instance(), 'attributesBeingSelected');
    expect(componentWrapper.instance().state.attributesSelected).toBeFalsy();

    // when
    componentWrapper.instance().attributesBeingSelected(true);

    // then
    expect(componentWrapper.instance().state.attributesSelected).toBeTruthy();
  });
  it('should change values if resetTriggerUpdate is being invoked', () => {
    // given
    const mstrData = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow mstrData={mstrData} />);

    const resetTriggerUpdateSpy = jest.spyOn(componentWrapper.instance(), 'resetTriggerUpdate');

    // when
    componentWrapper.instance().resetTriggerUpdate();
    // then
    expect(componentWrapper.instance().state.triggerUpdate).toBeFalsy();
    expect(componentWrapper.instance().state.loading).toBeFalsy();
  });
  it('should change value of openModal if openModal is being invoked', () => {
    // given
    const mstrData = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow mstrData={mstrData} />);
    const openModalSpy = jest.spyOn(componentWrapper.instance(), 'openModal');

    // when
    componentWrapper.instance().openModal();
    // then
    expect(componentWrapper.instance().state.openModal).toBeTruthy();
  });
  it('should change value of openModal if closeModal is being invoked', () => {
    // given
    const mstrData = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = shallow(<AttributeSelectorWindow mstrData={mstrData} />);
    const attributesBeingSelectedSpy = jest.spyOn(componentWrapper.instance(), 'closeModal');

    // when
    componentWrapper.instance().closeModal();

    // then
    expect(componentWrapper.instance().state.openModal).toBeFalsy();
  });
});
