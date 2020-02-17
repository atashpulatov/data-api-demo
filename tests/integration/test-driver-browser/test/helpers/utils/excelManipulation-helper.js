import { waitAndClick } from './click-helper';
import { switchToExcelFrame } from './iframe-helper';
import { excelSelectors } from '../../constants/selectors/office-selectors';

export function getTextOfNthObjectOnNameBoxList(number) {
  switchToExcelFrame();
  waitAndClick($(excelSelectors.nameBoxDropdownButton), 4000);
  return $(`${excelSelectors.nameBoxListContent} > li:nth-child(${number}) > a > span`).getText();
}
