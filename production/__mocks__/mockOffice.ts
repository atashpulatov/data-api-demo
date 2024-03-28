export const mockOffice = {
  context: {
    ui: {
      messageParent: () => {},
      displayDialogAsync: jest.fn(),
    },
    diagnostics: {},
  },
} as unknown as typeof Office;

global.Office = mockOffice;
export const { Office } = global;
