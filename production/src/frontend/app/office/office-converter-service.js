class OfficeConverterService {
    getConvertedTable(jsonReport) {
        let headers = this._getHeaders(jsonReport);
        let rows = this._getRows(jsonReport);
        let id = jsonReport.id;
        let name = jsonReport.name;
        console.log(name);
        return {
            headers: headers,
            rows: rows,
            id: id,
            name: name,
        };
    }

    _getHeaders(jsonReport) {
        let headers = [];
        let attributes = jsonReport.result.definition.attributes;
        let metrics = jsonReport.result.definition.metrics;
        attributes.forEach((attribute) => headers.push(attribute.name));
        metrics.forEach((metric) => headers.push(metric.name));
        return headers;
    }

    _parseTreeToArray(node, headers, level = -1) {
        level++;
        let rows = [];
        if (node.children === undefined) {
            let row = this._parseMetrics(node, headers[level]);
            rows.push(row);
        } else {
            node.children.forEach((child) => {
                let childRows = this._parseTreeToArray(child, headers, level);
                childRows = childRows.map((childRow) => {
                    childRow[headers[level]] = node.element.name;
                    return childRow;
                });
                rows = rows.concat(childRows);
            });
        }
        return rows;
    }

    _parseMetrics(node, header) {
        let row = {};
        // Parsing last attribute
        row[header] = node.element.name;
        let metrics = node.metrics;
        for (let property in metrics) {
            if (metrics.hasOwnProperty(property)) {
                row[property] = metrics[property].rv;
            }
        }
        return row;
    }

    _getRows(jsonReport) {
        let rows = [];
        const headers = this._getHeaders(jsonReport);

        let data = jsonReport.result.data.root.children;
        data.forEach((rootNode) => {
            rows = rows.concat(this._parseTreeToArray(rootNode, headers));
        });
        return rows;
    }
}

export const officeConverterService = new OfficeConverterService();
