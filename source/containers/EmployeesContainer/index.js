// vendor
import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { Tabs } from "antd";

// proj
import {
    fetchEmployees,
    deleteEmployee,
    setEmployeesStatus,
} from "core/employees/duck";
import { initEmployeeForm } from "core/forms/employeeForm/duck";
import { permissions, isForbidden } from "utils";

import { Catcher } from "commons";
import { EmployeesTable } from "components";
import { SalaryReportForm } from "forms";

// own
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    salaries: state.forms.settingSalary.salaries,
    entity: state.forms.settingSalary.fields,
    employees: state.employees.employees,
    status: state.employees.status,
    user: state.auth,
    isMobile: state.ui.views.isMobile,
});

const mapDispatchToProps = {
    setEmployeesStatus,
    fetchEmployees,
    initEmployeeForm,
    deleteEmployee,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class EmployeesContainer extends Component {
    componentDidMount() {
        const { status, setEmployeesStatus, fetchEmployees } = this.props;
        setEmployeesStatus({ status, disabled: false });
        fetchEmployees();
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
            isMobile,
        } = this.props;

        return (
            <Catcher>
                {isForbidden(user, permissions.EMPLOYEES_SALARIES) ? (
                    <EmployeesTable
                        user={user}
                        deleteEmployee={deleteEmployee}
                        initEmployeeForm={initEmployeeForm}
                        employees={employees}
                        status={status}
                        setEmployeesStatus={setEmployeesStatus}
                        fetchEmployees={fetchEmployees}
                        isMobile={isMobile}
                    />
                ) : (
                    <Tabs type="cards">
                        <TabPane
                            tab={this.props.intl.formatMessage({
                                id: "navigation.employees",
                            })}
                            key="1"
                        >
                            <EmployeesTable
                                user={user}
                                deleteEmployee={deleteEmployee}
                                initEmployeeForm={initEmployeeForm}
                                employees={employees}
                                status={status}
                                setEmployeesStatus={setEmployeesStatus}
                                fetchEmployees={fetchEmployees}
                                isMobile={isMobile}
                            />
                        </TabPane>
                        <TabPane
                            tab={this.props.intl.formatMessage({
                                id: "setting-salary.report_title",
                            })}
                            key="2"
                        >
                            <SalaryReportForm />
                        </TabPane>
                    </Tabs>
                )}
            </Catcher>
        );
    }
}
