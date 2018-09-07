// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table, Icon, List, Form, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

// proj

import {
    createClientVehicle,
    updateClientVehicle,
    deleteClientVehicle,
} from 'core/client/duck';
import { ClientRequisitesContainer } from 'containers';

import {
    AddClientVehicleForm,
    EditClientVehicleForm,
    EditClientForm,
} from 'forms';
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

const mapDispatchToProps = {
    createClientVehicle,
    updateClientVehicle,
    deleteClientVehicle,
};

const mapStateToProps = state => ({
    // clientEntity: state.client.clientEntity,
});

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ClientContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { clientEntity, clientId } = this.props;

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
                        <AddClientVehicleForm
                            addClientVehicle={ this.props.createClientVehicle.bind(
                                null,
                                clientId,
                            ) }
                        />
                    </TabPane>
                    <TabPane
                        tab={
                            <FormattedMessage id={ 'client_container.orders' } />
                        }
                        key='orders'
                    />
                    <TabPane
                        tab={
                            <FormattedMessage
                                id={ 'client_container.feedback' }
                            />
                        }
                        key='feedback'
                    />
                    <TabPane
                        tab={ <FormattedMessage id={ 'client_container.requisites' }/> }
                        key='clientRequisites'>
                        { clientEntity ? <ClientRequisitesContainer
                            requisites={ clientEntity.requisites }
                            clientId={ clientEntity.clientId }
                        /> : null }
                    </TabPane>
                </Tabs>
            </Catcher>
        );
    }
}
