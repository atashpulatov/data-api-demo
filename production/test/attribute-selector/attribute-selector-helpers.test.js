import {officeContext} from '../../src/office/office-context';
import {attributeSelectorHelpers} from '../../src/attribute-selector/attribute-selector-helpers';

jest.mock('../../src/office/office-context');

describe('AttributeSelectorHelpers', () => {
  it('should call for office messageParent if officeMessageParent', () => {
    // given
    const messageParentMock = jest.fn();
    const getOfficeSpy = jest.spyOn(officeContext, 'getOffice').mockImplementation(() => ({
      context: {
        ui: {
          messageParent: messageParentMock,
        },
      },
    }));

    // when
    attributeSelectorHelpers.officeMessageParent('simple_command');

    // then
    expect(getOfficeSpy).toHaveBeenCalled();
    expect(messageParentMock).toHaveBeenCalledWith(JSON.stringify({command: 'simple_command'}));
  });
});
