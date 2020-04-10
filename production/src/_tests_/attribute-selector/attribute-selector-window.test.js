import React from 'react';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { reduxStore } from '../../store';
import { AttributeSelectorWindow, AttributeSelectorWindowNotConnected } from '../../attribute-selector/attribute-selector-window';
import { AttributeSelector } from '../../attribute-selector/attribute-selector';
import { attributeSelectorHelpers } from '../../attribute-selector/attribute-selector-helpers';
import { selectorProperties } from '../../attribute-selector/selector-properties';

jest.mock('../../attribute-selector/attribute-selector-helpers');

describe('AttributeSelectorWindow', () => {
  it('should contain attribute selector', () => {
    // given
    const mstrData = { chosenObjectType: 'report' };
    const chosenObject = { objectType: { name: 'dossier' } };
    // when
    const componentWrapper = mount(
      <Provider store={reduxStore}>
        <AttributeSelectorWindowNotConnected
          mstrData={mstrData}
          chosenObject={chosenObject}
        />
      </Provider>
    );
    // then
    const selectorWrapper = componentWrapper.find(AttributeSelector);
    expect(selectorWrapper.get(0)).toBeDefined();
  });

  it('should pass mstr data', () => {
    // given
    const mstrData = {
      chosenObjectId: 'id',
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };
    const chosenObject = {
      promptsAnswers: 'promptsAnswers',
      objectType: { name: 'dossier' }
    };
    const objectName = '55';
    // when
    const componentWrapper = shallow(<AttributeSelectorWindowNotConnected
      mstrData={mstrData}
      chosenObject={chosenObject}
      objectName={objectName}
    />);
    // then
    const selectorWrapped = componentWrapper.find(AttributeSelector).at(0);
    expect(selectorWrapped.prop('mstrData')).not.toBeDefined();
    expect(selectorWrapped.prop('session')).not.toBeDefined();
    expect(selectorWrapped.prop('title')).toEqual(`Import Dossier > 55`);
    expect(selectorWrapped.prop('chosenObjectId')).not.toBeDefined();
    expect(selectorWrapped.prop('chosenObjectSubtype')).not.toBeDefined();
  });
  it('should call setState if attributesBeingSelected is called with parameter', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'

    };

    const chosenObject = { chosenObjectName: '55' };
    // when
    const componentWrapper = shallow(
      <AttributeSelectorWindowNotConnected
        mstrData={mstrData}
        chosenObject={chosenObject}
      />
    );
    const spyMethod = jest.spyOn(componentWrapper.instance(), 'setState');
    componentWrapper.instance().attributesBeingSelected(true);

    // then
    expect(spyMethod).toHaveBeenCalledWith({ attributesSelected: true });
  });

  it('should call setState if attributesBeingSelected is called WITHOUT parameter', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };
    const chosenObject = { chosenObjectName: '55' };

    // when
    const componentWrapper = shallow(
      <AttributeSelectorWindowNotConnected
        mstrData={mstrData}
        chosenObject={chosenObject}
      />
    );
    const spyMethod = jest.spyOn(componentWrapper.instance(), 'setState');
    componentWrapper.instance().attributesBeingSelected();

    // then
    expect(spyMethod).toHaveBeenCalledWith({ attributesSelected: undefined });
  });

  it('should call setState if handleOk is called', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };
    const chosenObject = { chosenObjectName: '55' };

    // when
    const componentWrapper = shallow(
      <AttributeSelectorWindowNotConnected
        mstrData={mstrData}
        chosenObject={chosenObject}
      />
    );
    const spyMethod = jest.spyOn(componentWrapper.instance(), 'setState');
    componentWrapper.instance().handleOk();

    // then
    expect(spyMethod).toHaveBeenCalledWith({ triggerUpdate: true, loading: true });
  });

  it('should call attributeSelectorHelpers.officeMessageParent if onTriggerUpdate is called without report name', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId',
    };

    const chosenObject = {
      chosenObjectName: '55',
      promptsAnswers: 'promptsAnswers',
      preparedInstanceId: 'instanceId',
    };

    const displayAttrFormNames = 'Automatic';
    const editedObject = { subtotalsInfo: { importSubtotal: true }, displayAttrFormNames };
    const importSubtotal = true;
    // when
    const componentWrapper = shallow(
      <AttributeSelectorWindowNotConnected
        mstrData={mstrData}
        chosenObject={chosenObject}
        editedObject={editedObject}
      />
    );
    const spyMethod = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');
    componentWrapper.instance().onTriggerUpdate(1, 2, 3, 4);
    // then
    expect(spyMethod).toHaveBeenCalledWith(
      selectorProperties.commandOnUpdate,
      1,
      2,
      3,
      4,
      chosenObject.chosenObjectName,
      chosenObject.preparedInstanceId,
      chosenObject.promptsAnswers,
      { importSubtotal },
      displayAttrFormNames
    );
  });

  it('should call attributeSelectorHelpers.officeMessageParent if onTriggerUpdate is called with report name', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId',
    };

    const chosenObject = {
      chosenObjectName: '55',
      promptsAnswers: 'promptsAnswers',
      preparedInstanceId: 'instanceId',
    };
    const displayAttrFormNames = 'Automatic';
    const editedObject = { subtotalsInfo: { importSubtotal: true }, displayAttrFormNames };

    const importSubtotal = true;

    // when
    const componentWrapper = shallow(
      <AttributeSelectorWindowNotConnected
        mstrData={mstrData}
        chosenObject={chosenObject}
        editedObject={editedObject}
      />
    );
    const spyMethod = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');
    componentWrapper.instance().onTriggerUpdate(1, 2, 3, 4, 5);

    // then
    expect(spyMethod).toHaveBeenCalledWith(
      selectorProperties.commandOnUpdate,
      1,
      2,
      3,
      4,
      5,
      chosenObject.preparedInstanceId,
      chosenObject.promptsAnswers,
      { importSubtotal },
      displayAttrFormNames
    );
  });

  it('should trigger handleCancel when Cancel was clicked', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };
    const chosenObject = {
      chosenObjectName: '55',
      promptsAnswers: 'promptsAnswers',
      objectType: { name: 'dossier' }
    };
    // when
    const componentWrapper = mount(<Provider store={reduxStore}>
      <AttributeSelectorWindowNotConnected
        mstrData={mstrData}
        chosenObject={chosenObject}
      />
    </Provider>);
    const spyMethod = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');

    const wrappedCancelButton = componentWrapper.find('Button #cancel');
    wrappedCancelButton.simulate('click');

    // then
    expect(spyMethod).toBeCalled();
  });

  it('should trigger handleBack when Back was clicked', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId',
      chosenObjectId: 'repId',
      chosenObjectType: 'report',
    };
    const chosenObject = { chosenObjectName: '55' };
    const handleBack = jest.fn();
    // when
    const componentWrapper = mount(
      <Provider store={reduxStore}>
        <AttributeSelectorWindowNotConnected
          mstrData={mstrData}
          chosenObject={chosenObject}
          handleBack={handleBack}
        />
      </Provider>
    );

    const wrappedCancelButton = componentWrapper.find('Button #back');
    wrappedCancelButton.simulate('click');

    // then
    expect(handleBack).toBeCalled();
    //
    // expect(componentWrapper.props("editedObject")).toEqual(editedObject);
    // expect(wrappedCancelButton.length).toBe(1);
  });


  it('should trigger attribute-selector-helpers: officeMessageParent when Cancel is clicked', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };
    const chosenObject = { chosenObjectName: '55' };


    // when
    const componentWrapper = shallow(<AttributeSelectorWindowNotConnected
      mstrData={mstrData}
      chosenObject={chosenObject}
    />);

    const officeMessageParentSpy = jest.spyOn(attributeSelectorHelpers, 'officeMessageParent');
    officeMessageParentSpy.mockClear();
    componentWrapper.instance().handleCancel();

    // then
    expect(officeMessageParentSpy).toHaveBeenCalledTimes(1);
  });


  it('should change value of attributesSelected if attributesBeingSelected is being invoked', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };

    const chosenObject = {
      chosenObjectName: '55',
      promptsAnswers: 'promptsAnswers',
    };


    const componentWrapper = shallow(<AttributeSelectorWindowNotConnected
      mstrData={mstrData}
      chosenObject={chosenObject}
    />);
    // when
    const attributesBeingSelectedSpy = jest.spyOn(componentWrapper.instance(), 'attributesBeingSelected');
    expect(componentWrapper.instance().state.attributesSelected).toBeFalsy();
    componentWrapper.instance().attributesBeingSelected(true);

    // then
    expect(componentWrapper.instance().state.attributesSelected).toBeTruthy();
  });
  it('should change values if resetTriggerUpdate is being invoked', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };

    const chosenObject = {
      chosenObjectName: '55',
      promptsAnswers: 'promptsAnswers',
    };

    // when
    const componentWrapper = shallow(<AttributeSelectorWindowNotConnected
      mstrData={mstrData}
      chosenObject={chosenObject}
    />);
    const resetTriggerUpdateSpy = jest.spyOn(componentWrapper.instance(), 'resetTriggerUpdate');
    componentWrapper.instance().resetTriggerUpdate();
    // then
    expect(componentWrapper.instance().state.triggerUpdate).toBeFalsy();
    expect(componentWrapper.instance().state.loading).toBeFalsy();
  });
  it('should change value of openModal if openModal is being invoked', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };

    const chosenObject = {
      chosenObjectName: '55',
      promptsAnswers: 'promptsAnswers',
    };
    // when

    const componentWrapper = shallow(<AttributeSelectorWindowNotConnected
      mstrData={mstrData}
      chosenObject={chosenObject}
    />);
    const openModalSpy = jest.spyOn(componentWrapper.instance(), 'openModal');
    componentWrapper.instance().openModal();
    // then
    expect(componentWrapper.instance().state.openModal).toBeTruthy();
  });
  it('should change value of openModal if closeModal is being invoked', () => {
    // given
    const mstrData = {
      envUrl: 'envUrl',
      authToken: 'authToken',
      projectId: 'proId'
    };

    const chosenObject = {
      chosenObjectName: '55',
      promptsAnswers: 'promptsAnswers',
    };

    // when
    const componentWrapper = shallow(<AttributeSelectorWindowNotConnected
      mstrData={mstrData}
      chosenObject={chosenObject}
    />);
    const attributesBeingSelectedSpy = jest.spyOn(componentWrapper.instance(), 'closeModal');
    componentWrapper.instance().closeModal();

    // then
    expect(componentWrapper.instance().state.openModal).toBeFalsy();
  });
});
