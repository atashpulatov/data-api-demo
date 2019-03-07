const Office = window.Office;

function officeInitialize() {
  Office.onReady()
      .then(() => {
        const currentPath = window.location.pathname;
        const pathBeginning = currentPath.split('/static/')[0];
        const loginParams = 'source=addin-mstr-office';
        window.location.replace(`${pathBeginning}/apps/addin-mstr-office/index.html?${loginParams}`);
      });
}

officeInitialize();
