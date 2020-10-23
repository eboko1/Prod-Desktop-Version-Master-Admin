// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import { Form, Modal, Button, Input, InputNumber, Radio, Checkbox, Icon, Row, Col } from 'antd';

// proj

// own
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 16, },
};

const formItemStyle= {
    labelAlign: 'left',
    style:{
        marginBottom: 4,
        display: 'flex',
        alignItems: 'center',
    }
}

@injectIntl
@Form.create()
export class RequisiteSettingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requisiteData: undefined,
        };
        this.fields = ['form', 'name', 'address', 'code', 'IBAN', 'bank', 'isPayer', 'rate', 'methodOfCalculation', 'isActive']
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    componentDidUpdate(prevProps) {
        if(Boolean(this.props.requisiteData) && !Boolean(prevProps.requisiteData)) {
            console.log(this);
            const { requisiteData } = this.props;
            this.props.form.setFieldsValue({
                form: requisiteData.form || "other",
                name: requisiteData.name,
                address: requisiteData.address,
                code: requisiteData.code,
                IBAN: requisiteData.IBAN,
                bank: requisiteData.bank,
                isPayer: Boolean(requisiteData.isPayer),
                rate: requisiteData.rate || 20,
                methodOfCalculation: requisiteData.methodOfCalculation,
                isActive: Boolean(requisiteData.isActive),
            });
            
        } else if(!Boolean(this.props.requisiteData) && Boolean(prevProps.requisiteData)) {
            this.props.form.resetFields();
            this.setState({
                requisiteData: undefined,
            })
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} layout='horizontal'>
                <Form.Item 
                    label={<FormattedMessage id='requisite-setting.form'/>}
                    {...formItemStyle}
                >
                    {getFieldDecorator('form', { initialValue: "soleProprietor" })(
                        <Radio.Group>
                            <Radio value="soleProprietor"><FormattedMessage id='requisite-setting.form.soleProprietor'/></Radio>
                            <Radio value="ltd"><FormattedMessage id='requisite-setting.form.ltd'/></Radio>
                            <Radio value="other"><FormattedMessage id='requisite-setting.form.other'/></Radio>
                        </Radio.Group>,
                    )}
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id='requisite-setting.name'/>}
                    {...formItemStyle}
                >
                  {getFieldDecorator('name')(<Input />)}
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id='requisite-setting.address'/>}
                    {...formItemStyle}
                >
                  {getFieldDecorator('address')(<Input />)}
                </Form.Item>
                <Form.Item
                    label={<span><FormattedMessage id='requisite-setting.code'/> <FormattedMessage id='USREOU'/></span>}
                    {...formItemStyle}
                >
                  {getFieldDecorator('code')(<Input />)}
                </Form.Item>
                <Form.Item
                    label={<span><FormattedMessage id='requisite-setting.account'/> <FormattedMessage id='IBAN'/></span>}
                    {...formItemStyle}
                >
                  {getFieldDecorator('IBAN')(<Input />)}
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id='requisite-setting.bank'/>}
                    {...formItemStyle}
                >
                  {getFieldDecorator('bank')(<Input />)}
                </Form.Item>
                <Form.Item
                    label={<span><FormattedMessage id='requisite-setting.payer'/> <FormattedMessage id='VAT'/></span>}
                    {...formItemStyle}
                >
                    {getFieldDecorator('isPayer', { initialValue: false })(
                        <Radio.Group>
                            <Radio value={true}><FormattedMessage id='yes'/></Radio>
                            <Radio value={false}><FormattedMessage id='no'/></Radio>
                        </Radio.Group>,
                    )}
                </Form.Item>
                <Form.Item
                    label={<span><FormattedMessage id='requisite-setting.rate'/> <FormattedMessage id='VAT'/></span>}
                    {...formItemStyle}
                >
                    {getFieldDecorator('rate', { initialValue: 20 })(<InputNumber min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')}/>)}
                </Form.Item>
                <Form.Item 
                    label={<FormattedMessage id='requisite-setting.method_of_calculation'/>}
                    {...formItemStyle}
                >
                    {getFieldDecorator('methodOfCalculation', { initialValue: "plus" })(
                        <Radio.Group>
                            <Radio value="plus"><FormattedMessage id='requisite-setting.VAT.plus'/></Radio>
                            <Radio value="including" disabled><FormattedMessage id='requisite-setting.VAT.including'/></Radio>
                        </Radio.Group>,
                    )}
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id='requisite-setting.active'/>}
                    {...formItemStyle}
                >
                  {getFieldDecorator('isActive', { valuePropName: 'checked', initialValue: true, })(<Checkbox />)}
                </Form.Item>
                <Row
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 24,
                    }}
                >
                    <Form.Item wrapperCol={{ span: 12}}>
                        <Button
                            onClick={this.props.hideModal}
                        >
                            <FormattedMessage id='cancel' />
                        </Button>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 12}}>
                        <Button type="primary" htmlType="submit">
                            <FormattedMessage id='save' />
                        </Button>
                    </Form.Item>
                </Row>
                
                
            </Form>
        );
    }
}

//export const RequisiteSettingForm = Form.create()(RequisiteSetting);

export class RequisiteSettingFormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    handleCancel = () => {
        const { buttonMode, hideModal } = this.props;
        if(buttonMode) {
            this.setState({
                visible: false,
            });
        } else {
            hideModal();
        }
    }

    handleOk = () => {
        this.handleCancel();
    }

    render() {
        const { buttonMode, modalVisible, requisiteData, hideModal } = this.props;
        const { visible } = this.state;
        return (
            <div>
                {buttonMode && 
                    <Button
                        onClick={()=>{
                            this.setState({
                                visible: true,
                            })
                        }}
                    >
                        <FormattedMessage id='add' />
                    </Button>
                }
                <Modal
                    forceRender
                    visible = { buttonMode ? visible : modalVisible }
                    title={null}
                    footer={null}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    style={{
                        minWidth: '40%',
                        maxWidth: '95%',
                    }}
                >
                    <RequisiteSettingForm
                        requisiteData = { requisiteData }
                        hideModal = { hideModal }
                        visible = { buttonMode ? visible : modalVisible }
                    />
                </Modal>
            </div>
        );
    }
}
