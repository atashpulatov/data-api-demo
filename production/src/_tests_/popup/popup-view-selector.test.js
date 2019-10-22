import React from 'react';
import { shallow } from 'enzyme';
import { Office } from '../mockOffice';
import { selectorProperties } from '../../attribute-selector/selector-properties';
import { _PopupViewSelector, mapStateToProps } from '../../popup/popup-view-selector';
import { PromptsWindow } from '../../prompts/prompts-window';
import { PopupTypeEnum } from '../../home/popup-type-enum';
import { NavigationTree } from '../../navigation/navigation-tree';
import { AttributeSelectorWindow } from '../../attribute-selector/attribute-selector-window';
import { DossierWindow } from '../../dossier/dossier-window';

describe('PopupViewSelector', () => {
  it('should render navigation tree when requested', () => {
    // given
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.navigationTree,
      connectToDB: jest.fn(),
      propsToPass: {},
      authToken: 'token',
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<_PopupViewSelector
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    expect(componentWrapper.find(NavigationTree).get(0)).toBeDefined();
  });

  it('should render navigation tree when requested', () => {
    // given
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.dossierWindow,
      propsToPass: {},
      authToken: 'token',
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<_PopupViewSelector
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    expect(componentWrapper.find(DossierWindow).get(0)).toBeDefined();
  });

  it('should render AttributeSelectorWindow when requested', () => {
    // given
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.dataPreparation,
      propsToPass: {},
      authToken: 'token',
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<_PopupViewSelector
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    expect(componentWrapper.find(AttributeSelectorWindow).get(0)).toBeDefined();
  });

  it('should render AttributeSelectorWindow with edit mode when requested', () => {
    // given
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.editFilters,
      propsToPass: {
        passedProps: 'passedProps',
      },
      editedReport: {
        reportContent: 'reportToEdit',
      },
      authToken: 'token',
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<_PopupViewSelector
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
        ...props.editedReport,
        token: props.authToken,
      });
  });

  it('should handle request import when not prompted', () => {
    // given
    const location = {
      search: {},
    };
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
    shallow(<_PopupViewSelector
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
    const location = {
      search: {},
    };
    const propsToPass = {
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      authToken: 'token',
      startImport: jest.fn(),
      startLoading: jest.fn(),
      importRequested: true,
      isPrompted: true,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<_PopupViewSelector
      location={location}
      {...propsToPass}
      propsToPass={propsToPass}
      methods={{}}
    />);
    // then
    expect(selectorWrapped.find(PromptsWindow).get(0)).toBeTruthy();
  });

  it('should navigate to prompts window when data preparation for prompted called', () => {
    // given
    const location = {
      search: {},
    };
    const propsToPass = {
      chosenObjectId: 'objectId',
      chosenProjectId: 'projectId',
      authToken: 'token',
      startImport: jest.fn(),
      startLoading: jest.fn(),
      isPrompted: true,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<_PopupViewSelector
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
    const location = {
      search: {},
    };
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
    shallow(<_PopupViewSelector
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
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.dataPreparation,
      authToken: 'token',
      propsToPass: {
        envUrl: 'envUrl',
        reportId: 'objectId',
        projectId: 'projectId',
        reportName: 'reportName',
        reportType: 'reportType',
        reportSubtype: 'reportSubtype',
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
    const selectorWrapped = shallow(<_PopupViewSelector
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    const attributeSelectorWrapped = selectorWrapped.find(AttributeSelectorWindow);
    expect(attributeSelectorWrapped.get(0)).toBeDefined();
    const mstrDataProp = attributeSelectorWrapped.at(0).prop('mstrData');
    expect(mstrDataProp.reportName).toBeDefined();
    expect(mstrDataProp.reportType).toBeDefined();
    expect(mstrDataProp.projectId).toBeDefined();
    expect(mstrDataProp.instanceId).toBeDefined();

    expect(mstrDataProp)
      .toEqual({
        ...props.propsToPass,
        ...props.editedReport,
        token: props.authToken,
      });
  });

  it('should proceed to import when prompts answered and no attributes, metrics and filters', () => {
    // given
    const instanceId = 'instanceId';
    const location = {
      search: {},
    };
    const reduxMethods = {
      startImport: jest.fn(),
      startLoading: jest.fn(),
    };
    const props = {
      popupType: PopupTypeEnum.repromptingWindow,
      authToken: 'token',
      propsToPass: {
        prop: 'prop',
      },
      preparedInstance: instanceId,
      isPrompted: true,
      editedReport: {
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
    const mockMessageParent = jest.spyOn(Office.context.ui, 'messageParent');
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    shallow(<_PopupViewSelector
      location={location}
      {...reduxMethods}
      {...props}
      authToken={{}}
      propsToPass={{}}
      methods={{}}
    />);
    // then
    expect(reduxMethods.startLoading).toHaveBeenCalled();
    expect(reduxMethods.startImport).toHaveBeenCalled();
    expect(mockMessageParent).toHaveBeenCalled();
  });

  it('should not clear attributes and metrics if going to edit filters from prompts window', () => {
    // given
    const instanceId = 'instanceId';
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.editFilters,
      authToken: 'token',
      propsToPass: {
        prop: 'prop',
      },
      preparedInstance: instanceId,
      isPrompted: true,
      editedReport: {
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
    const selectorWrapped = shallow(<_PopupViewSelector
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
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.navigationTree,
      connectToDB: jest.fn(),
      propsToPass: {},
      authToken: 'token',
    };
    // when

    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<_PopupViewSelector
      location={location}
      {...props}
      methods={{}}
    />);
    // then
    const wrappedNavTree = componentWrapper.find(NavigationTree).at(0);
    expect(wrappedNavTree.prop('mstrData').token).toEqual(props.authToken);
  });

  it('should render not conent when no token provided', () => {
    // given
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.navigationTree,
      propsToPass: {},
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const componentWrapper = shallow(<_PopupViewSelector
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
    const location = {
      search: {},
    };
    const propsToPass = {
      authToken: 'token',
      dossierOpenRequested: true,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<_PopupViewSelector
      location={location}
      {...propsToPass}
      propsToPass={propsToPass}
      methods={{}}
    />);
    // then
    expect(selectorWrapped.find(DossierWindow).get(0)).toBeTruthy();
  });

  it('should open promptsWindow if prompted dossier was selected', () => {
    // given
    const location = {
      search: {},
    };
    const propsToPass = {
      authToken: 'token',
      isPrompted: true,
      dossierOpenRequested: true,
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<_PopupViewSelector
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
    const location = {
      search: {},
    };
    const propsToPass = {
      authToken: 'token',
      isPrompted: true,
      dossierOpenRequested: true,
      promptsAnswers: ['whatever'],
      dossierData: {
        instanceId: 'whatever',
      },
    };
    // when
    // eslint-disable-next-line react/jsx-pascal-case
    const selectorWrapped = shallow(<_PopupViewSelector
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
        id: 'reportId',
        projectId: 'projectId',
        name: 'reportName',
        objectType: 'report',
        body: reportBody,
      };
      const reduxState = {
        navigationTree: {},
        sessionReducer: {
          authToken: 'token',
        },
        popupReducer: {
          editedReport: reportInRedux,
        },
      };
      // when
      const { editedReport } = mapStateToProps(reduxState);
      // then
      expect(editedReport.projectId).toEqual(reportInRedux.projectId);
      expect(editedReport.reportSubtype).toEqual(768);
      expect(editedReport.reportName).toEqual(reportInRedux.name);
      expect(editedReport.reportType).toEqual(reportInRedux.objectType);
      expect(editedReport.reportId).toEqual(reportInRedux.id);

      expect(editedReport.selectedAttributes).toEqual([attributeId]);
      expect(editedReport.selectedMetrics).toEqual([metricId]);
      expect(editedReport.selectedFilters).toEqual(filterValue);
    });

    it('should parse edited report properties without filters', () => {
      // given
      const reportInRedux = {
        id: 'reportId',
        projectId: 'projectId',
        name: 'reportName',
        objectType: 'report',
        body: {
          ...reportBody,
          viewFilter: null,
        },
      };
      const reduxState = {
        navigationTree: {},
        sessionReducer: {
          authToken: 'token',
        },
        popupReducer: {
          editedReport: reportInRedux,
        },
      };
      // when
      const { editedReport } = mapStateToProps(reduxState);
      // then
      expect(editedReport.projectId).toEqual(reportInRedux.projectId);
      expect(editedReport.reportSubtype).toEqual(768);
      expect(editedReport.reportName).toEqual(reportInRedux.name);
      expect(editedReport.reportType).toEqual(reportInRedux.objectType);
      expect(editedReport.reportId).toEqual(reportInRedux.id);

      expect(editedReport.selectedAttributes).toEqual([attributeId]);
      expect(editedReport.selectedMetrics).toEqual([metricId]);
      expect(editedReport.selectedFilters).not.toBeDefined();
    });

    it('should parse complex report properties', () => {
      // given
      const reportInRedux = {
        id: 'reportId',
        projectId: 'projectId',
        name: 'reportName',
        objectType: 'report',
        body: reportComplexBody,
      };
      const reduxState = {
        navigationTree: {},
        sessionReducer: {
          authToken: 'token',
        },
        popupReducer: {
          editedReport: reportInRedux,
        },
      };
      // when
      const { editedReport } = mapStateToProps(reduxState);
      // then
      expect(editedReport.projectId).toEqual(reportInRedux.projectId);
      expect(editedReport.reportSubtype).toEqual(768);
      expect(editedReport.reportName).toEqual(reportInRedux.name);
      expect(editedReport.reportType).toEqual(reportInRedux.objectType);
      expect(editedReport.reportId).toEqual(reportInRedux.id);

      expect(editedReport.selectedFilters).toEqual(complexFilterValue);
    });

    it('should parse edited dataset properties', () => {
      // given
      const datesetInRedux = {
        id: 'datasetId',
        projectId: 'projectId',
        name: 'reportName',
        objectType: 'dataset',
        body: reportBody,
      };
      const reduxState = {
        navigationTree: {},
        sessionReducer: {
          authToken: 'token',
        },
        popupReducer: {
          editedReport: datesetInRedux,
        },
      };
      // when
      const { editedReport } = mapStateToProps(reduxState);
      // then
      expect(editedReport.projectId).toEqual(datesetInRedux.projectId);
      expect(editedReport.reportSubtype).toEqual(779);
      expect(editedReport.reportName).toEqual(datesetInRedux.name);
      expect(editedReport.reportType).toEqual(datesetInRedux.objectType);
      expect(editedReport.reportId).toEqual(datesetInRedux.id);

      expect(editedReport.selectedAttributes).toEqual([attributeId]);
      expect(editedReport.selectedMetrics).toEqual([metricId]);
      expect(editedReport.selectedFilters).toEqual(filterValue);
    });

    it('should parse prepared instance id', () => {
      // given
      const reduxState = {
        navigationTree: {},
        sessionReducer: {
          authToken: 'token',
        },
        popupReducer: {
          preparedInstance: 'preparedInstance',
        },
      };
      // when
      const { preparedInstance } = mapStateToProps(reduxState);
      // then
      expect(preparedInstance).toEqual(reduxState.popupReducer.preparedInstance);
    });
  });
});
