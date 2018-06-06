import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

const RadioButton = (radioButtonProps) => (
    <div className='radioButton'>
        <label>
            <input type='radio' value={radioButtonProps.radioButton.name}
                checked={radioButtonProps.selectedOption === radioButtonProps.radioButton.name}
                onChange={radioButtonProps.radioButton.handleOptionChange} />
            {radioButtonProps.radioButton.name}
      </label>
    </div>
);

export default RadioButton;
