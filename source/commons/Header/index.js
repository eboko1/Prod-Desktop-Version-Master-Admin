// core
import React, { Component } from 'react';
import { Icon } from 'antd';

// own
import HeaderMenu from './HeaderMenu';
import Styles from './styles.m.css';

class Header extends Component {
    render() {
        const { collapsed, toggleNavigation } = this.props;

        return (
            <header
                className={ `${Styles.header} ${collapsed &&
                    Styles.headerCollapsed}` }
            >
                <div className={ Styles.headerWrapper }>
                    <Icon
                        className={ Styles.trigger }
                        type={ collapsed ? 'menu-unfold' : 'menu-fold' }
                        onClick={ toggleNavigation }
                    />
                    { <HeaderMenu { ...this.props } /> }
                </div>
            </header>
        );
    }
}

export default Header;
