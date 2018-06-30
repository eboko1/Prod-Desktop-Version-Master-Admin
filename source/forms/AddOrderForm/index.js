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
    Spin,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import moment from 'moment';
import { v4 } from 'uuid';
import _ from 'lodash';
import debounce from 'lodash/debounce';

//proj
import {
    fetchAddOrderForm,
    onChangeAddOrderForm,
} from 'core/forms/addOrderForm/duck';

import { DecoratedTextArea, DecoratedSelect } from 'forms/DecoratedFields';
import {
    DetailsTable,
    ServicesTable,
    DiscountPanel,
} from 'components/OrderFormTables';
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

@injectIntl
@withReduxForm({
    name:    'addOrderForm',
    actions: { change: onChangeAddOrderForm, fetchAddOrderForm },
})
export class AddOrderForm extends Component {
    // handleSubmit = e => {
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //         if (!err) {
    //             // eslint-disable-next-line
    //             console.log("Received values of form: ", values);
    //         }
    //     });
    // };

    callback(key) {
        console.log(key);
    }

    handleChangeSearchSelect(value) {
        console.log(`selected ${value}`);
    }

    fetchClientSearch(client) {
        debounce(this.props.fetchClientsSearch, 800);
    }

    render() {
        const {
            allServices,
            allDetails,
            managers,
            employees,
            vehicles,
            stations,
        } = this.props;
        const {
            clients: { clients = [] },
        } = this.props;

        const { getFieldDecorator, getFieldsError } = this.props.form;
        const formItemLayout = {
            labelCol:   { span: 6 },
            wrapperCol: { span: 14 },
        };

        const dateFormat = 'YYYY/MM/DD';
        const hourFormat = 'HH:mm';

        const buttonDisabled = hasErrors(getFieldsError());

        return (
            <Form
                // onSubmit={ this.handleSubmit }
                layout='horizontal'
            >
                <Button
                    type='dashed'
                    htmlType='submit'
                    disabled={ buttonDisabled }
                >
                    inner submit (test validation)
                </Button>
                { /* <FormItem { ...formItemLayout } label='Plain Text'>
                    <span className='ant-form-text'>readonlytext</span>
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

                <div className={ Styles.dateBlock }>
                    <FormItem
                        label={
                            <FormattedMessage id='add_order_form.enrollment_date' />
                        }
                        hasFeedback
                    >
                        <DatePicker
                            defaultValue={ moment('2015/01/01', dateFormat) }
                            format={ dateFormat }
                        />
                        <TimePicker
                            defaultValue={ moment('12:08', hourFormat) }
                            format={ hourFormat }
                        />
                    </FormItem>
                    <FormItem
                        label={ <FormattedMessage id='add_order_form.post' /> }
                    >
                        <Select>
                            { stations.map(station => (
                                <Option value={ station.num } key={ v4() }>
                                    { station.name }
                                </Option>
                            )) }
                        </Select>
                    </FormItem>
                    <FormItem label='Ответственный' hasFeedback>
                        { getFieldDecorator('managers', {
                            rules: [
                                {
                                    required: true,
                                    message:  'Please select your country!',
                                },
                            ],
                        })(
                            <Select placeholder='Выберете менеджера'>
                                { managers.map(manager => (
                                    <Option value={ manager.id } key={ v4() }>
                                        { `${manager.managerName} ${
                                            manager.managerSurname
                                        }` }
                                    </Option>
                                )) }
                            </Select>,
                        ) }
                    </FormItem>
                </div>

                <div className={ Styles.clientBlock }>
                    <div className={ Styles.clientCol }>
                        <div className={ Styles.client }>
                            <FormItem
                                label={
                                    <FormattedMessage id='add_order_form.client' />
                                }
                            >
                                <Input
                                    // onChange={ () => console.log('→ ', )}
                                    placeholder={ this.props.intl.formatMessage({
                                        id:             'add_order_form.client.placeholder',
                                        defaultMessage: 'search client',
                                    }) }
                                />
                                <Icon
                                    type='plus'
                                    className={ Styles.addClientIcon }
                                    onClick={ () =>
                                        this.props.setAddClientModal(true)
                                    }
                                />
                            </FormItem>
                        </div>
                        <FormItem
                            { ...formItemLayout }
                            label={
                                <FormattedMessage id='add_order_form.name' />
                            }
                        >
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
                        <FormItem
                            { ...formItemLayout }
                            label={
                                <FormattedMessage id='add_order_form.phone' />
                            }
                        >
                            <Select>
                                { _.flatten(
                                    clients.map(
                                        client =>
                                            !client.phones
                                                ? []
                                                : client.phones.map(phone => (
                                                    <Option
                                                        value={ phone }
                                                        key={ v4() }
                                                    >
                                                        { phone }
                                                    </Option>
                                                )),
                                    ),
                                ) }
                            </Select>
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={
                                <FormattedMessage id='add_order_form.email' />
                            }
                        >
                            <Select>
                                <Option value='jack'>Bob</Option>
                                <Option value='lucy'>Elf</Option>
                            </Select>
                        </FormItem>
                    </div>
                    <div className={ Styles.autoCol }>
                        <div className={ Styles.auto }>
                            <FormattedMessage id='add_order_form.car' />
                        </div>
                        <FormItem
                            label={ <FormattedMessage id='add_order_form.car' /> }
                        >
                            <Select>
                                <Option value='jack'>Jack</Option>
                                <Option value='lucy'>Lucy</Option>
                            </Select>
                        </FormItem>
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.car_number' />
                            }
                        >
                            <Input placeholder='car license number' />
                        </FormItem>
                        <FormItem
                            label={
                                <FormattedMessage id='add_order_form.odometr' />
                            }
                        >
                            <Input placeholder='odometr' />
                        </FormItem>
                        <FormItem
                            label={ <FormattedMessage id='add_order_form.vin' /> }
                        >
                            <Input placeholder='vin-code' />
                        </FormItem>
                    </div>
                </div>

                <div className={ Styles.totalBlock }>
                    <FormItem label='способ оплыты'>
                        { getFieldDecorator('paymentMethod')(
                            <Select>
                                <Option value='cash'>
                                    <Icon type='wallet' /> Нал
                                </Option>
                                <Option value='card'>
                                    <Icon type='credit-card' /> Безнал
                                </Option>
                                <Option value='visa'>
                                    <Icon type='credit-card' /> Visa
                                </Option>
                            </Select>,
                        ) }
                        { /* <Select>
                            <Option value='cash'>
                                <Icon type='wallet' /> Нал
                            </Option>
                            <Option value='card'>
                                <Icon type='credit-card' /> Безнал
                            </Option>
                            <Option value='visa'>
                                <Icon type='credit-card' /> Visa
                            </Option>
                        </Select> */ }
                    </FormItem>
                    { /* <FormItem label='CTO requisites'>
                        <DecoratedSelect />
                    </FormItem>
                    <FormItem label='Client requisites'>
                        <DecoratedSelect />
                    </FormItem> */ }
                    <FormItem>
                        <div className={ Styles.total }>
                            <FormattedMessage id='add_order_form.total' />
                            <span className={ Styles.totalSum }>
                                0<FormattedMessage id='currency' />
                            </span>
                        </div>
                    </FormItem>
                </div>
                { /* FORMS TABS */ }
                <Tabs onChange={ () => this.callback() } type='card'>
                    <TabPane
                        tab={ `${this.props.intl.formatMessage({
                            id:             'add_order_form.services',
                            defaultMessage: 'Services',
                        })} ()` }
                        key='1'
                    >
                        <ServicesTable { ...this.props } />
                        <DiscountPanel { ...this.props } />
                    </TabPane>
                    <TabPane
                        tab={ `${this.props.intl.formatMessage({
                            id:             'add_order_form.details',
                            defaultMessage: 'Details',
                        })} ()` }
                        key='2'
                    >
                        <DetailsTable { ...this.props } />
                        <DiscountPanel { ...this.props } />
                    </TabPane>
                    <TabPane
                        tab={ <FormattedMessage id='add_order_form.comments' /> }
                        key='3'
                    >
                        <FormItem
                            { ...formItemLayout }
                            label={
                                <FormattedMessage id='add_order_form.client_comments' />
                            }
                        >
                            <DecoratedTextArea
                                getFieldDecorator={ getFieldDecorator }
                                field='comment'
                                rules={ [
                                    {
                                        max:     2000,
                                        message: 'Too much',
                                    },
                                ] }
                                placeholder='comment'
                                autosize={ { minRows: 2, maxRows: 6 } }
                            />
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label={
                                <FormattedMessage id='add_order_form.service_recommendations' />
                            }
                        >
                            <DecoratedTextArea
                                getFieldDecorator={ getFieldDecorator }
                                field='recommendation'
                                rules={ [
                                    {
                                        max:     2000,
                                        message: 'Too much',
                                    },
                                ] }
                                placeholder='Autosize height min/max'
                                autosize={ { minRows: 2, maxRows: 6 } }
                            />
                        </FormItem>
                    </TabPane>
                </Tabs>
            </Form>
        );
    }
}
