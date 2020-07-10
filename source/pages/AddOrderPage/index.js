// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Icon, Button, Radio } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchAddOrderForm,
    createOrder,
    setCreateStatus,
    returnToOrdersPage,
} from 'core/forms/orderForm/duck';
import { fetchAddClientForm } from 'core/forms/addClientForm/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Layout, Spinner } from 'commons';
import { OrderForm } from 'forms';
import {
    convertFieldsValuesToDbEntity,
    requiredFieldsOnStatuses,
} from 'forms/OrderForm/extractOrderEntity';
import book from 'routes/book';
import { withErrorMessage } from 'utils';

//  own
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        // addClientFormData: state.forms.addClientForm.data,
        allDetails:        state.forms.orderForm.allDetails,
        allServices:       state.forms.orderForm.allServices,
        createStatus:      state.forms.orderForm.createStatus,
        employees:         state.forms.orderForm.employees,
        managers:          state.forms.orderForm.managers,
        modal:             state.modals.modal,
        orderHistory:      state.forms.orderForm.history,
        orderStationLoads: state.forms.orderForm.stationLoads,
        requisites:        state.forms.orderForm.requisites,
        selectedClient:    state.forms.orderForm.selectedClient,
        spinner:           state.ui.orderFetching,
        stations:          state.forms.orderForm.stations,
        user:              state.auth,
        vehicles:          state.forms.orderForm.vehicles,
    };
};

const mapDispatch = {
    fetchAddOrderForm,
    fetchAddClientForm,
    setModal,
    resetModal,
    createOrder,
    setCreateStatus,
    returnToOrdersPage,
};

@withRouter
@connect(
    mapStateToProps,
    mapDispatch,
)
@withErrorMessage()
class AddOrderPage extends Component {
    state = {
        errors: void 0,
    };

    componentDidMount() {
        this.props.fetchAddOrderForm();
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    saveOrderFormRef = formRef => {
        this.orderFormRef = formRef;
    };

    _createOrder = redirectStatus => {
        const form = this.orderFormRef.props.form;
        const {
            allServices,
            allDetails,
            selectedClient,
            createStatus,
            user,
            history,
        } = this.props;
        const requiredFields = requiredFieldsOnStatuses(form.getFieldsValue())[
            this.props.createStatus
        ];

        form.validateFields(requiredFields, err => {
            if (!err) {
                const values = form.getFieldsValue();
                const orderFormEntity = { ...values, selectedClient };

                /*const redirectToDashboard = _.get(
                    history,
                    'location.state.fromDashboard',
                );*/

                const redirectToDashboard = false;

                this.props.createOrder({
                    order: convertFieldsValuesToDbEntity(
                        orderFormEntity,
                        allServices,
                        allDetails,
                        createStatus,
                        user,
                    ),
                    redirectStatus,
                    redirectToDashboard,
                });
            } else {
                this.setState({ errors: err });
            }
        });
    };

    _redirect = () => {
        const { returnToOrdersPage, history, createStatus } = this.props;

        _.get(history, 'location.state.fromDashboard')
            ? history.push(`${book.dashboard}`)
            : returnToOrdersPage(createStatus);
    };

    _setAddClientModal = () => {
        this.props.fetchAddClientForm();
        this.props.setModal(MODALS.ADD_CLIENT);
    };

    _setCreateStatus = status => this.props.setCreateStatus(status);

    render() {
        const { modal, user, createStatus, spinner } = this.props;
        const { errors } = this.state;

        return spinner ? (
            <Spinner spin={ spinner } />
        ) : (
            <Layout
                title={ <FormattedMessage id='orders-page.add_appointment' /> }
                controls={
                    <>
                        <div>
                            <RadioGroup value={ createStatus }>
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
                                onClick={ () => this._createOrder(createStatus) }
                            >
                                <FormattedMessage id='add' />
                            </Button>
                        </div>
                        <Icon
                            style={ {
                                fontSize: 24,
                                cursor:   'pointer',
                            } }
                            type='close'
                            onClick={ this._redirect }
                        />
                    </>
                }
            >
                <OrderForm
                    allService={ this.props.allServices }
                    allDetails={ this.props.allDetails }
                    errors={ this.state.errors }
                    wrappedComponentRef={ this.saveOrderFormRef }
                    setAddClientModal={ this._setAddClientModal }
                    user={ user }
                    modal={ modal }
                    addOrderForm
                    orderHistory={ this.props.orderHistory }
                    orderStationLoads={ this.props.orderStationLoads }
                    location={ this.props.history.location }
                />
            </Layout>
        );
    }
}

export default AddOrderPage;
