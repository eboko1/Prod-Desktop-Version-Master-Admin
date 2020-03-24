// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Tabs, Button, Icon} from 'antd';

// proj
import { Layout, Spinner } from 'commons';
import { DiagnosticPatternsContainer } from 'containers';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    spinner: state.ui.dashboardInitializing,
    loading: state.ui.dashboardFetching,
    user:    state.auth,
});

@injectIntl
@withRouter
@connect(
    mapStateToProps,
)

class DiagnosticPatternsPage extends Component {
    render() {
        const { spinner } = this.props;

        return spinner ? (
            <Spinner spin={ spinner }/>
        ) : (
            <Layout
                title={ <FormattedMessage id='diagnostic-page.title' /> }
                controls={
                    <Button
                        type='primary'
                        onClick={ () =>
                            alert('test')
                        }
                    >
                        <FormattedMessage id='diagnostic-page.add_new_template' />
                    </Button>
                }
            >
                <DiagnosticPatternsContainer/>
            </Layout>
        );
    }
}

export default DiagnosticPatternsPage;