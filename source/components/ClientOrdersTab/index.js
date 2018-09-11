// vendor
import React, { Component } from 'react';
import { Table, Icon, Rate } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';

// proj
import book from 'routes/book';
import { fetchClientOrders, setClientOrdersPageFilter } from 'core/clientOrders/duck';
import { Loader, FormattedDatetime, OrderStatusIcon } from 'components';
import { Numeral } from 'commons';

// own
import Styles from './styles.m.css';
import {Link} from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';


const mapStateToProps = state => ({
    isFetching: state.ui.clientOrdersFetching,
    ordersData: state.clientOrders.ordersData,
    filter:     state.clientOrders.filter,
});

const mapDispatchToProps = {
    fetchClientOrders,
    setClientOrdersPageFilter,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientOrdersTab extends Component {
    constructor(props) {
        super(props);
        const { formatMessage } = this.props.intl;

        this.columns = [
            {
                title:     <FormattedMessage id='client_order_tab.date' />,
                dataIndex: 'datetime',
                width:     '20%',
                render:    record => <FormattedDatetime datetime={ record }/>,
            },
            {
                title:  <FormattedMessage id='client_order_tab.order' />,
                width:  '20%',
                render: (order) => //TODO to separate component, same in ordersTableConfig
                    <>
                        <Link
                            className={ Styles.ordernLink }
                            to={ `${book.order}/${order.id}` }
                        >
                            { order.num }
                        </Link>
                        <OrderStatusIcon status={ order.status } />
                        {order.serviceNames && (
                            <div className={ Styles.serviceNames }>
                                { [ ...new Set(order.serviceNames) ].join(', ') }
                            </div>
                        )}
                        {order.recommendation && (
                            <div className={ Styles.recommendation }>
                                { order.recommendation }
                            </div>
                        )}
                        {(order.cancelReason ||
                        order.cancelStatusReason ||
                        order.cancelStatusOwnReason) && (
                            <div className={ Styles.cancelReason }>
                                { /* <div>{ order.cancelReason }</div> */ }
                                <div>{ order.cancelStatusReason }</div>
                                <div>{ order.cancelStatusOwnReason }</div>
                            </div>
                        )}
                </>,
            },
            {
                title:  <FormattedMessage id='client_order_tab.car' />,
                width:  '20%',
                render: order =>
                    <>
                        <span>
                            { order.vehicleNumber }
                        </span>
                        <br/>
                        <span className={ Styles.clientVehicle }>
                            { `${order.vehicleMakeName ||
                    '-'} ${order.vehicleModelName ||
                    '-'} ${order.vehicleYear || '-'}` }
                        </span>
                     </>,
            },
            {
                title:  <FormattedMessage id='client_order_tab.amount' />,
                width:  '10%',
                render: order => <Numeral
                    currency={ formatMessage({ id: 'currency' }) }
                    nullText='0'
                >
                    { order.servicesTotalSum + order.detailsTotalSum }
                </Numeral>,
            },
            {
                title:     <FormattedMessage id='client_order_tab.raiting' />,
                dataIndex: 'nps',
                width:     '20%',
                render:    record => this.renderRatingStars(record),
            },
        ];
    }

    componentWillMount() {
        const {clientId, filter} = this.props;
        this.props.fetchClientOrders({ clientId, filter});
    }

    renderRatingStars(rating) {
        const value = rating / 2;
        const ratingStarts = <Rate
            className={ Styles.ratingStars }
            allowHalf
            disabled
            defaultValue={ value }
        />;

        return ratingStarts;
    }

    render() {
        const { isFetching, ordersData: { stats, orders } } = this.props;
        if (isFetching || !orders) { return <Loader loading={ isFetching } /> }

        const {
            clientId,
            filter,
        } = this.props;

        const ordersRows = orders.map((item, index) => ({
            ...item,
            index,
            key: item.id,
        }));

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(stats.countOrders / 25) * 25,
            hideOnSinglePage: true,
            current:          filter.page,
            onChange:         page => {
                this.props.setClientOrdersPageFilter(page);
                this.props.fetchClientOrders({ clientId, filter});
            },
        };

        return <>
            <h2 className={ Styles.title }>
                <FormattedMessage id='client_order_tab.all_orders' />
            </h2>

            <Table
                pagination={ pagination }
                size='small'
                dataSource={ ordersRows }
                columns={ this.columns }
            />
            </>;
    }
}
