// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, Form, Input } from 'antd';
import _ from 'lodash';

// proj
import { MODALS, resetModal } from 'core/modals/duck';
import { serviceOutput } from 'core/cash/duck';


const mapStateToProps = state => ({
    modal: state.modals.modal,
    modalProps: state.modals.modalProps,
});

const mapDispatchToProps = {
    resetModal,
    serviceOutput,
};

const formItemLayout = {
    labelCol: { span: 12 },
    labelAlign: 'left',
    wrapperCol: { span: 12 },
  }

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@Form.create()
/**
 * This modal is used to make service outputs, it is autonomous so the only thing you have to provide is cashboxId.
 * 
 * @param props.modalProps.cashboxId
 */
export default class ServiceOutputModal extends Component {
    handleCancel = () => {
		this.props.resetModal();
	};

    onOk = (e) => {
        e.preventDefault();
        const { serviceOutput, modalProps: {cashboxId}, form } = this.props;

        form.validateFields((err, values) => {
            if(!err) {
                const {serviceOutputSum} = values;

                serviceOutput({cashboxId, serviceOutputSum});

                this.props.resetModal();
            }
        });
    }

    render() {
        const {
            modal,
            form: { getFieldDecorator},
            intl,
        } = this.props;

        return (
            <Modal
                destroyOnClose
                visible={modal === MODALS.SERVICE_OUTPUT}
                maskClosable={false}
                title={<FormattedMessage id="service_output_modal.service_output"/>}
                width={'70vh'}
                onCancel={() => this.handleCancel()}
                onOk={this.onOk}
            >

                <Form layout="horizontal">
                    <Form.Item label={intl.formatMessage({id: "service_output_modal.enter_service_output_sum"})} {...formItemLayout}>
                        {getFieldDecorator('serviceOutputSum', {
                            rules: [
                                {
                                    //Custom checker to see if value is valid or not(includes all types of check up)
                                    validator: (rule, str, callback) => {
                                        const isNumber = !isNaN(str) && !isNaN(parseFloat(str)) // check if a string is a number and ensure strings of whitespace fail
                                        const isPositive = !isNaN(parseFloat(str))? (parseFloat(str) > 0): false;

                                        if(!(isNumber && isPositive)) callback(intl.formatMessage({id: "service_output_modal.enter_any_positive_number"}));
                                        callback(); //Must be called!
                                    }
                                }
                            ],
                        })(<Input />)}
                    </Form.Item>

                </Form>

            </Modal>
        );
    }
}
