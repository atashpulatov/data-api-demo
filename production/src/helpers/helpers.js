class Helper {
  isOverflown = (userName, containerWidth) => {
    const measureReportName = document.createElement('SPAN');
    measureReportName.innerHTML = userName;
    measureReportName.setAttribute('id', 'measure-text');
    document.body.appendChild(measureReportName);
    // we compare report name length with all popup width - 90px of paddings and icon container
    const result = document.getElementById('measure-text').scrollWidth > containerWidth;
    measureReportName.remove();
    return result;
  }
}

export const helper = new Helper();
