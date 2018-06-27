// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import _ from 'lodash';

// proj
import book from 'routes/book';

// own
import Styles from './styles.m.css';
import menuConfig from './menuConfig';

const mapStateToProps = state => {
    return {
        currentPath: state.router.location.pathname,
    };
};

@connect(mapStateToProps)
export default class Navigation extends Component {
    render() {
        const { currentPath, collapsed } = this.props;

        const defaultOpenKeys = collapsed ? [] : [ 'operations', 'catalog', 'reports' ];
        const selected = menuConfig.getSelectedByRoute(currentPath);
        if (selected.sectionKey
            && !collapsed
            && !defaultOpenKeys.includes(selected.sectionKey)) {
            defaultOpenKeys.push(selected.sectionKey);
        }

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
                    selectedKeys={ [ selected.itemKey ] }
                    activeKey={ selected.itemKey }
                    defaultOpenKeys={ defaultOpenKeys }
                >
                    {
                        menuConfig.sections.map((section) => {
                            const { key, iconType, name, items, link } = section;
                            if (items) {
                                return (<Menu.SubMenu
                                    key={ key }
                                    title={
                                        <>
                                            <Icon type={ iconType } />
                                            <FormattedMessage id={ name } />
                                        </>
                                    }
                                >
                                    {
                                        items.map((item) => {
                                            const { key, link, name } = item;

                                            return (<Menu.Item key={ key }>
                                                <Link to={ link }>
                                                    <FormattedMessage id={ name } />
                                                </Link>
                                            </Menu.Item>);
                                        })
                                    }
                                </Menu.SubMenu>
                                );
                            } else {
                                return (<Menu.Item key={ key }>
                                    <Link to={ link }>
                                        <Icon type={ iconType } />
                                        <FormattedMessage id={ name } />
                                    </Link>
                                </Menu.Item>);
                            }

                        })
                    }
                </Menu>
            </Layout.Sider>
        );
    }
}
