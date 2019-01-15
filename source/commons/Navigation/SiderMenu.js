// vendor
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import Link from './link';
import { Layout, Menu, Icon } from 'antd';

// proj
import HeaderMenu from 'commons/Header/HeaderMenu';

// own
import Styles from './styles.m.css';
import menuConfig from './menuConfig';

@withRouter
export default class SiderMenu extends Component {
    render() {
        const { history, collapsed, isMobile, onCollapse, user } = this.props;
        const defaultOpenKeys = collapsed
            ? []
            : [
                'operations',
                'catalog',
                'reports',
                'accounting', 
            ];
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
                className={ isMobile ? Styles.siderMobile : Styles.sider }
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
                    { collapsed ? (
                        <Icon type='environment-o' />
                    ) : 
                        user.businessName
                    }
                </div>
                { isMobile && <HeaderMenu isMobile={ isMobile } user={ user } /> }
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
                        const {
                            key,
                            iconType,
                            name,
                            items,
                            link,
                            disabled,
                        } = section;

                        if (items) {
                            return (
                                (!disabled || !disabled(user)) && (
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
                                            const {
                                                key,
                                                link,
                                                name,
                                                disabled,
                                                visible,
                                            } = item;

                                            return (
                                                (!visible || visible(user)) && (
                                                    <Menu.Item
                                                        key={ key }
                                                        disabled={
                                                            disabled &&
                                                            disabled(user)
                                                        }
                                                    >
                                                        <Link
                                                            to={ link }
                                                            onClick={ onCollapse }
                                                            collapsed={
                                                                collapsed
                                                            }
                                                            mobile={ isMobile }
                                                        >
                                                            <FormattedMessage
                                                                id={ name }
                                                            />
                                                        </Link>
                                                    </Menu.Item>
                                                )
                                            );
                                        }) }
                                    </Menu.SubMenu>
                                )
                            );
                        }

                        return (
                            <Menu.Item
                                key={ key }
                                disabled={ disabled && disabled(user) }
                            >
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
