import { popupViewSelectorHelper } from '../../popup/popup-view-selector-helper';

describe('PopupViewSelectorHelper', () => {
  describe('composeFilter', () => {
    const filter1 = 'filter1';
    const filter1Element1 = `${filter1}:1`;
    const filter1Element7 = `${filter1}:7`;
    const filter4 = 'filter4';
    const filter4Element3 = `${filter4}:3`;
    const filter4Element9 = `${filter4}:9`;
    it('should return expected value when called with 1 filter with 1 element', () => {
      // given
      const givenFilters = {
        filter1: [filter1Element1],
      };
      const expectedResult = {
        operator: 'In',
        operands: [
          { type: 'attribute', id: [filter1Element1] },
          { type: 'elements', elements: [{ id: filter1Element1 }] }
        ]
      };
      // when
      const result = popupViewSelectorHelper.composeFilter(givenFilters);
      // then
      expect(result).toStrictEqual(expectedResult);
    });

    it('should return expected value when called with 2 filters, both with 1 element', () => {
      // given
      const givenFilters = {
        filter1: [filter1Element1],
        filter4: [filter4Element3]
      };
      const expectedResult = {
        operator: 'And',
        operands: [
          { operator: 'In',
            operands: [
              { type: 'attribute', id: [filter1Element1] },
              { type: 'elements', elements: [{ id: filter1Element1 }] }
            ]
          },
          { operator: 'In',
            operands: [
              { type: 'attribute', id: [filter4Element3] },
              { type: 'elements', elements: [{ id: filter4Element3 }] }
            ]
          }
        ]
      };
      // when
      const result = popupViewSelectorHelper.composeFilter(givenFilters);
      // then
      expect(result).toStrictEqual(expectedResult);
    });

    it('should return expected value when called with 2 filters, both with 2 elements', () => {
      // given
      const givenFilters = {
        filter1: [filter1Element1, filter1Element7],
        filter4: [filter4Element3, filter4Element9]
      };
      const expectedResult = {
        operator: 'And',
        operands: [
          { operator: 'In',
            operands: [
              { type: 'attribute', id: [filter1Element1, filter1Element7] },
              { type: 'elements',
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
              { type: 'elements',
                elements: [
                  { id: filter4Element3 },
                  { id: filter4Element9 }
                ]
              }
            ]
          }
        ]
      };
      // when
      const result = popupViewSelectorHelper.composeFilter(givenFilters);
      // then
      expect(result).toStrictEqual(expectedResult);
    });
  });
});
