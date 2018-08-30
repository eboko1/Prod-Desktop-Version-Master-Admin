// vendro
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Tabs, Form, Icon, Button } from 'antd';
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
} from 'components/OrderForm/OrderFormTables';
import Styles from './styles.m.css';
const TabPane = Tabs.TabPane;

export class OrderFormTabs extends Component {
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
        } = this.props;

        const isHistoryForbidden = isForbidden(
            this.props.user,
            permissions.ACCESS_ORDER_HISTORY,
        );

        const areCallsForbidden = isForbidden(
            this.props.user,
            permissions.ACCESS_ORDER_CALLS,
        );

        return (
            <Tabs type='card'>
                { !addOrderForm && (
                    <TabPane
                        forceRender
                        tab={
                            formatMessage({
                                id: 'order_form_table.tasks',
                            }) + ` (${orderTasks.length})`
                        }
                        key='1'
                    >
                        { orderTasks.length < 1 ? (
                            <Button
                                className={ Styles.orderTaskModalButton }
                                type='primary'
                                onClick={ () => {
                                    setModal(MODALS.ORDER_TASK);
                                } }
                            >
                                <Icon type='plus' />
                            </Button>
                        ) : null }

                        <TasksTable
                            initOrderTasksForm={ initOrderTasksForm }
                            setModal={ setModal }
                            changeModalStatus={ changeModalStatus }
                            orderTasks={ orderTasks }
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
                        label={
                            <FormattedMessage id='add_order_form.client_comments' />
                        }
                        getFieldDecorator={ getFieldDecorator }
                        field='comment'
                        initialValue={ _.get(fetchedOrder, 'order.comment') }
                        rules={ [
                            {
                                max:     2000,
                                message: 'Too much',
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
                                message: 'Too much',
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
                                message: 'Too much',
                            },
                        ] }
                        placeholder={ formatMessage({
                            id:             'add_order_form.business_comment',
                            defaultMessage: 'Business comment',
                        }) }
                        autosize={ { minRows: 2, maxRows: 6 } }
                    />

                    <DecoratedTextArea
                        formItem
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
                                message: 'Too much',
                            },
                        ] }
                        placeholder={ formatMessage({
                            id:             'add_order_form.service_recommendations',
                            defaultMessage: 'Service recommendations',
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
                        <HistoryTable orderHistory={ orderHistory } />
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
