// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchOrders,
    setOrdersPageFilter,
    setOrdersStatusFilter,
    createInviteOrders,
    setOrdersPageSort,
} from 'core/clients/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';
import { InviteModal } from 'modals';

// own
import { columnsConfig, rowsConfig, scrollConfig } from './clientsTableConfig';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    clients:         state.clients.clients,
    filter:          state.clients.filter,
    modal:           state.modals.modal,
    sort:            state.clients.sort,
    clientsFetching: state.ui.clientsFetching,
    user:            state.auth,
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
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
class OrdersContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:         false,
            selectedRowKeys: [],
            invited:         [],
        };

        // this.invite = this.invite.bind(this);
        // this.isOrderInvitable = this.isOrderInvitable.bind(this);
        // this.isAlreadyInvited = this.isAlreadyInvited.bind(this);
        // this.inviteSelected = this.inviteSelected.bind(this);
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
    }

    setIniviteModal = () => this.props.setModal(MODALS.INVITE);

    render() {
        const { clients } = this.props;
        const { loading, activeRoute, selectedRowKeys } = this.state;
        // const { status, loading, selectedRowKeys } = this.state;

        const columns = columnsConfig(
            this.state.invited,
            this.invite,
            this.isOrderInvitable,
            this.isAlreadyInvited,
            activeRoute,
            this.props.sort,
            this.props.user,
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
                field:  sorter.field,
                client: sorter.client === 'ascend' ? 'asc' : 'desc',
            };
            if (!_.isEqual(sort, this.props.sort)) {
                this.props.setClientsPageSort(sort);
                this.props.fetchClients();
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
                        dataSource={ clients }
                        // scroll={ scrollConfig() }
                        loading={ this.props.clientsFetching }
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
