/* eslint-disable indent */
import { mergeHeaderColumns, mergeHeaderRows } from '../../office/api/office-api-header-merge-helper';

describe('OfficeApiHeaderMergeHelper', () => {
  let offsetRange;
  let resizedRangeDelta;
  let rangeFormat;
  let mergeFunc;
  let called;

  let titlesRange;

  beforeAll(() => {
    window.Excel = {
      HorizontalAlignment: {
        center: 'HorizontalAlignmentCenter'
      },
      VerticalAlignment: {
        center: 'VerticalAlignmentCenter'
      }
    };
  });

  beforeEach(() => {
    offsetRange = [];
    resizedRangeDelta = [];
    rangeFormat = {};
    mergeFunc = jest.fn();
    called = false;

    titlesRange = {
      getResizedRange: (rowsNo, colsNo) => {
        called = true;
        resizedRangeDelta.push([rowsNo, colsNo]);
        return {
          getOffsetRange: (rowsDelta, colsDelta) => {
            offsetRange.push([rowsDelta, colsDelta]);
            return {
              format: rangeFormat,
              merge: mergeFunc
            };
          }
        };
      },
    };
  });

  afterAll(() => {
    delete window.Excel;
  });

  it.each`
  attributes                                 | noOfMerges | resultResizedRangeDelta        | resultOffsetRange

  ${[]}                                            | ${0} | ${undefined}                   | ${undefined}
  ${['a']}                                         | ${0} | ${undefined}                   | ${undefined}

  ${['a', 'a']}                                    | ${1} | ${[[0, 0]]}                    | ${[[0, 0]]}
  ${['a', 'a', 'a']}                               | ${1} | ${[[0, 0]]}                    | ${[[0, 0]]}

  ${['a', 'b']}                                    | ${0} | ${undefined}                   | ${undefined}
  ${['a', 'a', 'b']}                               | ${1} | ${[[0, -1]]}                   | ${[[0, 0]]}
  ${['a', 'a', 'a', 'b']}                          | ${1} | ${[[0, -1]]}                   | ${[[0, 0]]}

  ${['a', 'b', 'b']}                               | ${1} | ${[[0, -1]]}                   | ${[[0, 1]]}
  ${['a', 'a', 'b', 'b']}                          | ${2} | ${[[0, -2], [0, -2]]}          | ${[[0, 0], [0, 2]]}
  ${['a', 'a', 'a', 'b', 'b']}                     | ${2} | ${[[0, -2], [0, -3]]}          | ${[[0, 0], [0, 3]]}

  ${['a', 'b', 'b', 'b']}                          | ${1} | ${[[0, -1]]}                   | ${[[0, 1]]}
  ${['a', 'a', 'b', 'b', 'b']}                     | ${2} | ${[[0, -3], [0, -2]]}          | ${[[0, 0], [0, 2]]}
  ${['a', 'a', 'a', 'b', 'b', 'b']}                | ${2} | ${[[0, -3], [0, -3]]}          | ${[[0, 0], [0, 3]]}

  ${['a', 'b', 'c']}                               | ${0} | ${undefined}                   | ${undefined}
  ${['a', 'a', 'b', 'c']}                          | ${1} | ${[[0, -2]]}                   | ${[[0, 0]]}
  ${['a', 'a', 'a', 'b', 'c']}                     | ${1} | ${[[0, -2]]}                   | ${[[0, 0]]}

  ${['a', 'b', 'b', 'c']}                          | ${1} | ${[[0, -2]]}                   | ${[[0, 1]]}
  ${['a', 'a', 'b', 'b', 'c']}                     | ${2} | ${[[0, -3], [0, -3]]}          | ${[[0, 0], [0, 2]]}
  ${['a', 'a', 'a', 'b', 'b', 'c']}                | ${2} | ${[[0, -3], [0, -4]]}          | ${[[0, 0], [0, 3]]}

  ${['a', 'b', 'b', 'b', 'c']}                     | ${1} | ${[[0, -2]]}                   | ${[[0, 1]]}
  ${['a', 'a', 'b', 'b', 'b', 'c']}                | ${2} | ${[[0, -4], [0, -3]]}          | ${[[0, 0], [0, 2]]}
  ${['a', 'a', 'a', 'b', 'b', 'b', 'c']}           | ${2} | ${[[0, -4], [0, -4]]}          | ${[[0, 0], [0, 3]]}

  ${['a', 'b', 'c', 'c']}                          | ${1} | ${[[0, -2]]}                   | ${[[0, 2]]}
  ${['a', 'a', 'b', 'c', 'c']}                     | ${2} | ${[[0, -3], [0, -3]]}          | ${[[0, 0], [0, 3]]}
  ${['a', 'a', 'a', 'b', 'c', 'c']}                | ${2} | ${[[0, -3], [0, -4]]}          | ${[[0, 0], [0, 4]]}

  ${['a', 'b', 'b', 'c', 'c']}                     | ${2} | ${[[0, -3], [0, -3]]}          | ${[[0, 1], [0, 3]]}
  ${['a', 'a', 'b', 'b', 'c', 'c']}                | ${3} | ${[[0, -4], [0, -4], [0, -4]]} | ${[[0, 0], [0, 2], [0, 4]]}
  ${['a', 'a', 'a', 'b', 'b', 'c', 'c']}           | ${3} | ${[[0, -4], [0, -5], [0, -5]]} | ${[[0, 0], [0, 3], [0, 5]]}

  ${['a', 'b', 'b', 'b', 'c', 'c']}                | ${2} | ${[[0, -3], [0, -4]]}          | ${[[0, 1], [0, 4]]}
  ${['a', 'a', 'b', 'b', 'b', 'c', 'c']}           | ${3} | ${[[0, -5], [0, -4], [0, -5]]} | ${[[0, 0], [0, 2], [0, 5]]}
  ${['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c']}      | ${3} | ${[[0, -5], [0, -5], [0, -6]]} | ${[[0, 0], [0, 3], [0, 6]]}

  ${['a', 'b', 'c', 'c', 'c']}                     | ${1} | ${[[0, -2]]}                   | ${[[0, 2]]}
  ${['a', 'a', 'b', 'c', 'c', 'c']}                | ${2} | ${[[0, -4], [0, -3]]}          | ${[[0, 0], [0, 3]]}
  ${['a', 'a', 'a', 'b', 'c', 'c', 'c']}           | ${2} | ${[[0, -4], [0, -4]]}          | ${[[0, 0], [0, 4]]}

  ${['a', 'b', 'b', 'c', 'c', 'c']}                | ${2} | ${[[0, -4], [0, -3]]}          | ${[[0, 1], [0, 3]]}
  ${['a', 'a', 'b', 'b', 'c', 'c', 'c']}           | ${3} | ${[[0, -5], [0, -5], [0, -4]]} | ${[[0, 0], [0, 2], [0, 4]]}
  ${['a', 'a', 'a', 'b', 'b', 'c', 'c', 'c']}      | ${3} | ${[[0, -5], [0, -6], [0, -5]]} | ${[[0, 0], [0, 3], [0, 5]]}

  ${['a', 'b', 'b', 'b', 'c', 'c', 'c']}           | ${2} | ${[[0, -4], [0, -4]]}          | ${[[0, 1], [0, 4]]}
  ${['a', 'a', 'b', 'b', 'b', 'c', 'c', 'c']}      | ${3} | ${[[0, -6], [0, -5], [0, -5]]} | ${[[0, 0], [0, 2], [0, 5]]}
  ${['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c', 'c']} | ${3} | ${[[0, -6], [0, -6], [0, -6]]} | ${[[0, 0], [0, 3], [0, 6]]}

  ${['a', 'a', 'b', 'a']}                          | ${1} | ${[[0, -2]]}                   | ${[[0, 0]]}
  ${['a', 'b', 'a', 'a']}                          | ${1} | ${[[0, -2]]}                   | ${[[0, 2]]}
  ${['a', 'a', 'b', 'a', 'a']}                     | ${2} | ${[[0, -3], [0, -3]]}          | ${[[0, 0], [0, 3]]}
  
  `('should create ranges using offsets and deltas, and execute merge() $noOfMerges time(s) '
    + 'for rows for given attributes $attributes',
    ({ attributes, noOfMerges, resultOffsetRange, resultResizedRangeDelta }) => {
      // given
      // when
      mergeHeaderRows(attributes, titlesRange);

      // then
      expect(mergeFunc).toBeCalledTimes(noOfMerges);

      if (noOfMerges > 0) {
        expect(offsetRange).toEqual(resultOffsetRange);
        expect(resizedRangeDelta).toEqual(resultResizedRangeDelta);
        expect(rangeFormat.horizontalAlignment).toEqual('HorizontalAlignmentCenter');
      }
    });

  it.each`
  attributes                                 | noOfMerges | resultResizedRangeDelta        | resultOffsetRange

  ${[]}                                            | ${0} | ${undefined}                   | ${undefined}
  ${['a']}                                         | ${0} | ${undefined}                   | ${undefined}

  ${['a']}                                         | ${0} | ${undefined}                   | ${undefined}
  ${['a', 'a']}                                    | ${1} | ${[[0, 0]]}                    | ${[[0, 0]]}
  ${['a', 'a', 'a']}                               | ${1} | ${[[0, 0]]}                    | ${[[0, 0]]}

  ${['a', 'b']}                                    | ${0} | ${undefined}                   | ${undefined}
  ${['a', 'a', 'b']}                               | ${1} | ${[[-1, 0]]}                   | ${[[0, 0]]}
  ${['a', 'a', 'a', 'b']}                          | ${1} | ${[[-1, 0]]}                   | ${[[0, 0]]}

  ${['a', 'b', 'b']}                               | ${1} | ${[[-1, 0]]}                   | ${[[1, 0]]}
  ${['a', 'a', 'b', 'b']}                          | ${2} | ${[[-2, 0], [-2, 0]]}          | ${[[0, 0], [2, 0]]}
  ${['a', 'a', 'a', 'b', 'b']}                     | ${2} | ${[[-2, 0], [-3, 0]]}          | ${[[0, 0], [3, 0]]}

  ${['a', 'b', 'b', 'b']}                          | ${1} | ${[[-1, 0]]}                   | ${[[1, 0]]}
  ${['a', 'a', 'b', 'b', 'b']}                     | ${2} | ${[[-3, 0], [-2, 0]]}          | ${[[0, 0], [2, 0]]}
  ${['a', 'a', 'a', 'b', 'b', 'b']}                | ${2} | ${[[-3, 0], [-3, 0]]}          | ${[[0, 0], [3, 0]]}

  ${['a', 'b', 'c']}                               | ${0} | ${undefined}                   | ${undefined}
  ${['a', 'a', 'b', 'c']}                          | ${1} | ${[[-2, 0]]}                   | ${[[0, 0]]}
  ${['a', 'a', 'a', 'b', 'c']}                     | ${1} | ${[[-2, 0]]}                   | ${[[0, 0]]}

  ${['a', 'b', 'b', 'c']}                          | ${1} | ${[[-2, 0]]}                   | ${[[1, 0]]}
  ${['a', 'a', 'b', 'b', 'c']}                     | ${2} | ${[[-3, 0], [-3, 0]]}          | ${[[0, 0], [2, 0]]}
  ${['a', 'a', 'a', 'b', 'b', 'c']}                | ${2} | ${[[-3, 0], [-4, 0]]}          | ${[[0, 0], [3, 0]]}

  ${['a', 'b', 'b', 'b', 'c']}                     | ${1} | ${[[-2, 0]]}                   | ${[[1, 0]]}
  ${['a', 'a', 'b', 'b', 'b', 'c']}                | ${2} | ${[[-4, 0], [-3, 0]]}          | ${[[0, 0], [2, 0]]}
  ${['a', 'a', 'a', 'b', 'b', 'b', 'c']}           | ${2} | ${[[-4, 0], [-4, 0]]}          | ${[[0, 0], [3, 0]]}

  ${['a', 'b', 'c', 'c']}                          | ${1} | ${[[-2, 0]]}                   | ${[[2, 0]]}
  ${['a', 'a', 'b', 'c', 'c']}                     | ${2} | ${[[-3, 0], [-3, 0]]}          | ${[[0, 0], [3, 0]]}
  ${['a', 'a', 'a', 'b', 'c', 'c']}                | ${2} | ${[[-3, 0], [-4, 0]]}          | ${[[0, 0], [4, 0]]}

  ${['a', 'b', 'b', 'c', 'c']}                     | ${2} | ${[[-3, 0], [-3, 0]]}          | ${[[1, 0], [3, 0]]}
  ${['a', 'a', 'b', 'b', 'c', 'c']}                | ${3} | ${[[-4, 0], [-4, 0], [-4, 0]]} | ${[[0, 0], [2, 0], [4, 0]]}
  ${['a', 'a', 'a', 'b', 'b', 'c', 'c']}           | ${3} | ${[[-4, 0], [-5, 0], [-5, 0]]} | ${[[0, 0], [3, 0], [5, 0]]}

  ${['a', 'b', 'b', 'b', 'c', 'c']}                | ${2} | ${[[-3, 0], [-4, 0]]}          | ${[[1, 0], [4, 0]]}
  ${['a', 'a', 'b', 'b', 'b', 'c', 'c']}           | ${3} | ${[[-5, 0], [-4, 0], [-5, 0]]} | ${[[0, 0], [2, 0], [5, 0]]}
  ${['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c']}      | ${3} | ${[[-5, 0], [-5, 0], [-6, 0]]} | ${[[0, 0], [3, 0], [6, 0]]}

  ${['a', 'b', 'c', 'c', 'c']}                     | ${1} | ${[[-2, 0]]}                   | ${[[2, 0]]}
  ${['a', 'a', 'b', 'c', 'c', 'c']}                | ${2} | ${[[-4, 0], [-3, 0]]}          | ${[[0, 0], [3, 0]]}
  ${['a', 'a', 'a', 'b', 'c', 'c', 'c']}           | ${2} | ${[[-4, 0], [-4, 0]]}          | ${[[0, 0], [4, 0]]}

  ${['a', 'b', 'b', 'c', 'c', 'c']}                | ${2} | ${[[-4, 0], [-3, 0]]}          | ${[[1, 0], [3, 0]]}
  ${['a', 'a', 'b', 'b', 'c', 'c', 'c']}           | ${3} | ${[[-5, 0], [-5, 0], [-4, 0]]} | ${[[0, 0], [2, 0], [4, 0]]}
  ${['a', 'a', 'a', 'b', 'b', 'c', 'c', 'c']}      | ${3} | ${[[-5, 0], [-6, 0], [-5, 0]]} | ${[[0, 0], [3, 0], [5, 0]]}

  ${['a', 'b', 'b', 'b', 'c', 'c', 'c']}           | ${2} | ${[[-4, 0], [-4, 0]]}          | ${[[1, 0], [4, 0]]}
  ${['a', 'a', 'b', 'b', 'b', 'c', 'c', 'c']}      | ${3} | ${[[-6, 0], [-5, 0], [-5, 0]]} | ${[[0, 0], [2, 0], [5, 0]]}
  ${['a', 'a', 'a', 'b', 'b', 'b', 'c', 'c', 'c']} | ${3} | ${[[-6, 0], [-6, 0], [-6, 0]]} | ${[[0, 0], [3, 0], [6, 0]]}

  ${['a', 'a', 'b', 'a']}                          | ${1} | ${[[-2, 0]]}                   | ${[[0, 0]]}
  ${['a', 'b', 'a', 'a']}                          | ${1} | ${[[-2, 0]]}                   | ${[[2, 0]]}
  ${['a', 'a', 'b', 'a', 'a']}                     | ${2} | ${[[-3, 0], [-3, 0]]}          | ${[[0, 0], [3, 0]]}

  `('should create ranges using offsets and deltas, and execute merge() $noOfMerges time(s) '
    + 'for columns for given attributes $attributes',
    ({ attributes, noOfMerges, resultOffsetRange, resultResizedRangeDelta }) => {
      // given
      // when
      mergeHeaderColumns(attributes, titlesRange);

      // then
      expect(mergeFunc).toBeCalledTimes(noOfMerges);

      if (noOfMerges > 0) {
        expect(offsetRange).toEqual(resultOffsetRange);
        expect(resizedRangeDelta).toEqual(resultResizedRangeDelta);
        expect(rangeFormat.verticalAlignment).toEqual('VerticalAlignmentCenter');
      }
    });
});
