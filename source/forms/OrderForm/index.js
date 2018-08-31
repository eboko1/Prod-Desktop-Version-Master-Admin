// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';

//proj
import {
    onChangeOrderForm,
    setClientSelection,
} from 'core/forms/orderForm/duck';
import { resetModal } from 'core/modals/duck';
import { initOrderTasksForm } from 'core/forms/orderTaskForm/duck';

import { AddClientModal } from 'modals';

import { withReduxForm2 } from 'utils';

// own
import OrderFormHeader from './OrderFormHeader';
import OrderFormBody from './OrderFormBody';
import OrderFormTabs from './OrderFormTabs';
import { ClientsSearchTable } from './OrderFormTables';
import { servicesStats, detailsStats } from './stats';
import Styles from './styles.m.css';

@injectIntl
@withReduxForm2({
    name:            'orderForm',
    debouncedFields: [ 'comment', 'recommendation', 'vehicleCondition', 'businessComment' ],
    actions:         {
        change: onChangeOrderForm,
        setClientSelection,
        initOrderTasksForm,
        resetModal,
    },
    mapStateToProps: state => ({
        modal:                  state.modals.modal,
        addClientFormData:      state.forms.addClientForm.data,
        authentificatedManager: state.auth.id,
        user:                   state.auth,
    }),
})
export class OrderForm extends Component {
    state = {};

    componentDidMount() {
        // TODO in order to fix late getFieldDecorator invoke for services
        this.setState({ initialized: true });
    }

    _saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        this.props.form.getFieldDecorator('services[0].serviceName');
        this.props.form.getFieldDecorator('details[0].detailName');

        const clientsSearchTable = this._renderClientSearchTable();
        const tabs = this._renderTabs();

        return (
            <Form className={ Styles.form } layout='horizontal'>
                <OrderFormHeader { ...this.props } />
                { clientsSearchTable }
                <OrderFormBody { ...this.props } />
                { tabs }
                <AddClientModal
                    searchQuery={ this.props.form.getFieldValue(
                        'searchClientQuery',
                    ) }
                    wrappedComponentRef={ this._saveFormRef }
                    visible={ this.props.modal }
                    resetModal={ this.props.resetModal }
                    addClientFormData={ this.props.addClientFormData }
                />
            </Form>
        );
    }

    _renderClientSearchTable = () => {
        const {
            searchClientsResult: { searching: clientsSearching, clients },
            setClientSelection,
        } = this.props;
        const { getFieldValue } = this.props.form;

        return (
            <ClientsSearchTable
                clientsSearching={ clientsSearching }
                setClientSelection={ setClientSelection }
                visible={ getFieldValue('searchClientQuery') }
                clients={ clients }
            />
        );
    };

    _renderTabs = () => {
        const { form, orderTasks, setModal, allServices } = this.props;
        const { formatMessage } = this.props.intl;
        const { getFieldDecorator } = this.props.form;

        const { count: countDetails, price: priceDetails } = detailsStats(
            form.getFieldsValue().details || [],
        );

        const {
            count: countServices,
            price: priceServices,
            totalHours,
        } = servicesStats(form.getFieldsValue().services || [], allServices);

        const comments = form.getFieldsValue([ 'comment', 'businessComment', 'vehicleCondition', 'recommendation' ]);

        const commentsCollection = _.values(comments);
        const commentsCount = commentsCollection.filter(Boolean).length;

        return (
            <OrderFormTabs
                { ...this.props }
                initOrderTasksForm={ this.props.initOrderTasksForm }
                formatMessage={ formatMessage }
                getFieldDecorator={ getFieldDecorator }
                form={ form }
                totalHours={ totalHours }
                countServices={ countServices }
                countDetails={ countDetails }
                priceServices={ priceServices }
                priceDetails={ priceDetails }
                setModal={ setModal }
                orderTasks={ orderTasks }
                commentsCount={ commentsCount }
            />
        );
    };
}
