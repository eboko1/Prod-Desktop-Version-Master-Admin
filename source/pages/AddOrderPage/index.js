// vendor
import _ from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Icon, Button, Radio } from 'antd';

// proj
import { fetchAddOrderForm, createOrder } from 'core/forms/orderForm/duck';
import { fetchAddClientForm } from 'core/forms/addClientForm/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Layout } from 'commons';
import { OrderForm } from 'forms';
import { AddClientModal } from 'modals';

//  own
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import Styles from './styles.m.css';

function convertFieldsValuesToDbEntity(orderFields, allServices, allDetails) {

    const services = _(orderFields.services)
        .values()
        .filter(service => _.get(service, 'serviceName.value'))
        .map(service => {
            const {
                serviceName: { value: name },
                servicePrice: { value: price },
                serviceCount: { value: count },
            } = service;
            const [ type, serviceId ] = name.split('|');
            const label = (allServices.find(({id, type}) => `${type}|${id}` === name) || {}).serviceName;

            const baseService = { price, count, hours: null };
            const serviceType =
                type === 'custom'
                    ? { type, serviceName: label }
                    : { type, serviceId };

            return { ...baseService, ...serviceType };
        });

    const details = _(orderFields.details)
        .values()
        .filter(detail => _.get(detail, 'detailName.value'))
        .map(detail => {
            const {
                detailName: { value: detailId },
                detailPrice: { value: price },
                detailCount: { value: count },
                detailBrandName: { value: brandId },
            } = detail;
            const [ detailType ] = String(detailId).split('|');
            const [ brandType ] = String(brandId).split('|');

            const detailLabel = (allDetails.details.find(({detailId: id}) => id === detailId) || {}).detailName;
            const brandLabel = (allDetails.brands.find(({brandId: id}) => id === brandId) || {}).brandName;

            const baseDetail = { price, count, ownDetail: false };
            const detailCustom =
                detailType === 'custom' ? { name: detailLabel } : { detailId };
            const brandCustom =
                brandType === 'custom' ? { brandName: brandLabel } : { brandId };

            return { ...baseDetail, ...detailCustom, ...brandCustom };
        });

    const order = {
        clientId:            _.get(orderFields, 'selectedClient.clientId'),
        status:              'not_complete',
        clientVehicleId:     _.get(orderFields, 'clientVehicle.value'),
        businessRequisiteId: _.get(orderFields, 'requisite.value'),
        managerId:           _.get(orderFields, 'manager.value'),
        beginDatetime:       _.get(orderFields, 'beginDatetime.value'),
        clientPhone:         _.get(orderFields, 'clientPhone.value'),
        paymentMethod:       _.get(orderFields, 'paymentMethod.value'),
        clientRequisiteId:   _.get(orderFields, 'clientRequisite.value'),
        services,
        details,
        employeeId:          _.get(orderFields, 'employee.value'),
    };

    return order;
}

const mapStateToProps = state => {
    return {
        stations:          state.forms.addOrderForm.stations,
        vehicles:          state.forms.addOrderForm.vehicles,
        employees:         state.forms.addOrderForm.employees,
        managers:          state.forms.addOrderForm.managers,
        clients:           state.forms.addOrderForm.clients.clients,
        allDetails:        state.forms.orderForm.allDetails,
        allServices:       state.forms.orderForm.allServices,
        requisites:        state.forms.addOrderForm.requisites,
        addClientModal:    state.modals.modal,
        addClientFormData: state.forms.addClientForm.data,
        orderEntity:       {
            ...state.forms.orderForm.fields,
            selectedClient: state.forms.orderForm.selectedClient,
        },
    };
};

const mapDispatch = {
    fetchAddOrderForm,
    fetchAddClientForm,
    setModal,
    resetModal,
    createOrder,
};

@withRouter
@connect(mapStateToProps, mapDispatch)
class AddOrderPage extends Component {
    componentDidMount() {
        this.props.fetchAddOrderForm();
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    onSubmit = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (!err) {
                this.props.createOrder(
                    convertFieldsValuesToDbEntity(
                        this.props.orderEntity,
                        this.props.allServices,
                        this.props.allDetails,
                    ),
                );
                // eslint-disable-next-line
                console.log("Received values of form: ", values);
            }
        });
    };

    handleAddClientModalSubmit = () => {
        const form = this.formRef.props.form;
        this.setAddClientModal();
        form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of AddClientForm: ', values);
            }
        });
        this.props.resetModal();
    };

    setAddClientModal = () => {
        this.props.fetchAddClientForm();
        this.props.setModal(MODALS.ADD_CLIENT);
    };

    render() {
        const { addClientModal, resetModal, addClientFormData } = this.props;

        return (
            <Layout
                title={ <FormattedMessage id='add-order-page.add_order' /> }
                controls={
                    <>
                        <div>
                            <RadioGroup defaultValue='not_complete'>
                                <RadioButton value='reserve'>
                                    <FormattedMessage id='reserve' />
                                </RadioButton>
                                <RadioButton value='not_complete'>
                                    <FormattedMessage id='not_complete' />
                                </RadioButton>
                                <RadioButton value='required'>
                                    <FormattedMessage id='required' />
                                </RadioButton>
                                <RadioButton value='approve'>
                                    <FormattedMessage id='approve' />
                                </RadioButton>
                            </RadioGroup>
                            <Button
                                type='primary'
                                htmlType='submit'
                                className={ Styles.submit }
                                onClick={ this.onSubmit }
                            >
                                <FormattedMessage id='add' />
                            </Button>
                        </div>
                        <Icon
                            style={ { fontSize: 24, cursor: 'pointer' } }
                            type='close'
                            onClick={ () => this.props.history.goBack() }
                        />
                    </>
                }
            >
                { /* eslint-disable-next-line */ }
                <OrderForm
                    wrappedComponentRef={ this.saveFormRef }
                    setAddClientModal={ this.setAddClientModal }
                    addClientModal={ addClientModal }
                />
                <AddClientModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ addClientModal }
                    handleAddClientModalSubmit={ this.handleAddClientModalSubmit }
                    resetModal={ resetModal }
                    addClientFormData={ addClientFormData }
                />
            </Layout>
        );
    }
}

export default AddOrderPage;
