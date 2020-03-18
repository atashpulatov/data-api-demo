import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Menu } from 'antd';
import { sessionHelper } from './storage/session-helper';
import { officeStoreService } from './office/store/office-store-service';

export class DevelopmentImportList extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedObject: 'SeasonalReport' };
  }

  setObject= (objectName) => {
    this.setState({ selectedObject: objectName });
  }

  render() {
    const { removeAllAction, reportArray } = this.props;
    const menu = (
      <Menu>
        <Menu.Item key="SeasonalReport" onClick={(e) => { e.domEvent.stopPropagation(); this.setObject('SeasonalReport'); }}>SeasonalReport</Menu.Item>
        <Menu.Item key="SubtotalsAllTypes" onClick={(e) => { e.domEvent.stopPropagation(); this.setObject('SubtotalsAllTypes'); }}>SubtotalsAllTypes</Menu.Item>
        <Menu.Item key="Crosstab123" onClick={(e) => { e.domEvent.stopPropagation(); this.setObject('Crosstab123'); }}>Crosstab123</Menu.Item>
        <Menu.Item key="ErrorAnalysis" onClick={(e) => { e.domEvent.stopPropagation(); this.setObject('ErrorAnalysis'); }}>ErrorAnalysis Viz</Menu.Item>
      </Menu>
    );
    const { selectedObject } = this.state;
    return (
      <div className="refresh-button-container">
        <Dropdown overlay={menu} trigger={['contextMenu']}>
          <Button
            title={selectedObject}
            className="add-data-btn floating-button"
            onClick={() => sessionHelper.importObjectWithouPopup(objectList[selectedObject])}>
          Quick Import
          </Button>
        </Dropdown>
        {reportArray
          ? (
            <Button
              style={{ width: '50px' }}
              className="add-data-btn floating-button"
              onClick={() => removeAllAction(reportArray)}>
          Kill All
            </Button>
          )
          : (
            <Button
              className="add-data-btn floating-button"
              onClick={() => officeStoreService.clearObjectReducerFromSettings()}
            >
            Clear Reducer
            </Button>
          )}
      </div>
    );
  }
}

DevelopmentImportList.propTypes = {
  reportArray: PropTypes.arrayOf(PropTypes.shape({})),
  removeAllAction: PropTypes.func,
};


const objectList = {
  SeasonalReport: {
    bindingId: null,
    dossierData: undefined,
    isPrompted: 0,
    mstrObjectType: {
      name: 'report',
      request: 'reports',
      subtypes: [768, 769, 774],
      type: 3,
    },
    objectId: 'F3DA2FE611E75A9600000080EFC5B53B',
    objectWorkingId: 1584090384002,
    preparedInstanceId: null,
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    promptsAnswers: null,
    visualizationInfo: undefined,
  },
  SubtotalsAllTypes: {
    bindingId: null,
    dossierData: undefined,
    isPrompted: 0,
    mstrObjectType: {
      name: 'report',
      request: 'reports',
      subtypes: [768, 769, 774],
      type: 3,
    },
    objectId: '075E66184A788958195710920F81B7D9',
    objectWorkingId: 1584543648066,
    preparedInstanceId: null,
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    promptsAnswers: null,
    visualizationInfo: undefined,
  },
  Crosstab123: {
    bindingId: null,
    dossierData: undefined,
    isPrompted: 0,
    mstrObjectType: {
      name: 'report',
      request: 'reports',
      subtypes: [768, 769, 774],
      type: 3,
    },
    objectId: 'A6E8885611E99CC31A6E0080EFF50C15',
    objectWorkingId: 1584545086057,
    preparedInstanceId: null,
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    promptsAnswers: null,
    visualizationInfo: undefined,
  }
};
