// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table, Icon, List, Form, Row, Col } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

// proj
import { createClientVehicle } from 'core/client/duck';
import { ClientRequisitesContainer } from 'containers';
import { AddClientVehicleForm, EditClientVehicleForm } from 'forms';
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';

const mapDispatchToProps = {
    createClientVehicle,
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
                        tab={ <FormattedMessage id={ 'client_container.general_info' }/> }
                        key='generalInfo'>
                        test catch 228{ ' ' }
                        { clientEntity ? JSON.stringify(clientEntity) : null }
                        <Form>
                            <EditClientVehicleForm clientEntity={ clientEntity }/>
                            <AddClientVehicleForm
                                addClientVehicle={ this.props.createClientVehicle.bind(
                                    null,
                                    clientId,
                                ) }
                            />
                        </Form>
                    </TabPane>
                    <TabPane
                        tab={ <FormattedMessage id={ 'client_container.orders' }/> }
                        key='orders'>
                    </TabPane>
                    <TabPane
                        tab={ <FormattedMessage id={ 'client_container.feedback' }/> }
                        key='feedback'>
                    </TabPane>
                    <TabPane
                        tab={ <FormattedMessage id={ 'client_container.send_sms' }/> }
                        key='sendSMS'>
                    </TabPane>
                    <TabPane
                        tab={ <FormattedMessage id={ 'client_container.requisites' }/> }
                        key='clientRequisites'>
                        <ClientRequisitesContainer/>
                    </TabPane>
                </Tabs>
            </Catcher>
        );
    }
}
