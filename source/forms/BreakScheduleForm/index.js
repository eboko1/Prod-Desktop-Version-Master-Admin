// vendor
import React, { Component } from "react";
import { injectIntl } from "react-intl";

// proj
import { ArrayBreakScheduleInput } from "components";
import {
    onChangeBreakScheduleForm,
    resetFields,
} from "core/forms/breakScheduleForm/duck";
import { withReduxForm2 } from "utils";

// own

@injectIntl
@withReduxForm2({
    name: "breakScheduleForm",
    actions: {
        change: onChangeBreakScheduleForm,
        resetFields,
    },
})
export class BreakScheduleForm extends Component {
    render() {
        const {
            initialBreakSchedule,
            form,
            intl,
            fields,
            loading,
        } = this.props;
        const {
            updateBreakSchedule,
            createBreakSchedule,
            deleteBreakSchedule,
            resetFields,
            forbiddenUpdate,
        } = this.props;

        return (
            <ArrayBreakScheduleInput
                loading={loading}
                fields={fields}
                forbiddenUpdate={forbiddenUpdate}
                resetFields={resetFields}
                updateBreakSchedule={updateBreakSchedule}
                createBreakSchedule={createBreakSchedule}
                deleteBreakSchedule={deleteBreakSchedule}
                initialBreakSchedule={initialBreakSchedule}
                form={form}
                intl={intl}
            />
        );
    }
}
