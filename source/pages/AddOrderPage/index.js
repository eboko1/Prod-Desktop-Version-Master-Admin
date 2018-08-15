// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Icon, Button, Radio } from 'antd';

// proj
import {
    fetchAddOrderForm,
    createOrder,
    setCreateStatus,
} from 'core/forms/orderForm/duck';
import { fetchAddClientForm } from 'core/forms/addClientForm/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Layout, Spinner } from 'commons';
import { OrderForm } from 'forms';
import { AddClientModal } from 'modals';

//  own
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import Styles from './styles.m.css';

import {
    convertFieldsValuesToDbEntity,
    requiredFieldsOnStatuses,
} from './extractOrderEntity';

const mapStateToProps = state => {
    return {
        stations:          state.forms.orderForm.stations,
        vehicles:          state.forms.orderForm.vehicles,
        employees:         state.forms.orderForm.employees,
        managers:          state.forms.orderForm.managers,
        allDetails:        state.forms.orderForm.allDetails,
        allServices:       state.forms.orderForm.allServices,
        requisites:        state.forms.orderForm.requisites,
        modal:             state.modals.modal,
        addClientFormData: state.forms.addClientForm.data,
        createOrderStatus: state.forms.orderForm.fields.createOrderStatus.value,
        spinner:           state.ui.orderFetching,
        createStatus:      state.forms.orderForm.createStatus,
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
    setCreateStatus,
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

    saveOrderFormRef = formRef => {
        this.orderFormRef = formRef;
    };

    onSubmit = () => {
        const form = this.orderFormRef.props.form;
        const requiredFields =
            requiredFieldsOnStatuses[ this.props.createStatus ];

        form.validateFields(requiredFields, err => {
            if (!err) {
                this.props.createOrder(
                    convertFieldsValuesToDbEntity(
                        this.props.orderEntity,
                        this.props.allServices,
                        this.props.allDetails,
                        this.props.createStatus,
                        form,
                    ),
                );
            }
        });
    };

    handleAddClientModalSubmit = () => {
        const form = this.formRef.props.form;
        this.setAddClientModal();
        form.validateFields((err, values) => {
            if (!err) {
                // TBD: @yan
                // console.log('Received values of AddClientForm: ', values);
            }
        });
        this.props.resetModal();
    };

    setAddClientModal = () => {
        this.props.fetchAddClientForm();
        this.props.setModal(MODALS.ADD_CLIENT);
    };

    setCreateStatus = status => {
        this.props.setCreateStatus(status);
    };

    render() {
        const { modal, resetModal, addClientFormData, spinner } = this.props;

        return !spinner ? (
            <Layout
                title={ <FormattedMessage id='add-order-page.add_order' /> }
                controls={
                    <>
                        <div>
                            <RadioGroup value={ this.props.createStatus }>
                                <RadioButton
                                    value='reserve'
                                    onClick={ () =>
                                        this.setCreateStatus('reserve')
                                    }
                                >
                                    <FormattedMessage id='reserve' />
                                </RadioButton>
                                <RadioButton
                                    value='not_complete'
                                    onClick={ () =>
                                        this.setCreateStatus('not_complete')
                                    }
                                >
                                    <FormattedMessage id='not_complete' />
                                </RadioButton>
                                <RadioButton
                                    value='required'
                                    onClick={ () =>
                                        this.setCreateStatus('required')
                                    }
                                >
                                    <FormattedMessage id='required' />
                                </RadioButton>
                                <RadioButton
                                    value='approve'
                                    onClick={ () =>
                                        this.setCreateStatus('approve')
                                    }
                                >
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
                    wrappedComponentRef={ this.saveOrderFormRef }
                    setAddClientModal={ this.setAddClientModal }
                    modal={ modal }
                    addOrderForm
                />
                <AddClientModal
                    wrappedComponentRef={ this.saveFormRef }
                    visible={ modal }
                    handleAddClientModalSubmit={ this.handleAddClientModalSubmit }
                    resetModal={ resetModal }
                    addClientFormData={ addClientFormData }
                />
            </Layout>
        ) : (
            <Spinner spin={ spinner } />
        );
    }
}

export default AddOrderPage;
