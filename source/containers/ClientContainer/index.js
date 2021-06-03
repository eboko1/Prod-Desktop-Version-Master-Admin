// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Tabs } from "antd";
import { permissions, isForbidden } from "utils";

// proj
import {
    createClientVehicle,
    updateClientVehicle,
    deleteClientVehicle,
} from "core/client/duck";

import { Catcher } from "commons";
import { ClientRequisitesContainer } from "containers";
import {
    AddClientVehicleForm,
    EditClientVehicleForm,
    EditClientForm,
} from 'forms';
import {
    ClientFeedbackTab,
    ClientOrdersTab,
    ClientMRDsTab,
    ClientCallsTab
} from 'components';

import { fetchClientOrders } from "core/clientOrders/duck";
import { fetchClientMRDs } from "core/clientMRDs/duck";
import { fetchCalls, selectCallsStats } from "core/calls/duck";

// own
const { TabPane } = Tabs;

const mapStateToProps = state => ({
    user: state.auth,
    isMobile: state.ui.views.isMobile,
    ordersData: state.clientOrders.ordersData,
    filterOrders: state.clientOrders.filter,
    mrdsStats: state.clientMRDs.stats,
    callStats: selectCallsStats(state)
});

const mapDispatchToProps = {
    createClientVehicle,
    updateClientVehicle,
    deleteClientVehicle,

    fetchClientOrders,
    fetchClientMRDs,
    fetchCalls
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class ClientContainer extends Component {
    componentDidMount() {
        const { clientId, filterOrders } = this.props;
        // console.log("F: ", clientId, filter)
        this.props.fetchClientOrders({ clientId, filterOrders });
        this.props.fetchClientMRDs({ clientId });
        this.props.fetchCalls();
    }

    render() {
        const { clientEntity, clientId, user, specificTab, isMobile, fetchClient,
                ordersData, mrdsStats, callStats } = this.props;
        const {
            CREATE_EDIT_DELETE_CLIENTS,
            GET_CLIENTS_ADDITIONAL_INFORMATION,
            ACCESS_CLIENTS_REQUISITES,
            ACCESS_RECEIVABLES_GET,
        } = permissions;

        console.log("OR: ", callStats)

        return (
            <Catcher>
                <Tabs
                    defaultActiveKey={specificTab ? specificTab :'generalInfo'}
                    tabPosition={!isMobile ? 'right' : 'top'}
                    type='card'
                >
                    <TabPane
                        tab={
                            <FormattedMessage
                                id={"client_container.general_info"}
                            />
                        }
                        key="generalInfo"
                    >
                        <EditClientForm
                            client={clientEntity}
                            clientId={clientId}
                        />
                        <EditClientVehicleForm
                            updateClientVehicle={this.props.updateClientVehicle}
                            deleteClientVehicle={this.props.deleteClientVehicle}
                            clientEntity={clientEntity}
                            clientId={clientId}
                            fetchClient={fetchClient}
                        />
                        {!isForbidden(user, CREATE_EDIT_DELETE_CLIENTS) ? (
                            <AddClientVehicleForm
                                addClientVehicle={this.props.createClientVehicle.bind(
                                    null,
                                    clientId,
                                )}
                            />
                        ) : null}
                    </TabPane>
                    <TabPane
                        tab={
                            <div>
                                <FormattedMessage id={"client_container.orders"} />
                                ({ordersData && ordersData.count})
                            </div>
                        }
                        key="orders"
                        disabled={isForbidden(
                            user,
                            GET_CLIENTS_ADDITIONAL_INFORMATION,
                        )}
                    >
                        <ClientOrdersTab clientId={clientId} />
                    </TabPane>
                    <TabPane
                        tab={
                            <div>
                                <FormattedMessage
                                    id={"client_container.feedback"}
                                />
                                ({clientEntity.reviews && clientEntity.reviews.length})
                            </div>

                        }
                        key="feedback"
                        disabled={isForbidden(
                            user,
                            GET_CLIENTS_ADDITIONAL_INFORMATION,
                        )}
                    >
                        <ClientFeedbackTab feedback={clientEntity.reviews} />
                    </TabPane>
                    <TabPane
                        disabled={isForbidden(user, ACCESS_CLIENTS_REQUISITES)}
                        tab={
                            <div>
                                <FormattedMessage
                                    id={"client_container.requisites"}
                                />
                                ({clientEntity.requisites && clientEntity.requisites.length})
                            </div>

                        }
                        key="clientRequisites"
                    >
                        <ClientRequisitesContainer
                            requisites={clientEntity.requisites}
                            clientId={clientEntity.clientId}
                        />
                    </TabPane>
                    <TabPane
                        disabled={ isForbidden(user, ACCESS_RECEIVABLES_GET) }
                        tab={
                            <div>
                                <FormattedMessage id={ 'client_container.debt'}/>
                                ({mrdsStats && mrdsStats.countMRDs})
                            </div>
                        }
                        key='clientDebt'
                    >
                        <ClientMRDsTab clientId={clientId} client={clientEntity}/>
                    </TabPane>
                    <TabPane
                        tab={
                            <div>
                                <FormattedMessage id={ 'client_container.calls'}/>
                                ({callStats && callStats.total})
                            </div>
                        }
                        key='calls'
                    >
                        <ClientCallsTab/>
                    </TabPane>
                </Tabs>
            </Catcher>
        );
    }
}
