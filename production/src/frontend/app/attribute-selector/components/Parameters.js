import React, { Component } from 'react';
import { Row, Col, Modal, message } from 'antd';
import FolderTree from './FolderTree';
import Selector from './Selector';
import FilterSelector from './FilterSelector';
import SearchToolbar from './SearchToolbar';
import PreviewTable from './PreviewTable';
import MSTRCallback from '../utilities/MSTRCallback';
import { msrtFetch } from '../utilities/MSTRFetch';

const parameter = new MSTRCallback('parameter');

class Parameters extends Component {
    constructor(props) {
        super(props);
        const api = msrtFetch;
        api.apiInitializer(this.props.session);
        this.state = {
            showSelected: false,
            dataset: {
                attributes: [],
                metrics: [],
                filters: [],
            },
            showModal: false,
            selectedAttributes: [],
            selectedMetrics: [],
            selectedFilters: [],
            loadingNode: false,
            selectedElementsHeader: {
                name: '',
                icon: '',
            },
            loadedAttributes: [],
            loadedMetrics: [],
            loadedFilterElements: [],
            api,
        };
        this.loadParameterData(props);
    }

    loadParameterData = (props) => {
        if (parameter && parameter.data && parameter.data.connectionData.url === this.state.api.url) {
            const { projectId, datasetId, isReport, body } = parameter.data.connectionData;
            const { attributes, metrics } = body.requestedObjects;
            const selectedMetrics = metrics ? metrics.map((metric) => metric.id) : [];
            const selectedAttributes = attributes ? attributes.map((att) => att.id) : [];
            props.api.projectId = projectId;
            if (isReport) {
                props.api.getReportInfo(datasetId).then((report) => {
                    if (!report) {
                        this.failedToLoadErrorHandling('report');
                        return;
                    }
                    this.loadDataset(isReport, report, selectedAttributes, selectedMetrics);
                });
            } else {
                props.api.getCube(datasetId, 1).then((cube) => {
                    if (!cube) {
                        this.failedToLoadErrorHandling('cube');
                        return;
                    }
                    this.loadDataset(isReport, cube, selectedAttributes, selectedMetrics);
                });
            }
        }
    }

    failedToLoadErrorHandling = (datasetType) => {
        message.warning(`Cannot load the ${datasetType} definition`);
        this.setState({
            loadingNode: false, dataset: {
                attributes: [],
                metrics: [],
                filters: [],
            }, selectedElementsHeader: {
                name: '',
                icon: '',
            },
            loadedAttributes: [],
            loadedMetrics: [],
        });
    }

    mstrSubmit = () => {
        const mstr = window.mstr;
        const { dataset, selectedAttributes, selectedMetrics, selectedFilters } = this.state;
        if (!dataset.datasetId || selectedAttributes.length + selectedMetrics.length === 0) {
            message.warning('No data selected');
            return;
        }
        const { datasetId, name, isReport = false } = dataset;
        const body = this.state.api.createBody(selectedAttributes, selectedMetrics, selectedFilters);
        mstr.connectionName = 'MicroStrategy Connector';
        mstr.fileType = 'JSON';
        mstr.connectionData = {
            body: body,
            name: name,
            isReport: isReport,
            datasetId: datasetId,
            url: this.state.api.envUrl,
            projectId: this.state.api.projectId,
        };

        mstr.authenticationInfo = this.state.api.credentials;
        const tableName = this.state.dataset.name;
        mstr.tableList = [{ tableName }];
        mstr.submit();
    }

