/* global Office Excel */

class OfficeContext {
    getOffice = () => {
        return Office;
    }
    getExcel = () => {
        return Excel;
    }
}

export const officeContext = new OfficeContext();
