// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

// proj
import { ArrayScheduleInput } from 'components';
import { onChangeScheduleForm } from 'core/forms/scheduleForm/duck';
import { withReduxForm2 } from 'utils';

// own

@injectIntl
@withReduxForm2({
    name:    'scheduleForm',
    actions: {
        change: onChangeScheduleForm,
    },
})
export class ScheduleForm extends Component {

    render() {
        const { initialSchedule, form, intl } = this.props;
        const { updateSchedule, createSchedule, deleteSchedule } = this.props;

        return (
            <ArrayScheduleInput
                updateSchedule={ updateSchedule }
                createSchedule={ createSchedule }
                deleteSchedule={ deleteSchedule }
                initialSchedule={ initialSchedule }
                form={ form }
                intl={ intl }
            />
        );
    }
}
