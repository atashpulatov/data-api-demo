import React from 'react';
import image from '../ynodata.jpeg';
import { sessionHelper } from '../storage/session-helper';
import { Button } from 'antd';
import { MenuBar } from '../menu-bar/menu-bar';
import { popupController } from '../popup-controller';

export const Placeholder = () => {
    sessionHelper.disableLoading();
    console.log('in arrow');
    return (
        <div>
            <img width='350px' src={image} />
            <Button
                type='primary'
                onClick={popupController.runPopupNavigation}>
                Import data
            </Button>
        </div>
    );
};
