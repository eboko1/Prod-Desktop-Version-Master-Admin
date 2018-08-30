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
        spinner:           state.ui.orderFetching,
        createStatus:      state.forms.orderForm.createStatus,
        selectedClient:    state.forms.orderForm.selectedClient,
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
@connect(
    mapStateToProps,
    mapDispatch,
)
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

    _onSubmit = () => {
        const form = this.orderFormRef.props.form;
        const {
            allServices,
            allDetails,
            selectedClient,
            createStatus,
        } = this.props;
        const requiredFields =
            requiredFieldsOnStatuses[ this.props.createStatus ];

        form.validateFields(requiredFields, err => {
            if (!err) {
                const values = form.getFieldsValue();
                const orderFormEntity = { ...values, selectedClient };

                this.props.createOrder(
                    convertFieldsValuesToDbEntity(
                        orderFormEntity,
                        allServices,
                        allDetails,
                        createStatus,
                    ),
                );
            }
        });
    };

    _setAddClientModal = () => {
        this.props.fetchAddClientForm();
        this.props.setModal(MODALS.ADD_CLIENT);
    };

    _setCreateStatus = status => this.props.setCreateStatus(status);

    render() {
        const { modal, resetModal, addClientFormData, spinner } = this.props;

        return spinner ? (
            <Spinner spin={ spinner } />
        ) : (
            <Layout
                title={ <FormattedMessage id='add-order-page.add_order' /> }
                controls={
                    <>
                        <div>
                            <RadioGroup value={ this.props.createStatus }>
                                <RadioButton
                                    value='reserve'
                                    onClick={ () =>
                                        this._setCreateStatus('reserve')
                                    }
                                >
                                    <FormattedMessage id='reserve' />
                                </RadioButton>
                                <RadioButton
                                    value='not_complete'
                                    onClick={ () =>
                                        this._setCreateStatus('not_complete')
                                    }
                                >
                                    <FormattedMessage id='not_complete' />
                                </RadioButton>
                                <RadioButton
                                    value='required'
                                    onClick={ () =>
                                        this._setCreateStatus('required')
                                    }
                                >
                                    <FormattedMessage id='required' />
                                </RadioButton>
                                <RadioButton
                                    value='approve'
                                    onClick={ () =>
                                        this._setCreateStatus('approve')
                                    }
                                >
                                    <FormattedMessage id='approve' />
                                </RadioButton>
                            </RadioGroup>
                            <Button
                                type='primary'
                                htmlType='submit'
                                className={ Styles.submit }
                                onClick={ this._onSubmit }
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
                <OrderForm
                    wrappedComponentRef={ this.saveOrderFormRef }
                    setAddClientModal={ this._setAddClientModal }
                    modal={ modal }
                    addOrderForm
                    location={ this.props.history.location }
                />
            </Layout>
        );
    }
}

export default AddOrderPage;
