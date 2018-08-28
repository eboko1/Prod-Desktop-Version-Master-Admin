// vendor
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';

// proj
import { Layout } from 'commons';
import { EmployeeContainer } from 'containers';
import book from 'routes/book';

export default class EmployeePage extends Component {
    render() {
        return (
            <Layout
                title={ <FormattedMessage id={ 'navigation.employees' } /> }
                description={
                    <FormattedMessage id='employee-page.description' />
                }
                controls={
                    <Link to={ book.addEmployee }>
                        <Button type='primary'>
                            <FormattedMessage id='employee-page.add_employee' />
                        </Button>
                    </Link>
                }
            >
                <EmployeeContainer />
            </Layout>
        );
    }
}
