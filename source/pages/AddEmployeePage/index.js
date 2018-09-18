// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Button, Icon, Tabs } from 'antd';

// proj
import { fetchEmployees } from 'core/employees/duck';
import {
    fetchEmployeeById,
    saveEmployee,
    resetEmployeeForm,
} from 'core/forms/employeeForm/duck';

import { Layout } from 'commons';
import { EmployeeForm, EmployeeScheduleForm } from 'forms';
import book from 'routes/book';

// own
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    employeesData: state.forms.employeeForm.fields,
    user:          state.auth,
});

const mapDispatchToProps = {
    saveEmployee,
    fetchEmployees,
    fetchEmployeeById,
    resetEmployeeForm,
};
@injectIntl
@withRouter
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class EditEmployeePage extends Component {
    componentDidMount() {
        this.props.resetEmployeeForm();
    }

    componentWillUnmount() {
        this.props.resetEmployeeForm();
    }

    saveEmployeeFormRef = formRef => {
        this.employeeFormRef = formRef;
    };

    saveScheduleEmployeeFormRef = formRef => {
        this.employeeScheduleFormRef = formRef;
    };

    saveEmployee = () => {
        const form = this.employeeFormRef.props.form;
        form.validateFields((err, values)  => {
            if (!err) {
                this.props.saveEmployee(values);
            }
        });
    };

    /* eslint-disable complexity*/
    render() {
        const { user } = this.props;

        return (
            <Layout
                title={ <FormattedMessage id={ 'employee-page.add_employee' } /> }
                controls={
                    <Link to={ book.employeesPage }>
                        { ' ' }
                        <Button type='default'>
                            <Icon type='arrow-left' />
                            <FormattedMessage id='back-to-list' />
                        </Button>
                    </Link>
                }
            >
                <Tabs type='card' tabPosition='right'>
                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'employee.general_data',
                        }) }
                        key='1'
                    >
                        <EmployeeForm
                            user={ user }
                            wrappedComponentRef={ this.saveEmployeeFormRef }
                            saveEmployee={ this.saveEmployee }
                            initialEmployee={ null }
                        />
                    </TabPane>
                </Tabs>
            </Layout>
        );
    }
}

export default EditEmployeePage;
