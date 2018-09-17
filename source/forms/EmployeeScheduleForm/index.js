// vendor
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
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
    fetchEmployeeSchedule,
} from 'core/employeeSchedule/duck';
import { ScheduleForm, BreakScheduleForm } from 'forms';
// own

import Styles from './styles.m.css';

// own
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    initialSchedule:      state.employeeSchedule.schedule,
    initialBreakSchedule: state.employeeSchedule.nonWorkingDays,
});

const mapDispatchToProps = {
    createEmployeeSchedule,
    updateEmployeeSchedule,
    deleteEmployeeSchedule,

    createEmployeeBreakSchedule,
    updateEmployeeBreakSchedule,
    deleteEmployeeBreakSchedule,

    fetchEmployeeSchedule,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export class EmployeeScheduleForm extends Component {
    componentDidMount() {
        const { employeeId } = this.props;
        this.props.fetchEmployeeSchedule(employeeId);
    }

    componentDidUpdate(prevProps) {
        if (this.props.employeeId !== prevProps.employeeId) {
            const { employeeId } = this.props;
            this.props.fetchEmployeeSchedule(employeeId);
        }
    }

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
                <Tabs defaultActiveKey='1'>
                    <TabPane tab={ <FormattedMessage id={ 'working_days' } /> } key='1'>
                        { initialSchedule && (
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
                        ) }
                    </TabPane>
                    <TabPane tab={ <FormattedMessage id={ 'non_working_days' } /> } key='2'>
                        { initialBreakSchedule && (
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
                        ) }
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
