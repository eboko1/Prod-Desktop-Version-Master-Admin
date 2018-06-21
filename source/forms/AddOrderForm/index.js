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
import { antdReduxFormActions } from 'core/forms/antdReduxForm/actions';

import {
    DetailsTable,
    ServicesTable,
    DiscountPanel,
} from 'components/OrderFormTables';
import { withReduxForm, hasErrors } from 'utils';

// own
import { DecoratedInput } from './DecoratedInput';
import Styles from './styles.m.css';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const { TextArea } = Input;

@withReduxForm({
    name:    'order',
    fields:  [ 'status' ],
    actions: { change: antdReduxFormActions.change },
})
export class AddOrderForm extends Component {
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
    render() {
        const { getFieldDecorator, getFieldsError } = this.props.form;
        const formItemLayout = {
            labelCol:   { span: 6 },
            wrapperCol: { span: 14 },
        };

        const dateFormat = 'YYYY/MM/DD';
        const hourFormat = 'HH:mm';

        const buttonDisabled = hasErrors(getFieldsError());

        return (
            <Form onSubmit={ this.handleSubmit } layout='horizontal'>
                <Button
                    type='dashed'
                    htmlType='submit'
                    disabled={ buttonDisabled }
                >
                    inner submit (test validation)
                </Button>
                { /* <FormItem { ...formItemLayout } label='Plain Text'>
                    <span className='ant-form-text'>China</span>
                </FormItem> */ }
                { /*
                <FormItem { ...formItemLayout } label='Radio.Button'>
                    { getFieldDecorator('status')(
                        <RadioGroup>
                            <RadioButton value='reserve'>Reserve</RadioButton>
                            <RadioButton value='new'>New</RadioButton>
                            <RadioButton value='questionable'>
                                Questionable
                            </RadioButton>
                            <RadioButton value='approved'>Approved</RadioButton>
                        </RadioGroup>,
                    ) }
                </FormItem> */ }

                <div>
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
                    <FormItem label='Ответственный' hasFeedback>
                        { getFieldDecorator('select', {
                            rules: [
                                {
                                    required: true,
                                    message:  'Please select your country!',
                                },
                            ],
                        })(
                            <Select placeholder='Выберете менеджера'>
                                <Option value='vasya'>Vasya</Option>
                                <Option value='vanya'>Vanya</Option>
                            </Select>,
                        ) }
                    </FormItem>
                </div>

                <div className={ Styles.clientBlock }>
                    <div className={ Styles.clientCol }>
                        <div className={ Styles.client }>
                            <FormItem label='Client'>
                                <Input placeholder='find client' />
                                <Icon
                                    type='plus'
                                    className={ Styles.addClientIcon }
                                />
                            </FormItem>
                        </div>
                        <FormItem label='ПИБ'>
                            <Select
                                showSearch
                                style={ { width: 200 } }
                                placeholder='Select a person'
                                optionFilterProp='children'
                                onChange={ this.handleChangeSearchSelect }
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
                            </Select>
                        </FormItem>
                        <FormItem label='Phone'>
                            <Select
                            // defaultValue='lucy'
                            // style={ { width: 120 } }
                            // onChange={ handleChange }
                            >
                                <Option value='jack'>Jack</Option>
                                <Option value='lucy'>Lucy</Option>
                            </Select>
                        </FormItem>
                        <FormItem label='Email'>
                            <Select>
                                <Option value='jack'>Bob</Option>
                                <Option value='lucy'>Elf</Option>
                            </Select>
                        </FormItem>
                    </div>
                    <div className={ Styles.autoCol }>
                        <div className={ Styles.auto }>Auto</div>
                        <FormItem label='Auto'>
                            <Select>
                                <Option value='jack'>Jack</Option>
                                <Option value='lucy'>Lucy</Option>
                            </Select>
                        </FormItem>
                        <FormItem label='Гос номер'>
                            <Input placeholder='find client' />
                        </FormItem>
                        <FormItem label='Пробег'>
                            <Input placeholder='find client' />
                        </FormItem>
                        <FormItem label='VIN-code'>
                            <Input placeholder='find client' />
                        </FormItem>
                    </div>
                </div>

                <div className={ Styles.totalBlock }>
                    <FormItem label='способ оплыты'>
                        <Select>
                            <Option value='cash'>
                                <Icon type='wallet' />Нал
                            </Option>
                            <Option value='card'>
                                <Icon type='credit-card' />Безнал
                            </Option>
                        </Select>
                    </FormItem>
                    <div>TOTAL 0uah.</div>
                </div>
                { /* <FormItem wrapperCol={ { span: 12, offset: 6 } }>
                    <Button type='primary' htmlType='submit'>
                        Submit
                    </Button>
                </FormItem> */ }
                { /* FORMS TABS */ }
                <Tabs onChange={ () => this.callback() } type='card'>
                    <TabPane tab='Services' key='1'>
                        <ServicesTable />
                        <DiscountPanel />
                    </TabPane>
                    <TabPane tab='Details' key='2'>
                        <DetailsTable />
                        <DiscountPanel />
                    </TabPane>
                    <TabPane tab='Comments' key='3'>
                        <FormItem { ...formItemLayout } label='Client Comments'>
                            { getFieldDecorator('comment', {
                                rules: [
                                    {
                                        max:     2000,
                                        message: 'Too much',
                                    },
                                ],
                            })(
                                <TextArea
                                    placeholder='Autosize height min/max'
                                    autosize={ { minRows: 2, maxRows: 6 } }
                                />,
                            ) }
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label='Services recommendation'
                        >
                            { getFieldDecorator('recommendation', {
                                rules: [
                                    {
                                        max:     2000,
                                        message: 'Too much',
                                    },
                                ],
                            })(
                                <TextArea
                                    placeholder='Autosize height min/max'
                                    autosize={ { minRows: 2, maxRows: 6 } }
                                />,
                            ) }
                        </FormItem>
                    </TabPane>
                </Tabs>
            </Form>
        );
    }
}
