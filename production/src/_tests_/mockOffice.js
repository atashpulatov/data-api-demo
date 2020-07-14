export const mockOffice = {
  context: {
    ui: {
      messageParent: () => {},
      displayDialogAsync: jest.fn()
    },
    diagnostics: {},
  },
};

global.Office = mockOffice;
export const { Office } = global;
