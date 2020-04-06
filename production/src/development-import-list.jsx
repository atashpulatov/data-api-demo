import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Menu } from 'antd';
import { sessionHelper } from './storage/session-helper';
import mstrObjectType from './mstr-object/mstr-object-type-enum';

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
        <Menu.Item key="SeasonalReport" onClick={(e) => { e.domEvent.stopPropagation(); this.setObject('SeasonalReport'); }}>{objectList.SeasonalReport.name}</Menu.Item>
        <Menu.Item key="SubtotalsAllTypes" onClick={(e) => { e.domEvent.stopPropagation(); this.setObject('SubtotalsAllTypes'); }}>{objectList.SubtotalsAllTypes.name}</Menu.Item>
        <Menu.Item key="Crosstab123" onClick={(e) => { e.domEvent.stopPropagation(); this.setObject('Crosstab123'); }}>{objectList.Crosstab123.name}</Menu.Item>
        <Menu.Item key="CrosstabSubtotal" onClick={(e) => { e.domEvent.stopPropagation(); this.setObject('CrosstabSubtotal'); }}>{objectList.CrosstabSubtotal.name}</Menu.Item>
      </Menu>
    );
    const { selectedObject } = this.state;
    return (
      <div className="refresh-button-container">
        <Dropdown overlay={menu} trigger={['contextMenu']}>
          <Button
            title={objectList[selectedObject].name}
            className="add-data-btn floating-button"
            onClick={() => sessionHelper.importObjectWithouPopup(objectList[selectedObject])}>
            Quick Import
          </Button>
        </Dropdown>
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
    name: 'Seasonal Report',
    mstrObjectType: mstrObjectType.mstrObjectType.report,
    objectId: 'F3DA2FE611E75A9600000080EFC5B53B',
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
  },
  SubtotalsAllTypes: {
    name: 'Subtotals - display all types',
    mstrObjectType: mstrObjectType.mstrObjectType.report,
    objectId: '075E66184A788958195710920F81B7D9',
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
  },
  Crosstab123: {
    name: 'Report with crosstab 123',
    mstrObjectType: mstrObjectType.mstrObjectType.report,
    objectId: 'A6E8885611E99CC31A6E0080EFF50C15',
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    body: {
      viewFilter: {
        operator: 'And', operands: [
          {
            operator: 'In', operands: [
              {
                type: 'attribute',
                id: '8D679D4411D3E4981000E787EC6DE8A4'
              },
              {
                type: 'elements',
                elements: [
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:201401' },
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:201402' },
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:201403' }]
              }
            ]
          },
          {
            operator: 'In', operands: [
              {
                type: 'attribute',
                id: '8D679D4F11D3E4981000E787EC6DE8A4'
              },
              {
                type: 'elements',
                elements: [
                  { id: '8D679D4F11D3E4981000E787EC6DE8A4:11' },
                  { id: '8D679D4F11D3E4981000E787EC6DE8A4:12' }]
              }
            ]
          },
        ]
      }
    }
  },
  CrosstabSubtotal: {
    name: 'Report with crosstab & subtotal',
    mstrObjectType: mstrObjectType.mstrObjectType.report,
    objectId: '86DADEE211E99CC328DA0080EF750B14',
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    body: {
      viewFilter: {
        operator: 'And', operands: [
          {
            operator: 'In', operands: [
              {
                type: 'attribute',
                id: '8D679D4411D3E4981000E787EC6DE8A4'
              },
              {
                type: 'elements',
                elements: [
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:201401' },
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:201402' },
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:201403' }]
              }
            ]
          },
          {
            operator: 'In', operands: [
              {
                type: 'attribute',
                id: '8D679D4F11D3E4981000E787EC6DE8A4'
              },
              {
                type: 'elements',
                elements: [
                  { id: '8D679D4F11D3E4981000E787EC6DE8A4:11' },
                  { id: '8D679D4F11D3E4981000E787EC6DE8A4:12' }]
              }
            ]
          },
        ]
      }
    }
  }
};
