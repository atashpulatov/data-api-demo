class Helper {
  isOverflown(text, containerWidth) {
    try {
      const measureReportName = document.createElement('SPAN');
      measureReportName.textContent = text;
      measureReportName.id = 'measure-text';
      document.body.appendChild(measureReportName);
      // we compare report name length with all popup width - 90px of paddings and icon container
      const result = measureReportName.scrollWidth > containerWidth;
      measureReportName.parentNode.removeChild(measureReportName);
      return result;
    } catch (error) {
      console.log(error);
      return true;
    }
  }
}

export const helper = new Helper();
