// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

// proj
import {
    fetchEmployees,
    deleteEmployee,
    setEmployeesStatus,
} from 'core/employees/duck';
import { initEmployeeForm } from 'core/forms/employeeForm/duck';

import { Catcher } from 'commons';
import { EmployeeTable } from 'components';
import { SettingSalaryContainer } from 'containers';
import { permissions, isForbidden } from 'utils';

// own
import Styles from './styles.m.css';
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    salaries:  state.forms.settingSalary.salaries,
    entity:    state.forms.settingSalary.fields,
    employees: state.employees.employees,
    status:    state.employees.status,
    user:      state.auth,
});

const mapDispatchToProps = {
    setEmployeesStatus,
    fetchEmployees,
    initEmployeeForm,
    deleteEmployee,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class EmployeesContainer extends Component {
    componentDidMount() {
        this.props.fetchEmployees();
    }

    /* eslint-enable complexity */
    render() {
        const {
            user,
            employees,
            initEmployeeForm,
            deleteEmployee,
            setEmployeesStatus,
            fetchEmployees,
            status,
        } = this.props;

        return (
            <Catcher>
                <Tabs type='card' tabPosition='right'>
                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'employee-page.employees',
                        }) }
                        key='employees'
                    >
                        <section className={ Styles.myTasks }>
                            <EmployeeTable
                                user={ user }
                                deleteEmployee={ deleteEmployee }
                                initEmployeeForm={ initEmployeeForm }
                                employees={ employees }
                                status={ status }
                                setEmployeesStatus={ setEmployeesStatus }
                                fetchEmployees={ fetchEmployees }
                            />
                        </section>
                    </TabPane>
                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'employee-page.setting_salary',
                        }) }
                        disabled={ isForbidden(
                            this.props.user,
                            permissions.EMPLOYEES_SALARIES,
                        ) }
                        key='settingSalary'
                    >
                        <section>
                            <SettingSalaryContainer
                                salaries={ this.props.salaries }
                                entity={ this.props.entity }
                                employees={ this.props.employees }
                            />
                        </section>
                    </TabPane>
                </Tabs>
            </Catcher>
        );
    }
}
