// core
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Icon, Tooltip, Switch } from 'antd';

// own
import HeaderMenu from './HeaderMenu';
import Styles from './styles.m.css';
import { values } from 'office-ui-fabric-react';
import { permissions, isForbidden, isAdmin } from 'utils';

import { setTireFittingToken, getTireFittingToken, removeTireFittingToken } from "utils";

const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

@connect(
    mapStateToProps,
    void 0,
)
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
        const { collapsed, user } = this.props;

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
                    {isAdmin(user) && false &&
                        <Switch
                            style={{marginLeft: 14}}
                            checked={Boolean(getTireFittingToken())}
                            onChange={(checked)=>{
                                if(checked) setTireFittingToken("666");
                                else removeTireFittingToken();

                                window.location.reload();
                            }}
                        />
                    }
                </div>
            </header>
        );
    }
}

export default Header;
