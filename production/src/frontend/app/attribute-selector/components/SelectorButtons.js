import React, { Component } from 'react';
import { Button } from 'antd';


class SelectorButtons extends Component {
    render() {
        return (
            <div style={{ float: 'right', display: 'inline-block' }}>
                <Button
                    className='selector-button'
                    onClick={this.props.onSelectAll} >
                    Select All
                </Button>
                <Button
                    className='selector-button'
                    onClick={this.props.onUnselectAll}>
                    Unselect All
                </Button>
            </div>
        );
    }
}

export default SelectorButtons;
