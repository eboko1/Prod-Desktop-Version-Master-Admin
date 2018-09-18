//vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Button, Select, Tabs, Row, Col } from 'antd';
import _ from 'lodash';

// proj
import { onChangeSalaryReportForm } from 'core/forms/salaryReportForm/duck';
import {
    fetchAnnualSalaryReport,
    fetchSalaryReport,
} from 'core/forms/settingSalaryForm/duck';
import { DecoratedDatePicker, DecoratedSelect } from 'forms/DecoratedFields';
import { withReduxForm } from 'utils';

// own
import Styles from './styles.m.css';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

@injectIntl
@withReduxForm({
    name:    'salaryReportForm',
    actions: {
        change: onChangeSalaryReportForm,
        fetchAnnualSalaryReport,
        fetchSalaryReport,
    },
})
export class SalaryReportForm extends Component {
    render() {
        const { form, intl, employeesIds } = this.props;
        const stringifiedEmployeesIds = employeesIds
            ? JSON.stringify(employeesIds.map(Number))
            : void 0;
        const years = Array(new Date().getFullYear() - 1970 + 1)
            .fill(1970)
            .map((val, index) => val + index)
            .reverse();

        return (
            <div>
                <Tabs>
                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'salary-report-form.period_report_title',
                        }) }
                        key='1'
                    >
                        <Form layout='inline'>
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
                                        !form.getFieldValue('filterRangeDate')
                                    }
                                    onClick={ () => {
                                        const [ startDate, endDate ] = form.getFieldValue(
                                            'filterRangeDate',
                                        );
                                        const parameters = {
                                            startDate:    startDate.toISOString(),
                                            endDate:      endDate.toISOString(),
                                            employeesIds: stringifiedEmployeesIds,
                                        };
                                        this.props.fetchSalaryReport(
                                            parameters,
                                        );
                                    } }
                                >
                                    <FormattedMessage id='setting-salary.calculate' />
                                </Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                    <TabPane
                        tab={ this.props.intl.formatMessage({
                            id: 'salary-report-form.annual_report_title',
                        }) }
                        key='2'
                    >
                        <Row type='flex' align='column'>
                            <Col span='6'>
                                <DecoratedSelect
                                    field='year'
                                    cnStyles={ Styles.salaryReportSelect }
                                    getFieldDecorator={ form.getFieldDecorator }
                                    initialValue={ _.first(years) }
                                >
                                    { years.map(year => (
                                        <Option value={ year } key={ String(year) }>
                                            { String(year) }
                                        </Option>
                                    )) }
                                </DecoratedSelect>
                            </Col>
                            <Col span='6'>
                                <DecoratedSelect
                                    cnStyles={ Styles.salaryReportSelect }
                                    field='type'
                                    formItem
                                    getFieldDecorator={ form.getFieldDecorator }
                                    initialValue={ 'FULL' }
                                >
                                    { [ 'FULL', 'ABOUT_RATE', 'ABOUT_PERCENTS' ].map(type => (
                                        <Option value={ type } key={ type }>
                                            { this.props.intl.formatMessage({
                                                id: `salary-report-form.${type}`,
                                            }) }
                                        </Option>
                                    )) }
                                </DecoratedSelect>
                            </Col>
                            <Col span='8'>
                                <Button
                                    type='primary'
                                    onClick={ () => {
                                        const formValues = form.getFieldsValue([ 'type', 'year' ]);
                                        this.props.fetchAnnualSalaryReport({
                                            ...formValues,
                                            employeesIds: stringifiedEmployeesIds,
                                        });
                                    } }
                                >
                                    <FormattedMessage id='setting-salary.calculate' />
                                </Button>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
                <br />
            </div>
        );
    }
}
