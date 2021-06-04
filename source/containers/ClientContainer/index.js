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

// own
const { TabPane } = Tabs;

const mapStateToProps = state => ({
    user: state.auth,
    isMobile: state.ui.views.isMobile,
});

const mapDispatchToProps = {
    createClientVehicle,
    updateClientVehicle,
    deleteClientVehicle,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class ClientContainer extends Component {
    render() {
        const { clientEntity, clientId, user, specificTab, isMobile, fetchClient } = this.props;
        const {
            CREATE_EDIT_DELETE_CLIENTS,
            GET_CLIENTS_ADDITIONAL_INFORMATION,
            ACCESS_CLIENTS_REQUISITES,
            ACCESS_RECEIVABLES_GET,
        } = permissions;

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
                    </TabPane>
                    <TabPane
                        tab={
                            <FormattedMessage id={"client_container.orders"} />
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
                            <FormattedMessage
                                id={"client_container.feedback"}
                            />
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
                            <FormattedMessage
                                id={"client_container.requisites"}
                            />
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
                        tab={<FormattedMessage id={ 'client_container.debt'}/>}
                        key='clientDebt'
                    >
                        <ClientMRDsTab clientId={clientId} client={clientEntity}/>
                    </TabPane>
                    <TabPane
                        tab={<FormattedMessage id={ 'client_container.calls'}/>}
                        key='calls'
                    >
                        <ClientCallsTab/>
                    </TabPane>
                </Tabs>
            </Catcher>
        );
    }
}
