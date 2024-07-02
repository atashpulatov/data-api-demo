import { operationService } from './operation-service';

import { reduxStore } from '../../store';

describe('SidePanelService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('importInNewRange should dispatch popup data', () => {
    // given
    const objectWorkingId = 1;
    const startCell = 'A1';
    const insertNewWorksheet = true;

    const mockedDispatch = jest.spyOn(reduxStore, 'dispatch').mockImplementation();

    const expectedObject = {
      payload: {
        insertNewWorksheet,
        objectWorkingId,
        startCell,
        repeatStep: true,
        tableChanged: true,
      },
      type: 'UPDATE_OPERATION',
    };
    // when
    operationService.importInNewRange(objectWorkingId, startCell, insertNewWorksheet);
    // then
    expect(mockedDispatch).toBeCalledWith(expectedObject);
    expect(mockedDispatch).toBeCalledTimes(1);
  });
});
