const Office = window.Office;

function officeInitialize() {
  Office.onReady()
    .then(() => {
      const currentPath = window.location.pathname;
      const pathBeginning = currentPath.split('/static/')[0];
      window.location.replace(`${pathBeginning}/apps/addin-mstr-office/index.html`);
    });
}

officeInitialize();
