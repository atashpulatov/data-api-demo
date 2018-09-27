import React, {Component} from 'react';
import {Icon, Col, Tree, Spin} from 'antd';
import Selector from './Selector';
import MSTRIcon from './MSTRIcon';

const TreeNode = Tree.TreeNode;

const loadingIndicator = <Icon type='loading' />;

class FilterSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterItems: [],
            selectedTreeKey: [],
            showSelected: false,
            selectedFilters: {},
            loadedData: [],
            loading: false,
            key: 0,
        };
    }

    onFilterChange = async (selectedKey, e) => {
        this.setState({selectedTreeKey: selectedKey});
        // on unselect filter
        if (selectedKey.length === 0) {
            this.setState({
                filterItems: [],
                selectedTreeKey: [],
            });
            return;
        }
        let id = this.props.items[selectedKey].id;
        // load items from REST Api
        if (!this.props.items[selectedKey].items) {
            this.setState({loading: true});
            this.props.items[selectedKey].items = await this.props.getAttributes(id);
        }
        // change filter elements
        this.setState({
            loading: false,
            filterItems: this.props.items[selectedKey].items,
            loadedData: this.state.selectedFilters[id] ? this.state.selectedFilters[id] : [],
            key: this.state.key + 1,
        });
    }

    renderItems = (filters) => {
        let elements = [];
        filters.forEach((filter) => {
            elements.push(
                <TreeNode
                    key={filter.index}
                    title={
                        <span>
                            <MSTRIcon type='filter' style={{marginRight: '5px'}} className='filter-icon' />
                            {filter.item.name}
                            <span style={{float: 'right', paddingRight: '15px', display: filter.checkedLength ? 'block' : 'none'}}> ({filter.checkedLength}/{filter.item.items ? filter.item.items.length : 0}) </span>
                        </ span>}
                    isLeaf
                    icon={<span><Icon type='check' className='filter-checkbox' style={{display: filter.checkedLength ? 'block' : 'none'}} /></span>}>
                </ TreeNode>
            );
        });
        return elements;
    }

    getItemsToRender = () => {
        let toRender = [];
        this.props.items.forEach((item, index) => {
            const checkedElements = this.state.selectedFilters[item.id];
            if (!this.shouldRender(checkedElements, item.name)) {
                return;
            }
            let checkedLength = (checkedElements && checkedElements.length) ? checkedElements.length : 0;
            toRender.push({item: item, index: index, checkedLength: checkedLength});
        });
        return toRender;
    }

    shouldRender = (checkedElements, name) => {
        const searchText = this.props.searchText;
        if ((this.props.showSelected && !checkedElements) || (searchText && !name.toLowerCase().includes(searchText.toLowerCase()))) {
            return false;
        } else {
            return true;
        }
    }

    onChangeElement = (selectedElements) => {
        let selectedFilters = this.state.selectedFilters;
        let id = this.props.items[this.state.selectedTreeKey].id;
        // update selected elements
        selectedFilters[id] = selectedElements;
        // remove attribute if nothing selected
        if (selectedElements.length === 0) {
            delete selectedFilters[id];
        }
        this.setState({selectedFilters: selectedFilters});
        this.props.onChange(selectedFilters);
    }

    render() {
        const filtersToRender = this.getItemsToRender();
        const treeSelector = filtersToRender.length > 0 ? (
            <Spin indicator={loadingIndicator} wrapperClassName='loading-indicator' spinning={this.props.loading}>
                <Tree
                    style={{width: '100%'}}
                    onSelect={this.onFilterChange}
                    showIcon={true}
                    selectedKeys={this.state.selectedTreeKey}
                >
                    {this.renderItems(filtersToRender)}
                </Tree>
            </Spin>
        ) : (<div class="ant-list-empty-text"> No data </div>);
        return (
            <div>
                <Col span={12}>
                    <div className='selector-title'>
                        {this.props.title} ({Object.keys(this.state.selectedFilters).length})
                    </div>
                    <div className='filter-list ant-list'>
                        {this.props.items.length > 0 ? treeSelector : <div />}
                    </div>
                </Col>
                <Col span={12}>
                    <Selector
                        key={this.state.key}
                        searchText={this.props.searchText}
                        showSelected={this.props.showSelected}
                        items={this.state.filterItems}
                        onChange={this.onChangeElement}
                        loading={this.state.loading}
                        loadedData={this.state.loadedData} />
                </Col>
            </div >
        );
    }
}

export default FilterSelector;
