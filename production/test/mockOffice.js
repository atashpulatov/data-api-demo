export const mockOffice = {
  context: {
    ui: {
      messageParent: () => {},
    },
  },
};

global.Office = mockOffice;
export const Office = global.Office;
