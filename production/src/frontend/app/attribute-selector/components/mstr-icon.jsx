/* eslint-disable */
import React, { Component } from 'react';
import {
    Attribute,
    Cube,
    Filter,
    FolderCollapsed,
    FolderExpanded,
    Metric,
    Report,
    ProjectCollapsed,
    ProjectExpanded,
} from './icon-source';
/* eslint-enable */

class MSTRIcon extends Component {
    render() {
        let icon;
        let customClass = 'hidden';
        switch (this.props.type) {
            case 'attribute':
                icon = <Attribute />;
                customClass = 'selector';
                break;
            case 'cube':
                icon = <Cube />;
                customClass = 'dataset';
                break;
            case 'filter':
                icon = <Filter />;
                customClass = 'selector';
                break;
            case 'folder-collapsed':
                icon = <FolderCollapsed />;
                break;
            case 'folder-expanded':
                icon = <FolderExpanded />;
                break;
            case 'metric':
                icon = <Metric />;
                customClass = 'selector';
                break;
            case 'project-collapsed':
                icon = <ProjectCollapsed />;
                customClass = 'selector';
                break;
            case 'project-expanded':
                icon = <ProjectExpanded />;
                customClass = 'selector';
                break;
            case 'report':
                icon = <Report />;
                customClass = 'dataset';
                break;
            default:
                break;
        }
        return (
            <span className={`mstr-icon ${customClass}`}>
                {icon}
            </span>
        );
    }
}

export default MSTRIcon;
