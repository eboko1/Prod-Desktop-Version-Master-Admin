

// vendor
import React, { Component } from 'react';
import {Form, Button, Select, Icon, Tooltip, Input} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { v4 } from 'uuid';
//proj
import { onChangeEmployeeScheduleForm } from 'core/forms/employeeScheduleForm/duck';

import { withReduxForm, getDateTimeConfigs } from 'utils';

// own
import {
    DecoratedInputPhone,
    DecoratedInput,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';
import Styles from './styles.m.css';


// own
const FormItem = Form.Item;

@injectIntl
@withReduxForm({
    name:    'employeeScheduleForm',
    actions: {
        change: onChangeEmployeeScheduleForm,
    },
})
export class EmployeeScheduleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toogleDirectory: false,
        };
    }
    remove = key => {
        const { fieldName, values, optional } = this.props;

        if (values.length === 1 && !optional) {
            return;
        }

        if (values.length === 1) {
            this.props.onChange(
                {
                    [ fieldName ]: [],
                },
                { form: '', field: fieldName },
            );
        }
        const newValues = [ ...values.slice(0, key), ...values.slice(key + 1, values.length) ].map((value, index) => ({
            ...value,
            name: `${fieldName}[${index}]`,
        }));

        this.props.onChange({
            [ fieldName ]: newValues,
        });
    };

    add = () => {
        const { fieldName, values } = this.props;
        const newValue = {
            errors:     void 0,
            name:       `${fieldName}[${values.length}]`,
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      true,
        };

        this.props.onChange(
            { [ fieldName ]: [ ...values, newValue ] },
            { form: '', field: fieldName },
        );
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;
        const {
            initialEmployee,
            saveEmployee,
        } = this.props;

        const { fieldName, values, fieldTitle, rules, optional } = this.props;

        const formItems = values.map((value, index) => {
            return (
                <Row type='flex' align='middle' key={ index }>
                    <Col span={ 20 }>
                        <div>
                            <Button size='small'><FormattedMessage id='mon'/></Button>
                            <Button size='small'><FormattedMessage id='tue'/></Button>
                            <Button size='small'><FormattedMessage id='wed'/></Button>
                            <Button size='small'><FormattedMessage id='thu'/></Button>
                            <Button size='small'><FormattedMessage id='fri'/></Button>
                            <Button size='small'><FormattedMessage id='sat'/></Button>
                            <Button size='small'><FormattedMessage id='sun'/></Button>

                        </div>
                    </Col>
                    <Col span={ 4 }>
                        <Row type='flex' justify='center'>
                            { values.length > 1 || optional ? (
                                <Icon
                                    key={ index }
                                    className='dynamic-delete-button'
                                    type='minus-circle-o'
                                    style={ { fontSize: 20, color: '#cc1300' } }
                                    disabled={ values.length === 1 }
                                    onClick={ () => this.remove(index) }
                                />
                            ) : null }
                        </Row>
                    </Col>
                </Row>
            );
        });

        return (
            <Form layout='horizontal'>
                <Col>
                    { formItems }
                    <Row type='flex'>
                        <Col span={ 20 }>
                            <Row type='flex' justify='center'>
                                <FormItem>
                                    <Button type='dashed' onClick={ this.add }>
                                        <Icon type='plus' /> { this.props.buttonText }
                                    </Button>
                                </FormItem>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Form>
        );
    }
}


