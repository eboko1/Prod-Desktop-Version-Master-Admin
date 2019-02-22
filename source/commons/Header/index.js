// core
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Tooltip } from 'antd';

// own
import HeaderMenu from './HeaderMenu';
import Styles from './styles.m.css';

class Header extends Component {
    state = {
        sidebarTooltip: false,
    };

    _setSidebarTooltip = (visibility, tooltipMode) => {
        if (!tooltipMode) {
            this.props.toggleNavigation();
        }
        this.setState(state => ({
            sidebarTooltip: !state.sidebarTooltip,
        }));
    };

    render() {
        const { collapsed } = this.props;

        return (
            <header
                className={ `${Styles.header} ${collapsed &&
                    Styles.headerCollapsed}` }
            >
                <div className={ Styles.headerWrapper }>
                    <Tooltip
                        placement='topLeft'
                        title={
                            collapsed ? (
                                <FormattedMessage id='header.expand_sidebar' />
                            ) : (
                                <FormattedMessage id='header.collapse_sidebar' />
                            )
                        }
                        visible={ this.state.sidebarTooltip }
                        onVisibleChange={ visibility =>
                            this._setSidebarTooltip(visibility, true)
                        }
                    >
                        <Icon
                            className={ Styles.trigger }
                            type={ collapsed ? 'menu-unfold' : 'menu-fold' }
                            onClick={ this._setSidebarTooltip }
                        />
                    </Tooltip>
                    { <HeaderMenu { ...this.props } /> }
                </div>
            </header>
        );
    }
}

export default Header;
