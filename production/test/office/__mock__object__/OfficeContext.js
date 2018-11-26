
class OfficeContextMock {
    constructor() {
        this.workbook = {
            worksheets: {
                getActiveWorksheet: () => { },
            },
            bindings: {
                add: () => { },
            },
            tables: {
                load: () => { },
            },
            getSelectedRange: () => {
                return {
                    load: () => { },
                    address: 'txt!txt',
                }
            },
        };
        this.sync = () => { };
    };
}

export const officeContextMock = new OfficeContextMock();
