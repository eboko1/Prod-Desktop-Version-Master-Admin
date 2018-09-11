// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table, Icon, List, Form, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Tabs } from 'antd';
import { permissions, isForbidden } from 'utils';

// proj
import {
    createClientVehicle,
    updateClientVehicle,
    deleteClientVehicle,
} from 'core/client/duck';

import { Catcher } from 'commons';
import { ClientRequisitesContainer } from 'containers';
import {
    AddClientVehicleForm,
    EditClientVehicleForm,
    EditClientForm,
} from 'forms';
import { ClientFeedbackTab, ClientOrdersTab } from 'components';

// own
import Styles from './styles.m.css';
const { TabPane } = Tabs;

const mapStateToProps = state => ({
    user: state.auth,
});

const mapDispatchToProps = {
    createClientVehicle,
    updateClientVehicle,
    deleteClientVehicle,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientContainer extends Component {
    render() {
        const { clientEntity, clientId, user } = this.props;
        const {
            CREATE_EDIT_DELETE_CLIENTS,
            GET_CLIENTS_ADDITIONAL_INFORMATION,
        } = permissions;

        // Client
        return (
            <Catcher>
                <Tabs
                    defaultActiveKey='generalInfo'
                    tabPosition='right'
                    type='card'
                >
                    <TabPane
                        tab={
                            <FormattedMessage
                                id={ 'client_container.general_info' }
                            />
                        }
                        key='generalInfo'
                    >
                        <EditClientForm
                            client={ clientEntity }
                            clientId={ clientId }
                        />
                        <EditClientVehicleForm
                            updateClientVehicle={ this.props.updateClientVehicle }
                            deleteClientVehicle={ this.props.deleteClientVehicle }
                            clientEntity={ clientEntity }
                            clientId={ clientId }
                        />
                        { !isForbidden(user, CREATE_EDIT_DELETE_CLIENTS) ? (
                            <AddClientVehicleForm
                                addClientVehicle={ this.props.createClientVehicle.bind(
                                    null,
                                    clientId,
                                ) }
                            />
                        ) : null }
                    </TabPane>
                    <TabPane
                        tab={
                            <FormattedMessage id={ 'client_container.orders' } />
                        }
                        key='orders'
                        disabled={ isForbidden(
                            user,
                            GET_CLIENTS_ADDITIONAL_INFORMATION,
                        ) }
                    >
                        { console.log('→ CC this.props', this.props) }
                        <ClientOrdersTab clientId={ clientId } />
                    </TabPane>
                    <TabPane
                        tab={
                            <FormattedMessage
                                id={ 'client_container.feedback' }
                            />
                        }
                        key='feedback'
                        disabled={ isForbidden(
                            user,
                            GET_CLIENTS_ADDITIONAL_INFORMATION,
                        ) }
                    >
                        <ClientFeedbackTab feedback={ clientEntity.reviews } />
                    </TabPane>
                    <TabPane
                        disabled={ isForbidden(user, CREATE_EDIT_DELETE_CLIENTS) }
                        tab={
                            <FormattedMessage
                                id={ 'client_container.requisites' }
                            />
                        }
                        key='clientRequisites'
                    >
                        <ClientRequisitesContainer
                            requisites={ clientEntity.requisites }
                            clientId={ clientEntity.clientId }
                        />
                    </TabPane>
                </Tabs>
            </Catcher>
        );
    }
}
