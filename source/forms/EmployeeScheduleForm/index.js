// vendor
import React, { Component } from 'react';
import { Form, Button, Select, Icon, Tooltip, Input } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';
//proj

import { ArrayScheduleInput, ArrayBreakScheduleInput } from 'components';
// own

import Styles from './styles.m.css';

// own
const FormItem = Form.Item;

@injectIntl

export class EmployeeScheduleForm extends Component {
    // componentDidMount() {
    //     this.props.fetchEmployeeSchedule(
    //         this.props.history.location.pathname.split('/')[ 2 ],
    //     );
    // }
    render() {
        // const { getFieldDecorator } = this.props.form;
        const {
            saveEmployeeBreakSchedule,
            deleteEmployeeBreakSchedule,
            entity,
            saveEmployeeSchedule,
            initialEmployee,
            deleteEmployeeSchedule,
        } = this.props;

        return (
            <div>
                <div>
                    <ArrayScheduleInput
                        // getFieldDecorator={ getFieldDecorator }
                        initialSchedule={ initialEmployee.schedule }
                        entity={ entity }
                        deleteEmployeeSchedule={ deleteEmployeeSchedule }
                        saveEmployeeSchedule={ saveEmployeeSchedule }
                    />
                </div>
                <div><FormItem className={ Styles.FormItem }><FormattedMessage id='add_non_working_day'/></FormItem></div>
                <div>
                    <ArrayBreakScheduleInput
                        // getFieldDecorator={ getFieldDecorator }
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
