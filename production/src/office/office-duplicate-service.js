import officeStoreRestoreObject from './store/office-store-restore-object';

// TODO jsdoc
class OfficeDuplicateService {
  assignNewName = (originalObjectName, mstrTable) => {
    if (originalObjectName) {
      console.time('Duplicate renaming');
      const nameCandidate = this.prepareNewNameForDuplicatedObject(originalObjectName);
      const finalNewName = this.checkAndSolveNameConflicts(nameCandidate);
      mstrTable.name = finalNewName;
      console.timeEnd('Duplicate renaming');
    }
  }

  prepareNewNameForDuplicatedObject = (originalObjectName) => {
    const splitedName = originalObjectName.split(' ');
    const nrOfWords = splitedName.length;

    const lastWordIndex = nrOfWords - 1;
    const lastWord = splitedName[lastWordIndex];
    const lastWordAsNumber = Number(lastWord);

    const secondLastWordIndex = nrOfWords - 2;
    const secondLastWord = splitedName[secondLastWordIndex];

    if ((Number.isNaN(lastWordAsNumber)) && (lastWord !== 'copy')) {
      splitedName.push('copy');
    } else if (lastWord === 'copy') {
      splitedName.push('1');
    } else if (secondLastWord === 'copy') {
      splitedName.pop();
      splitedName.push(`${lastWordAsNumber + 1}`);
    } else {
      splitedName.push('copy');
    }

    const nameCandidate = splitedName.join(' ');

    return nameCandidate;
  }

  checkAndSolveNameConflicts = (nameCandidate) => {
    const splitedName = nameCandidate.split(' ');
    let finalNameCandidate = nameCandidate;

    // TODO change to object reducer
    const reportsArray = [...officeStoreRestoreObject.getLegacyObjectsList()];
    const reportsArrayNames = [];
    for (const report of reportsArray) {
      reportsArrayNames.push(report.name);
    }

    while (reportsArrayNames.includes(finalNameCandidate)) {
      if (splitedName[splitedName.length - 1] === 'copy') {
        splitedName.push(1);
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


const officeDuplicateService = new OfficeDuplicateService();
export default officeDuplicateService;