    tableauSubmit = () => {
        const tableau = window.tableau;
        const { dataset, selectedAttributes, selectedMetrics, selectedFilters } = this.state;
        if (!dataset.datasetId || selectedAttributes.length + selectedMetrics.length === 0) {
            message.warning('No data selected');
            return;
        }
        const { datasetId, name, isReport = false } = dataset;
        const body = this.state.api.createBody(selectedAttributes, selectedMetrics, selectedFilters);
        const connectionData = {
            body: body,
            name: name,
            isReport: isReport,
            datasetId: datasetId,
            url: this.state.api.envUrl,
            projectId: this.state.api.projectId,
        };
        const { loginMode, username, password } = this.state.api.credentials;
        const authenticationInfo = { loginMode };
        tableau.username = username;
        tableau.password = password;
        tableau.connectionName = 'MicroStrategy Connector';
        tableau.connectionData = JSON.stringify({ connectionData, authenticationInfo });
        tableau.submit();
    }

    getPreviewData = () => {
        const limit = 15;
        const { dataset, selectedAttributes, selectedMetrics } = this.state;
        if (dataset.isReport) {
            return this.state.api.getReportDetails(dataset.datasetId, selectedAttributes, selectedMetrics, this.state.selectedFilters, limit)
                .then((res) => {
                    if (!res || res.message) {
                        throw new Error(res.message);
                    }
                    return this.processPreviewData(res);
                });
        } else {
            return this.state.api.getCubeDetails(dataset.datasetId, selectedAttributes, selectedMetrics, this.state.selectedFilters, limit)
                .then((res) => {
                    if (!res || res.message) {
                        throw new Error(res.message);
                    }
                    return this.processPreviewData(res);
                });
        }
    }

    processPreviewData = (res) => {
        const data = this.state.api.flattenResult(res.result, true);
        this.setState({ previewData: data });
        return data.data.length > 0;
    }

    onSwitchChange = (checked) => {
        this.setState({ showSelected: checked });
    }

    onSearchChange = (event) => {
        this.setState({ searchText: event.target.value });
    }

    showModal = () => {
        const { dataset, selectedAttributes, selectedMetrics } = this.state;
        if (!dataset.datasetId || selectedAttributes.length + selectedMetrics.length === 0) {
            message.warning('No data selected');
            return;
        }
        this.setState({
            showModal: true,
            previewData: null,
        });
        this.getPreviewData().catch((error) => {
            console.log(error);
            setTimeout(() => {
                this.setState({ showModal: false });
            }, 500);
            message.warning('Cannot load preview data');
        });
    }

    handleModalClose = (e) => {
        this.setState({
            showModal: false,
        });
    }

    onTreeSelect = (selectedKey, e) => {
        this.changeStateOfSubmit([], []);
        if (!selectedKey || selectedKey.length === 0 || e.selectedNodes.length === 0) {
            return;
        }
        this.setState({ loadingNode: true });
        const subtype = e.selectedNodes[0].props.subtypeId;
        this.state.api.projectId = e.selectedNodes[0].props.projectId;
        if (subtype === 779 || subtype === 776) { // cubes
            this.state.api.getCube(e.selectedNodes[0].props.id, 1).then((cube) => {
                if (!cube) {
                    this.failedToLoadErrorHandling('cube');
                    return;
                }
                this.loadDataset(false, cube);
            }).catch((error) => {
                console.log(error);
                this.failedToLoadErrorHandling('cube');
            });
        } else {
            this.state.api.getReportInfo(e.selectedNodes[0].props.id).then((report) => {
                if (!report) {
                    this.failedToLoadErrorHandling('report');
                    return;
                }
                this.loadDataset(true, report);
            }).catch((error) => {
                console.log(error);
                this.failedToLoadErrorHandling('report');
            });
        }
    }

