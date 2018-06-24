// vendor
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Layout } from 'antd';

// proj
import { authActions } from 'core/auth/actions';
import { uiActions } from 'core/ui/actions';
import { Navigation, Header, Footer, ModuleHeader } from 'commons';
import { getCollapsedState } from 'utils';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        authFetching: state.ui.get('authFetching'),
        collapsed:    state.ui.get('collapsed'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                logout:            authActions.logout,
                setCollapsedState: uiActions.setCollapsedState,
            },
            dispatch,
        ),
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export class LayoutComponent extends Component {
    static defaultProps = {
        paper: true,
    };

    // state = {
    //     collapsed: false,
    // };

    constructor(props) {
        super(props);
        this.toggleNavigation = this.toggleNavigation.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        const collapsed = getCollapsedState();
        this.props.actions.setCollapsedState(collapsed);
    }

    toggleNavigation = () => {
        const collapsed = getCollapsedState();
        this.props.actions.setCollapsedState(!collapsed);
    };

    logout = () => this.props.actions.logout();

    render() {
        const { title, description, controls, paper, collapsed } = this.props;

        return (
            <Layout>
                <Navigation collapsed={ collapsed } />
                <Layout className={ Styles.layout }>
                    <Layout.Header className={ Styles.header }>
                        <Header
                            className={ Styles.testStyles}
                            collapsed={ collapsed }
                            toggleNavigation={ this.toggleNavigation }
                            logout={ this.logout }
                        />
                    </Layout.Header>
                    { title && (
                        <ModuleHeader
                            title={ title }
                            description={ description }
                            controls={ controls }
                            collapsed={ collapsed }
                        />
                    ) }
                    <main
                        className={ `${Styles.content} ${collapsed &&
                            Styles.contentCollapsed} ${title &&
                            Styles.contentModuleHeader}` }
                    >
                        <Layout.Content
                            className={ `${paper ? Styles.paper : Styles.pure}` }
                        >
                            { this.props.children }
                        </Layout.Content>
                    </main>
                    <Layout.Footer>
                        <Footer collapsed={ collapsed } />
                    </Layout.Footer>
                </Layout>
            </Layout>
        );
    }
}

Layout.propTypes = {
    paper: PropTypes.bool,
};
