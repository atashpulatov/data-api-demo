/* eslint-disable */
import React, { Component } from 'react';
import { Input, Switch, Tooltip } from 'antd';
import MSTRIcon from './mstr-icon.jsx';

const Search = Input.Search;
/* eslint-enable */

class SearchToolbar extends Component {
    render() {
        return (
            <div className='search-toolbar'>
                <Tooltip title={this.props.selectedElementName}>
                    <div className='selected-element' id='selected-element-name'>
                        <MSTRIcon className='selected-element-icon' type={this.props.selectedElementIcon} />
                        <span> </span>
                        {this.props.selectedElementName}
                    </div>
                </Tooltip>
                <div className='search-container'>
                    <Search className='search-input' onChange={this.props.onSearchChange} placeholder='Search objects...' size='small' />
                    <div style={{ 'padding-top': '12px' }}>
                        <label className='switch-label' htmlFor='view-selected-switch'>View selected</label>
                        <Switch id='view-selected-switch' onChange={this.props.onSwitchChange} size='small' />
                    </div>
                </div>
            </ div>
        );
    }
}

export default SearchToolbar;
