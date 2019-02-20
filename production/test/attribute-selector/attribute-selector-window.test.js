/* eslint-disable */
import React from 'react';
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
      reportId: 'repId',
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
    expect(componentWrapper.state('reportId'))
        .toEqual(parsed.reportId);
  });

  it('should trigger onTriggerUpdate when Import button is clicked and data is returned', async () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = mount(<AttributeSelectorWindow
      parsed={parsed} />);

    const attributeMetricFilterWrapper = componentWrapper.find('AttributeMetricFilter');
    attributeMetricFilterWrapper.instance().noAttributesSelected = jest.fn(() => false);
    attributeMetricFilterWrapper.instance().checkIfEmptyData = jest.fn(() => false);

    const spyMethod = jest.spyOn(componentWrapper.instance(), 'onTriggerUpdate');

    const wrappedImportButton = componentWrapper.find('Button #import');

    // when
    await wrappedImportButton.simulate('click');

    // then
    expect(spyMethod).toBeCalled();
  });

  it('should NOT trigger onTriggerUpdate when Import button was clicked and no items are selected', async () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = mount(<AttributeSelectorWindow
      parsed={parsed} />);

    const attributeMetricFilterWrapper = componentWrapper.find('AttributeMetricFilter');
    attributeMetricFilterWrapper.instance().noDataSelected = jest.fn(() => true);

    const spyMethod = jest.spyOn(componentWrapper.instance(), 'onTriggerUpdate');

    const wrappedImportButton = componentWrapper.find('Button #import');

    // when
    await wrappedImportButton.simulate('click');

    // then
    expect(spyMethod).not.toBeCalled();
    expect(componentWrapper.instance().state.triggerUpdate).toEqual(false);
  });

  it('should NOT trigger onTriggerUpdate when Import button was clicked and all data is filtered out', async () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = mount(<AttributeSelectorWindow
      parsed={parsed} />);

    const attributeMetricFilterWrapper = componentWrapper.find('AttributeMetricFilter');
    attributeMetricFilterWrapper.instance().checkIfEmptyData = jest.fn(() => false);

    const spyMethod = jest.spyOn(componentWrapper.instance(), 'onTriggerUpdate');

    const wrappedImportButton = componentWrapper.find('Button #import');

    // when
    await wrappedImportButton.simulate('click');

    // then
    expect(spyMethod).not.toBeCalled();
    expect(componentWrapper.instance().state.triggerUpdate).toEqual(false);
  });

  it('should trigger office message with proper params' +
    ' when Import button is clicked and data is returned', async () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
      reportSubtype: 'subtype',
    };

    const componentWrapper = mount(<AttributeSelectorWindow
      parsed={parsed} />);

    const attributeMetricFilterWrapper = componentWrapper.find('AttributeMetricFilter');
    attributeMetricFilterWrapper.instance().noAttributesSelected = jest.fn(() => false);
    attributeMetricFilterWrapper.instance().checkIfEmptyData = jest.fn(() => false);

    const spyMethod = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');

    const wrappedImportButton = componentWrapper.find('Button #import');

    // when
    await wrappedImportButton.simulate('click');

    // then
    expect(spyMethod).toBeCalled();
    expect(spyMethod).toBeCalledWith(selectorProperties.commandOnUpdate,
        parsed.reportId,
        parsed.projectId,
        parsed.reportSubtype,
        {'requestedObjects': {}});
  });

  it('should trigger handleCancel when Cancel was clicked', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = mount(<AttributeSelectorWindow
      parsed={parsed} />);

    componentWrapper.instance().handleCancel = jest.fn();
    const spyMethod = jest.spyOn(componentWrapper.instance(), 'handleCancel');
    componentWrapper.instance().forceUpdate();

    const wrappedCancelButton = componentWrapper.find('Button #cancel');

    // when
    wrappedCancelButton.simulate('click');

    // then
    expect(spyMethod).toBeCalled();
  });

  it('should trigger attribute-selector-helpers: officeMessageParent when Cancel is clicked', () => {
    // given
    const parsed = {
      envUrl: 'url',
      token: 'token',
      projectId: 'proId',
      reportId: 'repId',
    };

    const componentWrapper = mount(<AttributeSelectorWindow
      parsed={parsed} />);

    const officeMessageParentSpy = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');
    officeMessageParentSpy.mockClear();

    // when
    componentWrapper.instance().handleCancel();

    // then
    expect(officeMessageParentSpy).toHaveBeenCalledTimes(1);
  });
});
