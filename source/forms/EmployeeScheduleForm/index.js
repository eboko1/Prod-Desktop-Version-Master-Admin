// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
//proj

import { ArrayScheduleInput, ArrayBreakScheduleInput } from 'components';
// own

import Styles from './styles.m.css';

// own
const FormItem = Form.Item;

@injectIntl

export class EmployeeScheduleForm extends Component {

    render() {
        const {
            saveEmployeeBreakSchedule,
            deleteEmployeeBreakSchedule,
            entity,
            saveEmployeeSchedule,
            initialEmployee,
            deleteEmployeeSchedule,
            user,
        } = this.props;

        return (
            <div>
                <div>
                    <ArrayScheduleInput
                        user={ user }
                        initialSchedule={ initialEmployee.schedule }
                        entity={ entity }
                        deleteEmployeeSchedule={ deleteEmployeeSchedule }
                        saveEmployeeSchedule={ saveEmployeeSchedule }
                    />
                </div>
                <div><FormItem className={ Styles.FormItem }><FormattedMessage id='add_non_working_day'/></FormItem></div>
                <div>
                    <ArrayBreakScheduleInput
                        user={ user }
                        initialSchedule={ initialEmployee.nonWorkingDays }
                        entity={ entity }
                        deleteEmployeeSchedule={ deleteEmployeeBreakSchedule }
                        saveEmployeeSchedule={ saveEmployeeBreakSchedule }
                    />
                </div>
            </div>
        );
    }
}
