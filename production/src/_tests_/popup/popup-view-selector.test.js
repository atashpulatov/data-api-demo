import React from 'react';
import { shallow } from 'enzyme';
import { Office } from '../mockOffice';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { PopupViewSelectorHOC, mapStateToProps } from '../../popup/popup-view-selector';
import { PromptsWindow } from '../../prompts/prompts-window';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { NavigationTree } from '../../navigation/navigation-tree';
import { AttributeSelectorWindow } from '../../attribute-selector/attribute-selector-window';
import { DossierWindow } from '../../dossier/dossier-window';
import { mstrObjectRestService } from '../../mstr-object/mstr-object-rest-service';

jest.mock('../../mstr-object/mstr-object-rest-service');
jest.mock('../../office/office-context');

const { createInstance, answerPrompts } = mstrObjectRestService;

describe('PopupViewSelector', () => {
  it('should render navigation tree when requested', () => {
    // given
    const location = { search: {}, };
    const props = {
      popupType: PopupTypeEnum.navigationTree,
      connectToDB: jest.fn(),
      propsToPass: {},
      authToken: 'authToken',
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<PopupViewSelectorHOC
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    expect(componentWrapper.find(NavigationTree).get(0)).toBeDefined();
  });

  it('should render navigation tree when requested', () => {
    // given
    const location = { search: {}, };
    const props = {
      popupType: PopupTypeEnum.dossierWindow,
      propsToPass: {},
      authToken: 'authToken',
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<PopupViewSelectorHOC
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    expect(componentWrapper.find(DossierWindow).get(0)).toBeDefined();
  });

  it('should render AttributeSelectorWindow when requested', () => {
    // given
    const location = { search: {}, };
    const props = {
      popupType: PopupTypeEnum.dataPreparation,
      propsToPass: {},
      authToken: 'authToken',
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<PopupViewSelectorHOC
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    expect(componentWrapper.find(AttributeSelectorWindow).get(0)).toBeDefined();
  });

  it('should render AttributeSelectorWindow with edit mode when requested', () => {
    // given
    const location = { search: {}, };
    const props = {
      popupType: PopupTypeEnum.editFilters,
      propsToPass: { passedProps: 'passedProps', },
      editedObject: { reportContent: 'reportToEdit', },
      authToken: 'authToken',
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<PopupViewSelectorHOC
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    const attributeSelectorWrapped = componentWrapper.find(AttributeSelectorWindow);
    expect(attributeSelectorWrapped.get(0)).toBeDefined();
    expect(attributeSelectorWrapped.at(0).prop('mstrData'))
      .toEqual({
        ...props.propsToPass,
        ...props.editedObject,
        authToken: props.authToken,
      });
  });

  it('should handle request import when not prompted', () => {
    // given
    const location = { search: {}, };
    const resultAction = {
      command: selectorProperties.commandOk,
      chosenObject: 'objectId',
      chosenProject: 'projectId',
      chosenSubtype: 'subtype',
    };
    const reduxMethods = {
      startImport: jest.fn(),
      startLoading: jest.fn(),
    };
    const mockMessageParent = jest.spyOn(Office.context.ui, 'messageParent');
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    shallow(<PopupViewSelectorHOC
      location={location}
      importRequested
      {...reduxMethods}
      {...resultAction}
      authToken={{}}
      propsToPass={{}}
      methods={{}}
      chosenObjectId={resultAction.chosenObject}
      chosenProjectId={resultAction.chosenProject}
    />);
    // then
    expect(reduxMethods.startLoading).toHaveBeenCalled();
    expect(reduxMethods.startImport).toHaveBeenCalled();
    expect(mockMessageParent).toHaveBeenCalledWith(JSON.stringify(resultAction));
  });

  it('should navigate to prompts window request import when prompted', () => {
    // given
    const location = { search: {}, };
    const propsToPass = {
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      authToken: 'authToken',
      startImport: jest.fn(),
      startLoading: jest.fn(),
      importRequested: true,
      isPrompted: true,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<PopupViewSelectorHOC
      location={location}
      {...propsToPass}
      propsToPass={propsToPass}
      methods={{}}
    />);
    // then
    expect(selectorWrapped.find(PromptsWindow).get(0)).toBeTruthy();
  });

  it('should invoke implementations inside proceedToImport', () => {
    // given

    const props = {
      importRequested: true,
      isPrompted: false,
      chosenChapterKey: 'chosenChapterKey',
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      chosenSubtype: 'chosenSubtype',
      popupType: PopupTypeEnum.dataPreparation,
      authToken: 'authToken',
      dossierData: {
        instanceId: 'instanceId',
        isReprompt: true,
      },
      editedObject: {
        selectedAttributes: ['1', '2'],
        selectedMetrics: ['1', '2'],
        selectedFilters: {},
      },
      propsToPass: {
        envUrl: 'envUrl',
        chosenObjectId: 'objectId',
        projectId: 'projectId',
        chosenObjectName: 'chosenObjectName',
        chosenObjectType: 'chosenObjectType',
        chosenObjectSubtype: 'chosenObjectSubtype',
      },
      startImport: jest.fn(),
      startLoading: jest.fn(),
    };
    const visualizationInfo = {
      chapterKey: props.chosenChapterKey,
      visualizationKey: props.visualizationKey,
    };
    const okObject = {
      command: selectorProperties.commandOk,
      chosenObject: props.chosenObjectId,
      chosenProject: props.chosenProjectId,
      chosenSubtype: props.chosenSubtype,
      isPrompted: props.isPrompted,
      promptsAnswers: props.promptsAnswers,
      visualizationInfo,
      preparedInstanceId: props.preparedInstanceId,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    shallow(<PopupViewSelectorHOC
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    expect(props.startLoading).toHaveBeenCalled();
    expect(props.startImport).toHaveBeenCalled();
  });

  it('should navigate to prompts window when data preparation for prompted called', () => {
    // given
    const location = { search: {}, };
    const propsToPass = {
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      authToken: 'authToken',
      startImport: jest.fn(),
      startLoading: jest.fn(),
      isPrompted: true,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<PopupViewSelectorHOC
      location={location}
      {...propsToPass}
      propsToPass={propsToPass}
      methods={{}}
      popupType={PopupTypeEnum.dataPreparation}
    />);
    // then
    expect(selectorWrapped.find(PromptsWindow).get(0)).toBeTruthy();
  });

  it('should handle request import when prompted and got dossierData', () => {
    // given
    const location = { search: {}, };
    const propsToPass = {
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      chosenSubtype: 'subtype',
      startImport: jest.fn(),
      startLoading: jest.fn(),
      importRequested: true,
      isPrompted: true,
      dossierData: {
        instanceId: 'instanceId',
        whatever: 'whatever',
      },
    };
    const resultAction = {
      command: selectorProperties.commandOk,
      chosenObject: propsToPass.chosenObjectId,
      chosenProject: propsToPass.chosenProjectId,
      chosenSubtype: propsToPass.chosenSubtype,
      isPrompted: propsToPass.isPrompted,
      dossierData: propsToPass.dossierData,
    };
    const mockMessageParent = jest.spyOn(Office.context.ui, 'messageParent');
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    shallow(<PopupViewSelectorHOC
      location={location}
      {...propsToPass}
      authToken={{}}
      propsToPass={{}}
      methods={{}}
    />);
    // then
    expect(propsToPass.startLoading).toHaveBeenCalled();
    expect(propsToPass.startImport).toHaveBeenCalled();
    expect(mockMessageParent).toHaveBeenCalledWith(JSON.stringify(resultAction));
  });

  it.skip('should handle prepare data when prompted and got dossierData', () => {
    // given
    const location = { search: {}, };
    const props = {
      popupType: PopupTypeEnum.dataPreparation,
      authToken: 'authToken',
      propsToPass: {
        envUrl: 'envUrl',
        chosenObjectId: 'objectId',
        projectId: 'projectId',
        chosenObjectName: 'chosenObjectName',
        chosenObjectType: 'chosenObjectType',
        chosenObjectSubtype: 'chosenObjectSubtype',
      },
      startImport: jest.fn(),
      startLoading: jest.fn(),
      isPrompted: true,
      dossierData: {
        instanceId: 'instanceId',
        whatever: 'whatever',
      },
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<PopupViewSelectorHOC
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    const attributeSelectorWrapped = selectorWrapped.find(AttributeSelectorWindow);
    expect(attributeSelectorWrapped.get(0)).toBeDefined();
    const mstrDataProp = attributeSelectorWrapped.at(0).prop('mstrData');
    expect(mstrDataProp.chosenObjectName).toBeDefined();
    expect(mstrDataProp.chosenObjectType).toBeDefined();
    expect(mstrDataProp.projectId).toBeDefined();
    expect(mstrDataProp.instanceId).toBeDefined();

    expect(mstrDataProp)
      .toEqual({
        ...props.propsToPass,
        ...props.editedObject,
        authToken: props.authToken,
      });
  });

  it('should proceed to edit filters after reprompting', () => {
    // given
    const instanceId = 'instanceId';
    const location = { search: {}, };
    const props = {
      popupType: PopupTypeEnum.repromptingWindow,
      authToken: 'authToken',
      propsToPass: { prop: 'prop', },
      preparedInstance: instanceId,
      isPrompted: true,
      editedObject: {
        instanceId,
        // selectedAttributes: undefined,
        selectedMetrics: [],
        selectedFilters: {},
      },
      dossierData: {
        instanceId: 'instanceId',
        whatever: 'whatever',
      },
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<PopupViewSelectorHOC
      location={location}
      {...props}
      authToken={{}}
      propsToPass={{}}
      methods={{}}
    />);
    // then
    expect(selectorWrapped.find(AttributeSelectorWindow).get(0)).toBeTruthy();
  });

  it('should not clear attributes and metrics if going to edit filters from prompts window', () => {
    // given
    const instanceId = 'instanceId';
    const location = { search: {}, };
    const props = {
      popupType: PopupTypeEnum.editFilters,
      authToken: 'authToken',
      propsToPass: { prop: 'prop', },
      preparedInstance: instanceId,
      isPrompted: true,
      editedObject: {
        instanceId,
        selectedAttributes: 'notEmptyThing',
        selectedMetrics: 'notEmptyThing',
        selectedFilters: 'notEmptyThing',
      },
      dossierData: {
        instanceId: 'instanceId',
        whatever: 'whatever',
      },
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<PopupViewSelectorHOC
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    const attributeSelectorWrapped = selectorWrapped.find(AttributeSelectorWindow);
    expect(attributeSelectorWrapped.get(0)).toBeDefined();
    const mstrDataProp = attributeSelectorWrapped.at(0).prop('mstrData');
    expect(mstrDataProp.selectedAttributes).toBeDefined();
    expect(mstrDataProp.selectedMetrics).toBeDefined();
    expect(mstrDataProp.selectedFilters).toBeDefined();
  });

  it('should pass authToken', () => {
    // given
    const location = { search: {}, };
    const props = {
      popupType: PopupTypeEnum.navigationTree,
      connectToDB: jest.fn(),
      propsToPass: {},
      authToken: 'authToken',
    };
    // when

    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<PopupViewSelectorHOC
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    const wrappedNavTree = componentWrapper.find(NavigationTree).at(0);
    expect(wrappedNavTree.prop('mstrData').authToken).toEqual(props.authToken);
  });

  it('should render not conent when no authToken provided', () => {
    // given
    const location = { search: {}, };
    const props = {
      popupType: PopupTypeEnum.navigationTree,
      propsToPass: {},
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<PopupViewSelectorHOC
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    const componentInstance = componentWrapper.get(0);
    expect(componentInstance).toBe(null);
  });

  it('should open dossierWindow', () => {
    // given
    const location = { search: {}, };
    const propsToPass = {
      authToken: 'authToken',
      dossierOpenRequested: true,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<PopupViewSelectorHOC
      location={location}
      {...propsToPass}
      propsToPass={propsToPass}
      methods={{}}
    />);
    // then
    expect(selectorWrapped.find(DossierWindow).get(0)).toBeTruthy();
  });

  it('should invoke obtainInstanceWithPromptsAnswers', async () => {
    // given
    const props = {
      dossierData: { instanceId: 'instanceId' },
      dossierOpenRequested: false,
      methods: {},
      importRequested: false,
      authToken: 'authToken',
      propsToPass: {
        isPrompted: true,
        projectId: '1',
        chosenObjectId: '1',
        chosenObjectName: 'chosenObjectName',
      },
      editedReport: {},
      preparePromptedReport: jest.fn()
    };
    createInstance.mockImplementationOnce(() => ({ status: 3, instanceId: 'abc' }));

    // when
    // eslint-disable-next-line react/jsx-pascal-case
    await shallow(<PopupViewSelectorHOC
      {...props}
    />);
    // then
    expect(createInstance).toHaveBeenCalled();
    expect(props.preparePromptedReport).toHaveBeenCalled();
  });

  it('should do the necessary operations inside while of obtainInstanceWithPromptsAnswers', async () => {
    // given
    const props = {
      dossierData: { instanceId: 'instanceId' },
      dossierOpenRequested: false,
      methods: {},
      importRequested: false,
      authToken: 'authToken',
      propsToPass: {
        isPrompted: true,
        projectId: '1',
        chosenObjectId: '1',
      },
      promptsAnswers: ['test1', 'test2', 'test3'],
      preparePromptedReport: jest.fn()
    };
    const returnedValue = { status: 2, instanceId: 'abc' };
    createInstance.mockImplementationOnce(() => (returnedValue));
    const configPromptsMocked = {
      objectId: props.propsToPass.chosenObjectId,
      projectId: props.propsToPass.projectId,
      instanceId: returnedValue.instanceId,
      promptsAnswers: props.promptsAnswers[0]
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    await shallow(<PopupViewSelectorHOC
      {...props}
    />);
    // then
    expect(answerPrompts).toBeCalledWith(configPromptsMocked);
  });

  it('should invoke implementations inside createBody when in obtainInstanceWithPromptsAnswers', () => {
    // given
    const instanceId = 'instanceId';
    const props = {
      editedObject: {
        instanceId,
        selectedAttributes: ['1', '2'],
        selectedMetrics: ['1', '2'],
        selectedFilters: 'notEmptyThing',
      },
      dossierData: { instanceId: 'instanceId' },
      dossierOpenRequested: false,
      methods: {},
      importRequested: false,
      authToken: 'authToken',
      promptsAnswers: ['test1', 'test2', 'test3'],
      preparePromptedReport: jest.fn(),
      propsToPass: {
        isPrompted: true,
        projectId: '1',
        chosenObjectId: '1',
      },
    };

    const returnedValue = { status: 3, instanceId: 'abc' };
    createInstance.mockReturnValueOnce((returnedValue));


    const body = {
      template: {
        attributes: ['1', '2'],
        metrics: ['1', '2'],
      },
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    shallow(<PopupViewSelectorHOC
      {...props}
    />);
    // then
    expect(body.template.attributes[0]).toEqual(props.editedObject.selectedAttributes[0]);
    expect(body.template.metrics[0]).toEqual(props.editedObject.selectedMetrics[0]);
  });


  it('should open promptsWindow if prompted dossier was selected', () => {
    // given
    const location = { search: {}, };
    const propsToPass = {
      authToken: 'authToken',
      isPrompted: true,
      dossierOpenRequested: true,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<PopupViewSelectorHOC
      location={location}
      {...propsToPass}
      propsToPass={propsToPass}
      methods={{}}
    />);
    // then
    expect(selectorWrapped.find(PromptsWindow).get(0)).toBeTruthy();
  });

  it('should open dossierWindow when prompts answers for dossier were provided', () => {
    // given
    const location = { search: {}, };
    const propsToPass = {
      authToken: 'authToken',
      isPrompted: true,
      dossierOpenRequested: true,
      promptsAnswers: ['whatever'],
      dossierData: { instanceId: 'whatever', },
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<PopupViewSelectorHOC
      location={location}
      {...propsToPass}
      propsToPass={propsToPass}
      methods={{}}
    />);
    // then
    expect(selectorWrapped.find(DossierWindow).get(0)).toBeTruthy();
  });

  describe('PopupViewConnected', () => {
    const attributeId = 'ACF673EC11E9554D08E20080EF651EBC';
    const metricId = 'ACF6AF8811E9554D08EE0080EF651EBC';
    const filterValue = {
      ACF66B9A11E9554D08E20080EF651EBC: [
        'ACF66B9A11E9554D08E20080EF651EBC:Europe',
        'ACF66B9A11E9554D08E20080EF651EBC:North America',
      ],
    };
    // eslint-disable-next-line max-len
    const complexFilterValue = { '8D679D3F11D3E4981000E787EC6DE8A4': ['8D679D3F11D3E4981000E787EC6DE8A4:1', '8D679D3F11D3E4981000E787EC6DE8A4:2', '8D679D3F11D3E4981000E787EC6DE8A4:3', '8D679D3F11D3E4981000E787EC6DE8A4:4', '8D679D3F11D3E4981000E787EC6DE8A4:5', '8D679D3F11D3E4981000E787EC6DE8A4:7', '8D679D3F11D3E4981000E787EC6DE8A4:8', '8D679D3F11D3E4981000E787EC6DE8A4:9', '8D679D3F11D3E4981000E787EC6DE8A4:10', '8D679D3F11D3E4981000E787EC6DE8A4:11', '8D679D3F11D3E4981000E787EC6DE8A4:12', '8D679D3F11D3E4981000E787EC6DE8A4:13', '8D679D3F11D3E4981000E787EC6DE8A4:14', '8D679D3F11D3E4981000E787EC6DE8A4:15', '8D679D3F11D3E4981000E787EC6DE8A4:16', '8D679D3F11D3E4981000E787EC6DE8A4:17', '8D679D3F11D3E4981000E787EC6DE8A4:18', '8D679D3F11D3E4981000E787EC6DE8A4:19', '8D679D3F11D3E4981000E787EC6DE8A4:20', '8D679D3F11D3E4981000E787EC6DE8A4:21', '8D679D3F11D3E4981000E787EC6DE8A4:24', '8D679D3F11D3E4981000E787EC6DE8A4:25', '8D679D3F11D3E4981000E787EC6DE8A4:27', '8D679D3F11D3E4981000E787EC6DE8A4:28', '8D679D3F11D3E4981000E787EC6DE8A4:30', '8D679D3F11D3E4981000E787EC6DE8A4:31', '8D679D3F11D3E4981000E787EC6DE8A4:32', '8D679D3F11D3E4981000E787EC6DE8A4:33', '8D679D3F11D3E4981000E787EC6DE8A4:34', '8D679D3F11D3E4981000E787EC6DE8A4:35', '8D679D3F11D3E4981000E787EC6DE8A4:36', '8D679D3F11D3E4981000E787EC6DE8A4:37', '8D679D3F11D3E4981000E787EC6DE8A4:38', '8D679D3F11D3E4981000E787EC6DE8A4:39'], '8D679D4B11D3E4981000E787EC6DE8A4': ['8D679D4B11D3E4981000E787EC6DE8A4:4', '8D679D4B11D3E4981000E787EC6DE8A4:2', '8D679D4B11D3E4981000E787EC6DE8A4:1', '8D679D4B11D3E4981000E787EC6DE8A4:6', '8D679D4B11D3E4981000E787EC6DE8A4:5', '8D679D4B11D3E4981000E787EC6DE8A4:3', '8D679D4B11D3E4981000E787EC6DE8A4:7', '8D679D4B11D3E4981000E787EC6DE8A4:12'] };

    // eslint-disable-next-line max-len
    const reportBody = { requestedObjects: { attributes: [{ id: attributeId }], metrics: [{ id: metricId }] }, viewFilter: { operator: 'In', operands: [{ type: 'attribute', id: 'ACF66B9A11E9554D08E20080EF651EBC' }, { type: 'elements', elements: [{ id: 'ACF66B9A11E9554D08E20080EF651EBC:Europe' }, { id: 'ACF66B9A11E9554D08E20080EF651EBC:North America' }] }] } };
    // eslint-disable-next-line max-len
    const reportComplexBody = { requestedObjects: { attributes: [{ id: '8D679D3F11D3E4981000E787EC6DE8A4' }], metrics: [{ id: '4C05177011D3E877C000B3B2D86C964F' }] }, viewFilter: { operator: 'And', operands: [{ operator: 'In', operands: [{ type: 'attribute', id: '8D679D4B11D3E4981000E787EC6DE8A4' }, { type: 'elements', elements: [{ id: '8D679D4B11D3E4981000E787EC6DE8A4:4' }, { id: '8D679D4B11D3E4981000E787EC6DE8A4:2' }, { id: '8D679D4B11D3E4981000E787EC6DE8A4:1' }, { id: '8D679D4B11D3E4981000E787EC6DE8A4:6' }, { id: '8D679D4B11D3E4981000E787EC6DE8A4:5' }, { id: '8D679D4B11D3E4981000E787EC6DE8A4:3' }, { id: '8D679D4B11D3E4981000E787EC6DE8A4:7' }, { id: '8D679D4B11D3E4981000E787EC6DE8A4:12' }] }] }, { operator: 'In', operands: [{ type: 'attribute', id: '8D679D3F11D3E4981000E787EC6DE8A4' }, { type: 'elements', elements: [{ id: '8D679D3F11D3E4981000E787EC6DE8A4:1' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:2' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:3' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:4' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:5' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:7' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:8' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:9' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:10' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:11' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:12' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:13' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:14' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:15' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:16' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:17' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:18' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:19' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:20' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:21' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:24' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:25' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:27' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:28' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:30' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:31' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:32' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:33' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:34' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:35' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:36' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:37' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:38' }, { id: '8D679D3F11D3E4981000E787EC6DE8A4:39' }] }] }] } };

    it('should parse edited report properties', () => {
      // given
      const reportInRedux = {
        id: 'chosenObjectId',
        projectId: 'projectId',
        name: 'chosenObjectName',
        objectType: 'report',
        body: reportBody,
      };
      const reduxState = {
        navigationTree: {},
        sessionReducer: { authToken: 'authToken', },
        popupReducer: { editedObject: reportInRedux, },
      };
      // when
      const { editedObject } = mapStateToProps(reduxState);
      // then
      expect(editedObject.projectId).toEqual(reportInRedux.projectId);
      expect(editedObject.chosenObjectSubtype).toEqual(768);
      expect(editedObject.chosenObjectName).toEqual(reportInRedux.name);
      expect(editedObject.chosenObjectType).toEqual(reportInRedux.objectType);
      expect(editedObject.chosenObjectId).toEqual(reportInRedux.id);

      expect(editedObject.selectedAttributes).toEqual([attributeId]);
      expect(editedObject.selectedMetrics).toEqual([metricId]);
      expect(editedObject.selectedFilters).toEqual(filterValue);
    });

    it('should parse edited report properties without filters', () => {
      // given
      const reportInRedux = {
        id: 'chosenObjectId',
        projectId: 'projectId',
        name: 'chosenObjectName',
        objectType: 'report',
        body: {
          ...reportBody,
          viewFilter: null,
        },
      };
      const reduxState = {
        navigationTree: {},
        sessionReducer: { authToken: 'authToken', },
        popupReducer: { editedObject: reportInRedux, },
      };
      // when
      const { editedObject } = mapStateToProps(reduxState);
      // then
      expect(editedObject.projectId).toEqual(reportInRedux.projectId);
      expect(editedObject.chosenObjectSubtype).toEqual(768);
      expect(editedObject.chosenObjectName).toEqual(reportInRedux.name);
      expect(editedObject.chosenObjectType).toEqual(reportInRedux.objectType);
      expect(editedObject.chosenObjectId).toEqual(reportInRedux.id);

      expect(editedObject.selectedAttributes).toEqual([attributeId]);
      expect(editedObject.selectedMetrics).toEqual([metricId]);
      expect(editedObject.selectedFilters).not.toBeDefined();
    });

    it('should parse complex report properties', () => {
      // given
      const reportInRedux = {
        id: 'chosenObjectId',
        projectId: 'projectId',
        name: 'chosenObjectName',
        objectType: 'report',
        body: reportComplexBody,
      };
      const reduxState = {
        navigationTree: {},
        sessionReducer: { authToken: 'authToken', },
        popupReducer: { editedObject: reportInRedux, },
      };
      // when
      const { editedObject } = mapStateToProps(reduxState);
      // then
      expect(editedObject.projectId).toEqual(reportInRedux.projectId);
      expect(editedObject.chosenObjectSubtype).toEqual(768);
      expect(editedObject.chosenObjectName).toEqual(reportInRedux.name);
      expect(editedObject.chosenObjectType).toEqual(reportInRedux.objectType);
      expect(editedObject.chosenObjectId).toEqual(reportInRedux.id);

      expect(editedObject.selectedFilters).toEqual(complexFilterValue);
    });

    it('should parse edited dataset properties', () => {
      // given
      const datesetInRedux = {
        id: 'datasetId',
        projectId: 'projectId',
        name: 'chosenObjectName',
        objectType: 'dataset',
        body: reportBody,
      };
      const reduxState = {
        navigationTree: {},
        sessionReducer: { authToken: 'authToken', },
        popupReducer: { editedObject: datesetInRedux, },
      };
      // when
      const { editedObject } = mapStateToProps(reduxState);
      // then
      expect(editedObject.projectId).toEqual(datesetInRedux.projectId);
      expect(editedObject.chosenObjectSubtype).toEqual(779);
      expect(editedObject.chosenObjectName).toEqual(datesetInRedux.name);
      expect(editedObject.chosenObjectType).toEqual(datesetInRedux.objectType);
      expect(editedObject.chosenObjectId).toEqual(datesetInRedux.id);

      expect(editedObject.selectedAttributes).toEqual([attributeId]);
      expect(editedObject.selectedMetrics).toEqual([metricId]);
      expect(editedObject.selectedFilters).toEqual(filterValue);
    });

    it('should parse prepared instance id', () => {
      // given
      const reduxState = {
        navigationTree: {},
        sessionReducer: { authToken: 'authToken', },
        popupReducer: { preparedInstance: 'preparedInstance', },
      };
      // when
      const { preparedInstance } = mapStateToProps(reduxState);
      // then
      expect(preparedInstance).toEqual(reduxState.popupReducer.preparedInstance);
    });
  });
});
