// vendor
import React, { Component } from 'react';
import { Icon, Form, Select, Table } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

// proj
import {
    DecoratedDatePicker,
    DecoratedInput,
    DecoratedSelect,
} from 'forms/DecoratedFields';
import { Catcher, StyledButton } from 'commons';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;
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

        this.state = { keys };
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

            this.setState({ keys });
        }
    }

    getBreakScheduleData(key, callback) {
        this.props.form.validateFields([ `schedule[${key}]` ], err => {
            if (err) {
                return;
            }

            const schedule = this.props.form.getFieldValue(`schedule[${key}]`);
            const scheduleWithParsedHours = _.mapValues(
                schedule,
                value =>
                    moment.isMoment(value) ? value.format('YYYY-MM-DD') : value,
            );

            callback &&
                callback({
                    ...scheduleWithParsedHours,
                    subjectType: 'employee',
                });
        });
    }

    remove = key => {
        const keys = this.state.keys;
        this.setState({ keys: keys.filter(value => value !== key) });
    };

    add = () => {
        const keys = this.state.keys;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { initialBreakSchedule } = this.props;
        const { formatMessage } = this.props.intl;

        const getDateTitle = (key, title) => {
            const date = _.get(initialBreakSchedule, [ key, title ]);

            return date ? moment(date, 'YYYY-MM-DD') : date;
        };

        const keys = this.state.keys;

        const dates = [
            ...[ 'beginDate', 'endDate' ].map(name => ({
                title:  <FormattedMessage id={ `break-schedule.${name}` } />,
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
            title:  <FormattedMessage id={ 'break-schedule.comment' } />,
            width:  '35%',
            render: (text, { key }) => (
                <DecoratedInput
                    field={ `schedule[${key}][note]` }
                    getFieldDecorator={ getFieldDecorator }
                    initialValue={ _.get(initialBreakSchedule, 'note') }
                />
            ),
        };

        const breakType = {
            title:  <FormattedMessage id={ 'break-schedule.break_type' } />,
            width:  '15%',
            render: (text, { key }) => (
                <DecoratedSelect
                    cnStyles={ Styles.scheduleType }
                    field={ `schedule[${key}][type]` }
                    getPopupContainer={ trigger =>
                        trigger.parentNode
                    }
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
                    { [ 'absenteeism', 'holiday', 'cant_work', 'legal_holiday', 'valid_reason', 'sick_leave', 'vacation' ].map(item => {
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
                <>
                    <Icon
                        type={ initialBreakSchedule[ key ] ? 'edit' : 'save' }
                        className={ Styles.scheduleBreakIcon }
                        onClick={ () => {
                            const callback = entity => {
                                const initialEntity = initialBreakSchedule[ key ];

                                if (initialEntity) {
                                    const { id } = initialEntity;
                                    this.props.updateBreakSchedule(id, entity);
                                } else {
                                    this.props.createBreakSchedule(entity);
                                }
                            };
                            this.getBreakScheduleData(key, callback);
                        } }
                    />{' '}
                    <Icon
                        type='delete'
                        className={ Styles.scheduleBreakIcon }
                        onClick={ () => {
                            this.remove(key);
                            const id = _.get(initialBreakSchedule, [ key, 'id' ]);
                            if (id) {
                                this.props.deleteBreakSchedule(id);
                            }
                        } }
                    />
                </>
            ,
        };

        const columns = [ breakType, ...dates, comment, actions ];

        return (
            <Catcher>
                <Table
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    size='small'
                    scroll={ { x: 1000 } }
                    pagination={ false }
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
                <StyledButton
                    type='secondary'
                    onClick={ this.add }
                    className={ Styles.newScheduleBreak }
                >
                    <Icon type='plus' />
                    <FormattedMessage id='add_break_schedule' />
                </StyledButton>
            </Catcher>
        );
    }
}

export default ArrayBreakScheduleInput;
