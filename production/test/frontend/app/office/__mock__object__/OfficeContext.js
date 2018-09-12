
class OfficeContextMock {
    constructor() {
        this.workbook = {
            worksheets: {
                getActiveWorksheet: () => { },
            },
            bindings: {
                add: () => { },
            },
            getSelectedRange: () => { },
        };
        this.sync = () => { };
    };
}

export const officeContextMock = new OfficeContextMock();
