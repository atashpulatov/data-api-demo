class OfficeStoreService {
    preserveReport = (report) => {
        const settings = this.getOfficeSettings();
        let reports = this._getReportProperties();
        reports.push({
            id: report.id,
            name: report.name,
            bindId: report.bindId,
            tableId: report.tableId,
            projectId: report.projectId,
            envUrl: report.envUrl,
        });
        settings.saveAsync();
    }

    deleteReport = (bindingId) => {
        const settings = this.getOfficeSettings();
        let reportProperties = this._getReportProperties();
        const indexOfReport = reportProperties.findIndex((report) => {
            return (report.bindId === bindingId);
        });
        const newReportProperties = [
            ...reportProperties.slice(0, indexOfReport),
            ...reportProperties.slice(indexOfReport + 1),
        ];
        settings.set('reportProperties', newReportProperties);
        settings.saveAsync();
    }

    getReportFromProperties = (bindingId) => {
        const reportProperties = this._getReportProperties();
        const report = reportProperties.find((report) => {
            return report.bindId === bindingId;
        });
        return report;
    }

    _getReportProperties = () => {
        const settings = this.getOfficeSettings();
        if (!(settings.get('reportProperties'))) {
            let reportProperties = [];
            settings.set('reportProperties', reportProperties);
            settings.saveAsync();
        }
        return settings.get('reportProperties');
    }

    getOfficeSettings = () => {
        return Office.context.document.settings;
    }
}

export const officeStoreService = new OfficeStoreService();
