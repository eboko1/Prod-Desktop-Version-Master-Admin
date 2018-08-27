// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon, Tabs } from 'antd';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

// proj

import {EmployeeForm} from 'forms/EmployeeForm'
import { Layout, Spinner } from 'commons';
import { fetchEmployee} from 'core/employee/duck';
import { fetchEmployeeById, saveEmployee, resetEmployeeForm} from 'core/forms/employeeForm/duck';
import book from 'routes/book';

const TabPane =Tabs.TabPane

const mapStateToProps = state => {
    return {
        employees:       state.employee.employees,
        employeesData:   state.forms.employeeForm.fields,
        employeeName:    state.forms.employeeForm.employeeName,
        initialEmployee: state.forms.employeeForm.initialEmployee,
    };
};

const mapDispatchToProps = {
    saveEmployee,
    fetchEmployee,
    fetchEmployeeById,
    resetEmployeeForm,
};
@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class EditEmployeePage extends Component {
    componentDidMount(){
        this.props.fetchEmployeeById(this.props.history.location.pathname.split('/')[ 2 ])
    }
    componentWillUnmount(){
        this.props.resetEmployeeForm()

    }
    saveEmployeeFormRef = formRef => {
        this.employeeFormRef = formRef;
    };

    saveEmployee= () => {
        const { orderTaskEntity, orderTaskId } = this.props;
        const form = this.employeeFormRef.props.form;
        form.validateFields(err => {
            if (!err) {
                this.props.saveEmployee(this.props.employeesData, this.props.history.location.pathname.split('/')[ 2 ])
            }
        });
    };
    /* eslint-disable complexity*/
    render() {
        const {
            spinner,
            employees,
            initialEmployee,
        } = this.props;

        return (
            <Layout    
                title={

                    <>
                        {this.props.employeeName}
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
                    <TabPane
                        tab={
                            this.props.intl.formatMessage({
                                id: 'employee.schedule',
                            })
                        }
                        key='2'
                    >
                        <EmployeeForm         
                            initialEmployee={ initialEmployee }         
                            wrappedComponentRef={ this.saveEmployeeFormRef }
                            saveEmployee={ this.saveEmployee }
                        /> 
                    </TabPane>
                </Tabs>
                
            </Layout>
        );
    }
}

export default EditEmployeePage;
