import operationStepDispatcher from '../../../operation/operation-step-dispatcher';
import stepBackupObjectData from '../../../office/backup-object-data/step-backup-object-data';

describe('StepBackupObjectData', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('BackupObjectData should works correctly', async () => {
    // given
    const objectData = { objectWorkingId: 1 };

    const mockedUpdateOperation = jest.spyOn(operationStepDispatcher, 'updateOperation').mockImplementation();
    const mockedCompleteStep = jest.spyOn(operationStepDispatcher, 'completeBackupObjectData').mockImplementation();

    // when
    await stepBackupObjectData.backupObjectData(objectData,);

    // then
    expect(mockedUpdateOperation).toBeCalledTimes(1);
    expect(mockedCompleteStep).toBeCalledTimes(1);
    expect(mockedCompleteStep).toBeCalledWith(objectData.objectWorkingId);
  });
});
