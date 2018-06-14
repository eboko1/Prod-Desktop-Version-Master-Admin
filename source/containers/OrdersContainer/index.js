// vendor
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Table, Button, Icon, Tooltip, Spin, Modal } from 'antd';
// import { isImmutable, List } from 'immutable';
// import moment from 'moment';
// import { v4 as uid } from 'uuid';
import _ from 'lodash';

// proj
import { fetchOrders, ordersSelector, stateSelector } from 'core/orders/duck';

import { Catcher, Spinner } from 'commons';
import { OrdersTable } from 'components';

// own
import {
    columnsConfig,
    rowsConfig,
    paginationConfig,
    scrollConfig,
} from './ordersTableConfig';
import Styles from './styles.m.css';

const mapStateToProps = state => {
    return {
        // orders:         ordersSelector(state),
        count:          state.orders.count,
        orders:         state.orders.data,
        ordersFetching: state.ui.get('ordersFetching'),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                fetchOrders: fetchOrders,
            },
            dispatch,
        ),
    };
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class OrdersContainer extends Component {
    constructor(props) {
        super(props);
        const status = OrdersContainer.getStatuses(props);
        this.state = {
            activeRoute:              props.location.pathname,
            status:                   status,
            loadign:                  false,
            selectedRowKeys:          [],
            cancelReasonModalVisible: false,
        };
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
            { route: /orders\/reviews/, statuses: 'success' },
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
                status:      status,
                activeRoute: nextProps.location.pathname,
            };
        }

        // No state update necessary
        return null;
    }

    componentDidMount() {
        // It's preferable in most cases to wait until after mounting to load data.
        const filter = {
            page:   1,
            status: this.state.status,
        };
        this.props.actions.fetchOrders(filter);
    }
    //
    componentDidUpdate(prevProps, prevState) {
        if (prevState.activeRoute !== this.state.activeRoute) {
            const filter = {
                page:   1,
                status: this.state.status,
            };
            this.props.actions.fetchOrders(filter);
            // this.columnsConfig(status);
        }
        // if (this.state.ordersOrError === null) {
        //     // At this point, we're in the "commit" phase, so it's safe to load the new data.
        //     this.props.actions.fetchOrders(1);
        // }
    }

    onSelectChange = selectedRowKeys => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    setCancelReasonModal(cancelReasonModalVisible) {
        this.setState({ cancelReasonModalVisible });
    }

    render() {
        const { orders } = this.props;
        const { status, loading, activeRoute, selectedRowKeys } = this.state;

        const columns = columnsConfig(activeRoute);

        const rows = rowsConfig(
            activeRoute,
            selectedRowKeys,
            this.onSelectChange,
        );

        const pagination = {
            pageSize:         25,
            total:            Math.ceil(this.props.count / 25) * 25,
            hideOnSinglePage: false,
            onChange:         page => {
                this.props.actions.fetchOrders({
                    page,
                    status,
                });
            },
        };

        const hasSelected = selectedRowKeys.length > 0;

        return (
            <Catcher>
                { /* <div className={ Styles.ordersTableWrapper }> */ }
                <div className={ Styles.paper }>
                    <Button onClick={ () => this.setCancelReasonModal(true) }>
                        set cancel reason modal
                    </Button>
                    <Button
                        type='primary'
                        onClick={ this.start }
                        disabled={ !hasSelected }
                        loading={ loading }
                    >
                        Reload
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
                        // scroll={ { x: 1640 } }
                        scroll={ scrollConfig(activeRoute) }
                        loading={ this.props.ordersFetching }
                        locale={ {
                            emptyText: <FormattedMessage id='orders.no_data' />,
                        } }
                        pagination={ pagination }
                    />
                </div>
                <Modal
                    title={
                        <FormattedMessage id='cancel_reson_modal.cancel_reason' />
                    }
                    cancelText=''
                    wrapClassName={ Styles.verticalCenterModal }
                    visible={ this.state.cancelReasonModalVisible }
                    onOk={ () => this.setCancelReasonModal(false) }
                    onCancel={ () => this.setCancelReasonModal(false) }
                    footer={ [
                        <Button
                            key='close'
                            type='primary'
                            onClick={ () => this.setCancelReasonModal(false) }
                        >
                            <FormattedMessage id='cancel_reason_modal.close' />
                        </Button>,
                    ] }
                >
                    <p>Status...</p>
                    <p>Manual...</p>
                </Modal>
            </Catcher>
        );
    }
}

export default OrdersContainer;

/* <OrdersTable
    columns={ columns }
    data={ orders }
    loading={ this.props.ordersFetching }
    pagination={ pagination }
    rowSelection={ rowSelection }
/> */
