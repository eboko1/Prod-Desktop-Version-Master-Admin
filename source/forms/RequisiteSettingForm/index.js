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
            formType: "ENTREPRENEUR",
            requisiteData: undefined,
        };
        this.fields = ['formType', 'name', 'address', 'ifi', 'ca', 'bank', 'isTaxPayer', 'taxRate', 'calculationMethod', 'enabled']
    }

    handleSubmit = async (e) => {
        const id = this.props.requisiteData && this.props.requisiteData.id;
        const { updateRequisite, postRequisite } = this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.itn = values.itn || values.ifi;
                if(values.formName) values.formType = null;
                if(id) {
                    updateRequisite(id, values, this.props.hideModal);
                } else {
                    postRequisite(values, this.props.hideModal, this.props.id);
                }
                //window.location.reload();
            }
        });
        await this.props.hideModal();
        //await window.location.reload();
    };

    componentDidUpdate(prevProps) {
        if(Boolean(this.props.requisiteData) && !Boolean(prevProps.requisiteData)) {
            const { requisiteData } = this.props;
            this.props.form.setFieldsValue({
                formType: requisiteData.formType || "OTHER",
                formName: requisiteData.formType ? undefined : requisiteData.formName,
                name: requisiteData.name,
                address: requisiteData.address,
                ifi: requisiteData.ifi,
                ca: requisiteData.ca,
                bank: requisiteData.bank,
                isTaxPayer: Boolean(requisiteData.isTaxPayer),
                taxRate: requisiteData.taxRate || 20,
                calculationMethod: requisiteData.calculationMethod,
                enabled: Boolean(requisiteData.enabled),
            });

            this.setState({
                formType: requisiteData.formType || "OTHER",
            });
            
        } else if(!Boolean(this.props.requisiteData) && Boolean(prevProps.requisiteData)) {
            this.props.form.resetFields();
            this.setState({
                requisiteData: undefined,
            })
        }
    }

    componentDidMount() {
        const { requisiteData } = this.props;
        if(requisiteData) {
            this.props.form.setFieldsValue({
                formType: requisiteData.formType || "OTHER",
                formName: requisiteData.formType ? undefined : requisiteData.formName,
                name: requisiteData.name,
                address: requisiteData.address,
                ifi: requisiteData.ifi,
                ca: requisiteData.ca,
                bank: requisiteData.bank,
                isTaxPayer: Boolean(requisiteData.isTaxPayer),
                taxRate: requisiteData.taxRate || 20,
                calculationMethod: requisiteData.calculationMethod,
                enabled: Boolean(requisiteData.enabled),
            });

            this.setState({
                formType: requisiteData.formType || "OTHER",
            });
        }
    }

    render() {
        const { intl: {formatMessage} } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const isOtherForm = this.state.formType == "OTHER";
        
        return (
            <Form onSubmit={this.handleSubmit} layout='horizontal'>
                <Form.Item 
                    label={<FormattedMessage id='requisite-setting.form'/>}
                    {...formItemStyle}
                    {...formItemLayout}
                >
                    {getFieldDecorator('formType', {
                        rules: [{ required: true, message: formatMessage({id: 'storage_document.error.required_fields'}), }],
                        initialValue: "ENTREPRENEUR" 
                    })(
                        <Radio.Group
                            onChange={(event)=>{
                                this.setState({
                                    formType: event.target.value,
                                });
                            }}
                        >
                            <Radio value="ENTREPRENEUR"><FormattedMessage id='requisite-setting.form.ENTREPRENEUR'/></Radio>
                            <Radio value="LEGAL_ENITITY"><FormattedMessage id='requisite-setting.form.LEGAL_ENITITY'/></Radio>
                            <Radio value="OTHER"><FormattedMessage id='requisite-setting.form.other'/></Radio>
                        </Radio.Group>,
                    )}
                </Form.Item>
                {isOtherForm && 
                    <Form.Item
                        label={<FormattedMessage id='requisite-setting.form.other'/>}
                        {...formItemStyle}
                        {...formItemLayout}
                    >
                      {getFieldDecorator('formName')(<Input />)}
                    </Form.Item>
                }
                <Form.Item
                    label={<FormattedMessage id='requisite-setting.name'/>}
                    {...formItemStyle}
                    {...formItemLayout}
                >
                  {getFieldDecorator('name', {
                        rules: [{ required: true, message: formatMessage({id: 'storage_document.error.required_fields'}), }],
                      })(<Input />)}
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id='requisite-setting.address'/>}
                    {...formItemStyle}
                    {...formItemLayout}
                >
                  {getFieldDecorator('address')(<Input />)}
                </Form.Item>
                <Form.Item
                    label={<span><FormattedMessage id='requisite-setting.code'/> <FormattedMessage id='USREOU'/></span>}
                    {...formItemStyle}
                    {...formItemLayout}
                >
                  {getFieldDecorator('ifi')(<Input />)}
                </Form.Item>
                <Form.Item
                    label={<span><FormattedMessage id='requisite-setting.account'/> <FormattedMessage id='IBAN'/></span>}
                    {...formItemStyle}
                    {...formItemLayout}
                >
                  {getFieldDecorator('ca')(<Input />)}
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id='requisite-setting.bank'/>}
                    {...formItemStyle}
                    {...formItemLayout}
                >
                  {getFieldDecorator('bank')(<Input />)}
                </Form.Item>
                <Form.Item
                    label={<span><FormattedMessage id='requisite-setting.payer'/> <FormattedMessage id='VAT'/></span>}
                    {...formItemStyle}
                    {...formItemLayout}
                >
                    {getFieldDecorator('isTaxPayer', {
                         rules: [{ required: true, message: formatMessage({id: 'storage_document.error.required_fields'}), }],
                        initialValue: false
                    })(
                        <Radio.Group>
                            <Radio value={true}><FormattedMessage id='yes'/></Radio>
                            <Radio value={false}><FormattedMessage id='no'/></Radio>
                        </Radio.Group>,
                    )}
                </Form.Item>
                <Form.Item
                    label={<span><FormattedMessage id='requisite-setting.rate'/> <FormattedMessage id='VAT'/></span>}
                    {...formItemStyle}
                    {...formItemLayout}
                >
                    {getFieldDecorator('taxRate', { initialValue: 20 })(<InputNumber min={0} max={100} formatter={value => `${value}%`} parser={value => value.replace('%', '')}/>)}
                </Form.Item>
                <Form.Item 
                    label={<FormattedMessage id='requisite-setting.method_of_calculation'/>}
                    {...formItemStyle}
                    {...formItemLayout}
                >
                    {getFieldDecorator('calculationMethod', { initialValue: "WITH_TAX" })(
                        <Radio.Group>
                            <Radio value="WITH_TAX"><FormattedMessage id='requisite-setting.VAT.plus'/></Radio>
                            <Radio value="ADD_TAX" disabled><FormattedMessage id='requisite-setting.VAT.including'/></Radio>
                        </Radio.Group>,
                    )}
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id='requisite-setting.active'/>}
                    {...formItemStyle}
                    {...formItemLayout}
                >
                  {getFieldDecorator('enabled', { valuePropName: 'checked', initialValue: true, })(<Checkbox />)}
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
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
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
        const { buttonMode, modalVisible, requisiteData, hideModal, postRequisite, updateRequisite, id } = this.props;
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
                    destroyOnClose
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
                        postRequisite={postRequisite}
                        updateRequisite={updateRequisite}
                        id={id}
                    />
                </Modal>
            </div>
        );
    }
}
