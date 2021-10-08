import mstrAttributeMetricHelper from '../../mstr-object/helper/mstr-attribute-metric-helper';
import { reportV2, reportWithMetricsInRows } from '../mockDataV2';
import regularCompoundJSON from './compound-grid/Regular Compound Grid.json';
import compoundJSONwithMetricsInRows from './compound-grid/Compound Grid with Metrics on Row.json';

describe('MstrAttributeMetricHelper', () => {
  describe('extractAttributesMetricsCompoundGrid', () => {
    it('should extracts attributes and metrics for a compound grid', () => {
      // given
      const { grid } = regularCompoundJSON.definition;

      const expectedElement = {
        attributes: [
          {
            id: '8D679D3711D3E4981000E787EC6DE8A4',
            name: 'Category',
          },
          {
            id: '8D679D5111D3E4981000E787EC6DE8A4',
            name: 'Year',
          },
          {
            id: '8D679D4F11D3E4981000E787EC6DE8A4',
            name: 'Subcategory',
          }],
        metrics: [
          {
            id: '4C051DB611D3E877C000B3B2D86C964F',
            name: 'Profit',
          },
          {
            id: '7FD5B69611D5AC76C000D98A4CC5F24F',
            name: 'Cost',
          },
        ],
      };

      // when
      const element = mstrAttributeMetricHelper.extractAttributesMetricsCompoundGrid(grid);
      // then
      expect(element).toEqual(expectedElement);
    });
  });

  describe('extractAttributesMetrics', () => {
    it('should extracts attributes and metrics for a standard grid', () => {
      // given
      const { grid } = reportV2.definition;

      const expectedElement = {
        attributes: [
          {
            id: '1D5F4A7811E97722F1050080EF65506C',
            name: 'Origin Airport',
          },
          {
            id: '9BC4691C11E97721AF570080EF55306C',
            name: 'Year',
          },
          {
            id: '9BC470B011E977217DA10080EF55306D',
            name: 'Month',
          },
        ],
        metrics: [
          {
            id: '9BC486D611E977217DA10080EF55306D',
            name: 'Flights Delayed',
          },
          {
            id: '9BC4944611E977217DA10080EF55306D',
            name: 'Avg Delay (min)',
          },
          {
            id: '9BC4778611E977217DA10080EF55306D',
            name: 'On-Time',
          },
        ],
      };
        // when
      const element = mstrAttributeMetricHelper.extractAttributesMetrics(grid);
      // then
      expect(element).toEqual(expectedElement);
    });
  });

  describe('extractAttributes', () => {
    it('should extracts attributes from rows and columns that we get from MSTR REST API', () => {
      // given
      const { rows } = reportV2.definition.grid;
      const { columns } = reportV2.definition.grid;

      const expectedElement = [
        {
          id: '1D5F4A7811E97722F1050080EF65506C',
          name: 'Origin Airport'
        },
        {
          id: '9BC4691C11E97721AF570080EF55306C',
          name: 'Year'
        },
        {
          id: '9BC470B011E977217DA10080EF55306D',
          name: 'Month'
        }
      ];
      // when
      const element = mstrAttributeMetricHelper.extractAttributes(rows, columns);
      // then
      expect(element).toEqual(expectedElement);
    });
  });

  describe('extractMetrics', () => {
    it('should extracts metrics from rows and columns that we get from MSTR REST API', () => {
      // given
      const { rows } = reportV2.definition.grid;
      const { columns } = reportV2.definition.grid;

      const expectedElement = [
        {
          id: '9BC486D611E977217DA10080EF55306D',
          name: 'Flights Delayed'
        },
        {
          id: '9BC4944611E977217DA10080EF55306D',
          name: 'Avg Delay (min)'
        },
        {
          id: '9BC4778611E977217DA10080EF55306D',
          name: 'On-Time'
        }
      ];
      // when
      const element = mstrAttributeMetricHelper.extractMetrics(rows, columns);
      // then
      expect(element).toEqual(expectedElement);
    });
  });

  describe('methods for metrics in rows', () => {
    it('should extracts metrics in rows from a report', () => {
      // given
      const body = reportWithMetricsInRows;

      const expectedResult = [
        {
          id: '4C051DB611D3E877C000B3B2D86C964F',
          name: 'Profit',
        },
        {
          id: '4C05177011D3E877C000B3B2D86C964F',
          name: 'Revenue',
        },
        {
          id: '7FD5B69611D5AC76C000D98A4CC5F24F',
          name: 'Cost',
        }
      ];
      // when
      const result = mstrAttributeMetricHelper.extractMetricsInRows(body);
      // then
      expect(result).toEqual(expectedResult);
    });

    it('should extracts metrics in rows from a compound grid', () => {
      // given
      const body = compoundJSONwithMetricsInRows;

      const expectedResult = [
        {
          id: '7FD5B69611D5AC76C000D98A4CC5F24F',
          name: 'Cost',
        }
      ];
      // when
      const result = mstrAttributeMetricHelper.extractMetricsInRows(body);
      // then
      expect(result).toEqual(expectedResult);
    });

    it('should return difference between two metric arrays', () => {
      // given
      const fetchedMetricsMock = [
        {
          id: '4C051DB611D3E877C000B3B2D86C964F',
          name: 'Profit',
        },
        {
          id: '4C05177011D3E877C000B3B2D86C964F',
          name: 'Revenue',
        },
        {
          id: '7FD5B69611D5AC76C000D98A4CC5F24F',
          name: 'Cost',
        }
      ];

      const currentMetricsMock = [
        {
          id: '4C051DB611D3E877C000B3B2D86C964F',
          name: 'Profit',
        }
      ];

      const expectedResult = [
        {
          id: '4C05177011D3E877C000B3B2D86C964F',
          name: 'Revenue',
        },
        {
          id: '7FD5B69611D5AC76C000D98A4CC5F24F',
          name: 'Cost',
        }
      ];

      // when
      const result = mstrAttributeMetricHelper.getMetricsDifference(fetchedMetricsMock, currentMetricsMock);
      // then
      expect(result).toEqual(expectedResult);
    });

    it('should extract metrics from body and returns the difference between them and the currentMetrics', () => {
      // given
      const body = reportWithMetricsInRows;

      const currentMetricsMock = [
        {
          id: '4C051DB611D3E877C000B3B2D86C964F',
          name: 'Profit',
        }
      ];

      const expectedResult = [
        {
          id: '4C05177011D3E877C000B3B2D86C964F',
          name: 'Revenue',
        },
        {
          id: '7FD5B69611D5AC76C000D98A4CC5F24F',
          name: 'Cost',
        }
      ];

      // when
      const result = mstrAttributeMetricHelper.getMetricsInRows(body, currentMetricsMock);
      // then
      expect(result).toEqual(expectedResult);
    });

    it('should return true if metrics are in rows', () => {
      // given
      const body = reportWithMetricsInRows;
      // when
      const result = mstrAttributeMetricHelper.isMetricInRows(body);
      // then
      expect(result).toEqual(true);
    });

    it('should return false if metrics are not in report rows', () => {
      // given
      const body = reportV2;
      // when
      const result = mstrAttributeMetricHelper.isMetricInRows(body);
      // then
      expect(result).toEqual(false);
    });

    it('should return false if metrics are not in compound grid rows', () => {
      // given
      const body = regularCompoundJSON;
      // when
      const result = mstrAttributeMetricHelper.isMetricInRows(body);
      // then
      expect(result).toEqual(false);
    });
  });
});
