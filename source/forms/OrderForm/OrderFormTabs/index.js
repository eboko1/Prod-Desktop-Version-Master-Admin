// vendor
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Tabs, Icon, Button } from 'antd';
import _ from 'lodash';

// proj
import { MODALS } from 'core/modals/duck';
import { DecoratedTextArea } from 'forms/DecoratedFields';
import { permissions, isForbidden } from 'utils';

// own
import {
    DetailsTable,
    ServicesTable,
    DiscountPanel,
    TasksTable,
    HistoryTable,
    CallsTable,
    StationsTable,
} from '../OrderFormTables';
import Styles from './styles.m.css';

const TabPane = Tabs.TabPane;

function hideTasks(orderTasks, managerId) {
    const newOrderTasks = _.cloneDeep(orderTasks);
    _.each(_.get(newOrderTasks, 'orderTasks'), newOrderTask => {
        newOrderTask.history = _.filter(newOrderTask.history, {
            responsibleId: managerId,
        });
    });

    return newOrderTasks;
}

@injectIntl
export default class OrderFormTabs extends Component {
    // shouldComponentUpdate(nextProps) {
    //     console.log('OrderFormTabs.shouldComponentUpdate.this.props', this.props.fields.comment);
    //     console.log('OrderFormTabs.shouldComponentUpdate.nextProps', nextProps.fields.comment);
    //     console.log('OrderFormTabs.shouldComponentUpdate', !_.isEqual(nextProps, this.props));
    //
    //     return true;
    // }

    /* eslint-disable complexity */

    constructor(props) {
        super(props);
        this._localizationMap = {};
        this.commentsRules = [
            {
                max:     2000,
                message: this.props.intl.formatMessage({
                    id: 'field_should_be_below_2000_chars',
                }),
            },
        ];
        this.commentsAutoSize = { minRows: 2, maxRows: 6 };
    }
    // TODO: move into utils
    _getLocalization(key) {
        if (!this._localizationMap[ key ]) {
            this._localizationMap[ key ] = this.props.intl.formatMessage({
                id: key,
            });
        }

        return this._localizationMap[ key ];
    }

