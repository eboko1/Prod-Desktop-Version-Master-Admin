// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon, Tabs } from 'antd';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
// proj

import { EmployeeForm, EmployeeScheduleForm } from 'forms';
import { Layout, Spinner } from 'commons';
import { fetchEmployees } from 'core/employees/duck';

import {
    fetchEmployeeById,
    saveEmployee,
    resetEmployeeForm,
    fireEmployee,
} from 'core/forms/employeeForm/duck';
import book from 'routes/book';

const TabPane = Tabs.TabPane;

const mapStateToProps = state => {
    return {
        employees:       state.employee.employees,
        employeesData:   state.forms.employeeForm.fields,
        employeeName:    state.forms.employeeForm.employeeName,
        initialEmployee: state.forms.employeeForm.initialEmployee,
        initialSchedule: state.forms.employeeForm.initialSchedule,
        entity:          state.forms.employee.fields,
        user:            state.auth,
    };
};

const mapDispatchToProps = {
    saveEmployee,
    fetchEmployees,
    fetchEmployeeById,
    resetEmployeeForm,

    fireEmployee,
};
@withRouter
@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class EditEmployeePage extends Component {
    componentDidMount() {
        this.props.fetchEmployeeById(
            this.props.history.location.pathname.split('/')[ 2 ], //employee id
        );
    }
    componentWillUnmount() {
        this.props.resetEmployeeForm();
    }
    fireEmployee = () => {
        this.props.fireEmployee(
            this.props.employeesData,
            this.props.history.location.pathname.split('/')[ 2 ], //employee id
            moment(),
        );
    };
    saveEmployeeFormRef = formRef => {
        this.employeeFormRef = formRef;
    };

    saveEmployee = () => {
        const form = this.employeeFormRef.props.form;
        form.validateFields(err => {
            if (!err) {
                this.props.saveEmployee(
                    this.props.employeesData,
                    this.props.history.location.pathname.split('/')[ 2 ], ////employee id
                );
            }
        });
    };
    /* eslint-disable complexity*/
    render() {
        const { initialEmployee, initialSchedule, user } = this.props;

        return (
            <Layout
                title={ <>{this.props.employeeName}</> }
                controls={
                    <>
                        <Link to={ book.employeesPage }>
                            { ' ' }
                            <Button type='default'>
                                <Icon type='arrow-left' />
                                <FormattedMessage id='back-to-list' />
                            </Button>
                        </Link>
                    </>
                }
            >
                <Tabs type='card'>
                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'employee.general_data',
                        }) }
                        key='1'
                    >
                        <EmployeeForm
                            user={ user }
                            fireEmployee={ this.fireEmployee }
                            initialEmployee={ initialEmployee }
                            wrappedComponentRef={ this.saveEmployeeFormRef }
                            saveEmployee={ this.saveEmployee }
                        />
                    </TabPane>
                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'employee.schedule',
                        }) }
                        key='2'
                    >
                        <EmployeeScheduleForm
                            user={ user }
                            initialEmployee={ initialEmployee }
                            initialSchedule={ initialSchedule }
                            fetchEmployeeSchedule={
                                this.props.fetchEmployeeSchedule
                            }
                            deleteEmployeeBreakSchedule={
                                this.props.deleteEmployeeBreakSchedule
                            }
                            history={ this.props.history }
                            saveEmployee={ this.saveEmployee }
                            saveEmployeeBreakSchedule={
                                this.saveEmployeeBreakSchedule
                            }
                            deleteEmployeeSchedule={
                                this.props.deleteEmployeeSchedule
                            }
                        />
                    </TabPane>
                </Tabs>
            </Layout>
        );
    }
}

export default EditEmployeePage;
