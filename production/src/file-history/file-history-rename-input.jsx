import React from 'react';
import {Input, Dropdown, Menu} from 'antd';
import {officeStoreService} from '../office/store/office-store-service';


export default class RenameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      value: props.fileName,
    };
  }

  renameReport = /* istanbul ignore next */ ({target}) => {
    const {bindingId, fileName} = this.props;
    const newName = target.value || fileName;
    this.setState({value: newName});
    this.setEditable(false);
    if (newName && bindingId) officeStoreService.renameReport(bindingId, newName);
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
    e.domEvent && e.domEvent.stopPropagation();
    this.selectTextAsync(`input-${this.props.bindingId}`);
    this.setEditable(true);
  }

  copyValue = /* istanbul ignore next */ (e) => {
    e.domEvent.stopPropagation();
    const text = document.createElement('textarea');
    text.value = this.state.value;
    document.body.appendChild(text);
    text.select();
    document.execCommand('copy');
    document.body.removeChild(text);
  }

  render() {
    const {editable, value} = this.state;
    const {fileName, bindingId} = this.props;
    const menu = (
      <Menu>
        <Menu.Item key="copy" onClick={this.copyValue}>Copy</Menu.Item>
        <Menu.Item key="rename" onClick={this.enableEdit}>Rename</Menu.Item>
      </Menu>);
    return (
      <Dropdown overlay={menu} trigger={['contextMenu']}>
        <div onDoubleClick={this.enableEdit}>
          <Input type='text'
            className='rename-input'
            maxLength={255}
            id={`input-${bindingId}`}
            defaultValue={fileName}
            value={value}
            disabled={!editable}
            onChange={this.handleChange}
            onBlur={this.renameReport}
            onPressEnter={this.renameReport} />
        </div >
      </Dropdown>
    );
  }
}
