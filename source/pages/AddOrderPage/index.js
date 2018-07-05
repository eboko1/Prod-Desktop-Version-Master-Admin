// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Icon, Button, Radio } from 'antd';

// proj
import { fetchAddOrderForm } from 'core/forms/addOrderForm/duck';
import { fetchAddClientForm } from 'core/forms/addClientForm/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Layout } from 'commons';
import { AddOrderForm } from 'forms';
import { AddClientModal } from 'modals';

//  own
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        stations:          state.forms.addOrderForm.stations,
        vehicles:          state.forms.addOrderForm.vehicles,
        employees:         state.forms.addOrderForm.employees,
        managers:          state.forms.addOrderForm.managers,
        clients:           state.forms.addOrderForm.clients.clients,
        allDetails:        state.forms.addOrderForm.allDetails,
        allServices:       state.forms.addOrderForm.allServices,
        requisites:        state.forms.addOrderForm.requisites,
        addClientModal:    state.modals.modal,
        addClientFormData: state.forms.addClientForm.data,
    };
};

const mapDispatch = {
    fetchAddOrderForm,
    fetchAddClientForm,
    setModal,
    resetModal,
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
                <AddOrderForm
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
