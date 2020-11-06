// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Select, Icon } from "antd";
import { injectIntl } from "react-intl";

// proj
import { createCashbox } from "core/cash/duck";
import { DecoratedInput, DecoratedSelect } from "forms/DecoratedFields";

// own
import { cashboxTypes } from "./config";
import Styles from "./styles.m.css";
const Option = Select.Option;

const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 15 },
};

@injectIntl
@Form.create()
@connect(null, { createCashbox })
export class CashCreationForm extends Component {
    _submit = () => {
        const { form, createCashbox } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                createCashbox(values);
                form.resetFields();
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { formatMessage } = this.props.intl;

        return (
            <Form
                layout="horizontal"
                className={Styles.form}
                onSubmit={this._submit}
            >
                <DecoratedInput
                    field="name"
                    rules={[
                        {
                            required: true,
                            message: formatMessage({
                                id: "cash-creation-form.name.validation",
                            }),
                        },
                    ]}
                    placeholder={formatMessage({
                        id: "cash-creation-form.name",
                    })}
                    getFieldDecorator={getFieldDecorator}
                    cnStyles={Styles.field}
                />
                <DecoratedSelect
                    field="type"
                    placeholder={formatMessage({
                        id: "cash-creation-form.type",
                    })}
                    getFieldDecorator={getFieldDecorator}
                    initialValue={cashboxTypes.CASH}
                    cnStyles={Styles.field}
                >
                    {Object.values(cashboxTypes).map(item => (
                        <Option value={item} key={item}>
                            {formatMessage({
                                id: `cash-creation-form.type-${item}`,
                            })}
                        </Option>
                    ))}
                </DecoratedSelect>
                <DecoratedInput
                    fields={{}}
                    cnStyles={Styles.field}
                    field="description"
                    placeholder={formatMessage({
                        id: "cash-creation-form.description",
                    })}
                    getFieldDecorator={getFieldDecorator}
                />
                <Icon
                    type="save"
                    onClick={() => this._submit()}
                    className={Styles.saveIcon}
                />
            </Form>
        );
    }
}
