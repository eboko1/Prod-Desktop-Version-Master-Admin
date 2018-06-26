// vendor
import React, { Component } from 'react';
import {
    Form,
    Select,
    Radio,
    Button,
    Tabs,
    Input,
    DatePicker,
    TimePicker,
    Icon,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

//proj
// import { antdReduxFormActions } from 'core/forms/antdReduxForm/actions';
import { onChangeUniversalFiltersForm } from 'core/forms/universalFiltersForm/duck';

import { withReduxForm, hasErrors } from 'utils';

// own
// import { DecoratedInput } from './DecoratedInput';
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

@withReduxForm({
    name:    'universalFilters',
    fields:  [ 'vehicleMakes' ],
    actions: { change: onChangeUniversalFiltersForm },
})
export class UniversalFiltersForm extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // eslint-disable-next-line
                console.log("Received values of form: ", values);
            }
        });
    };

    callback(key) {
        console.log(key);
    }

    handleChangeSearchSelect(value) {
        console.log(`selected ${value}`);
    }

    handleChange(value) {
        console.log('→ value', value);
    }

    render() {
        const { modalContentDivWrapper } = this.props;
        const { getFieldDecorator, getFieldsError } = this.props.form;
        const formItemLayout = {
            labelCol:   { span: 6 },
            wrapperCol: { span: 14 },
        };

        const dateFormat = 'YYYY/MM/DD';
        const hourFormat = 'HH:mm';

        // const buttonDisabled = hasErrors(getFieldsError());

        return (
            <Form onSubmit={ this.handleSubmit } layout='horizontal'>
                <FormItem label='Select Date' hasFeedback>
                    <DatePicker
                        defaultValue={ moment('2015/01/01', dateFormat) }
                        format={ dateFormat }
                    />
                    <TimePicker
                        defaultValue={ moment('12:08', hourFormat) }
                        format={ hourFormat }
                    />
                </FormItem>
                <FormItem label='пост'>
                    <Select>
                        <Option value='jack'>Нулевой Пост</Option>
                        <Option value='lucy'>Пост - 1</Option>
                    </Select>
                </FormItem>
                <FormItem label='Vehicle Makes'>
                    { getFieldDecorator('vehicleMakes', {
                        rules: [
                            {
                                required: true,
                                message:  'vehicleMakes is required!',
                            },
                        ],
                    })(
                        <Select
                            showSearch
                            style={ { width: 200 } }
                            placeholder='Select a service'
                            optionFilterProp='children'
                            onChange={ value => this.handleChange(value) }
                            // getPopupContainer={ () => modalContentDivWrapper }
                            // getPopupContainer={ () => modalContentDivWrapper }
                            // onFocus={ handleFocus }
                            // onBlur={ handleBlur }
                            filterOption={ (input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value='jack'>Jack</Option>
                            <Option value='lucy'>Lucy</Option>
                            <Option value='tom'>Tom</Option>
                        </Select>,
                    ) }
                </FormItem>
            </Form>
        );
    }
}
