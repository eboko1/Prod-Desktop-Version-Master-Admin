// vendor
import React, { Component } from 'react';
import { Icon, Button, Row, Col, Form, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { v4 } from 'uuid';

// proj
import {
    DecoratedDatePicker,
    DecoratedInput,
    DecoratedSelect, 
} from 'forms/DecoratedFields';
import {
    fetchEmployeeBreakSchedule,
    saveEmployeeBreakSchedule,
    deleteEmployeeBreakSchedule,
} from 'core/forms/employeeBreakScheduleForm/duck';
import { onChangeEmployeeBreakScheduleForm } from 'core/forms/employeeBreakScheduleForm/duck';
import { withReduxForm, getDateTimeConfigs } from 'utils';

// own
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;

@injectIntl
@withRouter
@withReduxForm({
    name:    'employeeBreakScheduleForm',
    actions: {
        change: onChangeEmployeeBreakScheduleForm,
        fetchEmployeeBreakSchedule,
        saveEmployeeBreakSchedule,
        deleteEmployeeBreakSchedule,
    },
})
class ArrayScheduleInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keys: [  ],
        };
    }
    saveEmployeeBreakSchedule=()=>{
        const {keys}=this.state
        const form = this.props.form;
        form.validateFields((err, values) => {
            if (!err) {
                keys.map(item => {
                    let data = {
                        type: values.type[ item ]
                            ? values.type[ item ]
                            : null,
                        beginDate: values.beginDate[ item ]
                            ? values.beginDate[ item ].format('YYYY-MM-DD')
                            : null,
                        endDate: values.endDate[ item ]
                            ? values.endDate[ item ].format('YYYY-MM-DD')
                            : null,
                        note: values.note[ item ]
                            ? values.note[ item ]
                            : null,
                        
                        subjectType: 'employee',
                    };
                    if (!values.id[ item ]) {
                        this.props.saveEmployeeBreakSchedule({
                            schedule: data,
                            id:       this.props.history.location.pathname.split(
                                '/',
                            )[ 2 ],
                            update: false,
                        });
                    }else if(values.id[ item ]){
                        this.props.saveEmployeeBreakSchedule({
                            schedule: data,
                            id:       this.props.history.location.pathname.split(
                                '/',
                            )[ 2 ],
                            update: 'true',
                        });
                    }
            
                });
            }
        });
    }
    componentDidMount() {
        this.setState({
            // keys: [ ...this.props.initialSchedule.map((item, key) => key),                 ...[ this.props.initialSchedule?this.props.initialSchedule[ this.props.initialSchedule.length+1 ]+1:[] ]  ],
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
        const { getFieldDecorator } = this.props.form;
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
                            
                        <div className={ Styles.Hours }>
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
                            <DecoratedSelect
                                // formItem
                                // label='Выберите причину отмены'
                                field={ `type[${key}]` }
                                cnStyles={ Styles.Select }
                                style={ {minWidth: '150px'} }
                                getFieldDecorator={ getFieldDecorator }
                                getPopupContainer={ trigger => trigger.parentNode }
                            >
                                { [ 'absenteeism', 'holiday', 'cant_work', 'legal_holiday', 'valid_reason', 'sick_leave', 'vacation'                                ].map(item=>{
                                    return <Option value={ item } key={ v4() }>
                                        <FormattedMessage id={ item } />
                                    </Option>
                                }) }
                                
                                       
                            </DecoratedSelect>
                            <DecoratedDatePicker
                                // formItem
                                field={ `beginDate[${key}]` }
                                rules={ [
                                    {
                                        required: true,
                                        message:  'Begin date is reuired',
                                    },
                                ] }
                                initialValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].beginDate &&
                                    moment(
                                        initialSchedule[ key ].beginDate,
                                        'YYYY-MM-DD',
                                    )
                                }
                                hasFeedback
                                // disabledHours={ disabledHours }
                                // disabledMinutes={ disabledMinutes }
                                // disabledSeconds={ disabledSeconds }
                                // label={ <FormattedMessage id='beginDate' /> }
                                formatMessage={ formatMessage }
                                // className={ Styles.datePanelItem }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                            <span>-</span>
                            <DecoratedDatePicker
                                // formItem
                                field={ `endDate[${key}]` }
                                rules={ [
                                    {
                                        required: true,
                                        message:  '',
                                    },
                                ] }
                                initialValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].endDate &&
                                    moment(
                                        initialSchedule[ key ].endDate,
                                        'YYYY-MM-DD',
                                    )
                                }
                                hasFeedback={ false }

                                // disabledHours={ disabledHours }
                                // disabledMinutes={ disabledMinutes }
                                // disabledSeconds={ disabledSeconds }
                                // label={ <FormattedMessage id='endWorkingHours' /> }
                                formatMessage={ formatMessage }
                                // className={ Styles.datePanelItem }
                                getFieldDecorator={ getFieldDecorator }
                                minuteStep={ 30 }
                            />
                            <DecoratedInput
                                // formItem
                                className={ Styles.InputNote }
                                field={ `note[${key}]` }
                                getFieldDecorator={ getFieldDecorator }
                                initialValue={
                                    initialSchedule[ key ] &&
                                    initialSchedule[ key ].note
                                }
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
                                        if (initialSchedule[ key ]&&initialSchedule[ key ].id) {
                                            this.props.deleteEmployeeBreakSchedule(
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
                                        this.saveEmployeeBreakSchedule(keys)
                                    }
                                >
                                    <Icon type='save' />
                                    <FormattedMessage id='save_break_schedules' />
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
