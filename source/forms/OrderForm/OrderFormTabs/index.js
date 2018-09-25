// vendor
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
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

export default class OrderFormTabs extends Component {
    render() {
        const {
            addOrderForm,
            orderTasks,
            priceServices,
            countServices,
            countDetails,
            formatMessage,
            getFieldDecorator,
            orderCalls,
            orderHistory,
            defaultDetails,
            priceDetails,
            onDetailSearch,
            onBrandSearch,
            setModal,
            initOrderTasksForm,
            changeModalStatus,
            commentsCount,
            fetchedOrder,
            user,
            fetchOrderForm,
            fetchOrderTask,
        } = this.props;

        const {
            ACCESS_ORDER_HISTORY,
            ACCESS_ORDER_CALLS,
            ACCESS_ORDER_COMMENTS,
            ACCESS_ORDER_SERVICES,
            ACCESS_ORDER_DETAILS,
            GET_ALL_TASKS,
        } = permissions;

        const isHistoryForbidden = isForbidden(user, ACCESS_ORDER_HISTORY);
        const areCallsForbidden = isForbidden(user, ACCESS_ORDER_CALLS);
        const areCommentsForbidden = isForbidden(user, ACCESS_ORDER_COMMENTS);
        const areServicesForbidden = isForbidden(user, ACCESS_ORDER_SERVICES);
        const areDetailsForbidden = isForbidden(user, ACCESS_ORDER_DETAILS);

        const viewAllTasks = !isForbidden(user, GET_ALL_TASKS);
        const canCreateTask =
            viewAllTasks &&
            orderTasks.orderTasks &&
            orderTasks.orderTasks.length < 1;

        const tasks = viewAllTasks
            ? orderTasks
            : hideTasks(orderTasks, user.id);

        return (
            <Tabs type='card'>
                { !addOrderForm && (
                    <TabPane
                        forceRender
                        tab={
                            formatMessage({
                                id: 'order_form_table.tasks',
                            }) +
                            ` (${orderTasks.orderTasks &&
                                orderTasks.orderTasks.length})`
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
                    <ServicesTable { ...this.props } />
                    <DiscountPanel
                        forbidden={ areServicesForbidden }
                        price={ priceServices }
                        discountFieldName={ 'servicesDiscount' }
                        { ...this.props }
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
                        { ...this.props }
                        onDetailSearch={ onDetailSearch }
                        onBrandSearch={ onBrandSearch }
                        defaultDetail={ defaultDetails }
                    />
                    <DiscountPanel
                        { ...this.props }
                        price={ priceDetails }
                        forbidden={ areDetailsForbidden }
                        discountFieldName={ 'detailsDiscount' }
                        getFieldDecorator={ getFieldDecorator }
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
                        formItem
                        disabled={ areCommentsForbidden }
                        label={
                            <FormattedMessage id='add_order_form.client_comments' />
                        }
                        getFieldDecorator={ getFieldDecorator }
                        field='comment'
                        initialValue={ _.get(fetchedOrder, 'order.comment') }
                        rules={ [
                            {
                                max:     2000,
                                message: formatMessage({
                                    id: 'field_should_be_below_2000_chars',
                                }),
                            },
                        ] }
                        placeholder={ formatMessage({
                            id:             'add_order_form.client_comments',
                            defaultMessage: 'Client_comments',
                        }) }
                        autosize={ { minRows: 2, maxRows: 6 } }
                    />
                    <DecoratedTextArea
                        formItem
                        disabled={ areCommentsForbidden }
                        label={
                            <FormattedMessage id='add_order_form.vehicle_condition' />
                        }
                        getFieldDecorator={ getFieldDecorator }
                        field='vehicleCondition'
                        initialValue={ _.get(
                            fetchedOrder,
                            'order.vehicleCondition',
                        ) }
                        rules={ [
                            {
                                max:     2000,
                                message: formatMessage({
                                    id: 'field_should_be_below_2000_chars',
                                }),
                            },
                        ] }
                        placeholder={ formatMessage({
                            id:             'add_order_form.vehicle_condition',
                            defaultMessage: 'Vehicle condition',
                        }) }
                        autosize={ { minRows: 2, maxRows: 6 } }
                    />

                    <DecoratedTextArea
                        formItem
                        disabled={ areCommentsForbidden }
                        label={
                            <FormattedMessage id='add_order_form.business_comment' />
                        }
                        getFieldDecorator={ getFieldDecorator }
                        field='businessComment'
                        initialValue={ _.get(
                            fetchedOrder,
                            'order.businessComment',
                        ) }
                        rules={ [
                            {
                                max:     2000,
                                message: formatMessage({
                                    id: 'field_should_be_below_2000_chars',
                                }),
                            },
                        ] }
                        placeholder={ formatMessage({
                            id:             'add_order_form.business_comment',
                            defaultMessage: 'Work Order comments',
                        }) }
                        autosize={ { minRows: 2, maxRows: 6 } }
                    />

                    <DecoratedTextArea
                        formItem
                        disabled={ areCommentsForbidden }
                        label={
                            <FormattedMessage id='add_order_form.service_recommendations' />
                        }
                        getFieldDecorator={ getFieldDecorator }
                        field='recommendation'
                        initialValue={ _.get(
                            fetchedOrder,
                            'order.recommendation',
                        ) }
                        rules={ [
                            {
                                max:     2000,
                                message: formatMessage({
                                    id: 'field_should_be_below_2000_chars',
                                }),
                            },
                        ] }
                        placeholder={ formatMessage({
                            id:             'add_order_form.service_recommendations',
                            defaultMessage: 'Garage recommendations',
                        }) }
                        autosize={ { minRows: 2, maxRows: 6 } }
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
            </Tabs>
        );
    }
}
