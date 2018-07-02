import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import './menu-bar.css';

let back = '‹';
let settings = '⏣';
let logout = '⏏';
let goTop = '«';

const MenuBar = () => (

    <div className='menu-bar-container'>
        <div className='menu-bar-nav-container'>
            <button className='menu-button menu-button-nav'>
                <div className='button-with-tooltip'>
                    {back}
                    <span className='button-tooltip-right'>Back</span>
                </div>
            </button>
            <button className='menu-button menu-button-nav'>
                <div className='button-with-tooltip'>
                    {goTop}
                    <span className='button-tooltip-right'>Go top</span>
                </div>
            </button>
        </div>
        <div className='menu-bar-options-container'>
            {/* <button className='menu-button menu-button-nav'>{forward}</button> */}
            <button className='menu-button menu-button-options'>
            <div className='button-with-tooltip'>
                    {logout}
                    <span className='button-tooltip-left'>Log out</span>
                </div>
            </button>
            <button className='menu-button menu-button-options'>
            <div className='button-with-tooltip'>
                    {settings}
                    <span className='button-tooltip-left'>Settings</span>
                </div>
            </button>
        </div>
    </div>
);

export default MenuBar;
