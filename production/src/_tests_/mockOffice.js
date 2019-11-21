export const mockOffice = {
  context: {
    ui: { messageParent: () => {}, },
    diagnostics: {},
  },
};

global.Office = mockOffice;
export const { Office } = global;
