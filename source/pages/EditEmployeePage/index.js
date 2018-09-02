// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon, Tabs } from 'antd';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment'
// proj

import { EmployeeForm, EmployeeScheduleForm } from 'forms';
import { Layout, Spinner } from 'commons';
import { fetchEmployee } from 'core/employee/duck';

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
    };
};

const mapDispatchToProps = {
    saveEmployee,
    fetchEmployee,
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
            this.props.history.location.pathname.split('/')[ 2 ],
        );
    }
    componentWillUnmount() {
        this.props.resetEmployeeForm();
    }
    fireEmployee=()=>{
        
        this.props.fireEmployee(
            this.props.employeesData,
            this.props.history.location.pathname.split('/')[ 2 ],
            moment(),
        );
    }
    saveEmployeeFormRef = formRef => {
        this.employeeFormRef = formRef;
    };
    // saveEmployeeBreakScheduleFormRef = formRef => {
    //     this.employeeBreakScheduleFormRef = formRef;
    // };

    saveEmployee = () => {
        const form = this.employeeFormRef.props.form;
        form.validateFields(err => {

            if (!err) {
                this.props.saveEmployee(
                    this.props.employeesData,
                    this.props.history.location.pathname.split('/')[ 2 ],
                );
            }
        });
    };
    
    
    // saveScheduleEmployeeFormRef = formRef => {
    //     this.employeeScheduleFormRef = formRef;
    // };
    
    // saveEmployeeSchedule = keys => {
    //     const form = this.employeeScheduleFormRef.props.form;
    //     const { entity } = this.props;
    //     form.validateFields((err, values) => {
    //         console.log(err, 'Hello')
    //         if (!err) {
    //             keys.map(item => {
    //                 let data = {
    //                     beginBreakHours: values.beginBreakHours[ item ]
    //                         ? values.beginBreakHours[ item ].format('HH:mm')
    //                         : null,
    //                     beginWorkingHours: values.beginWorkingHours[ item ]
    //                         ? values.beginWorkingHours[ item ].format('HH:mm')
    //                         : null,
    //                     endBreakHours: values.endBreakHours[ item ]
    //                         ? values.endBreakHours[ item ].format('HH:mm')
    //                         : null,
    //                     endWorkingHours: values.endWorkingHours[ item ]
    //                         ? values.endWorkingHours[ item ].format('HH:mm')
    //                         : null,
    //                     friday: values.friday[ item ]
    //                         ? values.friday[ item ]
    //                         : false,
    //                     monday: values.monday[ item ]
    //                         ? values.monday[ item ]
    //                         : false,
    //                     saturday: values.saturday[ item ]
    //                         ? values.saturday[ item ]
    //                         : false,
    //                     sunday: values.sunday[ item ]
    //                         ? values.sunday[ item ]
    //                         : false,
    //                     thursday: values.thursday[ item ]
    //                         ? values.thursday[ item ]
    //                         : false,
    //                     tuesday: values.tuesday[ item ]
    //                         ? values.tuesday[ item ]
    //                         : false,
    //                     wednesday: values.wednesday[ item ]
    //                         ? values.wednesday[ item ]
    //                         : false,
    //                     type:        'standard',
    //                     subjectType: 'employee',
    //                 };
    //                 if (!values.id[ item ]) {
    //                     this.props.saveEmployeeSchedule({
    //                         schedule: data,
    //                         id:       this.props.history.location.pathname.split(
    //                             '/',
    //                         )[ 2 ],
    //                     });
    //                 }
    //             });
    //         }
    //     });
    // };
    /* eslint-disable complexity*/
    render() {
        const {
            spinner,
            employees,
            fireEmployee,
            initialEmployee,
            initialSchedule,
        } = this.props;

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
                        { /* <EmployeeForm         
                            initialEmployee={ initialEmployee }         
                            wrappedComponentRef={ this.saveEmployeeFormRef }
                            saveEmployee={ this.saveEmployee }
                        />  */ }
                        <EmployeeScheduleForm
                            initialEmployee={ initialEmployee }
                            initialSchedule={ initialSchedule }
                            // wrappedComponentRef={
                            //     this.saveScheduleEmployeeFormRef
                            // }
                            fetchEmployeeSchedule={
                                this.props.fetchEmployeeSchedule
                            }
                            deleteEmployeeBreakSchedule={ this.props.deleteEmployeeBreakSchedule }
                            history={ this.props.history }
                            saveEmployee={ this.saveEmployee }
                            saveEmployeeBreakSchedule={ this.saveEmployeeBreakSchedule }
                            // saveEmployeeSchedule={ this.saveEmployeeSchedule }
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
