// vendor
import React, { Component } from 'react';
import { Icon, Button, Row, Col, Form, Checkbox } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
// proj
import {
    DecoratedCheckbox,
    DecoratedTimePicker,
    DecoratedInput,
} from 'forms/DecoratedFields';

import { permissions, isForbidden } from 'utils';
// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

@injectIntl
export default class ArrayScheduleInput extends Component {
    constructor(props) {
        super(props);

        const { initialSchedule } = props;
        this.uuid = _.isArray(initialSchedule) ? initialSchedule.length : 0;
        const keys = _.isArray(initialSchedule) ? _.keys(initialSchedule) : [];

        this.state = { keys };
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props.initialSchedule, prevProps.initialSchedule)) {
            this.props.form.resetFields();

            const { initialSchedule } = this.props;
            this.uuid = _.isArray(initialSchedule) ? initialSchedule.length : 0;
            const keys = _.isArray(initialSchedule)
                ? _.keys(initialSchedule)
                : [];

            this.setState({ keys });
        }
    }

    getScheduleData(key) {
        const schedule = this.props.form.getFieldValue(`schedule[${key}]`);
        const scheduleWithParsedHours = _.mapValues(
            schedule,
            value => moment.isMoment(value) ? value.format('HH:mm') : value,
        );

        return {
            ...scheduleWithParsedHours,
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
        const { initialSchedule } = this.props;
        const { formatMessage } = this.props.intl;

        const getHourTitle = (key, title) => {
            const date = _.get(initialSchedule, [ key, title ]);

            return date ? moment(date, 'HH:mm') : date;
        };

        const keys = this.state.keys;
        const formItems = keys.map(key => {
            return (
                <div className={ Styles.MainBlock }>
                    <Row type='flex' align='middle' key={ key }>
                        <Col span={ 12 }>
                            <Row>
                                { [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ].map(day => (
                                    <Col span={ 6 }>
                                        <DecoratedCheckbox
                                            field={ `schedule[${key}][${day}]` }
                                            getFieldDecorator={
                                                getFieldDecorator
                                            }
                                            initValue={ _.get(initialSchedule, [ key, day ]) }
                                        >
                                            <FormattedMessage id={ day } />
                                        </DecoratedCheckbox>
                                    </Col>
                                )) }
                            </Row>
                        </Col>
                        <Col span={ 12 }>
                            <Row type='flex' align='middle'>
                                <Col span={ 12 }>
                                    <DecoratedTimePicker
                                        formItem
                                        field={ `schedule[${key}][beginWorkingHours]` }
                                        rules={ [
                                            {
                                                required: true,
                                                message:  formatMessage({
                                                    id: 'required_field',
                                                }),
                                            },
                                        ] }
                                        initialValue={ getHourTitle(
                                            key,
                                            'beginWorkingHours',
                                        ) }
                                        hasFeedback
                                        label={
                                            <FormattedMessage id='beginWorkingHours' />
                                        }
                                        formatMessage={ formatMessage }
                                        getFieldDecorator={ getFieldDecorator }
                                        minuteStep={ 30 }
                                    />
                                    <DecoratedTimePicker
                                        formItem
                                        field={ `schedule[${key}][endWorkingHours]` }
                                        rules={ [
                                            {
                                                required: true,
                                                message:  formatMessage({
                                                    id: 'required_field',
                                                }),
                                            },
                                        ] }
                                        initialValue={ getHourTitle(
                                            key,
                                            'endWorkingHours',
                                        ) }
                                        hasFeedback
                                        label={
                                            <FormattedMessage id='endWorkingHours' />
                                        }
                                        formatMessage={ formatMessage }
                                        getFieldDecorator={ getFieldDecorator }
                                        minuteStep={ 30 }
                                    />
                                </Col>
                                <Col span={ 12 }>
                                    <DecoratedTimePicker
                                        formItem
                                        field={ `schedule[${key}][beginBreakHours]` }
                                        initialValue={ getHourTitle(
                                            key,
                                            'beginBreakHours',
                                        ) }
                                        label={
                                            <FormattedMessage id='beginBreakHours' />
                                        }
                                        formatMessage={ formatMessage }
                                        getFieldDecorator={ getFieldDecorator }
                                        minuteStep={ 30 }
                                    />
                                    <DecoratedTimePicker
                                        formItem
                                        field={ `schedule[${key}][endBreakHours]` }
                                        initialValue={ getHourTitle(
                                            key,
                                            'endBreakHours',
                                        ) }
                                        label={
                                            <FormattedMessage id='endBreakHours' />
                                        }
                                        formatMessage={ formatMessage }
                                        getFieldDecorator={ getFieldDecorator }
                                        minuteStep={ 30 }
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Button
                        type={ 'primary' }
                        onClick={ () => {
                            this.remove(key);
                            const id = _.get(initialSchedule, [ key, 'id' ]);
                            if (id) {
                                this.props.deleteSchedule(id);
                            }
                        } }
                    >
                        Delete
                    </Button>{ ' ' }
                    <Button
                        type={ 'primary' }
                        onClick={ () => {
                            const initialEntity = initialSchedule[ key ];
                            const entity = this.getScheduleData(key);

                            if (initialEntity) {
                                const { id } = initialEntity;
                                this.props.updateSchedule(id, entity);
                            } else {
                                this.props.createSchedule(entity);
                            }
                        } }
                    >
                        { initialSchedule[ key ] ? 'Save' : 'Create' }
                    </Button>
                </div>
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
