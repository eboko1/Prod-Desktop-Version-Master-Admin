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

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;

@injectIntl
@withRouter
class ArrayScheduleInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keys: [],
        };
    }
    componentDidMount() {
        this.setState({
            keys: this.props.initialSchedule.map((item, key) => key),
        });
    }
    remove = key => {
        const {
            optional,
            // form: { getFieldValue, setFieldsValue },
        } = this.props;

        //const keys = getFieldValue(`${this.props.fieldName}Keys`);
        const keys = this.state.keys;
        if (keys.length === 1 && !optional) {
            return;
        }

        this.setState({ keys: keys.filter(value => value !== key) });
        // setFieldsValue({
        //     [ `${this.props.fieldName}Keys` ]: keys.filter(
        //         value => value !== key,
        //     ),
        // });
    };

    add = () => {
        // const keys = this.props.form.getFieldValue(
        //     `${this.props.fieldName}Keys`,
        // );
        // this.props.form.setFieldsValue({
        //     [ `${this.props.fieldName}Keys` ]: [ ...keys, uuid++ ],
        // });
        const keys = this.state.keys;
        this.setState({ keys: [ ...keys, keys.length++ ] });
    };

    render() {
        const { getFieldDecorator } = this.props;
        const { fieldName, fieldTitle, initialSchedule, optional } = this.props;
        const { formatMessage } = this.props.intl;
        // getFieldDecorator(`${fieldName}Keys`, {
        //     initialValue: optional ? [] : [ 0 ],
        // });
        //const keys = getFieldValue(`${fieldName}Keys`);
        const keys = this.state.keys;
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
                                field={ `beginWorkingHours[${key}]` }
                                rules={ [
                                    {
                                        required: true,
                                        message:  '',
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
                                hasFeedback
                                // disabledHours={ disabledHours }
                                // disabledMinutes={ disabledMinutes }
                                // disabledSeconds={ disabledSeconds }
                                label={ <FormattedMessage id='beginWorkingHours' /> }
                                formatMessage={ formatMessage }
                                // className={ Styles.datePanelItem }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                            <span>-</span>
                            <DecoratedTimePicker
                                formItem
                                field={ `endWorkingHours[${key}]` }
                                rules={ [
                                    {
                                        required: true,
                                        message:  '',
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

                                // disabledHours={ disabledHours }
                                // disabledMinutes={ disabledMinutes }
                                // disabledSeconds={ disabledSeconds }
                                label={ <FormattedMessage id='endWorkingHours' /> }
                                formatMessage={ formatMessage }
                                // className={ Styles.datePanelItem }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                        </div>
                        <div className={ Styles.Hours }>
                            <DecoratedTimePicker
                                formItem
                                field={ `beginBreakHours[${key}]` }
                                initialValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].beginBreakHours &&
                                    moment(
                                        initialSchedule[ key ].beginBreakHours,
                                        'HH:mm',
                                    )
                                }
                                hasFeedback
                                label={ <FormattedMessage id='beginBreakHours' /> }
                                formatMessage={ formatMessage }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                            <span>-</span>
                            <DecoratedTimePicker
                                formItem
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
                                // disabledHours={ disabledHours }
                                // disabledMinutes={ disabledMinutes }
                                // disabledSeconds={ disabledSeconds }
                                label={ <FormattedMessage id='endBreakHours' /> }
                                formatMessage={ formatMessage }
                                // className={ Styles.datePanelItem }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                        </div>
                    </Col>
                    <Col span={ 4 }>
                        <Row type='flex' justify='center'>
                            { /* <Icon
                                key={ key }
                                className='dynamic-delete-button'
                                type='save'
                                style={ { fontSize: 20, color: '#cc1300' } }
                                disabled={ keys.length === 1 }
                                onClick={ () => this.props.saveEmployeeSchedule(key) }
                            /> */ }
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
                                                )[ 2 ],
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
                                        this.props.saveEmployeeSchedule(keys)
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
