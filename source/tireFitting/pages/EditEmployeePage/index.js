// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon, Tabs, List } from 'antd';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames/bind';
import _ from 'lodash';

// proj
import { fetchEmployees } from 'core/employees/duck';
import {
    fetchEmployeeById,
    saveEmployee,
    resetEmployeeForm,
    fireEmployee,
    selectInitialEmployee,
} from 'core/forms/employeeForm/duck';

import { EmployeeForm, EmployeeScheduleForm, SettingSalaryForm } from 'forms';
import { Layout } from 'tireFitting';
import { Loader } from 'commons';
import { EmployeeStatistics, EmployeeFeedback } from 'components';
import { permissions, isForbidden, linkTo } from 'utils';
import book from 'routes/book';

// own
import Styles from './styles.m.css';
const TabPane = Tabs.TabPane;

let cx = classNames.bind(Styles);

const mapStateToProps = state => ({
    employees:       state.employees.employees,
    employeeName:    state.forms.employeeForm.employeeName,
    initialEmployee: selectInitialEmployee(state),
    user:            state.auth,
    isMobile:        state.ui.views.isMobile,
});

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
export default class EditEmployeePage extends Component {
    componentDidMount() {
        this.props.fetchEmployeeById(this.props.match.params.id);
        this.props.fetchEmployees();
    }

    fireEmployee = () => {
        const form = this.employeeFormRef.props.form;
        const employeesData = form.getFieldsValue();
        const id = this.props.match.params.id;
        this.props.fireEmployee(employeesData, id, moment());
    };

    saveEmployeeFormRef = formRef => {
        this.employeeFormRef = formRef;
    };

    saveEmployee = () => {
        const form = this.employeeFormRef.props.form;
        form.validateFields((err, values) => {
            if (!err) {
                const id = this.props.match.params.id;
                this.props.saveEmployee(values, id);
            }
        });
    };

    _linkToEmployee = id => {
        linkTo(`${book.employeesPage}/${id}`);
        this.props.fetchEmployeeById(id);
        this.props.fetchEmployees();
    };

    render() {
        const { isMobile } = this.props;
        const employeeTabs = this._renderEmployeeTabs();
        const employeesList = this._renderEmployeesList();

        return this.props.initialEmployee ? (
            <Layout
                paper={ false }
                title={ this.props.employeeName }
                controls={
                    <Link to={ book.employeesPage }>
                        <Button type='default'>
                            <Icon type='arrow-left' />
                            <FormattedMessage id='back-to-list' />
                        </Button>
                    </Link>
                }
            >
                <div className={ Styles.employeePage }>
                    <section
                        className={ `${Styles.employeeSection} ${
                            Styles.employeeTabs
                        } ${
                            isMobile && Styles.employeeMobileSection
                        }` }
                    >
                        { employeeTabs }
                    </section>
                    {!isMobile &&
                        <section
                            className={ `${Styles.employeeSection} ${
                                Styles.employeesList
                            }` }
                        >
                            { employeesList }
                        </section>
                    }
                </div>
            </Layout>
        ) : (
            <Loader loading={ !this.props.initialEmployee } />
        );
    }

    _renderEmployeeTabs = () => {
        const { user, initialEmployee } = this.props;
        const employeeId = this.props.match.params.id;

        return (
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
                        id: 'add-employee-page.schedule',
                    }) }
                    key='2'
                >
                    <EmployeeScheduleForm employeeId={ employeeId } />
                </TabPane>
                <TabPane
                    tab={ this.props.intl.formatMessage({
                        id: 'employee-page.statistics',
                    }) }
                    key='3'
                >
                    <EmployeeStatistics
                        ordersCount={ _.get(initialEmployee, 'ordersCount') }
                        labourHours={ _.get(initialEmployee, 'labourHours') }
                    />
                </TabPane>
                <TabPane
                    tab={ this.props.intl.formatMessage({
                        id: 'employee-page.feedback',
                    }) }
                    key='4'
                >
                    <EmployeeFeedback
                        reviews={ _.get(initialEmployee, 'reviews') }
                    />
                </TabPane>
                <TabPane
                    tab={ this.props.intl.formatMessage({
                        id: 'employee-page.setting_salary',
                    }) }
                    disabled={ isForbidden(
                        this.props.user,
                        permissions.EMPLOYEES_SALARIES,
                    ) }
                    key='5'
                >
                    <SettingSalaryForm employeeId={ employeeId } />
                </TabPane>
            </Tabs>
        );
    };

    _renderEmployeesList = () => {
        const {
            employees,
            loading,
            history,
            intl: { formatMessage },
        } = this.props;
        const currentEmployeeId = Number(
            history.location.pathname.split('/')[ 2 ],
        );

        const _listItemStyles = id =>
            cx({
                listItem:       true,
                listItemActive: currentEmployeeId === id,
            });

        return employees ? (
            <List
                bordered
                className={ Styles.switchBusinessList }
                locale={ { emptyText: formatMessage({ id: 'no_data' }) } }
                dataSource={ employees }
                loading={ loading }
                renderItem={ item => (
                    <List.Item
                        onClick={ () => this._linkToEmployee(item.id) }
                        className={ _listItemStyles(item.id) }
                    >
                        <List.Item.Meta
                            className={ Styles.employeeListItem }
                            title={ `${item.name} ${item.surname}` }
                            description={ item.jobTitle }
                        />
                    </List.Item>
                ) }
            />
        ) : (
            <Loader loading={ !employees } />
        );
    };
}
