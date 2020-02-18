/* eslint array-callback-return: "off" */

class OfficeConverterService {
  createTable(jsonReport) {
    const headers = this.getHeaders(jsonReport);
    return {
      id: jsonReport.id,
      name: jsonReport.name,
      headers,
      rows: this.getRows(jsonReport, headers),
      columnInformation: this.getColumnInformation(jsonReport),
    };
  }

  getHeaders = (jsonReport) => {
    const headers = [];
    const { attributes } = jsonReport.result.definition;
    const { metrics } = jsonReport.result.definition;
    attributes.forEach((attribute) => {
      if (attribute.forms.length === 1) {
        headers.push(attribute.name);
      } else {
        attribute.forms.forEach((form) => headers.push(`${attribute.name} ${form.name}`));
      }
    });
    metrics.forEach((metric) => headers.push(metric.name));
    return headers;
  }

  parseTreeToArray(node, headers, level = 0) {
    let rows = [];
    if (node.children === undefined) {
      const row = this.parseLastAttributeAndMetrics(node, headers.slice(level));
      rows.push(row);
    } else {
      node.children.forEach((child) => {
        const { formValues } = node.element;
        let attributeFormsCount = 0;
        for (const key in formValues) {
          /* istanbul ignore else */
          if (formValues.hasOwnProperty(key)) {
            attributeFormsCount++;
          }
        }
        let childRows = this.parseTreeToArray(child, headers,
          level + attributeFormsCount);
        childRows = childRows.map((childRow) => {
          for (const key in formValues) {
            /* istanbul ignore else */
            if (formValues.hasOwnProperty(key)) {
              childRow[headers[level]] = formValues[key];
              level++;
            }
          }
          level -= attributeFormsCount;
          return childRow;
        });
        rows = rows.concat(childRows);
      });
    }
    return rows;
  }

  parseLastAttributeAndMetrics = (node, headers) => {
    const row = {};
    // Parsing last attribute
    const { formValues } = node.element;
    let level = 0;
    for (const key in formValues) {
      /* istanbul ignore else */
      if (formValues.hasOwnProperty(key)) {
        row[headers[level]] = formValues[key];
        level++;
      }
    }

    const { metrics } = node;
    for (const property in metrics) {
      /* istanbul ignore else */
      if (metrics.hasOwnProperty(property)) {
        row[property] = metrics[property].rv;
      }
    }
    return row;
  }

  getRows(jsonReport, headers) {
    let rows = [];
    let data = [];
    if (jsonReport.result.data.root) {
      data = (jsonReport.result.data.root.children) || [];
    }
    data.forEach((rootNode) => {
      rows = rows.concat(this.parseTreeToArray(rootNode, headers));
    });
    return rows;
  }

  getColumnInformation = (jsonReport) => {
    const columnInformation = [];
    let index = 0;

    const { attributes } = jsonReport.result.definition;
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

    const { metrics } = jsonReport.result.definition;
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
