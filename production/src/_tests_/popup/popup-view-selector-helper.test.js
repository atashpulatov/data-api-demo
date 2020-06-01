import { popupViewSelectorHelper } from '../../popup/popup-view-selector-helper';

describe('PopupViewSelectorHelper', () => {
  describe('composeFilter', () => {
    const filter1 = 'filter1';
    const filter1Element1 = `${filter1}:1`;
    const filter1Element7 = `${filter1}:7`;
    const filter4 = 'filter4';
    const filter4Element3 = `${filter4}:3`;
    const filter4Element9 = `${filter4}:9`;

    const givenFilter1 = {
      filter1: [filter1Element1],
    };
    const expectedResult1 = {
      operator: 'In',
      operands: [
        { type: 'attribute', id: [filter1Element1] },
        { type: 'elements', elements: [{ id: filter1Element1 }] }
      ]
    };

    const givenFilter2 = {
      filter1: [filter1Element1],
      filter4: [filter4Element3]
    };
    const expectedResult2 = {
      operator: 'And',
      operands: [
        {
          operator: 'In',
          operands: [
            { type: 'attribute', id: [filter1Element1] },
            { type: 'elements', elements: [{ id: filter1Element1 }] }
          ]
        },
        {
          operator: 'In',
          operands: [
            { type: 'attribute', id: [filter4Element3] },
            { type: 'elements', elements: [{ id: filter4Element3 }] }
          ]
        }
      ]
    };

    const givenFilter3 = {
      filter1: [filter1Element1, filter1Element7],
      filter4: [filter4Element3, filter4Element9]
    };
    const expectedResult3 = {
      operator: 'And',
      operands: [
        {
          operator: 'In',
          operands: [
            { type: 'attribute', id: [filter1Element1, filter1Element7] },
            {
              type: 'elements',
              elements: [
                { id: filter1Element1 },
                { id: filter1Element7 }
              ]
            }
          ]
        },
        {
          operator: 'In',
          operands: [
            { type: 'attribute', id: [filter4Element3, filter4Element9] },
            {
              type: 'elements',
              elements: [
                { id: filter4Element3 },
                { id: filter4Element9 }
              ]
            }
          ]
        }
      ]
    };

    it.each`
    givenFilter           | expectedResult
    ${givenFilter1}       | ${expectedResult1}
    ${givenFilter2}       | ${expectedResult2}
    ${givenFilter3}       | ${expectedResult3}
    `('should return $expectedResult when composeFilter was called with $givenFilter', ({ givenFilter, expectedResult }) => {
      // when
      const result = popupViewSelectorHelper.composeFilter(givenFilter);
      // then
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
