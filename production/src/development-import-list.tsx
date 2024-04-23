import React from 'react';
import { ButtonWithOptions, DropdownOption } from '@mstr/rc';

import { sessionHelper } from './storage/session-helper';

import { ObjectData } from './types/object-types';

import mstrObjectType from './mstr-object/mstr-object-type-enum';

const objectList: { [key: string]: Partial<ObjectData> } = {
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
        operands: [
          {
            operands: [
              { type: 'attribute', id: '8D679D4411D3E4981000E787EC6DE8A4' },
              {
                type: 'elements',
                elements: [
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:202002' },
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:202004' },
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:202006' },
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:202008' },
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:202010' },
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:202012' },
                  { id: '8D679D4411D3E4981000E787EC6DE8A4:202102' },
                ],
              },
            ],
            operator: 'In',
          },
        ],
        operator: 'And',
      },
    },
  },
  CrosstabSubtotal: {
    name: 'Report with crosstab & subtotal',
    mstrObjectType: mstrObjectType.mstrObjectType.report,
    objectId: '86DADEE211E99CC328DA0080EF750B14',
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
    body: {
      viewFilter: {
        operator: 'And',
        operands: [
          {
            operator: 'In',
            operands: [
              {
                type: 'attribute',
                id: '8D679D4411D3E4981000E787EC6DE8A4',
              },
              {
                type: 'elements',
                elements: [
                  {
                    id: '8D679D4411D3E4981000E787EC6DE8A4:202001',
                  },
                  {
                    id: '8D679D4411D3E4981000E787EC6DE8A4:202002',
                  },
                ],
              },
            ],
          },
          {
            operator: 'In',
            operands: [
              {
                type: 'attribute',
                id: '8D679D4F11D3E4981000E787EC6DE8A4',
              },
              {
                type: 'elements',
                elements: [
                  {
                    id: '8D679D4F11D3E4981000E787EC6DE8A4:12',
                  },
                  {
                    id: '8D679D4F11D3E4981000E787EC6DE8A4:13',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  },
  CrosstabSubtotal2: {
    name: 'Report with crosstab & subtotals',
    mstrObjectType: mstrObjectType.mstrObjectType.report,
    objectId: 'B570B68011EA637625CE0080EF65F1FA',
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
  },
  PageByDerivedElement: {
    name: 'View Report - Derived Element in the Page-by',
    mstrObjectType: mstrObjectType.mstrObjectType.report,
    objectId: '6E105112477A4D178B1F59BAA3314210',
    projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
  },
};

export const DevelopmentImportList = (): React.ReactElement => {
  const [selectedObject, setSelectedObject] = React.useState<string>(Object.keys(objectList)[0]);

  const options: DropdownOption<string>[] = Object.keys(objectList).map(key => ({
    key,
    value: objectList[key].name,
  }));

  const handleOptionChange = (option: string): void => {
    setSelectedObject(option);
  };

  return (
    <ButtonWithOptions
      id='quick-import-button'
      options={options}
      selectedValue={selectedObject}
      onOptionChange={handleOptionChange}
      onClick={() =>
        sessionHelper.importObjectWithouPopup(objectList[selectedObject] as unknown as ObjectData)
      }
    >
      Quick Import
    </ButtonWithOptions>
  );
};