    loadDataset = (isReport, dataset, loadedAttributes, loadedMetrics) => {
        let attributes;
        let metrics;
        if (isReport) {
            attributes = dataset.result.definition.availableObjects.attributes;
            metrics = dataset.result.definition.availableObjects.metrics;
        } else {
            attributes = dataset.result.definition.attributes;
            metrics = dataset.result.definition.metrics;
        }
        // load from parameter
        let checkedAttributes = [];
        let checkedMetrics = [];
        if (loadedMetrics || loadedAttributes) {
            checkedAttributes = attributes.slice().filter((att) => loadedAttributes.includes(att.id));
            checkedAttributes = checkedAttributes.map((att) => att.id);
            checkedMetrics = metrics.slice().filter((metric) => loadedMetrics.includes(metric.id));
            checkedMetrics = checkedMetrics.map((metric) => metric.id);
        }

        this.setState({
            loadedAttributes: checkedAttributes,
            loadedMetrics: checkedMetrics,
            selectedAttributes: [],
            selectedMetrics: [],
            selectedFilters: [],
            dataset: {
                isReport: isReport,
                datasetId: dataset.id,
                instanceId: dataset.instanceId,
                attributes: attributes,
                metrics: metrics,
                filters: attributes,
                name: dataset.name,
            },
            selectedElementsHeader: {
                name: dataset.name,
                icon: isReport ? 'report' : 'cube',
            },
            loadingNode: false,
        });
    }

    getAttributesForFilter = (attributeId, datasetId = this.state.dataset.datasetId, instanceId = this.state.dataset.instanceId) => {
        if (this.state.dataset.isReport) {
            return this.state.api.getReportAttributeElements(datasetId, attributeId);
        } else {
            return this.state.api.getCubeAttributeElements(datasetId, instanceId, attributeId);
        }
    }

    changeStateOfSubmit(attr, metrics) {
        // if (attr.length || metrics.length) {
        //     this.props.changeDisabledSubmit(false);
        // } else {
        //     this.props.changeDisabledSubmit(true);
        // }
    }

    onAttributesChange = (attributes) => {
        this.setState({ selectedAttributes: attributes });
        this.changeStateOfSubmit(attributes, this.state.selectedMetrics);
    }

    onMetricsChange = (metrics) => {
        this.setState({ selectedMetrics: metrics });
        this.changeStateOfSubmit(this.state.selectedAttributes, metrics);
    }

    onFiltersChange = (filters) => {
        this.setState({ selectedFilters: filters });
    }

    render() {
        return (
            <div>
                <Row gutter={32}>
                    <Col span={8} className='border-right'>
                        <FolderTree
                            session={this.props.session}
                            onSelect={this.onTreeSelect} />
                    </Col>
                    <Col span={16}>
                        <Row>
                            <SearchToolbar
                                selectedElementName={this.state.selectedElementsHeader.name}
                                selectedElementIcon={this.state.selectedElementsHeader.icon}
                                onSwitchChange={this.onSwitchChange}
                                onSearchChange={this.onSearchChange} />
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Selector
                                    title='Attributes'
                                    key={this.state.dataset.datasetId}
                                    searchText={this.state.searchText}
                                    showSelected={this.state.showSelected}
                                    items={this.state.dataset.attributes}
                                    onChange={this.onAttributesChange}
                                    loading={this.state.loadingNode}
                                    loadedData={this.state.loadedAttributes}
                                />
                            </Col>
                            <Col span={12}>
                                <Selector
                                    title='Metrics'
                                    key={this.state.dataset.datasetId}
                                    searchText={this.state.searchText}
                                    showSelected={this.state.showSelected}
                                    items={this.state.dataset.metrics}
                                    onChange={this.onMetricsChange}
                                    loading={this.state.loadingNode}
                                    loadedData={this.state.loadedMetrics} />
                            </Col>
                        </Row>
                        <Row>
                            <FilterSelector
                                title='Filters'
                                key={this.state.dataset.datasetId}
                                searchText={this.state.searchText}
                                showSelected={this.state.showSelected}
                                items={this.state.dataset.filters}
                                onChange={this.onFiltersChange}
                                getAttributes={this.getAttributesForFilter}
                                loading={this.state.loadingNode} />
                        </Row>
                    </Col>
                </Row>

                <Modal
                    title="Data Preview"
                    visible={this.state.showModal}
                    onCancel={this.handleModalClose}
                    width={640}
                    footer={null}>
                    <PreviewTable previewData={this.state.previewData} />
                </Modal>
            </div>

        );
    }
}

export default Parameters;
