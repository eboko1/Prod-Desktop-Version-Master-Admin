// vendor
import React, { Component } from 'react';
import { Button, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import {
    fetchSalary,
    saveSalary,
    deleteSalary,
    onChangeSettingSalaryForm,
    fetchSalaryReport,
} from 'core/forms/settingSalaryForm/duck';

import { Catcher } from 'commons';
import { DecoratedDatePicker } from 'forms/DecoratedFields/DecoratedDatePicker';
import { SettingSalaryTable } from 'components';
import { withReduxForm, getDaterange } from 'utils';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

const mapStateToProps = state => ({
    filterRangeDate: state.forms.settingSalary.fields.filterRangeDate,
});

@injectIntl
@withReduxForm({
    name:    'settingSalary',
    actions: {
        change: onChangeSettingSalaryForm,
        fetchSalary,
        saveSalary,
        deleteSalary,
        fetchSalaryReport,
    },
    mapStateToProps,
})
export default class SettingSalaryContainer extends Component {
    componentDidMount() {
        this.props.fetchSalary();
    }
    /* eslint-enable complexity */

    render() {
        const {
            saveSalary,
            deleteSalary,
            salaries,
            employees,
            entity,
            fetchSalaryReport,
            filterRangeDate,
        } = this.props;

        return (
            <Catcher>
                <div className={ Styles.downloadFile }>
                    <DecoratedDatePicker
                        field='filterRangeDate'
                        ranges
                        label={ null }
                        formItem
                        formatMessage={ this.props.intl.formatMessage }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        format='YYYY-MM-DD'
                    />
                    { /* <FormItem>
                        <Button
                            type='primary'
                            disabled={ !filterRangeDate.value }
                            onClick={ () =>
                                fetchSalaryReport(entity.filterRangeDate.value)
                            }
                        >
                            <FormattedMessage id='setting-salary.calculate' />
                        </Button>
                    </FormItem> */ }
                </div>
                <SettingSalaryTable
                    salaries={ salaries }
                    saveSalary={ saveSalary }
                    employees={ employees }
                    deleteSalary={ deleteSalary }
                />
            </Catcher>
        );
    }
}
