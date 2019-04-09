// vendor
import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Form, Button } from "antd";

// own
import { ProductsExcelTable } from "components";
import { withReduxForm2 } from "utils";

// import Styles from './styles.m.css';

@withReduxForm2({
    name: "productsExcelForm",
    actions: {
        // change: onChangeCashOrderForm,
    },
    mapStateToProps: state => ({
        productsExcel: state.storage.productsExcel,
    }),
})
export class ProductsExcelForm extends Component {
    _submit = event => {
        event.preventDefault();
        const { form } = this.props;

        form.validateFieldsAndScroll((err, values) => {
            console.log("→ err", err);
            console.log("→ values", values);

            if (!err) {
                console.log("→ submit values", value);
                // const products = [...values];

                // createCashOrder(cashOrder);
                // form.resetFields();
            }
        });
    };

    render() {
        const { packages } = this.props;
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this._submit}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <ProductsExcelTable
                    data={this.props.productsExcel}
                    getFieldDecorator={getFieldDecorator}
                />
            </Form>
        );
    }
}
