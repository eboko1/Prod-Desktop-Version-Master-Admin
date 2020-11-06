// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Layout, BackTop } from "antd";
import DocumentTitle from "react-document-title";

// proj
import { logout } from "core/auth/duck";
import { setCollapsedState, setView } from "core/ui/duck";
import { fetchHeaderData } from "core/subscription/duck";

import { Navigation, Header, Footer, ModuleHeader } from "commons";
import { getCollapsedState, withResponsive } from "utils";

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    authFetching: state.ui.authFetching,
    collapsed: state.ui.collapsed,
    header: state.subscription.header,
    user: state.auth,
});

const mapDispatchToProps = {
    logout,
    setCollapsedState,
    setView,
    fetchHeaderData,
};

@withResponsive()
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
        this.props.fetchHeaderData();
    }

    _toggleNavigation = () => {
        const collapsed = getCollapsedState();
        this.props.setCollapsedState(!collapsed);
    };

    _logout = () => this.props.logout();

    _getPageTitle = () => {
        const { history, location } = this.props;
        let title = "Carbook.Pro";

        if (history.location.pathname && location.pathname) {
            const path = location.pathname.split("/")[1];
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
            header,
            user,
        } = this.props;

        return (
            <DocumentTitle title={this._getPageTitle()}>
                <Layout style={{ height: "100%" }}>
                    <Navigation
                        onCollapse={this._toggleNavigation}
                        collapsed={collapsed}
                        isMobile={isMobile}
                        user={user}
                        logout={this._logout}
                    />
                    <Layout className={Styles.layout}>
                        {!isMobile && (
                            <Layout.Header className={Styles.header}>
                                <Header
                                    header={header}
                                    user={user}
                                    collapsed={collapsed}
                                    toggleNavigation={this._toggleNavigation}
                                    logout={this._logout}
                                />
                            </Layout.Header>
                        )}
                        {title && (
                            <ModuleHeader
                                title={title}
                                description={description}
                                controls={controls}
                                collapsed={collapsed}
                                isMobile={isMobile}
                            />
                        )}
                        <main
                            className={`${Styles.content} ${collapsed &&
                                Styles.contentCollapsed} ${title &&
                                Styles.contentModuleHeader}`}
                        >
                            <Layout.Content
                                className={`${
                                    paper ? Styles.paper : Styles.pure
                                }`}
                            >
                                {this.props.children}
                            </Layout.Content>
                        </main>
                        {!isMobile && (
                            <Layout.Footer>
                                <Footer collapsed={collapsed} />
                            </Layout.Footer>
                        )}
                    </Layout>
                </Layout>
            </DocumentTitle>
        );
    }
}

// export const LayoutComponent = withResponsive(LayoutWrapper);
