import { dialogViewSelectorHelper } from './dialog-view-selector-helper';

import { DialogType } from '../redux-reducer/popup-state-reducer/popup-state-reducer-types';

describe('Dialog View Selector Helper', () => {
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
        const result = dialogViewSelectorHelper.composeFilter(givenFilter);
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
        expect(dialogViewSelectorHelper.isRepromptReportPopupType(popupType)).toBe(true);
      });
    });

    it('should return false for non-reprompt popup types', () => {
      const nonRepromptPopupType = 'nonRepromptPopupType';

      expect(dialogViewSelectorHelper.isRepromptReportPopupType(nonRepromptPopupType)).toBe(false);
    });

    it('should proceed to import if conditions are met', () => {
      const props = {
        importRequested: true,
        isPrompted: false,
        pageBy: [],
      };
      const popupType = DialogType.dossierWindow;

      const proceedToImportSpy = jest
        .spyOn(dialogViewSelectorHelper, 'proceedToImport')
        .mockImplementation(() => undefined);

      const result = dialogViewSelectorHelper.setPopupType(props, popupType);

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
        .spyOn(dialogViewSelectorHelper, 'isInstanceWithPromptsAnswered')
        .mockImplementation(() => false);

      const arePromptsAnsweredSpy = jest
        .spyOn(dialogViewSelectorHelper, 'arePromptsAnswered')
        .mockImplementation(() => true);

      const result = dialogViewSelectorHelper.setPopupType(props, popupType);

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

    const result = dialogViewSelectorHelper.getPromptedReportPopupType(props);

    expect(result).toBe(DialogType.multipleRepromptTransitionPage);
  });

  it('should return editFilters for non-multiple reprompt', () => {
    const props = {
      repromptsQueueProps: {
        total: 0,
      },
    };

    const result = dialogViewSelectorHelper.getPromptedReportPopupType(props);

    expect(result).toBe(DialogType.editFilters);
  });
});
