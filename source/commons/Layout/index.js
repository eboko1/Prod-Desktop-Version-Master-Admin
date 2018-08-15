// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import withSizes from 'react-sizes';

// proj
import { logout } from 'core/auth/duck';
import { setCollapsedState, setView } from 'core/ui/duck';
import { Navigation, Header, Footer, ModuleHeader } from 'commons';
import { getCollapsedState } from 'utils';
import { _breakpoints } from 'commons/Responsive';

// own
import Styles from './styles.m.css';

const mapSizesToProps = ({ width }) => ({
    isMobile: width < _breakpoints.mobile.max,
    isTablet:
        _breakpoints.tablet.min <= width && width <= _breakpoints.tablet.max,
    isDesktop: _breakpoints.desktop.min <= width,
});

const mapStateToProps = state => ({
    authFetching: false,
    collapsed:    false,
    // authFetching: state.ui.get('authFetching'),
    // collapsed:    state.ui.get('collapsed'),
});

const mapDispatchToProps = {
    logout,
    setCollapsedState,
    setView,
};

@withSizes(mapSizesToProps)
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export class LayoutComponent extends Component {
    static defaultProps = {
        paper: true,
    };

    componentDidMount() {
        const { isMobile, isTablet, isDesktop } = this.props;
        const collapsed = getCollapsedState();

        this.props.setView({ isMobile, isTablet, isDesktop });
        this.props.setCollapsedState(collapsed);
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
        const {
            title,
            description,
            controls,
            paper,
            collapsed,
            isMobile,
        } = this.props;

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

// export const LayoutComponent = withResponsive(LayoutWrapper);
