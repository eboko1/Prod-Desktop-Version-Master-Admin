// vendor
import React, { Component } from 'react';
import { Icon, Button, Row, Col, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
// proj
import {
    DecoratedCheckbox,
    DecoratedTimePicker,
    DecoratedInput,
} from 'forms/DecoratedFields';
import { onChangeEmployeeScheduleForm } from 'core/forms/employeeScheduleForm/duck';
import {
    fetchEmployeeSchedule,
    saveEmployeeSchedule,
    deleteEmployeeSchedule,
} from 'core/forms/employeeScheduleForm/duck';
import { withReduxForm } from 'utils';
// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

@injectIntl
@withRouter
@withReduxForm({
    name:    'employeeScheduleForm',
    actions: {
        change: onChangeEmployeeScheduleForm,
        fetchEmployeeSchedule,
        saveEmployeeSchedule,
        deleteEmployeeSchedule,
    },
})
class ArrayScheduleInput extends Component {


state = {
    keys: [],
}

    saveScheduleEmployeeFormRef = formRef => {
        this.employeeScheduleFormRef = formRef;
    };
    
    saveEmployeeSchedule = keys => {
        const form = this.props.form
        form.validateFields((err, values) => {
            if (!err) {
                keys.map(item => {
                    let data = {
                        beginBreakHours: values.beginBreakHours[ item ]
                            ? values.beginBreakHours[ item ].format('HH:mm')
                            : null,
                        beginWorkingHours: values.beginWorkingHours[ item ]
                            ? values.beginWorkingHours[ item ].format('HH:mm')
                            : null,
                        endBreakHours: values.endBreakHours[ item ]
                            ? values.endBreakHours[ item ].format('HH:mm')
                            : null,
                        endWorkingHours: values.endWorkingHours[ item ]
                            ? values.endWorkingHours[ item ].format('HH:mm')
                            : null,
                        friday: values.friday[ item ]
                            ? values.friday[ item ]
                            : false,
                        monday: values.monday[ item ]
                            ? values.monday[ item ]
                            : false,
                        saturday: values.saturday[ item ]
                            ? values.saturday[ item ]
                            : false,
                        sunday: values.sunday[ item ]
                            ? values.sunday[ item ]
                            : false,
                        thursday: values.thursday[ item ]
                            ? values.thursday[ item ]
                            : false,
                        tuesday: values.tuesday[ item ]
                            ? values.tuesday[ item ]
                            : false,
                        wednesday: values.wednesday[ item ]
                            ? values.wednesday[ item ]
                            : false,
                        type:        'standard',
                        subjectType: 'employee',
                    };
                    if (!values.id[ item ]) {
                        this.props.saveEmployeeSchedule({
                            schedule: data,
                            id:       this.props.history.location.pathname.split(
                                '/',
                            )[ 2 ],
                            update: false,
                        });
                    }else if(values.id[ item ]){
                        this.props.saveEmployeeSchedule({
                            schedule: data,
                            id:       this.props.history.location.pathname.split(
                                '/',
                            )[ 2 ], //emplyee id
                            update: true,
                        });
                    }

                });
            }
        });
    };

    componentDidMount() {
        this.setState({
            keys: this.props.initialSchedule.map((item, key) => key),
        });
    }
    remove = key => {
        const {
            optional,
        } = this.props;

        const keys = this.state.keys;
        if (keys.length === 1 && !optional) {
            return;
        }

        this.setState({ keys: keys.filter(value => value !== key) });

    };

    add = () => {

        const keys = this.state.keys;
        this.setState({ keys: [ ...keys, keys.length++ ] });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { initialSchedule, optional } = this.props;
        const { formatMessage } = this.props.intl;

        const keys = this.state.keys;
        /*eslint-disable complexity*/
        const formItems = keys.map(key => {
            return (
                
                <Row className={ Styles.MainBlock } type='flex' align='middle' key={ key }>
                    <Col span={ 20 }>
                        <div className={ Styles.CheckboxBlock }>
                            <DecoratedInput
                                className={ Styles.InputBlock }
                                style={ {
                                    display:    'none',
                                    visibility: 'hidden',
                                } }
                                field={ `id[${key}]` }
                                getFieldDecorator={ getFieldDecorator }
                                initialValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].id
                                }
                            />
                            <DecoratedCheckbox
                                field={ `monday[${key}]` }
                                getFieldDecorator={ getFieldDecorator }
                                initValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].monday
                                }
                            >
                                <FormattedMessage id='monday' />
                            </DecoratedCheckbox>
                            <DecoratedCheckbox
                                field={ `tuesday[${key}]` }
                                getFieldDecorator={ getFieldDecorator }
                                initValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].tuesday
                                }
                            >
                                <FormattedMessage id='tuesday' />
                            </DecoratedCheckbox>
                            <DecoratedCheckbox
                                field={ `wednesday[${key}]` }
                                getFieldDecorator={ getFieldDecorator }
                                initValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].wednesday
                                }
                            >
                                <FormattedMessage id='wednesday' />
                            </DecoratedCheckbox>
                            <DecoratedCheckbox
                                field={ `thursday[${key}]` }
                                getFieldDecorator={ getFieldDecorator }
                                initValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].thursday
                                }
                            >
                                <FormattedMessage id='thursday' />
                            </DecoratedCheckbox>
                            <DecoratedCheckbox
                                field={ `friday[${key}]` }
                                getFieldDecorator={ getFieldDecorator }
                                initValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].friday
                                }
                            >
                                <FormattedMessage id='friday' />
                            </DecoratedCheckbox>
                            <DecoratedCheckbox
                                field={ `saturday[${key}]` }
                                getFieldDecorator={ getFieldDecorator }
                                initValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].saturday
                                }
                            >
                                <FormattedMessage id='saturday' />
                            </DecoratedCheckbox>
                            <DecoratedCheckbox
                                field={ `sunday[${key}]` }
                                getFieldDecorator={ getFieldDecorator }
                                initValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].sunday
                                }
                            >
                                <FormattedMessage id='sunday' />
                            </DecoratedCheckbox>
                        </div>
                        <div className={ Styles.Hours }>
                            <DecoratedTimePicker
                                formItem
                                className={ Styles.HourItem }
                                field={ `beginWorkingHours[${key}]` }
                                rules={ [
                                    {
                                        required: true,
                                        message:  formatMessage({
                                            id: 'required_field',
                                        }),
                                    },
                                ] }
                                initialValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].beginWorkingHours &&
                                    moment(
                                        initialSchedule[ key ].beginWorkingHours,
                                        'HH:mm',
                                    )
                                }
                                hasFeedback={ false }
                                label={ <FormattedMessage id='beginWorkingHours' /> }
                                formatMessage={ formatMessage }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                            <span className={ Styles.HourDash }>-</span>
                            <DecoratedTimePicker
                                formItem
                                className={ Styles.HourItem }
                                field={ `endWorkingHours[${key}]` }
                                rules={ [
                                    {
                                        required: true,
                                        message:  formatMessage({
                                            id: 'required_field',
                                        }),
                                    },
                                ] }
                                initialValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].endWorkingHours &&
                                    moment(
                                        initialSchedule[ key ].endWorkingHours,
                                        'HH:mm',
                                    )
                                }
                                hasFeedback={ false }
                                label={ <FormattedMessage id='endWorkingHours' /> }
                                formatMessage={ formatMessage }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                        </div>
                        <div className={ Styles.Hours }>
                            <DecoratedTimePicker
                                formItem
                                className={ Styles.HourItem }

                                field={ `beginBreakHours[${key}]` }
                                initialValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].beginBreakHours &&
                                    moment(
                                        initialSchedule[ key ].beginBreakHours,
                                        'HH:mm',
                                    )
                                }
                                hasFeedback={ false }
                                label={ <FormattedMessage id='beginBreakHours' /> }
                                formatMessage={ formatMessage }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                            <span className={ Styles.HourDash }>-</span>
                            <DecoratedTimePicker
                                formItem
                                className={ Styles.HourItem }

                                field={ `endBreakHours[${key}]` }
                                initialValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].endBreakHours &&
                                    moment(
                                        initialSchedule[ key ].endBreakHours,
                                        'HH:mm',
                                    )
                                }
                                hasFeedback={ false }
                                label={ <FormattedMessage id='endBreakHours' /> }
                                formatMessage={ formatMessage }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                        </div>
                    </Col>
                    <Col span={ 4 }>
                        <Row type='flex' justify='center'>
                            { keys.length > 1 || optional ? (
                                <Icon
                                    key={ key }
                                    className='dynamic-delete-button'
                                    type='minus-circle-o'
                                    style={ { fontSize: 20, color: '#cc1300' } }
                                    disabled={ keys.length === 1 }
                                    onClick={ () => {
                                        this.remove(key);
                                        if (initialSchedule[ key ].id) {
                                            this.props.deleteEmployeeSchedule(
                                                initialSchedule[ key ].id,
                                                this.props.history.location.pathname.split(
                                                    '/',
                                                )[ 2 ], //emplyee id
                                            );
                                        }
                                    } }
                                />
                            ) : null }
                        </Row>
                    </Col>
                </Row>
            );
        });

        return (
            <Col>
                { formItems }
                <Row type='flex'>
                    <Col span={ 20 }>
                        <Row type='flex' justify='center'>
                            <FormItem>
                                <Button type='dashed' className={ Styles.AddButton } onClick={ this.add }>
                                    <Icon type='plus' /> { this.props.buttonText }
                                </Button>
                            </FormItem>
                            <FormItem>
                                <Button
                                    type='dashed'
                                    onClick={ () =>
                                        this.saveEmployeeSchedule(keys)
                                    }
                                >
                                    <Icon type='save' />
                                    <FormattedMessage id='save_schedules' />
                                </Button>
                            </FormItem>
                        </Row>
                    </Col>
                </Row>
            </Col>
        );
    }
}

export default ArrayScheduleInput;
