// vendor
import React, { Component } from "react";
import { injectIntl } from "react-intl";

// proj
import { ArrayScheduleInput } from "components";
import {
    onChangeScheduleForm,
    resetFields,
} from "core/forms/scheduleForm/duck";
import { withReduxForm2 } from "utils";

// own

@injectIntl
@withReduxForm2({
    name: "scheduleForm",
    actions: {
        change: onChangeScheduleForm,
        resetFields,
    },
})
export class ScheduleForm extends Component {
    render() {
        const {
            initialSchedule,
            form,
            intl,
            fields,
            forbiddenUpdate,
            loading,
        } = this.props;
        const {
            updateSchedule,
            createSchedule,
            deleteSchedule,
            resetFields,
        } = this.props;

        return (
            <ArrayScheduleInput
                loading={loading}
                fields={fields}
                forbiddenUpdate={forbiddenUpdate}
                resetFields={resetFields}
                updateSchedule={updateSchedule}
                createSchedule={createSchedule}
                deleteSchedule={deleteSchedule}
                initialSchedule={initialSchedule}
                form={form}
                intl={intl}
            />
        );
    }
}
