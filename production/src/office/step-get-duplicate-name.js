import operationStepDispatcher from '../operation/operation-step-dispatcher';
import operationErrorHandler from '../operation/operation-error-handler';

class StepGetDuplicateName {
  init = (reduxStore) => {
    this.reduxStore = reduxStore;
  }

  /**
  * Assigns new name to duplicated object.
  *
  * This function is subscribed as one of the operation steps with the key GET_DUPLICATE_NAME,
  * therefore should be called only via operation bus.
  *
  * Assigning new name is skiped if vizualization key changed during duplication with edit for dossier.
  * In that case, name of new visualization  will be taken from instance definition in next step.
  *
  * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
  * @param {String} objectData.name Name of the original object.
  * during duplication with edit.
  */
  getDuplicateName = (objectData, operationData) => {
    try {
      const { objectWorkingId, name } = objectData;
      const { objectEditedData } = operationData;

      if (!(objectEditedData && objectEditedData.visualizationInfo
        && objectEditedData.visualizationInfo.nameAndFormatShouldUpdate)) {
        const nameCandidate = this.prepareNewNameForDuplicatedObject(name);
        const newName = this.checkAndSolveNameConflicts(nameCandidate);
        const updatedObject = {
          objectWorkingId,
          name: newName
        };
        operationStepDispatcher.updateObject(updatedObject);
      }
      operationStepDispatcher.completeGetDuplicateName(objectWorkingId);
    } catch (error) {
      console.error(error);
      operationErrorHandler.handleOperationError(objectData, operationData);
    }
  }

  /**
   * Prepares new name for duplicated object based on original object name.
   *
   * New name contains original object name with additional counter at the end.
   * Counting number starts with 2.
   *
   * @param {String} originalObjectName Name of the original object.
   * @returns {String} Proposed name for new duplicated object.
   */
  prepareNewNameForDuplicatedObject = (originalObjectName) => {
    const splitedName = String(originalObjectName).split(' ');
    const nrOfWords = splitedName.length;

    const lastWordIndex = nrOfWords - 1;
    const lastWord = splitedName[lastWordIndex];
    const lastWordLength = lastWord.length;

    if (lastWord.length > 2 && lastWord[0] === '(' && lastWord[lastWordLength - 1] === ')') {
      const counterNumber = Number(lastWord.substring(1, lastWordLength - 1));
      if (!(Number.isNaN(counterNumber))) {
        splitedName.pop();
        splitedName.push(`(${counterNumber + 1})`);
      } else {
        splitedName.push('(2)');
      }
    } else {
      splitedName.push('(2)');
    }

    const nameCandidate = splitedName.join(' ');

    return nameCandidate;
  }

  /**
   * Checks nameCandidate for conflicts with names of other imported objects.
   * Name of duplicated object cannot be conflicting with names of already exisitng objects.
   * If there are conflicts, function adujsts nameCandidate in loop, until conflicts are solved.
   *
   * In case of conflicts counter is added at the end of nameCandidate.
   *
   * @param {String} nameCandidate Prepared name for duplicated object
   * @returns {String} Final name for new duplicated object
   */
  checkAndSolveNameConflicts = (nameCandidate) => {
    let finalNameCandidate = nameCandidate;

    const { objects } = this.reduxStore.getState().objectReducer;

    const objectsNames = objects.map(({ name }) => name);

    while (objectsNames.includes(finalNameCandidate)) {
      finalNameCandidate = this.prepareNewNameForDuplicatedObject(finalNameCandidate);
    }
    return finalNameCandidate;
  }
}

const stepGetDuplicateName = new StepGetDuplicateName();
export default stepGetDuplicateName;
