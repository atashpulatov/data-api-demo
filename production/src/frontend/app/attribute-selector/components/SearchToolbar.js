import React, {Component} from 'react';
import {Input, Switch, Tooltip} from 'antd';
import MSTRIcon from './MSTRIcon';

const Search = Input.Search;

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
                    <label className='switch-label' htmlFor='view-selected-switch'>View selected</label>
                    <Switch id='view-selected-switch' onChange={this.props.onSwitchChange} size='small' />
                </div>
            </ div>
        );
    }
}

export default SearchToolbar;
