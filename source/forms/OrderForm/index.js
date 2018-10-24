// vendor
import React, { Component } from 'react';
import { Form } from 'antd';
import { injectIntl } from 'react-intl';
import _ from 'lodash';

//proj
import {
    onChangeOrderForm,
    setClientSelection,
    fetchAvailableHours,
    fetchTecdocSuggestions,
    fetchTecdocDetailsSuggestions,
    clearTecdocSuggestions,
    clearTecdocDetailsSuggestions,
} from 'core/forms/orderForm/duck';
import { resetModal } from 'core/modals/duck';
import { initOrderTasksForm } from 'core/forms/orderTaskForm/duck';

import { AddClientModal } from 'modals';

import { withReduxForm2 } from 'utils';

// own
import OrderFormHeader from './OrderFormHeader';
import OrderFormBody from './OrderFormBody';
import OrderFormTabs from './OrderFormTabs';
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
        fetchAvailableHours,
        fetchTecdocSuggestions,
        clearTecdocSuggestions,
        fetchTecdocDetailsSuggestions,
        clearTecdocDetailsSuggestions,
    },
    mapStateToProps: state => ({
        modal:                      state.modals.modal,
        addClientFormData:          state.forms.addClientForm.data,
        authentificatedManager:     state.auth.id,
        user:                       state.auth,
        suggestionsFetching:        state.ui.suggestionsFetching,
        detailsSuggestionsFetching: state.ui.detailsSuggestionsFetching,
        stationLoads:               state.forms.orderForm.stationLoads,
        schedule:                   state.forms.orderForm.schedule,
    }),
})
export class OrderForm extends Component {
    state = {
        formValues: {},
    };

    componentDidMount() {
        // TODO in order to fix late getFieldDecorator invoke for services
        this.setState({ initialized: true });
    }

    // TODO BODYA (antd rc-forms q)
    componentDidUpdate(prevProps, prevState) {
        const { formValues: prevFormValues } = prevState;
        const formValues = this.props.form.getFieldsValue();

        if (!_.isEqual(formValues, prevFormValues)) {
            this.setState({ formValues });
        }
    }

    _saveFormRef = formRef => {
        this.formRef = formRef;
    };

    _getTecdocId = () => {
        const { form } = this.props;

        const clientVehicleId = form.getFieldValue('clientVehicle');
        const vehicles = _.get(this.props, 'selectedClient.vehicles');

        return clientVehicleId && _.isArray(vehicles)
            ? _.chain(vehicles)
                .find({ id: clientVehicleId })
                .get('tecdocId', null)
                .value()
            : null;
    };

    render() {
        const { form, allServices } = this.props;
        form.getFieldDecorator('services[0].serviceName');
        form.getFieldDecorator('details[0].detailName');

        const tabs = this._renderTabs();

        const { totalHours } = servicesStats(
            form.getFieldsValue().services || [],
            allServices,
        );

        return (
            <Form className={ Styles.form } layout='horizontal'>
                <OrderFormHeader { ...this.props } totalHours={ totalHours } />
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

    _renderTabs = () => {
        const {
            form,
            orderTasks,
            setModal,
            allServices,
            stationLoads,
            schedule,
        } = this.props;
        const { formatMessage } = this.props.intl;
        const { getFieldDecorator } = this.props.form;

        const { count: countDetails, price: priceDetails } = detailsStats(
            form.getFieldsValue().details || [],
        );

        const {
            count: countServices,
            price: priceServices,
            // totalHours,
        } = servicesStats(form.getFieldsValue().services || [], allServices);

        const comments = form.getFieldsValue([ 'comment', 'businessComment', 'vehicleCondition', 'recommendation' ]);

        const commentsCollection = _.values(comments);
        const commentsCount = commentsCollection.filter(Boolean).length;

        const tecdocId = this._getTecdocId();
        const clientVehicleId = form.getFieldValue('clientVehicle');

        return (
            <OrderFormTabs
                { ...this.props }
                tecdocId={ tecdocId }
                clientVehicleId={ clientVehicleId }
                initOrderTasksForm={ this.props.initOrderTasksForm }
                formatMessage={ formatMessage }
                getFieldDecorator={ getFieldDecorator }
                form={ form }
                // totalHours={ totalHours }
                countServices={ countServices }
                countDetails={ countDetails }
                priceServices={ priceServices }
                priceDetails={ priceDetails }
                setModal={ setModal }
                orderTasks={ orderTasks }
                stationLoads={ stationLoads }
                schedule={ schedule }
                commentsCount={ commentsCount }
            />
        );
    };
}
