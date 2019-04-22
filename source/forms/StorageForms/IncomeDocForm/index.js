// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Select, Button } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import {
    fetchIncomeDoc,
    selectIncomeDoc,
    selectIncomeDocLoading,
} from 'core/storage/incomes';

import {
    DecoratedInput,
    DecoratedInputNumber,
    DecoratedDatePicker,
} from 'forms/DecoratedFields';

// own
const Option = Select.Option;

const formItemLayout = {
    labelCol:   { span: 7 },
    wrapperCol: { span: 15 },
};

const IncomeForm = props => {
    const {
        form,
        intl: { formatMessage },
    } = props;

    useEffect(() => {
        if (_.get(props, 'modalProps.id')) {
            props.fetchProduct(_.get(props, 'modalProps.id'));
        }
    }, [ _.get(props, 'modalProps.id') ]);

    console.log('→ props.editing', props.editing);
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
            <DecoratedInput
                formItem
                formItemLayout={ formItemLayout }
                fields={ {} }
                label={ formatMessage({
                    id: 'storage.supplier_document_number',
                }) }
                field='code'
                getFieldDecorator={ form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  'required',
                    },
                ] }
                // initialValue={}
            />
            <DecoratedDatePicker
                formItem
                formItemLayout={ formItemLayout }
                fields={ {} }
                label={ formatMessage({
                    id: 'storage.record_date',
                }) }
                field='recordDatetime'
                getFieldDecorator={ form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  'required',
                    },
                ] }
                // initialValue={}
            />
            <DecoratedDatePicker
                formItem
                formItemLayout={ formItemLayout }
                fields={ {} }
                label={ formatMessage({
                    id: 'storage.payment_date',
                }) }
                field='paymentDatetime'
                getFieldDecorator={ form.getFieldDecorator }

                // initialValue={}
            />

            <DecoratedInputNumber
                formItem
                formItemLayout={ formItemLayout }
                label={ formatMessage({ id: 'storage.sum' }) }
                fields={ {} }
                field='sum'
                getFieldDecorator={ form.getFieldDecorator }
                initialValue={ _.get(props, 'incomeDoc.tradeCode') }
            />
            <div>Table</div>
        </Form>
    );
};

const mapStateToProps = state => ({
    incomeDoc: selectIncomeDoc(state),
    loading:   selectIncomeDocLoading(state),
});

const mapDispatchToProps = {
    fetchIncomeDoc,
};

export const IncomeDocForm = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(Form.create()(IncomeForm)),
);
