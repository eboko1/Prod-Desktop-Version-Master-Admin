// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import { enquireScreen, unenquireScreen } from 'enquire-js';

// proj
import { authActions } from 'core/auth/actions';
import { uiActions } from 'core/ui/actions';
import {
    Navigation,
    Header,
    Footer,
    ModuleHeader,
    ResponsiveView,
} from 'commons';
import { getCollapsedState } from 'utils';

// own
import Styles from './styles.m.css';

let isMobile; // eslint-disable-line
enquireScreen(b => (isMobile = b)); // eslint-disable-line

const mapStateToProps = state => ({
    authFetching: state.ui.get('authFetching'),
    collapsed:    state.ui.get('collapsed'),
});

const mapDispatchToProps = {
    logout:            authActions.logout,
    setCollapsedState: uiActions.setCollapsedState,
    setLayoutState:    uiActions.setLayoutState,
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export class LayoutComponent extends Component {
    static defaultProps = {
        paper: true,
    };

    state = {
        isMobile,
    };

    componentDidMount() {
        const collapsed = getCollapsedState();

        this.enquireHandler = enquireScreen(mobile => {
            this.setState({
                isMobile: mobile,
            });
        });

        this.props.setLayoutState(isMobile);
        this.props.setCollapsedState(collapsed);
    }

    componentWillUnmount() {
        unenquireScreen(this.enquireHandler);
    }

    _toggleNavigation = () => {
        const collapsed = getCollapsedState();
        this.props.setCollapsedState(!collapsed);
    };

    _logout = () => this.props.logout();

    _getPageTitle = () => {
        const { history, location } = this.props;
        let title = 'Carbook.Pro';

        if (history.location.pathname && location.pathname) {
            const path = location.pathname.split('/')[ 1 ];
            title = `Carbook.Pro - ${path.charAt(0).toUpperCase() +
                path.slice(1)}`;
        }

        return title;
    };

    render() {
        const { title, description, controls, paper, collapsed } = this.props;
        const { isMobile } = this.state;

        return (
            <DocumentTitle title={ this._getPageTitle() }>
                <Layout style={ { height: '100%' } }>
                    <Navigation
                        onCollapse={ this._toggleNavigation }
                        collapsed={ collapsed }
                        isMobile={ isMobile }
                    />
                    <Layout className={ Styles.layout }>
                        { !isMobile && (
                            <Layout.Header className={ Styles.header }>
                                <Header
                                    collapsed={ collapsed }
                                    toggleNavigation={ this._toggleNavigation }
                                    logout={ this._logout }
                                />
                            </Layout.Header>
                        ) }
                        { title && (
                            <ModuleHeader
                                title={ title }
                                description={ description }
                                controls={ controls }
                                collapsed={ collapsed }
                                isMobile={ isMobile }
                            />
                        ) }
                        <main
                            className={ `${Styles.content} ${collapsed &&
                                Styles.contentCollapsed} ${title &&
                                Styles.contentModuleHeader}` }
                        >
                            <Layout.Content
                                className={ `${
                                    paper ? Styles.paper : Styles.pure
                                }` }
                            >
                                { this.props.children }
                            </Layout.Content>
                        </main>
                        { !isMobile && (
                            <Layout.Footer>
                                <Footer collapsed={ collapsed } />
                            </Layout.Footer>
                        ) }
                    </Layout>
                </Layout>
            </DocumentTitle>
        );
    }
}
