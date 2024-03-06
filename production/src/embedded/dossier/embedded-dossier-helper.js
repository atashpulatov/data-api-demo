class EmbeddedDossierHelper {
  /**
   * Have 2 arrays, A and B, that needs to be combined; however, if there are items in B that
   * are also in A, then I want items from B to replace the ones in A.
   * @param {*} A - array containing prompt answers
   * @param {*} B - array with answers to be added to A
   * @returns consolidated array
   */
  combineArraysByObjectKey = (A, B) => {
    // Create a Map to store objects from array A with keys as the map keys
    const combinedMap = new Map(A.map(obj => [obj.key, obj]));

    // Iterate through array B
    B?.forEach(objB => {
      // If the object with the same key exists in A, replace it with the object from B
      // and if the object doesn't exist in A, add it to the Map
      combinedMap.set(objB.key, objB);
    });

    // Convert the Map values back to an array
    const combinedArray = Array.from(combinedMap.values());

    return combinedArray;
  };
}

export const embeddedDossierHelper = new EmbeddedDossierHelper();
