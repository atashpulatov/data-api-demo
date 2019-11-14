import React from 'react';
import { mount } from 'enzyme';
import { Placeholder } from '../../home/placeholder';
import { sessionHelper } from '../../storage/session-helper';
import { popupController } from '../../popup/popup-controller';
import { officeApiHelper } from '../../office/office-api-helper';


jest.mock('../../storage/session-helper');

describe('Placeholder', () => {
  it('should render and element', () => {
    // given
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    sessionHelperSpy.mockClear();

    // when
    const wrappedComponent = mount(<Placeholder />);

    // then
    expect(wrappedComponent).toBeDefined();
    expect(sessionHelperSpy).toHaveBeenCalled();
  });
  it('should open popup on button click', async () => {
    // given
    const sessionHelperSpy = jest.spyOn(sessionHelper, 'disableLoading');
    sessionHelperSpy.mockClear();
    const mockIsCurrentSheetProtected = jest.spyOn(officeApiHelper, 'isCurrentReportSheetProtected').mockImplementation(() => (false));
    const clickSpy = jest.spyOn(popupController, 'runPopupNavigation');
    const wrappedComponent = mount(<Placeholder />);
    const wrappedButton = wrappedComponent.find('button');

    // when
    wrappedButton.simulate('click');
    // then
    expect(wrappedButton).toBeDefined();
    await expect(mockIsCurrentSheetProtected).toBeCalled();
    await expect(clickSpy).toHaveBeenCalled();
  });
});
