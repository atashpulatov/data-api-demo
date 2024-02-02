/**
 * Converts a readable stream into base64 PNG string
 *
 * @param response readable image stream
 */
export const convertImageToBase64 = async (response) => {
  const arrayBuffer = await response.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const binaryString = uint8Array.reduce((str, byte) => str + String.fromCharCode(byte), '');
  const base64String = btoa(binaryString);
  return base64String;
};

/**
 * Converts CSS points to pixels using standard absolute length units
 * defined in W3C CSS Values and Units Module Level 3
 * https://www.w3.org/TR/css-values-3/#absolute-lengths
 *
 * @param {Number} points css points
 * @returns {Number} pixel value
 */
export const convertPointsToPixels = (points) => {
  if (!points) {
    return -1;
  }
  // 1 point = 96/72 pixels
  return points * 1.333;
};

/**
 * Converts CSS pixels to points using standard absolute length units
 * defined in W3C CSS Values and Units Module Level 3
 * https://www.w3.org/TR/css-values-3/#absolute-lengths
 *
 * @param {Number} pixels css pixels
 * @returns {Number} points value
 */
export const convertPixelsToPoints = (pixels) => {
  if (!pixels) {
    return -1;
  }
  // 1 pixel = 72/96 points
  return pixels * 0.75;
};
