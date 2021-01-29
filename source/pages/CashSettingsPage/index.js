// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// proj
import { Layout, Paper } from 'commons';
import { CashCreationForm } from 'forms';
import { CashboxesTable } from 'components/Tables';
import { permissions, isForbidden } from 'utils';
// own

const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

@connect(
    mapStateToProps,
    void 0,
)
export default class CashSettingsPage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id='navigation.cash_settings' /> }
                paper={ false }
                // description={ <FormattedMessage id='chart-page.description' /> }
            >
                {!isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_CASH_CRUD) &&
                    <Paper>
                        <CashCreationForm />
                    </Paper>
                }
                <Paper>
                    <CashboxesTable />
                </Paper>
            </Layout>
        );
    }
}
