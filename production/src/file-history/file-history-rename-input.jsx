import React, {useState} from 'react';
import {Input} from 'antd';
import {officeStoreService} from '../office/store/office-store-service';

const renameReport = (bindId, defaultName, target) => {
  const newName = target.value;
  if (newName) {
    officeStoreService.renameReport(bindId, newName);
  } else {
    return setValueAsync(target, defaultName);
  }
};

const setValueAsync = (target, defaultName) => new Promise((resolve) => {
  setTimeout(() => {
    target.value = defaultName;
    resolve(defaultName);
  }, 50);
});

const selectTextAsync = (id) => new Promise((resolve) => {
  setTimeout(() => {
    document.getElementById(id).select();
    resolve();
  }, 50);
});

const RenameInput = ({fileName, bindingId}) => {
  const [editable, setEditable] = useState(false);
  return (
    <div onDoubleClick={() => {
      if (!editable) selectTextAsync(`input-${fileName}`);
      setEditable(!editable);
    }}>
      <Input type="text"
        className='rename-input'
        id={`input-${fileName}`}
        defaultValue={fileName}
        disabled={!editable}
        onBlur={(e) => renameReport(bindingId, fileName, e.target) || setEditable(false)}
        onPressEnter={(e) => renameReport(bindingId, fileName, e.target) || setEditable(false)} />
    </div >
  );
};

export default RenameInput;
