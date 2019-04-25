import React from 'react';
import {Input} from 'antd';
import {officeStoreService} from '../office/store/office-store-service';


export default class RenameInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      value: props.fileName,
    };
  }

  renameReport = ({target}) => {
    const {bindingId, fileName} = this.props;
    const newName = target.value || fileName;
    this.setState({value: newName});
    this.setEditable(false);
    if (newName && bindingId) officeStoreService.renameReport(bindingId, newName);
  };

  selectTextAsync = (id) => {
    // TODO: Timeout hardcoded value, without it cannot select text of the input
    if (!this.state.editable) {
      setTimeout(() => {
        document.getElementById(id).select();
      }, 100);
    }
  };

  handleChange = (e) => {
    this.setState({value: e.target.value});
  }

  setEditable = (editable) => {
    this.setState({editable});
  }

  render() {
    const {editable, value} = this.state;
    const {fileName, bindingId} = this.props;
    return (
      <div onDoubleClick={() => {
        this.selectTextAsync(`input-${bindingId}`);
        this.setEditable(!editable);
      }}>
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
    );
  }
}
