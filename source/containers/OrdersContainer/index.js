// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchOrders,
    setOrdersPageFilter,
    setOrdersStatusFilter,
    createInviteOrders,
    setOrdersPageSort,
} from 'core/orders/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';
import { InviteModal } from 'modals';

// own
import { columnsConfig, rowsConfig, scrollConfig } from './ordersTableConfig';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    count:          state.orders.count,
    orders:         state.orders.data,
    filter:         state.orders.filter,
    modal:          state.modals.modal,
    sort:           state.orders.sort,
    ordersFetching: state.ui.ordersFetching,
    user:           state.auth,
});

const mapDispatchToProps = {
    fetchOrders,
    setOrdersStatusFilter,
    setOrdersPageFilter,
    createInviteOrders,
    setModal,
    resetModal,
    setOrdersPageSort,
};

@withRouter
@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
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
                statuses: 'not_complete,required,call',
            },
            { route: /orders\/approve/, statuses: 'approve,reserve' },
            { route: /orders\/progress/, statuses: 'progress' },
            { route: /orders\/success/, statuses: 'success' },
            { route: /orders\/reviews/, statuses: 'review' },
            { route: /orders\/invitations/, statuses: 'invite' },
            { route: /orders\/cancel/, statuses: 'cancel' },
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
    // достаем ключ из ордеров и проверяем есть ли ключ в стейте
    // которая сохраняет ключивы выбраных рядов таблицы
    inviteSelected() {
        const inviteOrders = this.props.orders.filter(({ key }) =>
            this.state.selectedRowKeys.includes(key));
        // создаем приглашение на основании ключей из state
        this.invite(inviteOrders);
        this.props.resetModal();
    }
    // можно ли вообще создать приглашение
    isOrderInvitable(order) {
        return !!(
            order.clientPhone &&
            order.clientId &&
            order.vehicleId &&
            !order.vehicleInviteExists
        );
    }
    // генерируем массив из ордеров, который можно использовать для создания приглашений
    getAvailableOrdersForInvite(orders) {
        const inviteCandidates = orders
            .filter(this.isOrderInvitable)
            .filter(order => !this.isAlreadyInvited(order))
            .map(order => _.pick(order, [ 'clientId', 'vehicleId' ]));

        // проверка на унивальность добавленных в массив объектов по value
        return _.uniqWith(inviteCandidates, _.isEqual);
    }
    // создать приглашение
    invite(requestedInviteOrders) {
        const { orders, filters, user } = this.props;
        // осталяем только валидные ордера с уникальными clientId & vehicleId
        const omittedRequestedInviteOrders = this.getAvailableOrdersForInvite(
            requestedInviteOrders,
        );
        // массив из тех, кого пригласили
        const invited = [ ...this.state.invited, ...omittedRequestedInviteOrders ];
        // конвертация clientId, vehicleId в полноценную entitny для создания приглашения
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
                managerId:       user.id,
                status:          'invite',
            };
        };
        // создаем entity для создания приглашений
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

    setIniviteModal = () => this.props.setModal(MODALS.INVITE);

    render() {
        const { orders } = this.props;
        const { formatMessage } = this.props.intl;
        const { status, loading, activeRoute, selectedRowKeys } = this.state;
        // const { status, loading, selectedRowKeys } = this.state;

        const columns = columnsConfig(
            this.state.invited,
            this.invite,
            this.isOrderInvitable,
            this.isAlreadyInvited,
            activeRoute,
            this.props.sort,
            this.props.user,
            formatMessage,
        );

        const rows = rowsConfig(
            activeRoute,
            selectedRowKeys,
            this.onSelectChange,
            this.getOrderCheckboxProps,
        );

        const handleTableChange = (pagination, filters, sorter) => {
            if (!sorter) {
                return;
            }
            const sort = {
                field: sorter.field,
                order: sorter.order === 'ascend' ? 'asc' : 'desc',
            };
            if (!_.isEqual(sort, this.props.sort)) {
                this.props.setOrdersPageSort(sort);
                this.props.fetchOrders();
            }
        };

        const pagination = {
            pageSize:         25,
            size:             'large',
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
                    <Table
                        size='small'
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
                        onChange={ handleTableChange }
                    />
                </div>
                <InviteModal
                    // wrappedComponentRef={ this.saveFormRef }
                    visible={ this.props.modal }
                    count={ selectedRowKeys.length }
                    confirmInviteModal={ this.inviteSelected }
                    resetModal={ this.props.resetModal }
                />
            </Catcher>
        );
    }
}

export default OrdersContainer;
