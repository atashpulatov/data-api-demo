import { officeActions } from '../../redux-reducer/office-reducer/office-actions';
import { officeProperties } from '../../redux-reducer/office-reducer/office-properties';
import officeStoreHelper from '../../office/store/office-store-helper';

describe('Office Actions', () => {
    it('should dispatch proper toggleStoreSecuredFlag action', () => {
        // given
        jest.spyOn(officeStoreHelper, 'setFileSecuredFlag').mockImplementation();
        const listener = jest.fn();

        // when
        officeActions.toggleSecuredFlag(true)(listener);

        // then
        expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.toggleSecuredFlag, isSecured: true });

        expect(officeStoreHelper.setFileSecuredFlag).toBeCalledTimes(1);
        expect(officeStoreHelper.setFileSecuredFlag).toBeCalledWith(true);
    });

    it('should dispatch proper toggleIsSettingsFlag action', () => {
        // given
        const listener = jest.fn();

        // when
        officeActions.toggleIsSettingsFlag(true)(listener);

        // then
        expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.toggleIsSettingsFlag, isSettings: true });
    });

    it('should dispatch proper toggleIsConfirmFlag action', () => {
        // given
        const listener = jest.fn();

        // when
        officeActions.toggleIsConfirmFlag(true)(listener);

        // then
        expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.toggleIsConfirmFlag, isConfirm: true });
    });

    it('should dispatch proper toggleSettingsPanelLoadedFlag action', () => {
        // given
        const listener = jest.fn();

        // when
        officeActions.toggleSettingsPanelLoadedFlag(true)(listener);

        // then
        expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.toggleSettingsPanelLoadedFlag, settingsPanelLoded: true });
    });

    it('should dispatch proper toggleReusePromptAnswersFlag action', () => {
        // given
        const listener = jest.fn();

        // when
        officeActions.toggleReusePromptAnswersFlag(false)(listener);

        // then
        expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.toggleReusePromptAnswersFlag, reusePromptAnswers: false });
    });

    it('should dispatch proper toggleRenderSettingsFlag action', () => {
        // given
        const listener = jest.fn();

        // when
        officeActions.toggleRenderSettingsFlag()(listener);

        // then
        expect(listener).toHaveBeenCalledWith({ type: officeProperties.actions.toggleRenderSettingsFlag });
    });

    it('should dispatch proper toggleIsClearDataFailedFlag action', () => {
        // given
        jest.spyOn(officeStoreHelper, 'setIsClearDataFailed').mockImplementation();
        const listener = jest.fn();

        // when
        officeActions.toggleIsClearDataFailedFlag(true)(listener);

        // then
        expect(listener).toHaveBeenCalledWith(
            {
                type: officeProperties.actions.toggleIsClearDataFailedFlag,
                isClearDataFailed: true
            }
        );

        expect(officeStoreHelper.setIsClearDataFailed).toBeCalledTimes(1);
        expect(officeStoreHelper.setIsClearDataFailed).toBeCalledWith(true);
    });
});
