import { waitAndClick } from './click-helper';
import { switchToExcelFrame } from './iframe-helper';

export function getTextOfNthObjectOnNameBoxList(number) {
  switchToExcelFrame();
  waitAndClick($('#m_excelWebRenderer_ewaCtl_NameBox-Medium > a'), 4000);
  return $(`[id^=WacAirSpace] > div > div > div > ul > li:nth-child(${number}) > a > span`).getText();
}
