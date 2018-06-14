// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

// proj
import book from 'routes/book';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        currentPath: state.router.location.pathname,
    };
};

@connect(mapStateToProps)
export default class Navigation extends Component {
    render() {
        const { currentPath, collapsed } = this.props;

        // orders = [];
        return (
            <Layout.Sider
                className={ Styles.sider }
                trigger={ null }
                collapsible
                collapsed={ collapsed }
                width={ 256 }
                // breakpoint='xl'
                // onCollapse={
                //     () =>
                //         this.setState((prevState, props) =>
                //             console.log('collapsed', props.collapsed))
                // {
                //     collapsed: props.collapsed,
                // }
                // }
                // onCollapse={(collapsed, type) => { console.log(collapsed, type) }}
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
                <Menu
                    className={ Styles.navMenu }
                    theme='dark'
                    mode='inline'
                    // defaultSelectedKeys={ [ '1' ] }
                    selectedKeys={ [ currentPath ] }
                    activeKey={ currentPath }
                    defaultOpenKeys={
                        collapsed ? [] : [ 'operations', 'catalog', 'reports' ]
                    }
                >
                    { /*  Operations submenu*/ }
                    <Menu.SubMenu
                        key='operations'
                        title={
                            <>
                                <Icon type='dashboard' />
                                <FormattedMessage id='navigation.operations' />
                            </>
                        }
                    >
                        <Menu.Item key='/dashboard/'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.scheduler' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/orders/'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.appointments' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/tasks/'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.tasks' />
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    { /* Catalog submenu */ }
                    <Menu.SubMenu
                        key='catalog'
                        title={
                            <>
                                <Icon type='contacts' />
                                <FormattedMessage id='navigation.catalog' />
                            </>
                        }
                    >
                        <Menu.Item key='/clients/'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.clients' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/employees/'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.employees' />
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    { /* Statistics submenu */ }
                    <Menu.SubMenu
                        key='reports'
                        title={
                            <>
                                <Icon type='line-chart' />
                                <FormattedMessage id='navigation.reports' />
                            </>
                        }
                    >
                        <Menu.Item key='/control-panel'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.control_panel' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/indicators'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.service_indicators' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/funel'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.funel' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/reviews'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.reviews' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/statistics'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.general_statistics' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/statistics/calls'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.calls_statistics' />
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    { /* Settings submenu */ }
                    <Menu.SubMenu
                        key='settings'
                        title={
                            <>
                                <Icon type='setting' />
                                <FormattedMessage id='navigation.settings' />
                            </>
                        }
                    >
                        <Menu.Item key='/settings'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.main' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/prices'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.specialization_and_prices' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/services'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.services' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/stocks'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.stocks' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/news'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.news' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/articles'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.articles' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/media'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.media_files' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/managers'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.system_managers' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item key='/notice'>
                            <Link to={ book.ordersByStatuses }>
                                <FormattedMessage id='navigation.notice' />
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>

                    <Menu.Item key='/suggest-idea/'>
                        <Link to={ book.ordersByStatuses }>
                            <Icon type='bulb' />
                            <FormattedMessage id='navigation.suggest_idea' />
                        </Link>
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
        );
    }
}
