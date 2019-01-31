import React from 'react';
import image from '../ynodata.jpeg';
import { sessionHelper } from '../storage/session-helper';

export const Placeholder = () => {
    sessionHelper.disableLoading(); 
    console.log('in arrow');
    return (
        <div>
            <img width='350px' src={image} />
        </div>
    );
};
