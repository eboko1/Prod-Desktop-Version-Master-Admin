// vendor
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Table, Button, Icon, Tooltip, Spin, Modal } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchOrders,
    setOrdersPageFilter,
    setOrdersStatusFilter,
    ordersSelector,
    stateSelector,
    createInviteOrders,
} from 'core/orders/duck';

import { Catcher, Spinner } from 'commons';

// own
import { columnsConfig, rowsConfig, scrollConfig } from './ordersTableConfig';
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        count:          state.orders.count,
        orders:         state.orders.data,
        filter:         state.orders.filter,
        ordersFetching: state.ui.get('ordersFetching'),
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            fetchOrders,
            setOrdersStatusFilter,
            setOrdersPageFilter,
            createInviteOrders,
        },
        dispatch,
    );
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class OrdersContainer extends Component {
    constructor(props) {
        super(props);
        const status = OrdersContainer.getStatuses(props);

        this.state = {
            // activeRoute:              props.location.pathname,
            status:                   status,
            loading:                  false,
            selectedRowKeys:          [],
            cancelReasonModalVisible: false,
            invited:                  [],
        };

        this.invite = this.invite.bind(this);
        this.isOrderInvitable = this.isOrderInvitable.bind(this);
        this.isAlreadyInvited = this.isAlreadyInvited.bind(this);
        this.inviteSelected = this.inviteSelected.bind(this);
    }

    static getStatuses(properties) {
        const statusesMap = [
            {
                route:    /orders\/appointments/,
                statuses: 'not_complete,required,reserve,call',
            },
            { route: /orders\/approved/, statuses: 'approve' },
            { route: /orders\/in-progress/, statuses: 'progress' },
            { route: /orders\/success/, statuses: 'success' },
            { route: /orders\/reviews/, statuses: 'review' },
            { route: /orders\/invitations/, statuses: 'invite' },
            { route: /orders\/canceled/, statuses: 'cancel' },
        ];
        const matchedRoutes = statusesMap.filter(statusConfig =>
            properties.location.pathname.match(statusConfig.route));
        const status = (_.first(matchedRoutes) || {}).statuses;

        return status;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // Store prev activeRoute in state so we can compare when props change.
        // Clear out any previously-loaded user data (so we don't render stale stuff).
        if (nextProps.location.pathname !== prevState.activeRoute) {
            const status = OrdersContainer.getStatuses(nextProps);

            return {
                status:          status,
                activeRoute:     nextProps.location.pathname,
                selectedRowKeys: [],
                invited:         [],
            };
        }

        // No state update necessary
        return null;
    }

    componentDidMount() {
        this.props.setOrdersStatusFilter(this.state.status);
        this.props.fetchOrders(this.props.filter);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.activeRoute !== this.state.activeRoute) {
            this.props.fetchOrders({
                ...this.props.filter,
                status: this.state.status,
            });
            // this.columnsConfig(status);
        }

        if (prevProps.orders !== this.props.orders) {
            return this.setState({
                selectedRowKeys: [],
                invited:         [],
            });
        }
        // if (this.state.ordersOrError === null) {
        //     // At this point, we're in the "commit" phase, so it's safe to load the new data.
        //     this.props.actions.fetchOrders(1);
        // }
    }

    inviteSelected() {
        const inviteOrders = this.props.orders.filter(({ key }) =>
            this.state.selectedRowKeys.includes(key));
        this.invite(inviteOrders);
    }

    isOrderInvitable(order) {
        return !!(
            order.clientPhone &&
            order.clientId &&
            order.vehicleId &&
            !order.vehicleInviteExists
        );
    }

    getAvailableOrdersForInvite(orders) {
        const inviteCandidates = orders
            .filter(this.isOrderInvitable)
            .filter(order => !this.isAlreadyInvited(order))
            .map(order => _.pick(order, [ 'clientId', 'vehicleId' ]));

        return _.uniqWith(inviteCandidates, _.isEqual);
    }

    invite(requestedInviteOrders) {
        const { orders, filters } = this.props;
        const omittedRequestedInviteOrders = this.getAvailableOrdersForInvite(
            requestedInviteOrders,
        );
        const invited = [ ...this.state.invited, ...omittedRequestedInviteOrders ];

        const createInviteOrderPayload = requestedInviteOrder => {
            const { clientId, vehicleId } = requestedInviteOrder;
            const order = _(orders)
                .filter(requestedInviteOrder)
                .sort(
                    (
                        { datetime: firstDatetime },
                        { datetime: secondDatetime },
                    ) => secondDatetime.localeCompare(firstDatetime),
                )
                .filter(({ clientPhone }) => clientPhone)
                .first();

            return {
                clientId,
                clientPhone:     (order || {}).clientPhone,
                clientVehicleId: vehicleId,
                managerId:       720, // TODO use real manager id
                status:          'invite',
            };
        };
        const invites = omittedRequestedInviteOrders.map(
            createInviteOrderPayload,
        );
        this.setState(() => {
            this.props.createInviteOrders({ invites, filters });

            return { selectedRowKeys: [], invited };
        });
    }

    onSelectChange = (selectedRowKeys, selectedOrders) => {
        const removedKeys = _.difference(
            this.state.selectedRowKeys,
            selectedRowKeys,
        );
        const removedOrders = _.filter(this.props.orders, ({ key }) =>
            removedKeys.includes(key)).map(order => _.pick(order, [ 'clientId', 'vehicleId' ]));

        // Filter invited orders
        const availableSelectedOrders = this.getAvailableOrdersForInvite(
            selectedOrders,
        );
        // Filter duplicate orders
        const availableOrders = _.differenceWith(
            availableSelectedOrders,
            removedOrders,
            _.isEqual,
        );

        // ~ -1 == false
        // ~ (>=0) == true
        const allOrders = this.props.orders.filter(
            ({ clientId, vehicleId }) =>
                ~_.findIndex(availableOrders, { clientId, vehicleId }),
        );
        const selectedKeys = _.map(allOrders, 'key');

        this.setState({ selectedRowKeys: selectedKeys });
    };

    isAlreadyInvited({ clientId, vehicleId } = {}) {
        return !!(
            clientId &&
            vehicleId &&
            ~_.findIndex(this.state.invited, { clientId, vehicleId })
        );
    }

    getOrderCheckboxProps = order => {
        // Checkbox is disabled if clientId or vehicleId is missing
        // Checkbox is disabled if clientVehicleId is already invited
        const missingRequiredFields = !this.isOrderInvitable(order);
        const invited = this.isAlreadyInvited(order);

        return {
            defaultValue: false,
            disabled:     missingRequiredFields || invited,
        };
    };

    setCancelReasonModal(cancelReasonModalVisible) {
        this.setState({ cancelReasonModalVisible });
    }

    render() {
        const { orders } = this.props;
        const { status, loading, activeRoute, selectedRowKeys } = this.state;
        // const { status, loading, selectedRowKeys } = this.state;

        const columns = columnsConfig(
            this.state.invited,
            this.invite,
            this.isOrderInvitable,
            this.isAlreadyInvited,
            activeRoute,
        );

        const rows = rowsConfig(
            activeRoute,
            selectedRowKeys,
            this.onSelectChange,
            this.getOrderCheckboxProps,
        );

        const pagination = {
            pageSize:         25,
            total:            Math.ceil(this.props.count / 25) * 25,
            hideOnSinglePage: true,
            current:          this.props.filter.page,
            onChange:         page => {
                this.props.setOrdersPageFilter(page);
                this.props.fetchOrders(this.props.filter);
            },
        };

        const hasSelected = selectedRowKeys.length > 0;

        return (
            <Catcher>
                <div className={ Styles.paper }>
                    <Button
                        type='primary'
                        onClick={ this.inviteSelected }
                        disabled={ !hasSelected }
                        loading={ loading }
                    >
                        Reload Checkboxes
                    </Button>
                    <span style={ { marginLeft: 8 } }>
                        { hasSelected
                            ? `Selected ${selectedRowKeys.length} items`
                            : '' }
                    </span>
                    <Table
                        className={ Styles.ordersTable }
                        columns={ columns }
                        rowSelection={ rows }
                        dataSource={ orders }
                        scroll={ scrollConfig(activeRoute) }
                        loading={ this.props.ordersFetching }
                        locale={ {
                            emptyText: <FormattedMessage id='no_data' />,
                        } }
                        pagination={ pagination }
                    />
                </div>
            </Catcher>
        );
    }
}

export default OrdersContainer;
