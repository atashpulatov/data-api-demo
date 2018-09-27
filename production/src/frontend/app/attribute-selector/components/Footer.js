import React, {Component} from 'react';
import {Button} from 'antd';


class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <Button type='ghost' onClick={this.props.goBack} style={{display: this.props.token ? 'inline-block' : 'none'}}>Back</Button>
                {this.renderButton(this.props.token)}
            </div>
        );
    }

    renderButton(token) {
        if (token) {
            return (<Button disabled={this.props.disabledSubmit} type='primary' className='ml-auto' onClick={this.props.onSubmit}>Submit</Button>);
        } else {
            return (<Button disabled={this.props.disabledConnect} type='primary' className='ml-auto' onClick={this.props.onConnect} loading={this.props.loading}>Connect</Button>);
        }
    }
}

export default Footer;
