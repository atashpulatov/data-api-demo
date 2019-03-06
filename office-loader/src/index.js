const Office = window.Office;

function officeInitialize() {
  Office.onReady()
    .then(() => {
	window.location.replace('/MicroStrategyLibrary/apps/addin-mstr-office/index.html');
    });
}

officeInitialize();
