import React from 'react';
import { Input, Popover } from 'antd';
import { withTranslation } from 'react-i18next';

export class _RenameInput extends React.Component {
  getNameContainer(editable, bindingId, fileName, value) {
    const { handleChange, renameReport } = this.props;
    if (editable) {
      return (
        <Input
          type="text"
          className="rename-input"
          maxLength={255}
          id={`input-${bindingId}`}
          defaultValue={fileName}
          onBlur={renameReport}
          onPressEnter={renameReport}
        />
      );
    }
    return <div className="rename-container" id={`rename-container-${bindingId}`}>{value}</div>;
  }


  render() {
    const { editable, value, fileName, bindingId, enableEdit } = this.props;
    const nameContainer = this.getNameContainer(editable, bindingId, fileName, value);
    return (
      <Popover overlayClassName={`${editable ? 'hidden' : ''}`} placement="bottomLeft" content={value} mouseEnterDelay={1}>
        <div className="object-name" onDoubleClick={enableEdit} style={{ position: 'relative' }}>
          {nameContainer}
        </div>
      </Popover>
    );
  }
}
_RenameInput.defaultProps = {
  t: (text) => text,
};

export default withTranslation('common')(_RenameInput);
