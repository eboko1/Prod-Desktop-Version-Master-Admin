// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form } from 'antd';

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
import { DecoratedDatePicker } from 'forms/DecoratedFields/DecoratedDatePicker';
import { SettingSalaryTable } from 'components';
import { withReduxForm2, getDaterange } from 'utils';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

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
            fetchSalaryReport,

            employeeId,
            salaries,
            user,
            form,
            intl,
        } = this.props;

        return (
            <Catcher>
                <div className={ Styles.downloadFile }>
                    <DecoratedDatePicker
                        field='filterRangeDate'
                        ranges
                        label={ null }
                        formItem
                        formatMessage={ intl.formatMessage }
                        getFieldDecorator={ form.getFieldDecorator }
                        format='YYYY-MM-DD'
                    />
                    <FormItem>
                        <Button
                            type='primary'
                            disabled={
                                false
                            }
                            onClick={ () =>
                                console.log('clicked')
                                // fetchSalaryReport(entity.filterRangeDate.value)
                            }
                        >
                            <FormattedMessage id='setting-salary.calculate' />
                        </Button>
                    </FormItem>
                </div>
                <SettingSalaryTable
                    fields={ this.props.fields }
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
