import PropTypes from 'prop-types';

class OverflowHelperNotConnected {
  isOverflown = (text, containerWidth) => {
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
      return true;
    }
  }
}

OverflowHelperNotConnected.propTypes = {
  name: PropTypes.string,
  t: PropTypes.func,
};

const overflowHelper = new OverflowHelperNotConnected();

export default overflowHelper;
