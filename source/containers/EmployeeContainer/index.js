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

// own
import Styles from './styles.m.css';

const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    salaries:  state.forms.settingSalary.salaries,
    entity:    state.forms.settingSalary.fields,
    employees: state.employee.employees,
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
        const { employees, initEmployeeForm, deleteEmployee } = this.props;

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
