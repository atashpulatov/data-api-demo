import React, { Component } from 'react';
import { Checkbox, List, Icon } from 'antd';
import SelectorButtons from './SelectorButtons';
import MSTRIcon from './MSTRIcon';

const loadingIndicator = <Icon type='loading' />;
const loadingSettings = {
    indicator: loadingIndicator,
    wrapperClassName: 'loading-indicator',
};

class Selector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValues: [],
            shouldRestore: true,
        };

        if (this.props.title) {
            const isAttribute = this.props.title === 'Attributes';
            this.type = isAttribute ? 'attribute' : 'metric';
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.shouldRestore && props.loadedData && props.loadedData.length) {
            props.onChange(props.loadedData);
            return { shouldRestore: false, selectedValues: props.loadedData };
        }
        return null;
    }

    renderIcon = () => {
        return (<MSTRIcon type={this.type} />);
    }

    renderItem = (item) => {
        return (
            <List.Item>
                <Checkbox value={item.id}>{this.renderIcon()}{item.name}</Checkbox>
            </List.Item>
        );
    }

    onSelectAll = (e) => {
        const { items, showSelected, searchText } = this.props;
        const { selectedValues } = this.state;
        // Get only visible
        let filteredItems = this.filterItems(selectedValues, items, showSelected, searchText);
        // Get elements to add to selectedValues
        filteredItems = filteredItems.filter((item) => !selectedValues.includes(item.id));
        // Get only IDs
        filteredItems = filteredItems.map((item) => item.id);
        // Append to state
        const newSelectedValues = [...selectedValues, ...filteredItems];
        this.setState({ selectedValues: newSelectedValues });
        // Notify parent
        this.props.onChange(newSelectedValues);
    }

    onUnselectAll = (e) => {
        const { items, showSelected, searchText } = this.props;
        const { selectedValues } = this.state;
        // Get only visible
        let filteredItems = this.filterItems(selectedValues, items, showSelected, searchText);
        // Get only IDs
        filteredItems = filteredItems.map((item) => item.id);
        // Remove from selectedValues
        filteredItems = selectedValues.filter((item) => {
            return !filteredItems.includes(item);
        });
        // Set new state
        this.setState({ selectedValues: filteredItems });
        // Notify parent
        this.props.onChange(filteredItems);
    }

    onChange = (selection) => {
        this.props.onChange(selection);
        this.setState({ selectedValues: selection });
    }

    filterItems = (selectedValues, items, showSelected, searchText) => {
        let filteredItems = items;
        if (showSelected || searchText) {
            filteredItems = items.filter((item) => {
                const searchFilter = searchText ? item.name.toLowerCase().includes(searchText.toLowerCase()) : true;
                const selectedFilter = showSelected ? selectedValues.includes(item.id) : true;
                return searchFilter && selectedFilter;
            });
        }
        return filteredItems;
    }

    renderTitle = () => {
        if (this.props.title) {
            return <span> {this.props.title} ({this.state.selectedValues.length}) </span>;
        } else {
            return <div style={{ marginBottom: '5px', display: 'inline-block' }}> </div>;
        }
    }

    render() {
        const { items, loading, showSelected, searchText } = this.props;
        const checkboxGroup = ((items && items.length) || loading)
            ? (<Checkbox.Group style={{ width: '100%' }}
                onChange={this.onChange}
                value={this.state.selectedValues}
                defaultValue={this.props.loadedData}>
                <List size='small'
                    className='ant-list-selector'
                    loading={{ spinning: loading, ...loadingSettings }}
                    bordered
                    dataSource={this.filterItems(this.state.selectedValues, items, showSelected, searchText)}
                    renderItem={this.renderItem} />
            </Checkbox.Group>)
            : (<div className='empty-list'></div>);
        return (
            <div>
                <div className='selector-title'> {this.renderTitle()}
                    <SelectorButtons onSelectAll={this.onSelectAll} onUnselectAll={this.onUnselectAll} />
                </div>
                {checkboxGroup}
            </div>
        );
    }
}

export default Selector;
