// vendor
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

// proj
import { ArrayBreakScheduleInput } from 'components';
import { onChangeBreakScheduleForm } from 'core/forms/breakScheduleForm/duck';
import { withReduxForm2 } from 'utils';

// own

@injectIntl
@withReduxForm2({
    name:    'breakScheduleForm',
    actions: {
        change: onChangeBreakScheduleForm,
    },
})
export class BreakScheduleForm extends Component {

    render() {
        const { initialBreakSchedule, form, intl } = this.props;
        const { updateBreakSchedule, createBreakSchedule, deleteBreakSchedule } = this.props;

        return (
            <ArrayBreakScheduleInput
                updateBreakSchedule={ updateBreakSchedule }
                createBreakSchedule={ createBreakSchedule }
                deleteBreakSchedule={ deleteBreakSchedule }
                initialBreakSchedule={ initialBreakSchedule }
                form={ form }
                intl={ intl }
            />
        );
    }
}
