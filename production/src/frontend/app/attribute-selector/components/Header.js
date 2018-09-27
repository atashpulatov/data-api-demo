import React, {Component} from 'react';
import MSTRCallback from '../utilities/MSTRCallback';

const mode = new MSTRCallback('mode');
class Header extends Component {
    constructor() {
        super();
        this.mode = (mode.parameter === 'tableau') ? 'tableau' : 'mstr';
    }
    render() {
        return (
            <div className='header'>
                <img className='mstr-logo' src='./images/mstr-logo.png' alt='MSTR Logo' />
                <div className='v-divider'></div>
                <div className='title'>{this.props.title}</div>
                <img className='connector-logo' src={`./images/${this.mode}-icon.png`} alt='Connector Logo' />
            </div>
        );
    }
}

export default Header;
