import React from 'react';
import {shallow, mount} from 'enzyme';
import {Office} from '../mockOffice';
import {selectorProperties} from '../../src/attribute-selector/selector-properties';
import {_PopupViewSelector, mapStateToProps} from '../../src/popup/popup-view-selector';
import {PromptsWindow} from '../../src/prompts/prompts-window';
import {PopupTypeEnum} from '../../src/home/popup-type-enum';
import {NavigationTree} from '../../src/navigation/navigation-tree';
import {AttributeSelectorWindow} from '../../src/attribute-selector/attribute-selector-window';

describe('PopupViewSelector', () => {
  it('should render navigation tree when requested', () => {
    // given
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.navigationTree,
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
      importRequested={true}
      {...reduxMethods}
      {...resultAction}
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
      methods={{}}
    />);
    // then
    expect(propsToPass.startLoading).toHaveBeenCalled();
    expect(propsToPass.startImport).toHaveBeenCalled();
    expect(mockMessageParent).toHaveBeenCalledWith(JSON.stringify(resultAction));
  });

  it('should pass authToken', () => {
    // given
    const location = {
      search: {},
    };
    const props = {
      popupType: PopupTypeEnum.navigationTree,
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
    expect(wrappedNavTree.prop('mstrData')).toEqual({token: props.authToken});
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

  describe('PopupViewConnected', () => {
    const attributeId = 'ACF673EC11E9554D08E20080EF651EBC';
    const metricId = 'ACF6AF8811E9554D08EE0080EF651EBC';
    const filterValue = {'ACF66B9A11E9554D08E20080EF651EBC': [
      'ACF66B9A11E9554D08E20080EF651EBC:Europe',
      'ACF66B9A11E9554D08E20080EF651EBC:North America',
    ]};
    // eslint-disable-next-line max-len
    const reportBody = {'requestedObjects': {'attributes': [{'id': attributeId}], 'metrics': [{'id': metricId}]}, 'viewFilter': {'operator': 'In', 'operands': [{'type': 'attribute', 'id': 'ACF66B9A11E9554D08E20080EF651EBC'}, {'type': 'elements', 'elements': [{'id': 'ACF66B9A11E9554D08E20080EF651EBC:Europe'}, {'id': 'ACF66B9A11E9554D08E20080EF651EBC:North America'}]}]}};

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
      const {editedReport} = mapStateToProps(reduxState);
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
      const {editedReport} = mapStateToProps(reduxState);
      // then
      expect(editedReport.projectId).toEqual(reportInRedux.projectId);
      expect(editedReport.reportSubtype).toEqual(768);
      expect(editedReport.reportName).toEqual(reportInRedux.name);
      expect(editedReport.reportType).toEqual(reportInRedux.objectType);
      expect(editedReport.reportId).toEqual(reportInRedux.id);

      expect(editedReport.selectedAttributes).toEqual([attributeId]);
      expect(editedReport.selectedMetrics).toEqual([metricId]);
      expect(editedReport.selectedFilters).toBe(null);
    });
  });
});
