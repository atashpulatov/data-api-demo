import React, {Component} from 'react';
import {Spin, Tree, Input, Icon, Col} from 'antd';
import MSTRIcon from './MSTRIcon';
import setValueByPath from '../utilities/set-value';

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const loadingIndicator = <Icon type='loading' />;

/**
 * setPathIndex
 * Creates a string with the path to each node in the tree.
 * @param {array} array
 * @param {array} parentPath
 * @return {array} An array where each node has a path
 * @example
 * Object.parent[0].children[1] => 'parent.0.children.1'
 */
const setPathIndex = (array, parentPath) => array.map((node, index) => {
    if (node.type === 3 || node.emptyFolder) {
        node.isLeaf = true;
    } else {
        node.isLeaf = false;
    }
    return {...node, path: parentPath + index.toString()};
});


class FolderTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searching: false,
            searchTree: [],
        };
    }

    componentDidMount() {
        if (!this.props.api.envUrl) return;
        this.props.api.getProjects().then((mstrTree) => {
            if (mstrTree) {
                mstrTree = setPathIndex(mstrTree, '');
                this.setState({...this.state, mstrTree});
            } else {
                this.props.api.envUrl = null;
            }
        });
    }

    componentWillReceiveProps(props) {
        if (props.url && props.url !== null && props.url !== this.props.url) {
            this.setState({searchName: ''});
            this.props.api.getProjects().then((mstrTree) => {
                if (mstrTree) {
                    mstrTree = setPathIndex(mstrTree, '');
                }
                this.setState({searching: false, mstrTree, searchTree: []});
            });
        }
    }

    onSearch = (name) => {
        if (!name || name === this.state.searchName) {
            return;
        }
        this.setState({searching: true, searchTree: [], searchName: name});
        const projects = this.props.api.projects;
        const promises = projects.map((projectId) => {
            this.props.api.projectId = projectId;
            return this.props.api.searchDataset(name)
                .then((response) => {
                    return this.updateSearchTree(response, projectId);
                }).catch((error) => {
                    console.log(error);
                });
        });
        Promise.all(promises).then((results) => {
            const isEmpty = results.reduce((accumulator, current) => accumulator || current);
            if (!isEmpty) {
                this.setState({
                    searchTree:
                        [{
                            name: 'No datasets found',
                            key: Date.now(),
                            id: Date.now(),
                            emptyFolder: true,
                            isLeaf: true,
                            projectId: 'noresultsid',
                        }],
                });
            }
        });
    }

    updateSearchTree = (response, projectId) => {
        const {result, totalItems} = response;
        if (!response || totalItems === 0) {
            return false;
        }
        const results = result.map((result) => {
            const {id, name, type, subtype} = result;
            return {
                id,
                name,
                type,
                subtype,
                key: projectId + id,
                isLeaf: true,
                projectId: projectId,
            };
        });
        this.setState({searchTree: [...this.state.searchTree, ...results]});
        return true;
    }

    onSearchChange = (e) => {
        if (!e.target.value) {
            this.setState({searching: false, searchName: ''});
        }
    }

    onLoadData = (treeNode) => {
        const mstrObject = treeNode.props.dataRef;

        if (mstrObject.children) {
            return Promise.resolve();
        }

        // Projects don't have subtype
        if (!mstrObject.subtype) {
            return this.loadRootFolders(mstrObject);
        }

        if (mstrObject.personalObjects) {
            return this.loadMyPersonalObjects(mstrObject);
        }

        // Folders
        if (mstrObject.type === 8) {
            return this.loadFolderContent(mstrObject);
        }
    }

    loadRootFolders(mstrObject) {
        const id = mstrObject.id;
        this.props.api.projectId = id;
        const path = mstrObject.path;
        const personalObjectsNode = {
            id: id,
            key: 'PO' + id,
            personalObjects: true,
            name: 'My Personal Objects',
            type: 8,
            subtype: 2048,
        };
        return this.props.api.getRootFolders()
            .then((treeNodes) => {
                if (!treeNodes) return;
                treeNodes.push(personalObjectsNode);
                return this.createTreeNodes(treeNodes, path);
            });
    }

    loadMyPersonalObjects(mstrObject) {
        const id = mstrObject.id;
        const path = mstrObject.path;
        this.props.api.projectId = this.getProjectId(mstrObject.path);
        return this.props.api.getMyPersonalObjects(id)
            .then((treeNodes) => {
                if (!treeNodes || treeNodes.length === 0) {
                    treeNodes = [{
                        name: 'No datasets',
                        key: Date.now(),
                        id: Date.now(),
                        emptyFolder: true,
                        isLeaf: true,
                    }];
                }
                return this.createTreeNodes(treeNodes, path);
            });
    }

    loadFolderContent(mstrObject) {
        const id = mstrObject.id;
        const path = mstrObject.path;
        this.props.api.projectId = this.getProjectId(mstrObject.path);
        return this.props.api.getFolderContent(id)
            .then((treeNodes) => {
                if (!treeNodes || treeNodes.length === 0) {
                    treeNodes = [{
                        name: 'No datasets',
                        id: Date.now(),
                        key: Date.now(),
                        emptyFolder: true,
                        isLeaf: true,
                    }];
                }
                return this.createTreeNodes(treeNodes, path);
            });
    }

    createTreeNodes(treeNodes, path) {
        const newMstrTree = this.state.mstrTree;
        const updatePath = path + '.children';

        treeNodes = setPathIndex(treeNodes, updatePath + '.');
        setValueByPath(newMstrTree, updatePath, treeNodes);

        this.setState({...this.state, mstrTree: newMstrTree});
    }

    getProjectId(path) {
        const index = Number(path.split('.')[0]);
        return this.state.mstrTree[index].id;
    }

    renderTreeNodes(treeNodes) {
        if (!treeNodes) {
            return;
        }

        return treeNodes.map((node) => {
            const key = this.props.api.token + node.key;
            const icon = (({expanded, isLeaf}) => {
                if (node.emptyFolder) {
                    return (<Icon type='info-circle-o' />);
                } else if (!node.subtype) {
                    return (<MSTRIcon type={expanded ? 'project-expanded' : 'project-collapsed'} />);
                } else if (node.type === 8) {
                    return (<MSTRIcon type={expanded ? 'folder-expanded' : 'folder-collapsed'} />);
                } else if (isLeaf) {
                    return (<MSTRIcon type={node.subtype === 779 || node.subtype === 776 ? 'cube' : 'report'} />);
                } else {
                    return (<Icon type={'folder'} />);
                }
            });

            if (node.children) {
                return (
                    < TreeNode
                        title={node.name}
                        key={key}
                        id={node.id}
                        selectable={!!node.isLeaf}
                        icon={icon}
                        dataRef={node}
                        isLeaf={!!node.isLeaf}
                        disabled={node.emptyFolder}>
                        {this.renderTreeNodes(node.children)}
                    </TreeNode >
                );
            }
            return (< TreeNode
                title={node.name}
                id={node.id}
                key={key}
                selectable={!!node.isLeaf}
                icon={icon}
                dataRef={node}
                isLeaf={node.isLeaf}
                disabled={node.emptyFolder}
                projectId={node.projectId || this.getProjectId(node.path)}
                typeId={node.type}
                subtypeId={node.subtype}>
            </TreeNode >
            );
        });
    }

    render() {
        let tree;
        if (this.state.searching) {
            tree = (<Spin indicator={loadingIndicator} wrapperClassName='loading-indicator-tree' spinning={this.state.searchTree.length === 0}>
                <Tree
                    showIcon
                    onSelect={this.props.onSelect}>
                    {this.renderTreeNodes(this.state.searchTree)}
                </Tree>
            </Spin>);
        } else {
            tree = (<Spin indicator={loadingIndicator} wrapperClassName='loading-indicator-tree' spinning={!this.state.mstrTree || this.state.mstrTree.length === 0}>
                <DirectoryTree
                    showIcon
                    loadData={this.onLoadData}
                    onSelect={this.props.onSelect}>
                    {this.renderTreeNodes(this.state.mstrTree)}
                </DirectoryTree>
            </Spin>);
        }
        return (
            <div>
                <Col span={12}>
                    <div style={{lineHeight: '24px', fontWeight: 'bold', padding: '8px 0'}}>Select a Dataset</div>
                </Col>
                <Col span={12}>
                    <Search key={this.props.url} style={{padding: '8px 0'}} placeholder='Search...' onSearch={this.onSearch} onChange={this.onSearchChange} size='small' />
                </Col>
                <Col span={24} className='folder-tree-container'>
                    {tree}
                </Col>
            </div>
        );
    }
}

export default FolderTree;
