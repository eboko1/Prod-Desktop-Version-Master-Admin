// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

// proj
import {
    fetchSalary,
    fetchSalaryReport,
    createSalary,
    updateSalary,
    deleteSalary,
    onChangeSettingSalaryForm,
    resetFields,
} from 'core/forms/settingSalaryForm/duck';

import { Catcher } from 'commons';
import { SettingSalaryTable } from 'components';
import { SalaryReportForm } from 'forms';
import { withReduxForm2 } from 'utils';
import { permissions, isForbidden } from 'utils';

const mapStateToProps = state => ({
    user: state.auth,
});

@injectIntl
@withReduxForm2({
    name:    'settingSalary',
    actions: {
        change: onChangeSettingSalaryForm,
        resetFields,
        fetchSalary,
        fetchSalaryReport,

        createSalary,
        updateSalary,
        deleteSalary,
    },
    mapStateToProps,
})
export default class SettingSalaryForm extends Component {
    componentDidMount() {
        const { employeeId } = this.props;
        this.props.fetchSalary(employeeId);
    }

    componentDidUpdate(prevProps) {
        if (this.props.employeeId !== prevProps.employeeId) {
            const { employeeId } = this.props;
            this.props.fetchSalary(employeeId);
        }
    }

    render() {
        const {
            createSalary,
            updateSalary,
            deleteSalary,

            employeeId,
            salaries,
            user,
            form,
            fields,
            loading,
        } = this.props;

        return (
            <Catcher>
                { !isForbidden(user, permissions.EMPLOYEES_SALARIES) && (
                    <SalaryReportForm employeesIds={ [ employeeId ] } />
                ) }
                <SettingSalaryTable
                    loading={ loading }
                    fields={ fields }
                    form={ form }
                    user={ user }
                    initialSettingSalaries={ salaries }
                    createSalary={ createSalary.bind(this, employeeId) }
                    updateSalary={ updateSalary.bind(this, employeeId) }
                    deleteSalary={ deleteSalary.bind(this, employeeId) }
                    resetFields={ resetFields }
                />
            </Catcher>
        );
    }
}
