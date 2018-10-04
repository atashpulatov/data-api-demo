import { message } from 'antd';
import { MSTRFetchError } from './MSTRFetchError';

message.config({ maxCount: 1 });
let USE_PROXY = false;

class MSTRFetch {
    constructor() {
        this.supportedTypes = [3, 8, 768, 769, 779, 776];
    }

    get url() {
        return this.envUrl;
    }

    get isAuthenticated() {
        return this.token;
    }

    get projectId() {
        return this.project;
    }

    set projectId(id) {
        this.project = id;
    }

    logout() {
        this.token = null;
    }

    apiInitializer = (session) => {
        this.sessionValidator(session);
        USE_PROXY = session.USE_PROXY;
        this.token = session.authToken;
        this.envUrl = session.url;
        this.project = session.projectId;
    };

    sessionValidator = (session) => {
        if (!session.authToken) {
            throw new MSTRFetchError('Missing authToken');
        }
        if (!session.url) {
            throw new MSTRFetchError('Missing url');
        }
        if (!session.projectId) {
            throw new MSTRFetchError('Missing projectId');
        }
    }

    getToken() {
        const mstrURL = this.envUrl + '/auth/login';
        const url = USE_PROXY ? './getMSTRToken' : mstrURL;
        const data = {
            'username': this.username,
            'password': this.password,
            'loginMode': this.loginMode,
        };
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
        if (USE_PROXY) {
            headers = {
                ...headers,
                'forward.Accept': 'application/json',
                'forward.Content-Type': 'application/json',
                'forward.url': mstrURL,
            };
        }

        return fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            credentials: 'include',
            headers,
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                const token = response.headers.get('X-MSTR-AuthToken');
                return { token };
            } else {
                if (response.status === 401) {
                    message.info('Cannot login. Please check your credentials');
                } else {
                    if (response.status === 404 && USE_PROXY) {
                        message.warning(`The Community Connectors proxy server is not available`);
                    } else {
                        message.error(`Server error, got status ${response.status} ${response.statusText}`);
                    }
                }
            }
            return null;
        }).then((response) => {
            if (!response || !response.token) {
                return;
            }
            this.token = response.token;
            return this.token;
        }).catch(this.handleError);
    }

    postData(endpoint, data = {}) {
        const mstrURL = this.envUrl + '/' + endpoint;
        const url = USE_PROXY ? './httpPostFull' : mstrURL;
        let headers = {
            'Accept': 'application/json',
            'X-MSTR-AuthToken': this.token,
            'Content-Type': 'application/json',
        };
        if (this.project && endpoint !== 'projects') {
            headers['X-MSTR-ProjectID'] = this.project;
        }
        if (USE_PROXY) {
            headers = {
                ...headers,
                'forward.Accept': 'application/json',
                'forward.X-MSTR-AuthToken': this.token,
                'forward.Content-Type': 'application/json',
                'forward.url': mstrURL,
            };
            if (this.project && endpoint !== 'projects') {
                headers = { ...headers, 'forward.X-MSTR-ProjectID': this.project };
            }
        }
        return fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include',
            headers,
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                if (response.status === 401) {
                    this.logout();
                    throw new Error(`Unauthorized, got status ${response.status}`);
                } else {
                    throw new Error(`Server error, got status ${response.status}`);
                }
            }
        }).catch(this.handleError);
    }

    getData(endpoint) {
        const mstrURL = this.envUrl + '/' + endpoint;
        const url = USE_PROXY ? './httpGetFull' : mstrURL;
        let headers = {
            'Accept': 'application/json',
            'X-MSTR-AuthToken': this.token,
        };
        if (this.project && endpoint !== 'projects') {
            headers['X-MSTR-ProjectID'] = this.project;
        }
        if (USE_PROXY) {
            headers = {
                ...headers,
                'forward.Accept': 'application/json',
                'forward.X-MSTR-AuthToken': this.token,
                'forward.url': mstrURL,
            };
            if (this.project && endpoint !== 'projects') {
                headers = { ...headers, 'forward.X-MSTR-ProjectID': this.project };
            }
        }
        return fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers,
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                if (response.status === 401) {
                    this.logout();
                    throw new Error(`Unauthorized, got status ${response.status}`);
                } else {
                    throw new Error(`Server error, got status ${response.status}`);
                }
            }
        }).catch(this.handleError);
    }

    getCubeInfo(cubeId) {
        return this.getData(`cubes/${cubeId}`);
    }

    getCube(cubeId, limit = -1) {
        return this.postData(`cubes/${cubeId}/instances?offset=0&limit=${limit}`);
    }

    getCubeAttributeElements(cubeId, instanceId, attributeId) {
        return this.getData(`cubes/${cubeId}/instance/${instanceId}/attributes/${attributeId}/elements`);
    }

    getReportInfo(reportId) {
        return this.getData(`reports/${reportId}`);
    }

    getReport(reportId) {
        return this.postData(`reports/${reportId}/instances?offset=0&limit=-1`);
    }

    getReportAttributeElements(reportId, attributeId) {
        return this.getReportDetails(reportId, [attributeId], [], []).then((report) => {
            if (!report) {
                return;
            }
            let attributes = [];
            if (report.result.data.root && report.result.data.root.children) {
                report.result.data.root.children.forEach((item) => {
                    attributes.push({ name: item.element.name, id: item.element.id });
                });
            }
            return attributes;
        });
    }

    getProjects() {
        return this.getData('projects').then((projects) => {
            if (!projects) {
                return;
            }
            this.projects = projects.map((project) => {
                return project.id;
            });
            this.createUniqueFolderKey(projects, 'PROJ');
            return projects;
        });
    }

    getRootFolders(project = this.project) {
        return this.getData('folders?offset=0&limit=-1').then((folders) => {
            if (!folders) return;
            this.createUniqueFolderKey(folders, project);
            return this.sortAndFilterArray(folders.filter((folder) => !folder.hidden));
        });
    }

    getMyPersonalObjects(project = this.project) {
        return this.getData('folders/myPersonalObjects').then((folders) => {
            this.createUniqueFolderKey(folders, project);
            return this.sortAndFilterArray(folders.filter((folder) => !folder.hidden));
        });
    }

    getFolderContent(folderId) {
        return this.getData(`folders/${folderId}?offset=0&limit=-1`)
            .then((folderContent) => {
                if (!folderContent) return;
                this.createUniqueFolderKey(folderContent, folderId);
                return this.sortAndFilterArray(folderContent);
            });
    }

    searchDataset(name) {
        name = name.replace(/#/g, '');
        const encodedName = USE_PROXY ? name : encodeURIComponent(name);
        return this.getData(`searches/results?name=${encodedName}&pattern=4&type=3&getAncestors=false&limit=10&certifiedStatus=ALL`)
            .then((response) => {
                let { result, totalItems } = response;
                result = this.sortAndFilterArray(result);
                return { result, totalItems };
            });
    }

    createUniqueFolderKey(array, prefix) {
        array.forEach((item) => {
            item.key = item.id + prefix;
        });
    }

    sortAndFilterArray(array) {
        if (!array || array.length === 0) {
            return;
        }
        const filteredArray = array.filter((element) => {
            return this.supportedTypes.includes(element.type) ||
                this.supportedTypes.includes(element.subtype) ||
                !element.subtype;
        });

        return filteredArray.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
    }

    handleError(error) {
        console.log(error);
        if (error.message) {
            message.error(`Cannot connect to the server. ${error.message}`);
        } else {
            message.error(error);
        }
        return null;
    }

    createBody(attributes, metrics, filters) {
        let body = {
            'requestedObjects': {},
        };
        if (attributes && attributes.length > 0) {
            body.requestedObjects.attributes = [];
            attributes.forEach((att) => {
                body.requestedObjects.attributes.push({ 'id': att });
            });
        }
        if (metrics && metrics.length > 0) {
            body.requestedObjects.metrics = [];
            metrics.forEach((met) => {
                body.requestedObjects.metrics.push({ 'id': met });
            });
        }
        if (filters && Object.keys(filters).length > 0) {
            body.viewFilter = this.composeFilter(filters);
        }
        return body;
    }

    getCubeDetails(cubeId, attributes, metrics, filters, limit = -1) {
        let body = this.createBody(attributes, metrics, filters);
        return this.postData(`cubes/${cubeId}/instances?offset=0&limit=${limit}`, body);
    }

    getReportDetails(reportId, attributes, metrics, filters, limit = -1) {
        let body = this.createBody(attributes, metrics, filters);
        return this.postData(`reports/${reportId}/instances?offset=0&limit=${limit}`, body);
    }

    flattenResult(result, preview) {
        try {
            if (result && result.definition && result.data) {
                let attributes = [];
                let metrics = [];
                let row = [];
                let rawData = [];
                let attributesobj = [];
                let attNum;
                let temp;
                let rowobj = {};
                result.definition.attributes.forEach((att) => {
                    if (att.forms.length > 1) {
                        att.forms.forEach(function (form) {
                            attributesobj.push(att.name + ' ' + form.name);
                        });
                    } else {
                        attributesobj.push(att.name);
                    }
                });
                attributes = result.definition.attributes.map((att) => {
                    return att.name;
                });
                metrics = result.definition.metrics.map((mm) => {
                    return mm.name;
                });
                attNum = attributes.length;
                const visit = (node) => {
                    if (node.element) {
                        rowobj[node.depth] = node.element.formValues;
                    }

                    if (node.metrics || !node.children) {
                        metrics.forEach(function (metric, i) {
                            const value = preview ? node.metrics[metric].fv : node.metrics[metric].rv;
                            rowobj[attNum + i] = value;
                        });
                        temp = {};
                        row = {};
                        attributes.forEach(function (att, i) {
                            temp[att] = rowobj[i];
                        });
                        metrics.forEach(function (metric, i) {
                            temp[metric] = rowobj[attNum + i];
                        });

                        // Resolve multi-form attributes
                        for (let k in temp) {
                            if (typeof (temp[k]) === 'object') {
                                if (Object.keys(temp[k]).length > 1) {
                                    for (let form in temp[k]) {
                                        if (form) {
                                            row[k + ' ' + form] = temp[k][form];
                                        }
                                    }
                                } else {
                                    for (let form in temp[k]) {
                                        if (form) {
                                            row[k] = temp[k][form];
                                        }
                                    }
                                }
                            } else {
                                row[k] = temp[k];
                            }
                        }
                        rawData.push(row);
                    }
                };

                const search = (root) => {
                    if (root) {
                        visit(root);
                        root.visited = true;
                        if (!root.metrics && root.children) {
                            root.children.forEach((node) => {
                                if (!node.visited) {
                                    search(node);
                                }
                            });
                        }
                    }
                };

                search(result.data.root);
                return {
                    attributes: attributesobj,
                    metrics: metrics,
                    data: rawData,
                };
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    }

    composeFilter(selectedFilters) {
        let branch;
        let filter;
        let filterOperands = [];
        let addItem = (item) => {
            branch.operands[1].elements.push({
                id: item,
            });
        };

        for (let att in selectedFilters) {
            if (selectedFilters[att].length) {
                branch = {};
                branch.operator = 'In';
                branch.operands = [];
                branch.operands.push({
                    type: 'attribute',
                    id: att,
                });
                branch.operands.push({
                    type: 'elements',
                    elements: [],
                });

                selectedFilters[att].forEach(addItem);
                filterOperands.push(branch);
            }
        }
        if (filterOperands.length === 0) {
            filter = null;
        } else if (filterOperands.length === 1) {
            filter = filterOperands[0];
        } else {
            filter = {
                operator: 'And',
            };
            filter.operands = filterOperands;
        }
        return filter;
    };
}

export const msrtFetch = new MSTRFetch();
