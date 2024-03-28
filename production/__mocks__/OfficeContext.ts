class OfficeContextMock {
  workbook: any;

  sync: any;

  constructor() {
    this.workbook = {
      worksheets: { getActiveWorksheet: () => {} },
      bindings: { add: () => {} },
      tables: { load: () => {} },
      getSelectedRange: () => ({
        load: () => {},
        address: 'txt!txt',
      }),
    };
    this.sync = () => {};
  }
}

export const officeContextMock = new OfficeContextMock();
