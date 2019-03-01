const Office = window.Office;

function officeInitialize() {
  Office.onReady()
    .then(() => {
	window.location.replace('/MicroStrategyLibrary/office/index.html');
    });
}

officeInitialize();
