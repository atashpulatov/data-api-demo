class OfficeConverterService {
  createTable(jsonReport) {
    const headers = this._getHeaders(jsonReport);
    return {
      id: jsonReport.id,
      name: jsonReport.name,
      headers,
      rows: this._getRows(jsonReport, headers),
      columnInformation: this._getcolumnInformation(jsonReport),
    };
  }

  appendRows(table, jsonReport) {
    const newRows = this._getRows(jsonReport, table.headers);
    table.rows.push(...newRows);
    return table;
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

  _parseTreeToArray(node, headers, level = 0) {
    let rows = [];
    if (node.children === undefined) {
      const row = this._parseLastAttributeAndMetrics(node, headers.slice(level));
      rows.push(row);
    } else {
      node.children.forEach((child) => {
        const formValues = node.element.formValues;
        let attributeFormsCount = 0;
        for (const key in formValues) {
          if (formValues.hasOwnProperty(key)) {
            attributeFormsCount++;
          }
        };
        let childRows = this._parseTreeToArray(child, headers,
            level + attributeFormsCount);
        childRows = childRows.map((childRow) => {
          for (const key in formValues) {
            if (formValues.hasOwnProperty(key)) {
              childRow[headers[level]] = formValues[key];
              level++;
            }
          };
          level -= attributeFormsCount;
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
    let data = [];
    if (jsonReport.result.data.root) {
      data = (jsonReport.result.data.root.children) || [];
    }
    data.forEach((rootNode) => {
      rows = rows.concat(this._parseTreeToArray(rootNode, headers));
    });
    return rows;
  }

  _getcolumnInformation(jsonReport) {
    const columnInformation = [];
    let index = 0;

    const attributes = jsonReport.result.definition.attributes;
    attributes.map((attribute) => {
      attribute.forms.map((form) => columnInformation.push({
        isAttribute: true,
        index: index++,
        attributeId: attribute.id,
        formId: form.id,
        attributeName: attribute.name,
        formName: form.name,
      }));
    });

    const metrics = jsonReport.result.definition.metrics;
    metrics.map((metric, metricIndex) => {
      columnInformation.push({
        isAttribute: false,
        index: index++,
        mi: metricIndex,
        id: metric.id,
        name: metric.name,
        formatString: metric.numberFormatting.formatString,
        category: metric.numberFormatting.category,
      });
    });

    return columnInformation;
  }
}

export const officeConverterService = new OfficeConverterService();
