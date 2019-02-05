class OfficeConverterService {
    getConvertedTable(jsonReport) {
        const headers = this._getHeaders(jsonReport);
        const rows = this._getRows(jsonReport, headers);
        return {
            id: jsonReport.id,
            name: jsonReport.name,
            headers: headers,
            rows: rows,
        };
    }

    _getHeaders(jsonReport) {
        const headers = [];
        const attributes = jsonReport.result.definition.attributes;
        const metrics = jsonReport.result.definition.metrics;
        attributes.forEach((attribute) => {
            if (attribute.forms.length === 1) {
                headers.push(attribute.name);
            } else {
                attribute.forms.forEach((form) =>
                    headers.push(`${attribute.name} ${form.name}`));
            }
        });
        metrics.forEach((metric) => headers.push(metric.name));
        return headers;
    }

    _parseTreeToArray(node, headers, level = -1) {
        level++;
        let rows = [];
        if (node.children === undefined) {
            const row = this._parseLastAttributeAndMetrics(node, headers.slice(level));
            rows.push(row);
        } else {
            node.children.forEach((child) => {
                let childRows = this._parseTreeToArray(child, headers, level);
                childRows = childRows.map((childRow) => {
                    const formValues = node.element.formValues;
                    for (const key in formValues) {
                        if (formValues.hasOwnProperty(key)) {
                            childRow[headers[level]] = formValues[key];
                            level++;
                        }
                    };
                    level--;
                    return childRow;
                });
                rows = rows.concat(childRows);
            });
        }
        return rows;
    }

    _parseLastAttributeAndMetrics(node, headers) {
        const row = {};
        // Parsing last attribute
        const formValues = node.element.formValues;
        let level = 0;
        for (const key in formValues) {
            if (formValues.hasOwnProperty(key)) {
                row[headers[level]] = formValues[key];
                level++;
            }
        };

        const metrics = node.metrics;
        for (const property in metrics) {
            if (metrics.hasOwnProperty(property)) {
                row[property] = metrics[property].rv;
            }
        }
        return row;
    }

    _getRows(jsonReport, headers) {
        let rows = [];
        const data = jsonReport.result.data.root.children;
        data.forEach((rootNode) => {
            rows = rows.concat(this._parseTreeToArray(rootNode, headers));
        });
        return rows;
    }
}

export const officeConverterService = new OfficeConverterService();