    render() {
        const {
            setModal,
            fetchOrderForm,
            fetchOrderTask,
            fetchTecdocSuggestions,
            fetchTecdocDetailsSuggestions,
            clearTecdocDetailsSuggestions,
            clearTecdocSuggestions,

            addOrderForm,
            detailsSuggestionsFetching,
            suggestionsFetching,

            orderTasks,
            orderCalls,
            orderHistory,
            orderServices,
            orderDetails,
            allServices,
            allDetails,
            employees,
            selectedClient,
            detailsSuggestions,
            suggestions,
            fetchedOrder,
            user,
            schedule,
            stations,
            availableHours,
            stationLoads,
            tecdocId,
            clientVehicleId,

            //fields
            services,
            details,
            initialStation,
            initialBeginDatetime,

            // stats
            priceDetails,
            priceServices,
            countDetails,
            countServices,
            commentsCount,
            stationsCount,
            totalDetailsProfit,

            intl: { formatMessage },
            form: { getFieldDecorator },
            form,

            initOrderTasksForm,
            changeModalStatus,

            fields,
            errors,
        } = this.props;

        const {
            ACCESS_ORDER_HISTORY,
            ACCESS_ORDER_CALLS,
            ACCESS_ORDER_COMMENTS,
            ACCESS_ORDER_SERVICES,
            ACCESS_ORDER_DETAILS,
            GET_TASKS,
            GET_ALL_TASKS,
        } = permissions;

        const isHistoryForbidden = isForbidden(user, ACCESS_ORDER_HISTORY);
        const areCallsForbidden = isForbidden(user, ACCESS_ORDER_CALLS);
        const areCommentsForbidden = isForbidden(user, ACCESS_ORDER_COMMENTS);
        const areServicesForbidden = isForbidden(user, ACCESS_ORDER_SERVICES);
        const areDetailsForbidden = isForbidden(user, ACCESS_ORDER_DETAILS);

        const viewTasks = !isForbidden(user, GET_TASKS);
        const viewAllTasks = !isForbidden(user, GET_ALL_TASKS);
        const canCreateTask =
            viewAllTasks &&
            orderTasks.orderTasks &&
            orderTasks.orderTasks.length < 1;

        const tasks = viewAllTasks
            ? orderTasks
            : hideTasks(orderTasks, user.id);

        const servicesTableFieldsProps = _.pick(this.props.fields, [ 'services', 'clientVehicle', 'employee' ]);
        const detailsTableFieldsProps = _.pick(this.props.fields, [ 'details' ]);
        const discountTabFieldsProps = _.pick(this.props.fields, [ 'servicesDiscount', 'detailsDiscount' ]);
        const stationLoadsFieldsProps = _.pick(this.props.fields, [ 'stationLoads' ]);

        return (
            <Tabs type='card' className={ Styles.orderFormsTabs }>
                { !addOrderForm && viewTasks && (
                    <TabPane
                        forceRender
                        tab={
                            formatMessage({
                                id: 'order_form_table.tasks',
                            }) +
                            ` (${orderTasks.orderTasks ?
                                orderTasks.orderTasks.length : 0})`
                        }
                        key='1'
                    >
                        { canCreateTask ? (
                            <Button
                                className={ Styles.orderTaskModalButton }
                                type='primary'
                                onClick={ () => setModal(MODALS.ORDER_TASK) }
                            >
                                <FormattedMessage id='add' />
                                <Icon type='plus' />
                            </Button>
                        ) : null }

                        <TasksTable
                            errors={ errors }
                            user={ user }
                            initOrderTasksForm={ initOrderTasksForm }
                            setModal={ setModal }
                            changeModalStatus={ changeModalStatus }
                            orderTasks={ tasks }
                        />
                    </TabPane>
                ) }
                <TabPane
                    forceRender
                    tab={ `${formatMessage({
                        id:             'add_order_form.services',
                        defaultMessage: 'Services',
                    })} (${countServices})` }
                    key='2'
                >
                    <ServicesTable
                        errors={ errors }
                        fields={ servicesTableFieldsProps }
                        services={ services }
                        employees={ employees }
                        form={ form }
                        allServices={ allServices }
                        orderServices={ orderServices }
                        user={ user }
                        selectedClient={ selectedClient }
                        fetchTecdocSuggestions={ fetchTecdocSuggestions }
                    />
                    <DiscountPanel
                        fields={ discountTabFieldsProps }
                        form={ form }
                        forbidden={ areServicesForbidden }
                        price={ priceServices }
                        discountFieldName={ 'servicesDiscount' }
                        fetchedOrder={ fetchedOrder }
                    />
                </TabPane>
                <TabPane
                    forceRender
                    tab={ `${formatMessage({
                        id:             'add_order_form.details',
                        defaultMessage: 'Details',
                    })} (${countDetails})` }
                    key='3'
                >
                    <DetailsTable
                        errors={ errors }
                        fields={ detailsTableFieldsProps }
                        details={ details }
                        tecdocId={ tecdocId }
                        clientVehicleId={ clientVehicleId }
                        orderDetails={ orderDetails }
                        form={ form }
                        allDetails={ allDetails }
                        fetchTecdocDetailsSuggestions={
                            fetchTecdocDetailsSuggestions
                        }
                        detailsSuggestions={ detailsSuggestions }
                        clearTecdocDetailsSuggestions={
                            clearTecdocDetailsSuggestions
                        }
                        clearTecdocSuggestions={ clearTecdocSuggestions }
                        suggestions={ suggestions }
                        detailsSuggestionsFetching={ detailsSuggestionsFetching }
                        suggestionsFetching={ suggestionsFetching }
                        user={ user }
                    />
                    <DiscountPanel
                        fields={ discountTabFieldsProps }
                        form={ form }
                        forbidden={ areDetailsForbidden }
                        price={ priceDetails }
                        totalDetailsProfit={ totalDetailsProfit }
                        discountFieldName={ 'detailsDiscount' }
                        fetchedOrder={ fetchedOrder }
                        detailsMode
                    />
                </TabPane>
                <TabPane
                    forceRender
                    key='4'
                    tab={
                        formatMessage({
                            id: 'add_order_form.comments',
                        }) + ` (${commentsCount})`
                    }
                >
                    <DecoratedTextArea
                        errors={ errors }
                        defaultGetValueProps
                        fieldValue={ _.get(fields, 'comment') }
                        formItem
                        disabled={ areCommentsForbidden }
                        label={ this._getLocalization(
                            'add_order_form.client_comments',
                        ) }
                        getFieldDecorator={ getFieldDecorator }
                        field='comment'
                        initialValue={ _.get(fetchedOrder, 'order.comment') }
                        rules={ this.commentsRules }
                        placeholder={ this._getLocalization(
                            'add_order_form.client_comments',
                        ) }
                        autosize={ this.commentsAutoSize }
                    />
                    <DecoratedTextArea
                        errors={ errors }
                        defaultGetValueProps
                        fieldValue={ _.get(fields, 'vehicleCondition') }
                        formItem
                        disabled={ areCommentsForbidden }
                        label={ this._getLocalization(
                            'add_order_form.vehicle_condition',
                        ) }
                        getFieldDecorator={ getFieldDecorator }
                        field='vehicleCondition'
                        initialValue={ _.get(
                            fetchedOrder,
                            'order.vehicleCondition',
                        ) }
                        rules={ this.commentsRules }
                        placeholder={ this._getLocalization(
                            'add_order_form.vehicle_condition',
                        ) }
                        autosize={ this.commentsAutoSize }
                    />

                    <DecoratedTextArea
                        errors={ errors }
                        defaultGetValueProps
                        fieldValue={ _.get(fields, 'businessComment') }
                        formItem
                        disabled={ areCommentsForbidden }
                        label={ this._getLocalization(
                            'add_order_form.business_comment',
                        ) }
                        getFieldDecorator={ getFieldDecorator }
                        field='businessComment'
                        initialValue={ _.get(
                            fetchedOrder,
                            'order.businessComment',
                        ) }
                        rules={ this.commentsRules }
                        placeholder={ this._getLocalization(
                            'add_order_form.business_comment',
                        ) }
                        autosize={ this.commentsAutoSize }
                    />

                    <DecoratedTextArea
                        errors={ errors }
                        defaultGetValueProps
                        fieldValue={ _.get(fields, 'recommendation') }
                        formItem
                        disabled={ areCommentsForbidden }
                        label={ this._getLocalization(
                            'add_order_form.service_recommendations',
                        ) }
                        getFieldDecorator={ getFieldDecorator }
                        field='recommendation'
                        initialValue={ _.get(
                            fetchedOrder,
                            'order.recommendation',
                        ) }
                        rules={ this.commentsRules }
                        placeholder={ this._getLocalization(
                            'add_order_form.service_recommendations',
                        ) }
                        autosize={ this.commentsAutoSize }
                    />
                </TabPane>
                { !addOrderForm && (
                    <TabPane
                        forceRender
                        disabled={ isHistoryForbidden }
                        tab={
                            formatMessage({
                                id: 'order_form_table.history',
                            }) +
                            (isHistoryForbidden
                                ? ''
                                : ` (${orderHistory.orders.length})`)
                        }
                        key='5'
                    >
                        <HistoryTable
                            orderHistory={ orderHistory }
                            fetchOrderForm={ fetchOrderForm }
                            fetchOrderTask={ fetchOrderTask }
                            user={ user }
                        />
                    </TabPane>
                ) }
                { !addOrderForm && (
                    <TabPane
                        forceRender
                        disabled={ areCallsForbidden }
                        tab={
                            formatMessage({
                                id: 'order_form_table.calls',
                            }) +
                            (areCallsForbidden ? '' : ` (${orderCalls.length})`)
                        }
                        key='6'
                    >
                        <CallsTable orderCalls={ orderCalls } />
                    </TabPane>
                ) }
                <TabPane
                    forceRender
                    // disabled={ areCallsForbidden }
                    tab={
                        formatMessage({
                            id: 'order_form_table.station',
                        }) + ` (${stationsCount ? stationsCount.length : 0})`
                    }
                    key='7'
                >
                    <StationsTable
                        errors={ errors }
                        initialBeginDatetime={ initialBeginDatetime }
                        initialStation={ initialStation }
                        fields={ stationLoadsFieldsProps }
                        form={ form }
                        schedule={ schedule }
                        stations={ stations }
                        availableHours={ availableHours }
                        stationLoads={ stationLoads }
                        user={ user }
                    />
                </TabPane>
            </Tabs>
        );
    }
}
