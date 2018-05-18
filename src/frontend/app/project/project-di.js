import './project.css';
import superagent from 'superagent';
import * as projectRestService from './project-rest-service.js';
// import * as projectRestService from './project-rest-service-mock.js';

export default {
    request: superagent,
    projectRestService: projectRestService,
};
