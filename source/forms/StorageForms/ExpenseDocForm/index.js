// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Button } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import {
    fetchExpenseDoc,
    selectExpenseDoc,
    selectExpenseDocLoading,
} from 'core/storage/expenses';

import { DecoratedInput, DecoratedInputNumber } from 'forms/DecoratedFields';

// own
const Option = Select.Option;

const formItemLayout = {
    labelCol:   { span: 7 },
    wrapperCol: { span: 15 },
};

const ExpenseForm = props => {
    const {
        form,
        intl: { formatMessage },
    } = props;

    useEffect(() => {
        if (_.get(props, 'modalProps.id')) {
            props.fetchProduct(_.get(props, 'modalProps.id'));
        }
    }, [ _.get(props, 'modalProps.id') ]);

    const _submit = event => {
        props.form.validateFields((err, values) => {
            if (!err) {
                if (values.brandName && values.brandId) {
                    _.set(values, 'brandId', void 0);
                }
                console.log('→ values', values);
                props.editing
                    ? props.updateProduct({
                        id:      _.get(props, 'modalProps.id'),
                        product: values,
                    })
                    : props.createProduct(values);

                props.form.resetFields();
                props.resetModal();
            }
        });
    };

    return (
        <Form>
            { /* <DecoratedInput
                formItem
                formItemLayout={ formItemLayout }
                fields={ {} }
                label={ formatMessage({ id: 'storage.product_code' }) }
                field='code'
                getFieldDecorator={ form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  'required',
                    },
                ] }
                // initialValue={}
            /> */ }

            <DecoratedInputNumber
                formItem
                formItemLayout={ formItemLayout }
                label={ formatMessage({ id: 'storage.sum' }) }
                fields={ {} }
                field='sum'
                getFieldDecorator={ form.getFieldDecorator }
                initialValue={ _.get(props, 'expenseDoc.tradeCode') }
            />
        </Form>
    );
};

const mapStateToProps = state => ({
    expenseDoc: selectExpenseDoc(state),
    loading:    selectExpenseDocLoading(state),
});

const mapDispatchToProps = {
    fetchExpenseDoc,
};

export const ExpenseDocForm = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(Form.create()(ExpenseForm)),
);
