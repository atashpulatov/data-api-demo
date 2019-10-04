/* global Office Excel */

class OfficeContext {
    getOffice = () => Office

    getExcel = () => Excel
}

export const officeContext = new OfficeContext();
