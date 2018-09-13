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
import { EmployeesTable } from 'components';

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
                <EmployeesTable
                    user={ user }
                    deleteEmployee={ deleteEmployee }
                    initEmployeeForm={ initEmployeeForm }
                    employees={ employees }
                    status={ status }
                    setEmployeesStatus={ setEmployeesStatus }
                    fetchEmployees={ fetchEmployees }
                />
            </Catcher>
        );
    }
}
