// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import {Link} from 'react-router-dom'

// proj
import EmployeeContainer from 'containers/EmployeeContainer'
import { Layout } from 'commons';


import book from 'routes/book';


class EmployeePage extends Component {


    /* eslint-disable complexity*/
    render() {
        const {
            employees,
            initEmployeeForm,
        } = this.props;

        return  (
            <Layout    
                title={

                    <>
                        <FormattedMessage
                            id={ 'navigation.employees' }
                        />
                    </>

                }
                description={
                <>
                    <FormattedMessage id='employee-page.description' />
                </>
                }
                controls={
                <>
                    <Link to={ book.addEmployee }>
                        <Button                        
                            type='primary'
                        >
                            <FormattedMessage id='employee-page.add_employee' />
                        
                        </Button>
                    </Link>
                </>
                }>
                <EmployeeContainer
                    initEmployeeForm={ initEmployeeForm } 
                    employees={ employees } 
                    fetchEmployee={ this.props.fetchEmployee }/>
            </Layout>
        );
    }
}

export default EmployeePage;
