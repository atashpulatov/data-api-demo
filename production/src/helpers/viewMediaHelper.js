/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */

/**
 * Mapping of the EnumDSSXMLViewMedia bits from MicroStrategy WebSDK
 */
const EnumDSSXMLViewMedia = {
  DssXmlViewMediaReserved: 0x00000000,
  DssXmlViewMediaViewStatic: 0x00000001,
  DssXmlViewMediaViewInteractive: 0x00000002,
  DssXmlViewMediaViewEditable: 0x00000004,
  DssXmlViewMediaViewFlash: 0x00000008,
  DssXmlViewMediaExportExcel: 0x00000010,
  DssXmlViewMediaExportPDF: 0x00000020,
  DssXmlViewMediaExportHTML: 0x00000040,
  DssXmlViewMediaExportFlash: 0x00000080,
  DssXmlViewMediaExportExcelPlainText: 0x00000100,
  DssXmlViewMediaExportCSV: 0x00000200,
  DssXmlViewMediaExportPlainText: 0x00000400,
  DssXmlViewMediaViewAnalysis: 0x00000800,
  DssXmlViewMediaCustomSQL: 0x00001600,
  DssXmlViewMediaHTML5Dashboard: 0x00002000,
  DssXmlViewMediaExportMSTR: 0x00004000,
  DssXmlViewMediaPrivate: 0x00008000,
  DssXmlViewMediaAvailableServeAsModel: 0x00010000,
  DssXmlViewMediaExportPhone: 0x00020000,
  DssXmlViewMediaExportTablet: 0x00040000,
  DssXmlViewMediaExportJSON: 0x00080000,
  DssXmlViewMediaStatic: 0x08000000,
  DssXmlViewMediaAll: 0x7FFFFFF,
};

const DOCUMENT_TYPES = Object.freeze({
  DOSSIER: EnumDSSXMLViewMedia.DssXmlViewMediaHTML5Dashboard,
  RSD: EnumDSSXMLViewMedia.DssXmlViewMediaViewStatic,
});

/**
 * Get default mode from given viewMedia
 */
function getDefaultViewMode(viewMedia) {
  const defModePosition = viewMedia >> 27;

  if (defModePosition === 0) {
    return 0;
  }
  return EnumDSSXMLViewMedia.DssXmlViewMediaViewStatic << defModePosition - 1;
}

/**
 * Map the documents default view media to the type of document, which can be Dossier or RSD.
 */
function getTypeFromViewMedia(viewMedia) {
  const defaultViewMedia = getDefaultViewMode(viewMedia);
  if (!defaultViewMedia) {
    return null;
  }
  if (defaultViewMedia & EnumDSSXMLViewMedia.DssXmlViewMediaViewAnalysis
    | defaultViewMedia & EnumDSSXMLViewMedia.DssXmlViewMediaHTML5Dashboard) {
    return DOCUMENT_TYPES.DOSSIER;
  }
  if (defaultViewMedia & EnumDSSXMLViewMedia.DssXmlViewMediaViewStatic) {
    return DOCUMENT_TYPES.RSD;
  }
  return null;
}

/**
 * function to determine if a provided view media is for an dossier
 * @param viewMedia
 * @returns {boolean}
 */
export default function isDossier(viewMedia) {
  return getTypeFromViewMedia(viewMedia) === DOCUMENT_TYPES.DOSSIER;
}
