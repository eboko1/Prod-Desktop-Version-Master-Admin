// vendor
import React, { Component } from 'react';
import { Icon, Select, Table } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

// proj
import {
    DecoratedDatePicker,
    DecoratedInput,
    DecoratedSelect,
} from 'forms/DecoratedFields';
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

@injectIntl
class ArrayBreakScheduleInput extends Component {
    constructor(props) {
        super(props);

        const { initialBreakSchedule } = props;
        this.uuid = _.isArray(initialBreakSchedule)
            ? initialBreakSchedule.length
            : 0;
        const keys = _.isArray(initialBreakSchedule)
            ? _.keys(initialBreakSchedule)
            : [];

        this.state = { keys: [ ...keys, this.uuid++ ] };
    }

    componentDidUpdate(prevProps) {
        if (
            !_.isEqual(
                this.props.initialBreakSchedule,
                prevProps.initialBreakSchedule,
            )
        ) {
            this.props.form.resetFields();

            const { initialBreakSchedule } = this.props;
            this.uuid = _.isArray(initialBreakSchedule)
                ? initialBreakSchedule.length
                : 0;
            const keys = _.isArray(initialBreakSchedule)
                ? _.keys(initialBreakSchedule)
                : [];

            this.setState({ keys: [ ...keys, this.uuid++ ] });
        }
    }

    getBreakScheduleData(key, callback) {
        this.props.form.validateFields([ `schedule[${key}]` ], err => {
            if (err) {
                return;
            }

            const schedule = this.props.form.getFieldValue(`schedule[${key}]`);
            const scheduleWithParsedHours = _.mapValues(schedule, value =>
                moment.isMoment(value) ? value.format('YYYY-MM-DD') : value);

            callback &&
                callback({
                    ...scheduleWithParsedHours,
                    subjectType: 'employee',
                });
        });
    }

    add = () => {
        const keys = this.state.keys;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { initialBreakSchedule, forbiddenUpdate, loading } = this.props;
        const { formatMessage } = this.props.intl;

        const getDateTitle = (key, title) => {
            const date = _.get(initialBreakSchedule, [ key, title ]);

            return date ? moment(date) : date;
        };

        const keys = this.state.keys;

        const dates = [
            ...[ 'beginDate', 'endDate' ].map(name => ({
                title:  <FormattedMessage id={ `array-break-schedule.${name}` } />,
                width:  '20%',
                render: (text, { key }) => (
                    <DecoratedDatePicker
                        field={ `schedule[${key}][${name}]` }
                        formItem
                        className={ Styles.breakScheduleFormItem }
                        rules={ [
                            {
                                required: true,
                                message:  '',
                            },
                        ] }
                        initialValue={ getDateTitle(key, name) }
                        formatMessage={ formatMessage }
                        getFieldDecorator={ getFieldDecorator }
                        minuteStep={ 30 }
                    />
                ),
            })),
        ];

        const comment = {
            title:  <FormattedMessage id={ 'array-break-schedule.comment' } />,
            width:  '35%',
            render: (text, { key }) => (
                <DecoratedInput
                    fields={ this.props.fields }
                    field={ `schedule[${key}][note]` }
                    getFieldDecorator={ getFieldDecorator }
                    initialValue={ _.get(initialBreakSchedule, [ key, 'note' ]) }
                />
            ),
        };

        const breakType = {
            title:  <FormattedMessage id={ 'array-break-schedule.break_type' } />,
            width:  '15%',
            render: (text, { key }) => (
                <DecoratedSelect
                    cnStyles={ Styles.scheduleType }
                    field={ `schedule[${key}][type]` }
                    getFieldDecorator={ getFieldDecorator }
                    formItem
                    className={ Styles.breakScheduleFormItem }
                    rules={ [
                        {
                            required: true,
                            message:  'Type is required',
                        },
                    ] }
                    initialValue={ _.get(initialBreakSchedule, [ key, 'type' ]) }
                >
                    { [
                        'holiday',
                        'vacation',
                        'sick_leave',
                        'legal_holiday',
                        'absenteeism',
                        'cant_work',
                    ].map(item => {
                        return (
                            <Option value={ item } key={ item }>
                                <FormattedMessage id={ item } />
                            </Option>
                        );
                    }) }
                </DecoratedSelect>
            ),
        };

        const actions = {
            title:  '',
            width:  '10%',
            render: (text, { key }) =>
                !forbiddenUpdate && (
                    <div>
                        <Icon
                            type={ 'save' }
                            className={ Styles.scheduleBreakIcon }
                            onClick={ () => {
                                const callback = entity => {
                                    const initialEntity = _.get(
                                        initialBreakSchedule,
                                        [ key ],
                                    );

                                    if (initialEntity) {
                                        const { id } = initialEntity;
                                        this.props.updateBreakSchedule(
                                            id,
                                            entity,
                                        );
                                    } else {
                                        this.props.createBreakSchedule(entity);
                                    }
                                    this.props.resetFields();
                                };
                                this.getBreakScheduleData(key, callback);
                            } }
                        />{ ' ' }
                        { _.get(initialBreakSchedule, [ key ]) && (
                            <Icon
                                type='delete'
                                className={ Styles.scheduleBreakIcon }
                                onClick={ () => {
                                    const id = _.get(initialBreakSchedule, [ key, 'id' ]);
                                    if (id) {
                                        this.props.deleteBreakSchedule(id);
                                    }
                                    this.props.resetFields();
                                } }
                            />
                        ) }
                    </div>
                ),
        };

        const columns = [
            breakType,
            ...dates,
            comment,
            actions,
        ];

        return (
            <Catcher>
                <Table
                    loading={ loading }
                    rowClassName={ ({ key }) => {
                        const wasEdited = _.get(this.props.fields, [ 'schedule', key ]);
                        const exists = _.get(initialBreakSchedule, [ key ]);

                        if (!exists) {
                            return Styles.newBreakScheduleRow;
                        } else if (wasEdited) {
                            return Styles.editedBreakScheduleRow;
                        }
                    } }
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    size='small'
                    scroll={ { x: 1000 } }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}

export default ArrayBreakScheduleInput;
