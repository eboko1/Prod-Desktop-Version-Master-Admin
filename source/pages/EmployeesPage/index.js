// vendor
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button } from 'antd';

// proj
import { Layout } from 'commons';
import { EmployeesContainer } from 'containers';
import { permissions, isForbidden } from 'utils';
import book from 'routes/book';

const mapStateToProps = state => ({
    user: state.auth,
});

@injectIntl
@connect(mapStateToProps)
export default class EmployeesPage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id={ 'navigation.employees' } /> }
                description={
                    <FormattedMessage id='employee-page.description' />
                }
                controls={
                    <Link to={ book.addEmployee }>
                        <Button
                            type='primary'
                            disabled={ isForbidden(
                                this.props.user,
                                permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                            ) }
                        >
                            <FormattedMessage id='employee-page.add_employee' />
                        </Button>
                    </Link>
                }
            >
                <EmployeesContainer />
            </Layout>
        );
    }
}
