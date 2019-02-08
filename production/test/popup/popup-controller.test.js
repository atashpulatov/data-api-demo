import React from 'react';
import { shallow } from 'enzyme';
import { selectorProperties } from '../../src/attribute-selector/selector-properties';
import { popupController } from '../../src/popup-controller';

describe('PopupButtons', () => {
    const dialog = {};

    beforeAll(() => {
        dialog.close = jest.fn();
    });

    it('should close popup and call another when secondary action provided',
        () => {
            // given
            const actionObject = {
                command: selectorProperties.commandSecondary,
                chosenObject: 'objectId',
                chosenProject: 'projectId',
            };
            const arg = {
                message = JSON.stringify(actionObject),
            }
            // when
            popupController.onMessageFromPopup(dialog, message);
            // then
            expect(true).toBe(false);
        })
});