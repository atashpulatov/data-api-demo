import React from 'react';
import { shallow } from 'enzyme';
import { PopupButtons } from "../../src/popup-buttons";

describe('PopupButtons', () => {
    it('should NOT display prepare data when secondary action NOT provided',
        () => {
            // given
            const secondaryAction = jest.fn();
            // when
            const buttonsWrapped = shallow(<PopupButtons />);
            // then
            expect(buttonsWrapped.exists('#prepare')).not.toBeTruthy();
        })

    it('should display prepare data when secondary action provided', () => {
        // given
        const secondaryAction = jest.fn();
        // when
        const buttonsWrapped = shallow(<PopupButtons
            handleSecondary={secondaryAction} />);
        // then
        expect(buttonsWrapped.exists('#prepare')).toBeTruthy();
    })

    it('should call secondary action when prepare data clicked', () => {
        // given
        const secondaryAction = jest.fn();
        const buttonsWrapped = shallow(<PopupButtons
            handleSecondary={secondaryAction} />);
        const secondaryButton = buttonsWrapped.find('#prepare');
        // when
        secondaryButton.simulate('click');
        // then
        expect(secondaryAction).toBeCalled();
    })
});