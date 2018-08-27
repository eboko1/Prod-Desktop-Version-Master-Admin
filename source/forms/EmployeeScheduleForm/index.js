// vendor
import React, { Component } from 'react';
import { Form, Button, Select, Icon, Tooltip, Input } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';
//proj
import { onChangeEmployeeScheduleForm } from 'core/forms/employeeScheduleForm/duck';

import { withReduxForm, getDateTimeConfigs } from 'utils';
import { ArrayScheduleInput } from 'components';
// own
import {
    DecoratedInputPhone,
    DecoratedInput,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';
import Styles from './styles.m.css';

// own
const FormItem = Form.Item;

@injectIntl
@withReduxForm({
    name:    'employeeScheduleForm',
    actions: {
        change: onChangeEmployeeScheduleForm,
    },
})
export class EmployeeScheduleForm extends Component {
    componentDidMount() {
        this.props.fetchEmployeeSchedule(
            this.props.history.location.pathname.split('/')[ 2 ],
        );
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            initialSchedule,
            entity,
            saveEmployeeSchedule,
            initialEmployee,
            deleteEmployeeSchedule,
        } = this.props;

        return (
            <div>
                <ArrayScheduleInput
                    getFieldDecorator={ getFieldDecorator }
                    initialSchedule={ initialEmployee.schedule }
                    entity={ entity }
                    deleteEmployeeSchedule={ deleteEmployeeSchedule }
                    saveEmployeeSchedule={ saveEmployeeSchedule }
                />
            </div>
        );
    }
}
