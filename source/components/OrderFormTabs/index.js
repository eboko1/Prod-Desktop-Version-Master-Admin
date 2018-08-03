// vendro
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Tabs, Form } from 'antd';

// proj
import { DecoratedTextArea } from 'forms/DecoratedFields';

// own
import {
    DetailsTable,
    ServicesTable,
    DiscountPanel,
    TasksTable,
    HistoryTable,
    CallsTable,
} from 'components/OrderFormTables';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

class OrderFormTabs extends Component {
    render() {
        const {
            addOrderForm,
            orderTasks,
            priceServices,
            countServices,
            countDetails,
            formatMessage,
            getFieldDecorator,
            fields,
            orderCalls,
            orderHistory,
            onServiceSearch,
            defaultDetails,
            priceDetails,
            onDetailSearch,
            onBrandSearch,
            employees,
            allDetails,
            filteredDetails,
        } = this.props;

        return (
            <Tabs type='card'>
                { !addOrderForm && (
                    <TabPane
                        tab={
                            formatMessage({
                                id: 'order_form_table.tasks',
                            }) +
                            ' (' +
                            orderTasks.length +
                            ')'
                        }
                        key='1'
                    >
                        <TasksTable orderTasks={ orderTasks } />
                    </TabPane>
                ) }
                <TabPane
                    tab={ `${formatMessage({
                        id:             'add_order_form.services',
                        defaultMessage: 'Services',
                    })} (${countServices})` }
                    key='2'
                >
                    <ServicesTable
                        { ...this.props }
                        onServiceSearch={ onServiceSearch }
                        services={ fields.services }
                    />
                    <DiscountPanel
                        price={ priceServices }
                        discountFieldName={ 'servicesDiscount' }
                        { ...this.props }
                    />
                </TabPane>
                <TabPane
                    tab={ `${formatMessage({
                        id:             'add_order_form.details',
                        defaultMessage: 'Details',
                    })} (${countDetails})` }
                    key='3'
                >
                    <DetailsTable
                        { ...this.props }
                        details={ fields.details }
                        onDetailSearch={ onDetailSearch }
                        onBrandSearch={ onBrandSearch }
                        defaultDetail={ defaultDetails }
                    />
                    <DiscountPanel
                        price={ priceDetails }
                        discountFieldName={ 'detailsDiscount' }
                        { ...this.props }
                        getFieldDecorator={ getFieldDecorator }
                    />
                </TabPane>
                <TabPane
                    tab={ <FormattedMessage id='add_order_form.comments' /> }
                    key='4'
                >
                    <FormItem
                        label={
                            <FormattedMessage id='add_order_form.client_comments' />
                        }
                    >
                        <DecoratedTextArea
                            getFieldDecorator={ getFieldDecorator }
                            field='comment'
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
                    </FormItem>
                    <FormItem
                        label={
                            <FormattedMessage id='add_order_form.service_recommendations' />
                        }
                    >
                        <DecoratedTextArea
                            getFieldDecorator={ getFieldDecorator }
                            field='recommendation'
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
                    </FormItem>
                    <FormItem
                        label={
                            <FormattedMessage id='add_order_form.vehicle_condition' />
                        }
                    >
                        <DecoratedTextArea
                            getFieldDecorator={ getFieldDecorator }
                            field='vehicleCondition'
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
                    </FormItem>
                    <FormItem
                        label={
                            <FormattedMessage id='add_order_form.business_comment' />
                        }
                    >
                        <DecoratedTextArea
                            getFieldDecorator={ getFieldDecorator }
                            field='businessComment'
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
                    </FormItem>
                </TabPane>
                { !addOrderForm && (
                    <TabPane
                        tab={
                            formatMessage({
                                id: 'order_form_table.history',
                            }) +
                            ' (' +
                            orderHistory.orders.length +
                            ')'
                        }
                        key='5'
                    >
                        <HistoryTable orderHistory={ orderHistory } />
                    </TabPane>
                ) }
                { !addOrderForm && (
                    <TabPane
                        tab={
                            formatMessage({
                                id: 'order_form_table.calls',
                            }) +
                            ' (' +
                            orderCalls.length +
                            ')'
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

export default OrderFormTabs;
