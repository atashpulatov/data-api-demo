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
