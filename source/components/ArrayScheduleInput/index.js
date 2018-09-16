// vendor
import React, { Component } from 'react';
import { Icon, Col, Form, Table } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
// proj
import {
    DecoratedCheckbox,
    DecoratedTimePicker,
} from 'forms/DecoratedFields';
import { Catcher, StyledButton } from 'commons';

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

    getScheduleData(key, callback) {
        this.props.form.validateFields([ `schedule[${key}]` ], err => {
            if (err) {
                return;
            }
            const schedule = this.props.form.getFieldValue(`schedule[${key}]`);
            const scheduleWithParsedHours = _.mapValues(
                schedule,
                value =>
                    moment.isMoment(value) ? value.format('HH:mm') : value,
            );

            callback && callback(scheduleWithParsedHours);
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
        const { initialSchedule } = this.props;
        const { formatMessage } = this.props.intl;

        const getHourTitle = (key, title) => {
            const date = _.get(initialSchedule, [ key, title ]);

            return date ? moment(date, 'HH:mm') : date;
        };

        const keys = this.state.keys;

        const days = [
            ...[ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ].map(day => ({
                title:  <FormattedMessage id={ day } />,
                width:  '7%',
                render: (text, record) => (
                    <Col span={ 12 }>
                        <DecoratedCheckbox
                            field={ `schedule[${record.key}][${day}]` }
                            getFieldDecorator={ getFieldDecorator }
                            initValue={ _.get(initialSchedule, [ record.key, day ]) }
                        />
                    </Col>
                ),
            })),
        ];

        const workingHours = [
            ...[ 'beginWorkingHours', 'endWorkingHours' ].map(name => ({
                title:  <FormattedMessage id={ name } />,
                width:  '12%',
                render: (text, record) => (
                    <DecoratedTimePicker
                        field={ `schedule[${record.key}][${name}]` }
                        formItem
                        rules={ [
                            {
                                required: true,
                                message:  formatMessage({
                                    id: 'required_field',
                                }),
                            },
                        ] }
                        initialValue={ getHourTitle(record.key, name) }
                        formatMessage={ formatMessage }
                        getFieldDecorator={ getFieldDecorator }
                        minuteStep={ 30 }
                    />
                ),
            })),
        ];

        const breakHours = [
            ...[ 'beginBreakHours', 'endBreakHours' ].map(name => ({
                title:  <FormattedMessage id={ name } />,
                width:  '10%',
                render: (text, record) => (
                    <DecoratedTimePicker
                        field={ `schedule[${record.key}][${name}]` }
                        initialValue={ getHourTitle(record.key, name) }
                        formatMessage={ formatMessage }
                        getFieldDecorator={ getFieldDecorator }
                        minuteStep={ 30 }
                    />
                ),
            })),
        ];

        const actions = {
            title:  '',
            width:  '10%',
            render: (text, { key }) => 
                <>
                    <Icon
                        type={ initialSchedule[ key ] ? 'edit' : 'save' }
                        className={ Styles.scheduleIcon }
                        onClick={ () => {
                            const callback = entity => {
                                const initialEntity = initialSchedule[ key ];
                                if (initialEntity) {
                                    const { id } = initialEntity;
                                    this.props.updateSchedule(id, entity);
                                } else {
                                    this.props.createSchedule(entity);
                                }
                            };
                            this.getScheduleData(key, callback);
                        } }
                    />{' '}
                    <Icon
                        type='delete'
                        className={ Styles.scheduleIcon }
                        onClick={ () => {
                            this.remove(key);
                            const id = _.get(initialSchedule, [ key, 'id' ]);
                            if (id) {
                                this.props.deleteSchedule(id);
                            }
                        } }
                    />
                </>
            ,
        };

        const columns = [ ...days, ...workingHours, ...breakHours, actions ];

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
                    className={ Styles.newSchedule }
                >
                    <Icon type='plus' />
                    <FormattedMessage id='add_schedule' />
                </StyledButton>
            </Catcher>
        );
    }
}
