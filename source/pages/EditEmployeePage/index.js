// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { setModal, resetModal } from 'core/modals/duck';
import { withRouter, Link } from 'react-router-dom';

// proj
import {
    resetOrderTasksForm,
    saveOrderTask,
    changeModalStatus,
} from 'core/forms/orderTaskForm/duck';
import {EmployeeForm} from 'forms/EmployeeForm'
import { Layout, Spinner } from 'commons';
import { fetchEmployee} from 'core/employee/duck';
import { fetchEmployeeById, saveEmployee} from 'core/forms/employeeForm/duck';


import book from 'routes/book';

const mapStateToProps = state => {
    return {
        employees:     state.employee.employees,
        employeesData: state.forms.employeeForm.fields,

    };
};

const mapDispatchToProps = {
    saveEmployee,
    fetchEmployee,
    fetchEmployeeById,
};
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class EditEmployeePage extends Component {
    componentDidMount(){
        this.props.fetchEmployeeById(this.props.history.location.pathname.split('/')[ 2 ])
    }
    saveEmployeeFormRef = formRef => {
        this.employeeFormRef = formRef;
    };
    saveEmployee= () => {
        const { orderTaskEntity, orderTaskId } = this.props;
        const form = this.employeeFormRef.props.form;
        form.validateFields(err => {
            if (!err) {
                console.log(this.props.employeesData, this.props.history.location.pathname.split('/')[ 2 ])
                this.props.saveEmployee(this.props.employeesData, this.props.history.location.pathname.split('/')[ 2 ])
            }
        });
    };
    /* eslint-disable complexity*/
    render() {
        const {
            spinner,
            employees,
        } = this.props;

        return (
            <Layout    
                title={

                    <>
                        <FormattedMessage
                            id={ 'employee-page.add_employee' }
                        />
                    </>

                }
                // description={
                // <>
                //     <FormattedMessage id='employee-page.description' />
                // </>
                // }
                controls={
                <>
                    <Link to={ book.employeesPage }> <Button                        
                        type='default'
                    >
                        <Icon type='arrow-left' />
                        <FormattedMessage id='back-to-list' />
                        
                    </Button>
                    </Link>
                </>
                }>
                <EmployeeForm                  
                    wrappedComponentRef={ this.saveEmployeeFormRef }
                    saveEmployee={ this.saveEmployee }
                /> 
            </Layout>
        );
    }
}

export default EditEmployeePage;
