import React from 'react';
import PropTypes from 'prop-types';
import { Input, Popover } from 'antd';
import { withTranslation } from 'react-i18next';

export class RenameInputNotConnected extends React.Component {
  getNameContainer(editable, bindId, fileName, value) {
    const { renameObject } = this.props;
    if (editable) {
      return (
        <Input
          type="text"
          className="rename-input"
          maxLength={255}
          id={`input-${bindId}`}
          defaultValue={fileName}
          onBlur={renameObject}
          onPressEnter={renameObject}
        />
      );
    }
    return <div className="rename-container" id={`rename-container-${bindId}`}>{value}</div>;
  }

  render() {
    const {
      editable, value, fileName, bindId, enableEdit
    } = this.props;
    const nameContainer = this.getNameContainer(editable, bindId, fileName, value);
    return (
      <Popover overlayClassName={`${editable ? 'hidden' : 'rename-popover-width'}`} placement="bottomLeft" content={value} mouseEnterDelay={1}>
        <div className="object-name" onDoubleClick={enableEdit} style={{ position: 'relative' }}>
          {nameContainer}
        </div>
      </Popover>
    );
  }
}
RenameInputNotConnected.propTypes = {
  editable: PropTypes.bool,
  value: PropTypes.string,
  fileName: PropTypes.string,
  bindId: PropTypes.string,
  enableEdit: PropTypes.func,
  renameObject: PropTypes.func,
};

export default withTranslation('common')(RenameInputNotConnected);
