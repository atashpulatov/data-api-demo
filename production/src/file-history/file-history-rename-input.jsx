import React, {useState} from 'react';
import {Input} from 'antd';
import {officeStoreService} from '../office/store/office-store-service';

const renameReport = (bindId, defaultName, target) => {
  const newName = target.value;
  newName ? officeStoreService.renameReport(bindId, newName) : setValueAsync(target, defaultName);
};

const setValueAsync = (target, defaultName) => {
  setTimeout(() => {
    target.value = defaultName;
  }, 100);
};

const selectTextAsync = (id) => {
  setTimeout(() => {
    document.getElementById(id).select();
  }, 100);
};

const RenameInput = ({fileName, bindingId}) => {
  const [editable, setEditable] = useState(false);
  return (
    <div onDoubleClick={() => {
      if (!editable) selectTextAsync(`input-${bindingId}`);
      setEditable(!editable);
    }}>
      <Input type='text'
        className='rename-input'
        maxLength={255}
        id={`input-${bindingId}`}
        defaultValue={fileName}
        disabled={!editable}
        onBlur={(e) => renameReport(bindingId, fileName, e.target) || setEditable(false)}
        onPressEnter={(e) => renameReport(bindingId, fileName, e.target) || setEditable(false)} />
    </div >
  );
};

export default RenameInput;
