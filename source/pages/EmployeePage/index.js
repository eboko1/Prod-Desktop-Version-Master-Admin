// vendor
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {FormattedMessage, injectIntl} from 'react-intl';
import { Button } from 'antd';

// proj
import { Layout } from 'commons';
import { EmployeeContainer } from 'containers';
import book from 'routes/book';
import { permissions, isForbidden } from 'utils';

const mapStateToProps = state => ({
    user: state.auth,
});

const mapDispatchToProps = {};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class EmployeePage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id={ 'navigation.employees' } /> }
                description={
                    <FormattedMessage id='employee-page.description' />
                }
                controls={
                    <Button
                        type='primary'
                        disabled={ isForbidden(
                            this.props.user,
                            permissions.CREATE_EDIT_DELETE_EMPLOYEES,
                        ) }
                    >
                        <Link to={ book.addEmployee }>
                            <FormattedMessage id='employee-page.add_employee' />
                        </Link>
                    </Button>
                }
            >
                <EmployeeContainer />
            </Layout>
        );
    }
}
