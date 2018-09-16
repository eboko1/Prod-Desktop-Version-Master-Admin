// vendor
import React, { Component } from 'react';
import { Icon, Button, Row, Col, Form, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';

// proj
import {
    DecoratedDatePicker,
    DecoratedInput,
    DecoratedSelect,
} from 'forms/DecoratedFields';

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
        if (!_.isEqual(this.props.initialBreakSchedule, prevProps.initialBreakSchedule)) {
            this.props.form.resetFields();

            const { initialBreakSchedule } = this.props;
            this.uuid = _.isArray(initialBreakSchedule) ? initialBreakSchedule.length : 0;
            const keys = _.isArray(initialBreakSchedule)
                ? _.keys(initialBreakSchedule)
                : [];

            this.setState({ keys });
        }
    }

    getBreakScheduleData(key) {
        const schedule = this.props.form.getFieldValue(`schedule[${key}]`);
        const scheduleWithParsedHours = _.mapValues(
            schedule,
            value =>
                moment.isMoment(value) ? value.format('YYYY-MM-DD') : value,
        );

        return {
            ...scheduleWithParsedHours,
            subjectType: 'employee',
        };
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
        const formItems = keys.map(key => {
            return (
                <Row
                    className={ Styles.MainBlock }
                    type='flex'
                    align='middle'
                    key={ key }
                >
                    <Col span={ 20 }>
                        <div className={ Styles.Hours }>
                            <DecoratedSelect
                                formItem
                                field={ `schedule[${key}][type]` }
                                cnStyles={ Styles.Select }
                                style={ { minWidth: '150px' } }
                                getFieldDecorator={ getFieldDecorator }
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
                                rules={ [
                                    {
                                        required: true,
                                        message:  'Type is required',
                                    },
                                ] }
                                hasFeedback={ false }
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
                            <DecoratedDatePicker
                                field={ `schedule[${key}][beginDate]` }
                                formItem
                                rules={ [
                                    {
                                        required: true,
                                        message:  'Begin date is required',
                                    },
                                ] }
                                initialValue={ getDateTitle(key, 'beginDate') }
                                hasFeedback
                                formatMessage={ formatMessage }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                            <FormItem>
                                <span>-</span>
                            </FormItem>
                            <DecoratedDatePicker
                                field={ `schedule[${key}][endDate]` }
                                formItem
                                rules={ [
                                    {
                                        required: true,
                                        message:  '',
                                    },
                                ] }
                                initialValue={ getDateTitle(key, 'endDate') }
                                hasFeedback={ false }
                                formatMessage={ formatMessage }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                            <DecoratedInput
                                className={ Styles.InputNote }
                                field={ `schedule[${key}][note]` }
                                formItem
                                getFieldDecorator={ getFieldDecorator }
                                initialValue={ _.get(
                                    initialBreakSchedule,
                                    'note',
                                ) }
                            />
                        </div>
                    </Col>
                    <Col span={ 4 }>
                        <Row type='flex' justify='center'>
                            <Button
                                type={ 'primary' }
                                onClick={ () => {
                                    this.remove(key);
                                    const id = _.get(initialBreakSchedule, [ key, 'id' ]);
                                    if (id) {
                                        this.props.deleteBreakSchedule(id);
                                    }
                                } }
                            >
                                Delete
                            </Button>
                            <Button
                                type={ 'primary' }
                                onClick={ () => {
                                    const initialEntity =
                                        initialBreakSchedule[ key ];
                                    const entity = this.getBreakScheduleData(key);

                                    if (initialEntity) {
                                        const { id } = initialEntity;
                                        this.props.updateBreakSchedule(
                                            id,
                                            entity,
                                        );
                                    } else {
                                        this.props.createBreakSchedule(entity);
                                    }
                                } }
                            >
                                { initialBreakSchedule[ key ] ? 'Save' : 'Create' }
                            </Button>
                        </Row>
                    </Col>
                </Row>
            );
        });

        return (
            <div>
                { formItems }
                <Button
                    type='dashed'
                    className={ Styles.AddButton }
                    onClick={ this.add }
                >
                    <Icon type='plus' /> { this.props.buttonText }
                </Button>
            </div>
        );
    }
}

export default ArrayBreakScheduleInput;
