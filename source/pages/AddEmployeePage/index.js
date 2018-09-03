// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon, Tabs} from 'antd';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

// proj

import { EmployeeForm, EmployeeScheduleForm} from 'forms'
import { Layout, Spinner } from 'commons';
import { fetchEmployee} from 'core/employee/duck';
import { fetchEmployeeById, saveEmployee, resetEmployeeForm} from 'core/forms/employeeForm/duck';
import book from 'routes/book';
const TabPane =Tabs.TabPane

const mapStateToProps = state => {
    return {
        employees:       state.employee.employees,
        employeesData:   state.forms.employeeForm.fields,
        initialSchedule: state.forms.employee.initialSchedule,
        entity:          state.forms.employee.fields,

    };
};

const mapDispatchToProps = {
    saveEmployee,
    fetchEmployee,
    fetchEmployeeById,
    resetEmployeeForm,
};
@injectIntl
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class EditEmployeePage extends Component {
    componentDidMount(){
        this.props.resetEmployeeForm()
    }
    saveEmployeeFormRef = formRef => {
        this.employeeFormRef = formRef;
    };
    saveScheduleEmployeeFormRef = formRef => {
        this.employeeScheduleFormRef = formRef;
    };
    
    saveEmployee= () => {
        const form = this.employeeFormRef.props.form;
        form.validateFields(err => {
            if (!err) {
                this.props.saveEmployee(this.props.employeesData)
            }
        });
    };
    saveEmployeeSchedule= () => {
        const form = this.employeeScheduleFormRef.props.form;
        form.validateFields(err => {
            if (!err) {
                console.log('hello', this.props.entity)
            }
        });
    };
    componentWillUnmount(){
        this.props.resetEmployeeForm()

    }
    /* eslint-disable complexity*/
    render() {
        const {
            spinner,
            employees,
            entity,
            initialSchedule,
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
                <Tabs type='card' >
                    <TabPane
                        tab={
                            this.props.intl.formatMessage({
                                id: 'employee.general_data',
                            })
                        }
                        key='1'
                    >
                        <EmployeeForm                  
                            wrappedComponentRef={ this.saveEmployeeFormRef }
                            saveEmployee={ this.saveEmployee }
                        /> 
                    </TabPane>
                    { /* <TabPane
                        tab={
                            this.props.intl.formatMessage({
                                id: 'employee.schedule',
                            })
                        }
                        key='2'
                    >
                        <EmployeeScheduleForm
                            wrappedComponentRef={ this.saveScheduleEmployeeFormRef }
                            initialSchedule={ initialSchedule }
                            saveEmployeeSchedule={ this.saveEmployeeSchedule }
                        /> 
                    </TabPane> */ }
                </Tabs>
            </Layout>
        );
    }
}

export default EditEmployeePage;
