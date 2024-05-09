/**
 * Checks if a specific array of objects exists in an array of arrays.
 *
 * @param arrOfArrays An array of arrays of objects to search.
 * @param arr The array of objects to search for.
 * @returns A boolean indicating whether the array of arrays contains the specified array of objects.
 */
export const isArrayInNestedArrays = <T extends Record<string, any>>(
  arrOfArrays: T[][],
  arr: T[]
): boolean =>
  arrOfArrays.some(
    innerArray =>
      innerArray.length === arr.length &&
      innerArray.every((innerObj, index) => {
        const outerObj = arr[index];
        const innerKeys = Object.keys(innerObj);
        return innerKeys.every(key => innerObj[key] === outerObj[key]);
      })
  );
