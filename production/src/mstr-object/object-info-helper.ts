
import { reduxStore } from "../store";

import { ObjectData } from "../types/object-types";

export const getObjectDetailsForWorksheet = (object: ObjectData): any[] => {
    const worksheetDetailsSettings = reduxStore.getState().settingsReducer.worksheetObjectInfoSettings;

    const enabledWorksheetDetailsSettings = worksheetDetailsSettings.filter(
        setting => setting.toggleChecked
    );
    const enabledWorksheetDetailsSettingsKeys = enabledWorksheetDetailsSettings.map(
        setting => setting.key
    );

    const filteredSingleObjectDetails: any[] = [];

    enabledWorksheetDetailsSettingsKeys.forEach(key => {
        switch (key) {
            case 'name':
                filteredSingleObjectDetails.push([object.name], [""]);
                break;
            case 'owner':
                filteredSingleObjectDetails.push(["Owner"], [object.details?.owner.name], [""]);
                break;
            case 'description':
                filteredSingleObjectDetails.push(["Description"], [object.details?.description || '-'], [""]);
                break;
            case 'filter':
                if (object.mstrObjectType.name === 'report') {
                    filteredSingleObjectDetails.push(
                        ["Report Filter"], [object.details?.filters.reportFilterText], [""],
                        ["Report Limits"], [object.details?.filters.reportLimitsText], [""],
                        ["View Filter"], [object.details?.filters.viewFilterText], [""],
                        // ["Metric Limits"], [object.details?.filters.metricLimitsText], [""]
                    );
                } else {
                    filteredSingleObjectDetails.push(["Filter"], [object.details?.filters.viewFilterText || '-'], [""]);
                }
                break;
            case 'importedBy':
                filteredSingleObjectDetails.push(["Imported By"], [object.details?.importedBy], [""]);
                break;
            case 'dateModified':
                filteredSingleObjectDetails.push(["Date Modified"], [object.details?.modifiedDate], [""]);
                break;
            case 'dateCreated':
                filteredSingleObjectDetails.push(["Date Created"], [object.details?.createdDate], [""]);
                break;
            case 'id':
                filteredSingleObjectDetails.push(["ID"], [object.objectId], [""]);
                break;
            case 'pageBy':
                filteredSingleObjectDetails.push(["Page By"], [object.pageByData || '-'], [""]);
                break;
            default:
                break;
        }
    });

    console.log('filteredSingleObjectDetails', filteredSingleObjectDetails);

    return filteredSingleObjectDetails;
};
