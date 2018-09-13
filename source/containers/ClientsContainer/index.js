// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table, Modal, Select, Form, Button } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchClients,
    setClientsPageSort,
    createInviteOrders,
    setInvite,
    createInvite,
} from 'core/clients/duck';
import { setModal, resetModal } from 'core/modals/duck';

import { Catcher } from 'commons';

// own
import { columnsConfig } from './clientsTableConfig';
import Styles from './styles.m.css';
import { v4 } from 'uuid';

const Option = Select.Option;
const FormItem = Form.Item;

const mapStateToProps = state => ({
    clients:         state.clients.clients,
    stats:           state.clients.stats,
    filter:          state.clients.filter,
    sort:            state.clients.sort,
    modal:           state.modals.modal,
    clientsFetching: state.ui.clientsFetching,
    user:            state.auth,
    invite:          state.clients.invite,
});

const mapDispatchToProps = {
    fetchClients,
    setClientsPageSort,
    createInviteOrders,
    setModal,
    resetModal,
    setInvite,
    createInvite,
};

function formatVehicleLabel(vehicle, formatMessage) {
    const modelPart = vehicle.model
        ? `${vehicle.make} ${vehicle.model}`
        : formatMessage({ id: 'add_order_form.no_model' });
    const horsePowerLabel = !vehicle.horsePower
        ? null
        : `(${vehicle.horsePower} ${formatMessage({
            id: 'horse_power',
        })})`;
    const modificationPart = [ vehicle.modification, horsePowerLabel ]
        .filter(Boolean)
        .join(' ');
    const parts = [ modelPart, vehicle.year, modificationPart, vehicle.number, vehicle.vin ];

    return parts
        .filter(Boolean)
        .map(String)
        .map(_.trimEnd)
        .join(', ');
}

@withRouter
@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientsContainer extends Component {
    componentDidMount() {
        this.props.fetchClients(this.props.filter);
    }

    render() {
        const { clients, invite, user, sort } = this.props;
        const { setInvite, createInvite } = this.props;
        const { formatMessage } = this.props.intl;

        const columns = columnsConfig(sort, user, formatMessage, setInvite);

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
                <Modal
                    title={ <FormattedMessage id='orders.invitation' /> }
                    visible={ invite.client }
                    footer={ [
                        <Button
                            key='back'
                            onClick={ () => setInvite(null, null) }
                        >
                            <FormattedMessage id='cancel' />
                        </Button>,
                        <Button
                            key='submit'
                            type='primary'
                            disabled={ !invite.clientVehicleId }
                            onClick={ () => {
                                const inviteOrder = {
                                    managerId:       user.id,
                                    clientId:        invite.client.clientId,
                                    clientVehicleId: invite.clientVehicleId,
                                    clientPhone:     invite.client.phones.find(
                                        Boolean,
                                    ),
                                    status: 'invite',
                                };
                                setInvite(null, null);
                                createInvite(inviteOrder);
                            } }
                        >
                            <FormattedMessage id='orders.invite' />
                        </Button>,
                    ] }
                >
                    { invite.client && (
                        <Form>
                            <FormItem
                                label={
                                    <FormattedMessage id='client_order_tab.car' />
                                }
                            >
                                <Select
                                    value={ invite.clientVehicleId }
                                    getPopupContainer={ trigger =>
                                        trigger.parentNode
                                    }
                                    onChange={ clientVehicleId =>
                                        setInvite(
                                            invite.client,
                                            clientVehicleId,
                                        )
                                    }
                                >
                                    { invite.client.vehicles.map(vehicle => (
                                        <Option value={ vehicle.id } key={ v4() }>
                                            { formatVehicleLabel(
                                                vehicle,
                                                formatMessage,
                                            ) }
                                        </Option>
                                    )) }
                                </Select>
                            </FormItem>
                        </Form>
                    ) }
                </Modal>
            </Catcher>
        );
    }
}
