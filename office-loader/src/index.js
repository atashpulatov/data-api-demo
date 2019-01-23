const Office = window.Office;

function officeInitialize() {
  Office.onReady()
    .then(() => {
	window.location.replace('/MicroStrategyLibrary/build/index.html');
    });
}

officeInitialize();
