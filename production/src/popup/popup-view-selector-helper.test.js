import officeReducerHelper from '../office/store/office-reducer-helper';
import { popupViewSelectorHelper } from './popup-view-selector-helper';

import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';

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
        { type: 'attribute', id: filter1 },
        { type: 'elements', elements: [{ id: filter1Element1 }] },
      ],
    };

    const givenFilter2 = {
      filter1: [filter1Element1],
      filter4: [filter4Element3],
    };
    const expectedResult2 = {
      operator: 'And',
      operands: [
        {
          operator: 'In',
          operands: [
            { type: 'attribute', id: filter1 },
            { type: 'elements', elements: [{ id: filter1Element1 }] },
          ],
        },
        {
          operator: 'In',
          operands: [
            { type: 'attribute', id: filter4 },
            { type: 'elements', elements: [{ id: filter4Element3 }] },
          ],
        },
      ],
    };

    const givenFilter3 = {
      filter1: [filter1Element1, filter1Element7],
      filter4: [filter4Element3, filter4Element9],
    };
    const expectedResult3 = {
      operator: 'And',
      operands: [
        {
          operator: 'In',
          operands: [
            { type: 'attribute', id: filter1 },
            {
              type: 'elements',
              elements: [{ id: filter1Element1 }, { id: filter1Element7 }],
            },
          ],
        },
        {
          operator: 'In',
          operands: [
            { type: 'attribute', id: filter4 },
            {
              type: 'elements',
              elements: [{ id: filter4Element3 }, { id: filter4Element9 }],
            },
          ],
        },
      ],
    };

    /* eslint-disable indent */
    it.each`
      givenFilter     | expectedResult
      ${givenFilter1} | ${expectedResult1}
      ${givenFilter2} | ${expectedResult2}
      ${givenFilter3} | ${expectedResult3}
    `(
      'should return $expectedResult when composeFilter was called with $givenFilter',
      ({ givenFilter, expectedResult }) => {
        // when
        const result = popupViewSelectorHelper.composeFilter(givenFilter);
        // then
        expect(result).toStrictEqual(expectedResult);
      }
    );
    /* eslint-enable indent */

    it('should return true for reprompt popup types', () => {
      const repromptPopupTypes = [
        DialogType.repromptingWindow,
        DialogType.repromptReportDataOverview,
      ];

      repromptPopupTypes.forEach(popupType => {
        expect(popupViewSelectorHelper.isRepromptReportPopupType(popupType)).toBe(true);
      });
    });

    it('should return false for non-reprompt popup types', () => {
      const nonRepromptPopupType = 'nonRepromptPopupType';

      expect(popupViewSelectorHelper.isRepromptReportPopupType(nonRepromptPopupType)).toBe(false);
    });

    it('should proceed to import if conditions are met', () => {
      const props = {
        importRequested: true,
        isPrompted: false,
        pageBy: [],
      };
      const popupType = DialogType.dossierWindow;

      const proceedToImportSpy = jest
        .spyOn(popupViewSelectorHelper, 'proceedToImport')
        .mockImplementation(() => undefined);

      const result = popupViewSelectorHelper.setPopupType(props, popupType);

      expect(proceedToImportSpy).toHaveBeenCalled();
      // Assuming proceedToImport doesn't return a value
      expect(result).toBe('dossier-window');
    });

    it('should return obtainInstanceHelper if instance with prompts is answered', () => {
      const props = {
        isPrompted: true,
        arePromptsAnswered: true,
        // Assuming arePromptsAnswered and isInstanceWithPromptsAnswered return true
      };
      const popupType = DialogType.dossierWindow;

      const isInstanceWithPromptsAnsweredSpy = jest
        .spyOn(popupViewSelectorHelper, 'isInstanceWithPromptsAnswered')
        .mockImplementation(() => false);

      const arePromptsAnsweredSpy = jest
        .spyOn(popupViewSelectorHelper, 'arePromptsAnswered')
        .mockImplementation(() => true);

      const result = popupViewSelectorHelper.setPopupType(props, popupType);

      expect(isInstanceWithPromptsAnsweredSpy).toHaveBeenCalled();
      expect(arePromptsAnsweredSpy).toHaveBeenCalled();
      expect(result).toBe(DialogType.obtainInstanceHelper);
    });
  });

  it('should return multipleRepromptTransitionPage for multiple reprompt', () => {
    const props = {
      repromptsQueueProps: {
        total: 2,
      },
    };

    const result = popupViewSelectorHelper.getPromptedReportPopupType(props);

    expect(result).toBe(DialogType.multipleRepromptTransitionPage);
  });

  it('should return editFilters for non-multiple reprompt', () => {
    const props = {
      repromptsQueueProps: {
        total: 0,
      },
    };

    const result = popupViewSelectorHelper.getPromptedReportPopupType(props);

    expect(result).toBe(DialogType.editFilters);
  });

  it('getPageByConfigurations should work properly', () => {
    officeReducerHelper.reduxStore.getState = jest.fn().mockImplementation(() => ({
      objectReducer: {
        objects: [
          {
            objectWorkingId: 1,
            pageByData: {
              pageByLinkId: '2',
              elements: [{ name: 'name1', value: 'value1', valueId: '1' }],
            },
          },
          {
            objectWorkingId: 2,
            pageByData: {
              pageByLinkId: '2',
              elements: [{ name: 'name2', value: 'value2', valueId: '2' }],
            },
          },
        ],
      },
    }));

    const result = popupViewSelectorHelper.getPageByConfigurations(1);

    expect(result).toEqual([
      [{ id: '1', name: 'name1', value: 'value1' }],
      [{ id: '2', name: 'name2', value: 'value2' }],
    ]);
  });
});
