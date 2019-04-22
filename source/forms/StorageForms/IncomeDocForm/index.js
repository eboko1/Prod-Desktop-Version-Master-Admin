// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Select, Icon } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import {
    fetchIncomeDoc,
    selectIncomeDoc,
    selectIncomeDocLoading,
} from 'core/storage/incomes';
import { setBrandsSearchQuery, selectBrandsByQuery } from 'core/search/duck';
import { fetchSuppliers, selectSuppliers } from 'core/suppliers/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';
import {
    DecoratedInput,
    DecoratedInputNumber,
    DecoratedDatePicker,
    DecoratedSelect,
} from 'forms/DecoratedFields';
import { SupplierModal } from 'modals';
import { StoreDocumentProductsTable } from 'components';

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
        if (props.match.params.id) {
            props.fetchIncomeDoc(props.match.params.id);
        }
    }, []);

    useEffect(() => {
        props.fetchSuppliers();
    }, []);

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
    const { incomeDoc } = props;

    return (
        <Catcher>
            <Form>
                <DecoratedInput
                    formItem
                    formItemLayout={ formItemLayout }
                    fields={ {} }
                    label={ formatMessage({
                        id: 'storage.supplier_document_number',
                    }) }
                    field='supplierDocNumber'
                    getFieldDecorator={ form.getFieldDecorator }
                    rules={ [
                        {
                            required: true,
                            message:  'required',
                        },
                    ] }
                    initialValue={ incomeDoc.supplierDocNumber }
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
                    initialValue={ incomeDoc.recordDatetime }
                />
                <DecoratedDatePicker
                    formItem
                    formItemLayout={ formItemLayout }
                    fields={ {} }
                    label={ formatMessage({
                        id: 'storage.payment_date',
                    }) }
                    field='paidDatetime'
                    getFieldDecorator={ form.getFieldDecorator }
                    initialValue={ incomeDoc.paidDatetime }
                />
                <DecoratedSelect
                    field='businessSupplierId'
                    formItem
                    placeholder={ formatMessage({
                        id: 'cash-order-form.select_supplier',
                    }) }
                    label={ formatMessage({
                        id: 'cash-order-form.counterparty.BUSINESS_SUPPLIER',
                    }) }
                    formItemLayout={ formItemLayout }
                    getFieldDecorator={ form.getFieldDecorator }
                    getPopupContainer={ trigger => trigger.parentNode }
                    initialValue={ incomeDoc.businessSupplierId }
                >
                    { !_.isEmpty(props.suppliers)
                        ? props.suppliers.map(({ id, name }) => (
                            <Option value={ id } key={ id }>
                                { name }
                            </Option>
                        ))
                        : [] }
                </DecoratedSelect>
                <Icon
                    type='plus'
                    onClick={ () => props.setModal(MODALS.SUPPLIER) }
                />
                <DecoratedInputNumber
                    formItem
                    formItemLayout={ formItemLayout }
                    label={ formatMessage({ id: 'storage.sum' }) }
                    fields={ {} }
                    field='sum'
                    getFieldDecorator={ form.getFieldDecorator }
                    initialValue={ incomeDoc.sum }
                />
                <StoreDocumentProductsTable
                    incomeDoc={ incomeDoc }
                    form={ props.form }
                    brands={ props.brands }
                    setBrandsSearchQuery={ props.setBrandsSearchQuery }
                />
            </Form>
            <SupplierModal />
        </Catcher>
    );
};

const mapStateToProps = state => ({
    incomeDoc: selectIncomeDoc(state),
    loading:   selectIncomeDocLoading(state),
    brands:    selectBrandsByQuery(state),
    suppliers: selectSuppliers(state),
});

const mapDispatchToProps = {
    fetchIncomeDoc,
    fetchSuppliers,
    setModal,
    resetModal,
};

export const IncomeDocForm = withRouter(
    injectIntl(
        connect(
            mapStateToProps,
            mapDispatchToProps,
        )(Form.create()(IncomeForm)),
    ),
);
