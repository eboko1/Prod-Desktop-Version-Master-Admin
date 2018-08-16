// vendor
import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Select, Button, Upload, Icon, Input } from 'antd';

// proj
import { DecoratedSelect } from 'forms';
import { withReduxForm } from 'utils';

//own
const FormItem = Form.Item;
const Option = Select.Option;

@injectIntl
@withReduxForm(name: "profileForm")
export class ProfileForm extends Component {
    // class Demo extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // if (!err) {
            // }
        });
    };

    handleChange = e => {
        this.setState(() => {
            this.props.form.validateFields([ 'nickname' ], { force: true });
        });
    };

    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }

        return e && e.fileList;
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol:   { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <Form onSubmit={ this.handleSubmit }>
                <FormItem { ...formItemLayout } label='Name'>
                    { getFieldDecorator('firstName', {
                        rules: [
                            {
                                required: true,
                                message:  this.props.intl.formatMessage({
                                    id:             'profile-form.firstnName_validation',
                                    defaultMessage: 'validate',
                                }),
                                // <FormattedMessage id='profile-form.please_enter_your_first_name' />
                            },
                        ],
                    })(<Input placeholder='Please input your name' />) }
                </FormItem>

                <FormItem { ...formItemLayout } label='Last Name'>
                    { getFieldDecorator('lastName', {
                        rules: [
                            {
                                required: true,
                                message:  'Please input your name',
                            },
                        ],
                    })(<Input placeholder='Please input your last name' />) }
                </FormItem>

                <FormItem { ...formItemLayout } label='Dragger'>
                    <div className='dropbox'>
                        { getFieldDecorator('dragger', {
                            valuePropName:     'fileList',
                            getValueFromEvent: this.normFile,
                        })(
                            <Upload.Dragger name='files' action='/upload.do'>
                                <p className='ant-upload-drag-icon'>
                                    <Icon type='inbox' />
                                </p>
                                <p className='ant-upload-text'>
                                    Click or drag file to this area to upload
                                </p>
                                <p className='ant-upload-hint'>
                                    Support for a single or bulk upload.
                                </p>
                            </Upload.Dragger>,
                        ) }
                    </div>
                </FormItem>

                <FormItem { ...formItemLayout } label='Select' hasFeedback>
                    { getFieldDecorator('select', {
                        rules: [
                            {
                                required: true,
                                message:  'Please select your country!',
                            },
                        ],
                    })(
                        <Select
                            placeholder={
                                <FormattedMessage id='profile-form.please_select_a_language' />
                            }
                        >
                            <Option value='en'>English</Option>
                            <Option value='uk'>Українська</Option>
                            <Option value='ru'>Русский</Option>
                        </Select>,
                    ) }
                </FormItem>

                <FormItem wrapperCol={ { span: 12, offset: 6 } }>
                    <Button type='primary' htmlType='submit'>
                        Submit
                    </Button>
                </FormItem>
            </Form>
        );
    }
}
