// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchClients,
    setClientsPageSort,
    createInviteOrders,
} from 'core/clients/duck';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

import { Catcher } from 'commons';
import { InviteModal } from 'modals';

// own
import { columnsConfig, rowsConfig, scrollConfig } from './clientsTableConfig';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    clients:         state.clients.clients,
    stats:           state.clients.stats,
    filter:          state.clients.filter,
    sort:            state.clients.sort,
    modal:           state.modals.modal,
    clientsFetching: state.ui.clientsFetching,
    user:            state.auth,
});

const mapDispatchToProps = {
    fetchClients,
    setClientsPageSort,
    createInviteOrders,
    setModal,
    resetModal,
};

@withRouter
@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientsContainer extends Component {
    state = {
        loading:         false,
        selectedRowKeys: [],
        invited:         [],
    };

    componentDidMount() {
        this.props.fetchClients(this.props.filter);
    }

    componentDidUpdate(prevProps, prevState) {
        // if (prevState.activeRoute !== this.state.activeRoute) {
        //     this.props.fetchClients({
        //         ...this.props.filter,
        //     });
        //     // this.columnsConfig(status);
        // }

        if (prevProps.clients !== this.props.clients) {
            return this.setState({
                selectedRowKeys: [],
                invited:         [],
            });
        }
    }

    setIniviteModal = () => this.props.setModal(MODALS.INVITE);

    render() {
        const { clients } = this.props;
        const { formatMessage } = this.props.intl;
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
            formatMessage,
        );

        const rows = rowsConfig(
            activeRoute,
            selectedRowKeys,
            this.onSelectChange,
            this.getOrderCheckboxProps,
        );

        const pagination = {
            pageSize:         25,
            size:             'large',
            total:            Math.ceil(this.props.stats.countClients / 25) * 25,
            hideOnSinglePage: true,
            current:          this.props.sort.page,
            onChange:         page => {
                this.props.setClientsPageSort({ page });
                this.props.fetchClients(this.props.filter);
            },
        };

        return (
            <Catcher>
                <div className={ Styles.paper }>
                    <Table
                        size='small'
                        className={ Styles.table }
                        columns={ columns }
                        rowSelection={ rows }
                        dataSource={ clients }
                        // scroll={ scrollConfig() }
                        loading={ this.props.clientsFetching }
                        locale={ {
                            emptyText: <FormattedMessage id='no_data' />,
                        } }
                        pagination={ pagination }
                        // onChange={ handleTableChange }
                        scroll={ { x: 1360 } }
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
