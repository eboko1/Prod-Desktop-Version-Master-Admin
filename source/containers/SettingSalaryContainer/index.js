// vendor
import React, { Component } from 'react';
import { Button, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment'
// proj
import { withReduxForm, getDaterange } from 'utils';
import { fetchSalary, saveSalary, deleteSalary, onChangeSettingSalaryForm, fetchSalaryReport } from 'core/settingSalary/duck';
import { Catcher } from 'commons';
import { DecoratedDatePicker } from 'forms/DecoratedFields/DecoratedDatePicker';
import SettingSalaryTable from 'components/SettingSalaryTable';

// own

import Styles from './styles.m.css';
const mapStateToProps = state => {
    return {
        salaries:  state.settingSalary.salaries,
        entity:    state.settingSalary.fields,
        employees: state.employee.employees,
    };
};

const FormItem = Form.Item;

@injectIntl
@withReduxForm({ name:    'settingSalary', actions: {
    change: onChangeSettingSalaryForm,
    fetchSalary,
    saveSalary,
    deleteSalary,
    fetchSalaryReport}, 
    // mapStateToProps 
})
export default class SettingSalaryContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchSalary();
    }
    /* eslint-enable complexity */

    render() {
        const { saveSalary, deleteSalary, salaries, employees, entity, fetchSalaryReport } = this.props;
        // console.log(entity.filterRangeDate.value?moment(entity.filterRangeDate.value[ 0 ]).format('YYYY-MM-DD'):null)

        return (
            <Catcher>
                <div className={ Styles.downloadFile }>
                    <DecoratedDatePicker
                        ranges={ {
                            Today:        getDaterange('today', 'ant'),
                            'This Month': getDaterange(
                                'prevMonth',
                                'ant',
                            ),
                        } }
                        field='filterRangeDate'
                        label={ null }
                        formItem
                        rules={ [
                            {
                                required: true,
                                message:  '',
                            },
                        ] }
                        formatMessage={ this.props.intl.formatMessage }
                        getFieldDecorator={ this.props.form.getFieldDecorator }
                        // getCalendarContainer={ trigger => trigger.parentNode }
                        format='YYYY-MM-DD'
                    />
                    <FormItem>
                        <Button 
                            // onClick={

                            //     ()=>fetchSalaryReport(entity.filterRangeDate.value) 
                            // }
                        >
                            <FormattedMessage id='setting-salary.calculate' />
                        </Button>
                    </FormItem>
                </div>
                <div>
                    { /* <SettingSalaryTable
                        salaries={ salaries }
                        saveSalary={ saveSalary }
                        employees={ employees }
                        deleteSalary={ deleteSalary }
                    /> */ }
                </div>
            </Catcher>
        );
    }
}
