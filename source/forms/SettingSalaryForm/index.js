// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, Form } from 'antd';
import _ from 'lodash';

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
import { withReduxForm2, getDaterange } from 'utils';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

const mapStateToProps = state => ({
    filterRangeDate: state.forms.settingSalary.fields.filterRangeDate,
    user:            state.auth,
});

@injectIntl
@withReduxForm2({
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

    state = {
        formValues: {},
    };

    componentDidMount() {
        this.props.fetchSalary();
    }

    componentDidUpdate(prevProps, prevState) {
        const { formValues: prevFormValues } = prevState;
        const formValues = this.props.form.getFieldsValue();

        if (!_.isEqual(formValues, prevFormValues)) {
            this.setState({ formValues });
        }
    }

    render() {
        const {
            saveSalary,
            deleteSalary,
            salaries,
            employees,
            entity,
            fetchSalaryReport,
            filterRangeDate,
            user,
            form: { getFieldDecorator },
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
                        getFieldDecorator={ getFieldDecorator }
                        format='YYYY-MM-DD'
                    />
                    <FormItem>
                        <Button
                            type='primary'
                            disabled={
                                filterRangeDate ? !filterRangeDate.value : true
                            }
                            onClick={ () =>
                                fetchSalaryReport(entity.filterRangeDate.value)
                            }
                        >
                            <FormattedMessage id='setting-salary.calculate' />
                        </Button>
                    </FormItem>
                </div>
                <SettingSalaryTable
                    user={ user }
                    salaries={ salaries }
                    saveSalary={ saveSalary }
                    employees={ employees }
                    deleteSalary={ deleteSalary }
                    getFieldDecorator={ getFieldDecorator }
                />
            </Catcher>
        );
    }
}
