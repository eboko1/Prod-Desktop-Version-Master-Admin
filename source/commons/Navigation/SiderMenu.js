// vendor
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Link from './link';
import { Layout, Menu, Icon } from 'antd';

// proj
import { MobileView } from 'commons';
import HeaderMenu from 'commons/Header/HeaderMenu';

// own
import Styles from './styles.m.css';
import menuConfig from './menuConfig';

@withRouter
export default class Navigation extends Component {
    render() {
        const { history, collapsed, isMobile } = this.props;

        const defaultOpenKeys = collapsed
            ? []
            : [ 'operations', 'catalog', 'reports' ];
        const selected = menuConfig.getSelectedByRoute(
            history.location.pathname,
        );
        if (
            selected.sectionKey &&
            !collapsed &&
            !defaultOpenKeys.includes(selected.sectionKey)
        ) {
            defaultOpenKeys.push(selected.sectionKey);
        }

        return (
            <Layout.Sider
                className={ Styles.sider }
                trigger={ null }
                collapsible
                collapsed={ collapsed }
                width={ 256 }
            >
                <div
                    className={
                        collapsed
                            ? `${Styles.logo} ${Styles.logoCollapsed}`
                            : Styles.logo
                    }
                >
                    { collapsed ? <Icon type='environment-o' /> : 'CARBOOK.PRO' }
                </div>
                { isMobile && <HeaderMenu isMobile={ isMobile } /> }
                <Menu
                    className={ `${Styles.navMenu} ${isMobile &&
                        Styles.navMenuMobile}` }
                    theme='dark'
                    mode='inline'
                    // defaultSelectedKeys={ [ '1' ] }
                    selectedKeys={ [ selected.itemKey ] }
                    activeKey={ selected.itemKey }
                    defaultOpenKeys={ defaultOpenKeys }
                >
                    { menuConfig.sections.map(section => {
                        const { key, iconType, name, items, link } = section;
                        if (items) {
                            return (
                                <Menu.SubMenu
                                    key={ key }
                                    title={
                                        <>
                                            <Icon type={ iconType } />
                                            <FormattedMessage id={ name } />
                                        </>
                                    }
                                >
                                    { items.map(item => {
                                        const { key, link, name } = item;

                                        return (
                                            <Menu.Item key={ key }>
                                                <Link to={ link }>
                                                    <FormattedMessage
                                                        id={ name }
                                                    />
                                                </Link>
                                            </Menu.Item>
                                        );
                                    }) }
                                </Menu.SubMenu>
                            );
                        }

                        return (
                            <Menu.Item key={ key }>
                                <Link to={ link }>
                                    <Icon type={ iconType } />
                                    <FormattedMessage id={ name } />
                                </Link>
                            </Menu.Item>
                        );
                    }) }
                </Menu>
            </Layout.Sider>
        );
    }
}
