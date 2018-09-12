// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Icon, Tabs, List } from 'antd';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import classNames from 'classnames/bind';

// proj
import { EmployeeForm, EmployeeScheduleForm } from 'forms';
import { Layout, Spinner, Loader } from 'commons';
import { fetchEmployees } from 'core/employees/duck';

import {
    fetchEmployeeById,
    saveEmployee,
    resetEmployeeForm,
    fireEmployee,
} from 'core/forms/employeeForm/duck';
import book from 'routes/book';

// own
import Styles from './styles.m.css';
const TabPane = Tabs.TabPane;

let cx = classNames.bind(Styles);

const mapStateToProps = state => ({
    employees:       state.employees.employees,
    employeesData:   state.forms.employeeForm.fields,
    employeeName:    state.forms.employeeForm.employeeName,
    initialEmployee: state.forms.employeeForm.initialEmployee,
    initialSchedule: state.forms.employeeForm.initialSchedule,
    entity:          state.forms.employee.fields,
    user:            state.auth,
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
        const { history, fetchEmployeeById, fetchEmployees } = this.props;
        fetchEmployeeById(history.location.pathname.split('/')[ 2 ]); // employee id
        fetchEmployees();
    }

    componentWillUnmount() {
        this.props.resetEmployeeForm();
    }

    fireEmployee = () => {
        this.props.fireEmployee(
            this.props.employeesData,
            this.props.history.location.pathname.split('/')[ 2 ], // employee id
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
                    this.props.history.location.pathname.split('/')[ 2 ], // employee id
                );
            }
        });
    };

    _linkToEmployee = id => {
        this.props.history.push(`${book.employeesPage}/${id}`);
        this.props.fetchEmployees();
    };

    /* eslint-disable complexity*/
    render() {
        const employeeTabs = this._renderEmployeeTabs();
        const employeesList = this._renderEmployeesList();

        return (
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
                        }` }
                    >
                        { employeeTabs }
                    </section>
                    <section
                        className={ `${Styles.employeeSection} ${
                            Styles.employeesList
                        }` }
                    >
                        { employeesList }
                    </section>
                </div>
            </Layout>
        );
    }

    _renderEmployeeTabs = () => {
        const {
            user,
            history,
            initialEmployee,
            initialSchedule,
            fetchEmployeeSchedule,
            deleteEmployeeSchedule,
            deleteEmployeeBreakSchedule,
        } = this.props;

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
                        id: 'employee.schedule',
                    }) }
                    key='2'
                >
                    <EmployeeScheduleForm
                        user={ user }
                        initialEmployee={ initialEmployee }
                        initialSchedule={ initialSchedule }
                        fetchEmployeeSchedule={ fetchEmployeeSchedule }
                        deleteEmployeeBreakSchedule={
                            deleteEmployeeBreakSchedule
                        }
                        history={ history }
                        saveEmployee={ this.saveEmployee }
                        saveEmployeeBreakSchedule={
                            this.saveEmployeeBreakSchedule
                        }
                        deleteEmployeeSchedule={ deleteEmployeeSchedule }
                    />
                </TabPane>
                <TabPane
                    tab={ this.props.intl.formatMessage({
                        id: 'employee.statistics',
                    }) }
                    key='3'
                >
                    statistics
                </TabPane>
                <TabPane
                    tab={ this.props.intl.formatMessage({
                        id: 'employee.feedback',
                    }) }
                    key='4'
                >
                    Feedback
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
