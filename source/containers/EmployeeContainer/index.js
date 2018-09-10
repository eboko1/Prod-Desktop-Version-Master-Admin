// vendor
import React, { Component } from 'react';
import { Tabs } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

// proj

import { fetchEmployee, deleteEmployee } from 'core/employee/duck';
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
    employees: state.employee.employees,
    user:      state.auth,
});

const mapDispatchToProps = {
    fetchEmployee,
    initEmployeeForm,
    deleteEmployee,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class EmployeeContainer extends Component {
    componentDidMount() {
        this.props.fetchEmployee({ kind: 'all' });
    }

    /* eslint-enable complexity */
    render() {
        const { employees, initEmployeeForm, deleteEmployee, user } = this.props;

        return (
            <Catcher>
                <Tabs
                    type='card'
                    onChange={ active => {
                        this.props.fetchEmployee({ kind: active });
                    } }
                >
                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'employee-page.all',
                        }) }
                        key='all'
                    >
                        <section className={ Styles.myTasks }>
                            <EmployeeTable
                                user={ user }
                                kind='all'
                                deleteEmployee={ deleteEmployee }
                                initEmployeeForm={ initEmployeeForm }
                                employees={ employees }
                            />
                        </section>
                    </TabPane>
                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'employee-page.workers',
                        }) }
                        key='workers'
                    >
                        <section className={ Styles.myTasks }>
                            <EmployeeTable
                                kind='workers'
                                user={ user }
                                deleteEmployee={ deleteEmployee }
                                initEmployeeForm={ initEmployeeForm }
                                employees={ employees }
                            />
                        </section>
                    </TabPane>
                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'employee-page.dismissed',
                        }) }
                        key='disabled'
                    >
                        <section className={ Styles.myTasks }>
                            <EmployeeTable
                                kind='disabled'
                                user={ user }
                                deleteEmployee={ deleteEmployee }
                                initEmployeeForm={ initEmployeeForm }
                                employees={ employees }
                            />
                        </section>
                    </TabPane>

                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'employee-page.setting_salary',
                        }) }
                        disabled={ isForbidden(this.props.user, permissions.EMPLOYEES_SALARIES) }
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
