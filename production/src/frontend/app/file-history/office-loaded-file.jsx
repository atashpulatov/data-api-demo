import React from 'react';

export const OfficeLoadedFile = ({ name, bindingId, onClick }) => (
    <div
        className='cursor-is-pointer'
        onClick={() => onClick(bindingId)}>
        {name}
    </div>
);
