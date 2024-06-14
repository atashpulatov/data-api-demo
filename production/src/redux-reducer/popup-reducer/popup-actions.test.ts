import { popupActions } from './popup-actions';

describe('Popup Actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch proper resetState action', () => {
    // given

    // when
    popupActions.resetState();
    // then
    // expect(listener).toHaveBeenCalledWith({ type: PopupActionTypes.RESET_STATE });
  });

  it('should set proper popupType when switch to edit requested', () => {
    // given
    const reportInstance = 'instanceId';
    const chosenObjectData = 'chosenObjectData';
    // when
    popupActions.preparePromptedReport(reportInstance, chosenObjectData);
    // then
  });
});
