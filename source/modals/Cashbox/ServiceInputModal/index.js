// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, Form, Input } from 'antd';
import _ from 'lodash';

// proj
import { MODALS, resetModal } from 'core/modals/duck';
import { serviceInput } from 'core/cash/duck';


const mapStateToProps = state => ({
    modal: state.modals.modal,
    modalProps: state.modals.modalProps,
});

const mapDispatchToProps = {
    resetModal,
    serviceInput,
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
 * This modal is used to make service inputs, it is autonomous so the only thing you have to provide is cashboxId.
 */
export default class ServiceInputModal extends Component {
    constructor(props) {
        super(props);

        this.onOk = this.onOk.bind(this);
    }

    handleCancel = () => {
		this.props.resetModal();
	};

    onOk(e) {
        e.preventDefault();
        const { serviceInput, modalProps: {cashboxId}, form } = this.props;

        form.validateFields((err, values) => {
            if(!err) {
                const {serviceInputSum} = values;

                serviceInput({cashboxId, serviceInputSum});

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
                visible={modal === MODALS.SERVICE_INPUT}
                maskClosable={false}
                title={<FormattedMessage id="service_input_modal.service input"/>}
                width={'50vh'}
                onCancel={() => this.handleCancel()}
                onOk={this.onOk}
            >

                <Form layout="horizontal">
                    <Form.Item label={intl.formatMessage({id: "service_input_modal.enter_service_input_sum"})} {...formItemLayout}>
                        {getFieldDecorator('serviceInputSum', {
                            rules: [
                                {
                                    //Custom checker to see if value is valid or not(includes all types of check up)
                                    validator: (rule, str, callback) => {
                                        const isNumber = !isNaN(str) && !isNaN(parseFloat(str)) // check if a string is a number and ensure strings of whitespace fail
                                        const isPositive = !isNaN(parseFloat(str))? (parseFloat(str) > 0): false;

                                        if(!(isNumber && isPositive)) callback(intl.formatMessage({id: "service_input_modal.enter_any_positive_number"}));
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
