// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

// proj
import { createEmployeeSchedule, updateEmployeeSchedule, deleteEmployeeSchedule } from 'core/employeeSchedule/duck';
import { ScheduleForm } from 'forms';
// own

import Styles from './styles.m.css';


// own
const FormItem = Form.Item;

const mapStateToProps = () => ({});
const mapDispatchToProps = {
    createEmployeeSchedule,
    updateEmployeeSchedule,
    deleteEmployeeSchedule,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class EmployeeScheduleForm extends Component {
    render() {
        const { initialSchedule, employeeId } = this.props;
        const { createEmployeeSchedule, updateEmployeeSchedule, deleteEmployeeSchedule } = this.props;

        return (
            <div>
                <ScheduleForm
                    initialSchedule={ initialSchedule }
                    createSchedule={ createEmployeeSchedule.bind(null, employeeId) }
                    updateSchedule={ updateEmployeeSchedule.bind(null, employeeId) }
                    deleteSchedule={ deleteEmployeeSchedule.bind(null, employeeId) }
                    isForbidden={ false }
                />
                { /*<div><FormItem className={ Styles.FormItem }><FormattedMessage id='add_non_working_day'/></FormItem></div>*/ }
                { /*<div>*/ }
                { /*<ArrayBreakScheduleInput*/ }
                { /*user={ user }*/ }
                { /*initialSchedule={ initialEmployee.nonWorkingDays }*/ }
                { /*entity={ entity }*/ }
                { /*deleteEmployeeSchedule={ deleteEmployeeBreakSchedule }*/ }
                { /*saveEmployeeSchedule={ saveEmployeeBreakSchedule }*/ }
                { /*/>*/ }
                { /*</div>*/ }
            </div>
        );
    }
}
