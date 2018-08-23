// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import { connect } from 'react-redux';
import { setModal, resetModal } from 'core/modals/duck';
import {Link} from 'react-router-dom'
// proj
import {
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
} from 'core/forms/orderTaskForm/duck';
import EmployeeContainer from 'containers/EmployeeContainer'
import { Layout, Spinner } from 'commons';
import { fetchEmployee} from 'core/employee/duck';
import { initEmployeeForm} from 'core/forms/employeeForm/duck';

import book from 'routes/book';

const mapStateToProps = state => {
    return {
        employees: state.employee.employees,

    };
};

const mapDispatchToProps = {

    fetchEmployee,
    initEmployeeForm,
};

@connect(mapStateToProps, mapDispatchToProps)
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
