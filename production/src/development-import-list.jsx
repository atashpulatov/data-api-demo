import React from 'react';
import { ContextMenu } from '@mstr/rc';
import { sessionHelper } from './storage/session-helper';
import mstrObjectType from './mstr-object/mstr-object-type-enum';

export const DevelopmentImportList = () => {
  const menuItems = [
    {
      itemIndex: 'SeasonalReport',
      title: objectList.SeasonalReport.name
    },
    {
      itemIndex: 'SubtotalsAllTypes',
      title: objectList.SubtotalsAllTypes.name
    },
    {
      itemIndex: 'Crosstab123',
      title: objectList.Crosstab123.name
    },
    {
      itemIndex: 'CrosstabSubtotal',
      title: objectList.CrosstabSubtotal.name
    },
  ];

  const onItemClick = (event) => {
    if (event.key === 'SeasonalReport') { sessionHelper.importObjectWithouPopup(objectList.SeasonalReport); }
    if (event.key === 'SubtotalsAllTypes') { sessionHelper.importObjectWithouPopup(objectList.SubtotalsAllTypes); }
    if (event.key === 'Crosstab123') { sessionHelper.importObjectWithouPopup(objectList.Crosstab123); }
    if (event.key === 'CrosstabSubtotal') { sessionHelper.importObjectWithouPopup(objectList.CrosstabSubtotal); }
  };

  return (
    <div className="refresh-button-container">
      <ContextMenu items={menuItems} onItemClick={onItemClick}>
        <button type="button" onClick={() => sessionHelper.importObjectWithouPopup(objectList.SeasonalReport)}>Quick Import</button>
      </ContextMenu>
    </div>
  );
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
