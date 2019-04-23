// vendor
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Select, Icon, Button } from 'antd';
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

import { Catcher, Numeral } from 'commons';
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
    labelCol:   { span: 8 },
    wrapperCol: { span: 16 },
};

const FormHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`;

const FormBody = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TotalSum = styled.div`
    font-weight: bold;
    font-size: 18px;
    background: var(--static);
    padding: 16px;
`;

const FormColumn = styled.div`
    display: flex;
    flex-direction: column;
    flex: 0 1 45%;
`;

const SupplierFieldWrapper = styled.div`
    position: relative;
`;

const AddSupplierIcon = styled(Icon)`
    position: absolute;
    right: -60px;
    top: -5px;
    color: var(--green);
    font-size: 24px;
    margin: 10px 32px 0 10px;
`;

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

    const _submit = () => {
        props.form.validateFields((err, values) => {
            console.log('→ form values', values);
            if (!err) {
                // if (values.brandName && values.brandId) {
                //     _.set(values, 'brandId', void 0);
                // }
                console.log('→ submit values', values);

                // props.editing
                //     ? props.updateProduct({
                //         id:      _.get(props, 'modalProps.id'),
                //         product: values,
                //     })
                //     : props.createProduct(values);

                // props.form.resetFields();
                // props.resetModal();
            }
        });
    };
    const { incomeDoc } = props;

    return (
        <Catcher>
            <Form>
                <FormHeader>
                    <Button type='primary' onClick={ _submit }>
                        { formatMessage({ id: 'create' }) }
                    </Button>
                    <TotalSum>
                        { formatMessage({ id: 'storage.sum' }) }&nbsp;
                        <Numeral
                            currency={ formatMessage({
                                id: 'currency',
                            }) }
                            nullText='0'
                        >
                            { Number(1) }
                        </Numeral>
                    </TotalSum>
                    <DecoratedInput
                        hiddeninput='hiddeninput'
                        fields={ {} }
                        field='sum'
                        getFieldDecorator={ form.getFieldDecorator }
                        initialValue={ incomeDoc.sum }
                    />
                </FormHeader>
                <FormBody>
                    <FormColumn>
                        <DecoratedInput
                            formItem
                            // style={ { display: 'flex' } }
                            formItemLayout={ formItemLayout }
                            fields={ {} }
                            label={ formatMessage({
                                id: 'storage.document_number',
                            }) }
                            field='supplierDocNumber'
                            placeholder={ formatMessage({
                                id: 'storage.supplier_document_number',
                            }) }
                            getFieldDecorator={ form.getFieldDecorator }
                            rules={ [
                                {
                                    required: true,
                                    message:  'required',
                                },
                            ] }
                            initialValue={ incomeDoc.supplierDocNumber }
                        />

                        <SupplierFieldWrapper>
                            <DecoratedSelect
                                field='businessSupplierId'
                                formItem
                                placeholder={ formatMessage({
                                    id: 'cash-order-form.select_supplier',
                                }) }
                                label={ formatMessage({
                                    id:
                                        'cash-order-form.counterparty.BUSINESS_SUPPLIER',
                                }) }
                                formItemLayout={ formItemLayout }
                                getFieldDecorator={ form.getFieldDecorator }
                                getPopupContainer={ trigger =>
                                    trigger.parentNode
                                }
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
                            <AddSupplierIcon
                                type='plus'
                                onClick={ () => props.setModal(MODALS.SUPPLIER) }
                            />
                        </SupplierFieldWrapper>
                    </FormColumn>
                    <FormColumn>
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
                    </FormColumn>
                </FormBody>
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
