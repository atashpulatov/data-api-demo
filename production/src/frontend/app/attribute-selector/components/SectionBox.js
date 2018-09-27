import React, {Component} from 'react';


class SectionBox extends Component {
    render() {
        return (
            <div className="section-box">
                {this.props.children}
            </div>
        );
    }
}

export default SectionBox;
