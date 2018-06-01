import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import RadioButton from './radio-button.jsx'; // eslint-disable-line no-unused-vars

const RadioSelectionForm = (props) => (
    <div>
        <h3>Insert report</h3>
        {props.reportList.map((radioButton) => (
            <RadioButton key={radioButton.id}
                radioButton={radioButton}
                selectedOption={props.selectedOption} />
        ))}
        <button onClick={props.onImportReport}>Insert Report</button>
    </div>
);

export default RadioSelectionForm;
