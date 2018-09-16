// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

// proj
import {
    createEmployeeSchedule,
    updateEmployeeSchedule,
    deleteEmployeeSchedule,
    createEmployeeBreakSchedule,
    updateEmployeeBreakSchedule,
    deleteEmployeeBreakSchedule,
} from 'core/employeeSchedule/duck';
import { ScheduleForm, BreakScheduleForm } from 'forms';
// own

import Styles from './styles.m.css';

// own
const FormItem = Form.Item;

const mapStateToProps = () => ({});
const mapDispatchToProps = {
    createEmployeeSchedule,
    updateEmployeeSchedule,
    deleteEmployeeSchedule,

    createEmployeeBreakSchedule,
    updateEmployeeBreakSchedule,
    deleteEmployeeBreakSchedule,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class EmployeeScheduleForm extends Component {
    render() {
        const {
            initialSchedule,
            initialBreakSchedule,
            employeeId,
        } = this.props;
        const {
            createEmployeeSchedule,
            updateEmployeeSchedule,
            deleteEmployeeSchedule,

            createEmployeeBreakSchedule,
            updateEmployeeBreakSchedule,
            deleteEmployeeBreakSchedule,
        } = this.props;

        return (
            <div>
                <ScheduleForm
                    initialSchedule={ initialSchedule }
                    createSchedule={ createEmployeeSchedule.bind(
                        null,
                        employeeId,
                    ) }
                    updateSchedule={ updateEmployeeSchedule.bind(
                        null,
                        employeeId,
                    ) }
                    deleteSchedule={ deleteEmployeeSchedule.bind(
                        null,
                        employeeId,
                    ) }
                    isForbidden={ false }
                />
                <BreakScheduleForm
                    initialBreakSchedule={ initialBreakSchedule }
                    createBreakSchedule={ createEmployeeBreakSchedule.bind(
                        null,
                        employeeId,
                    ) }
                    updateBreakSchedule={ updateEmployeeBreakSchedule.bind(
                        null,
                        employeeId,
                    ) }
                    deleteBreakSchedule={ deleteEmployeeBreakSchedule.bind(
                        null,
                        employeeId,
                    ) }
                    isForbidden={ false }
                />
            </div>
        );
    }
}
