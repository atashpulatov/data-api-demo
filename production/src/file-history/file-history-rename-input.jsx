import React from 'react';
import {
  Input, Dropdown, Menu, Popover,
} from 'antd';
import {withTranslation} from 'react-i18next';
import {officeStoreService} from '../office/store/office-store-service';

export class _RenameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      value: props.fileName,
    };
  }

  getNameContainer(editable, bindingId, fileName, value) {
    if (editable) {
      return (
        <Input
          type="text"
          className="rename-input"
          maxLength={255}
          id={`input-${bindingId}`}
          defaultValue={fileName}
          value={value}
          onChange={this.handleChange}
          onBlur={this.renameReport}
          onPressEnter={this.renameReport}
        />
      );
    }
    return <div className="rename-container" id={`rename-container-${bindingId}`}>{value}</div>;
  }

  renameReport = /* istanbul ignore next */ ({target}) => {
    const {bindingId, fileName} = this.props;
    const newName = target.value || fileName;
    this.setState({value: newName});
    this.setEditable(false);
    if (newName && bindingId) officeStoreService.preserveReportValue(bindingId, 'name', newName);
  };

  selectTextAsync = (id) => {
    // TODO: Timeout hardcoded value, without it cannot select text of the input
    setTimeout(() => {
      /* istanbul ignore next */
      document.getElementById(id).select();
    }, 100);
  };

  handleChange = (e) => {
    this.setState({value: e.target.value});
  }

  setEditable = (editable) => {
    this.setState({editable});
  }

  enableEdit = (e) => {
    if (e.domEvent) e.domEvent.stopPropagation();
    const {bindingId} = this.props;
    this.selectTextAsync(`input-${bindingId}`);
    this.setEditable(true);
  }


  copyValue = /* istanbul ignore next */ (e) => {
    const {value} = this.state;
    e.domEvent.stopPropagation();
    const text = document.createElement('textarea');
    text.value = value;
    document.body.appendChild(text);
    text.select();
    document.execCommand('copy');
    document.body.removeChild(text);
  }

  render() {
    const {editable, value} = this.state;
    const {
      fileName, bindingId, t, isPrompted, buttonsFunctions,
    } = this.props;
    const nameContainer = this.getNameContainer(editable, bindingId, fileName, value);
    const menu = (
      <Menu>
        {isPrompted && <Menu.Item key="reprompt" onClick={(e) => {e.domEvent.stopPropagation(); buttonsFunctions.reprompt();}}>{t('Reprompt')}</Menu.Item>}
        <Menu.Item key="edit" onClick={(e) => {e.domEvent.stopPropagation(); buttonsFunctions.edit();}}>{t('Edit')}</Menu.Item>
        <Menu.Item key="refresh" onClick={(e) => {e.domEvent.stopPropagation(); buttonsFunctions.refresh();}}>{t('Refresh')}</Menu.Item>
        <Menu.Item key="remove" onClick={(e) => {e.domEvent.stopPropagation(); buttonsFunctions.delete();}}>{t('Remove')}</Menu.Item>
        <Menu.Item key="rename" onClick={this.enableEdit}>{t('Rename')}</Menu.Item>
        <Menu.Item key="copy" onClick={this.copyValue}>{t('Copy')}</Menu.Item>
      </Menu>
    );
    return (
      <Popover overlayClassName={`${editable ? 'hidden' : ''}`} placement="bottomLeft" content={value} mouseEnterDelay={1}>
        <Dropdown overlay={menu} trigger={['contextMenu']}>
          <div onDoubleClick={this.enableEdit} style={{position: 'relative'}}>
            {nameContainer}
          </div>
        </Dropdown>
      </Popover>
    );
  }
}
_RenameInput.defaultProps = {
  t: (text) => text,
};

export default withTranslation('common')(_RenameInput);
