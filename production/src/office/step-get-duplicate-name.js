import operationStepDispatcher from '../operation/operation-step-dispatcher';
import i18n from '../i18n';

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
  * @param {Number} objectData.objectWorkingId Unique Id of the object allowing to reference specific object
  * @param {String} objectData.name Name of the original object.
  */
  getDuplicateName = (objectData) => {
    const { objectWorkingId, name } = objectData;
    const lang = i18n.language;
    const translatedCopy = i18n.store.data[lang].common.Copy;
    const nameCandidate = this.prepareNewNameForDuplicatedObject(name, translatedCopy);
    const newName = this.checkAndSolveNameConflicts(nameCandidate, translatedCopy);
    const updatedObject = {
      objectWorkingId,
      name: newName
    };
    operationStepDispatcher.updateObject(updatedObject);
    operationStepDispatcher.completeGetDuplicateName(objectWorkingId);
  }

  /**
   * Prepares new name for duplicated object based on original object name.
   *
   * New name contains original object name with additional 'copy' at the end.
   * 'Copy' can be expanded by counting number, starting from 2.
   *
   * @param {String} originalObjectName Name of the original object.
   * @param {String} translatedCopy 'Copy' translated to active language.
   * @returns {String} Proposed name for new duplicated object.
   */
  prepareNewNameForDuplicatedObject = (originalObjectName, translatedCopy) => {
    const splitedName = String(originalObjectName).split(' ');
    const nrOfWords = splitedName.length;

    const lastWordIndex = nrOfWords - 1;
    const lastWord = splitedName[lastWordIndex];
    const lastWordAsNumber = Number(lastWord);

    const secondLastWordIndex = nrOfWords - 2;
    const secondLastWord = splitedName[secondLastWordIndex];


    if ((Number.isNaN(lastWordAsNumber)) && (lastWord !== translatedCopy)) {
      splitedName.push(translatedCopy);
    } else if (lastWord === translatedCopy) {
      splitedName.push('2');
    } else if (secondLastWord === translatedCopy) {
      splitedName.pop();
      splitedName.push(`${lastWordAsNumber + 1}`);
    } else {
      splitedName.push(translatedCopy);
    }

    const nameCandidate = splitedName.join(' ');

    return nameCandidate;
  }

  /**
   * Checks nameCandidate for conflicts with names of other imported objects.
   * Name of duplicated object cannot be conflicting with names of already exisitng objects.
   * If there are conflicts, function adujsts nameCandidate in loop, until conflicts are solved.
   *
   * In case of conflicts:
   * 1. Add '2' if there is 'copy' at the end of nameCandidate.
   * 2. Increment number which is at the end of nameCandidate.
   *
   * @param {String} nameCandidate Prepared name for duplicated object
   * @param {String} translatedCopy 'Copy' translated to active language.
   * @returns {String} Final name for new duplicated object
   */
  checkAndSolveNameConflicts = (nameCandidate, translatedCopy) => {
    const splitedName = nameCandidate.split(' ');
    let finalNameCandidate = nameCandidate;

    const { objects } = this.reduxStore.getState().objectReducer;

    const objectsNames = [];
    for (const object of objects) {
      objectsNames.push(object.name);
    }

    while (objectsNames.includes(finalNameCandidate)) {
      if (splitedName[splitedName.length - 1] === translatedCopy) {
        splitedName.push(2);
      } else {
        const last = splitedName.pop();
        const last2Number = Number(last);
        splitedName.push(`${last2Number + 1}`);
      }
      finalNameCandidate = splitedName.join(' ');
    }
    return finalNameCandidate;
  }
}

const stepGetDuplicateName = new StepGetDuplicateName();
export default stepGetDuplicateName;
