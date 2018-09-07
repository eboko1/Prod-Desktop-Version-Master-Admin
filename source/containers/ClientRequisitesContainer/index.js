// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Table, Icon, Modal, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import _ from 'lodash';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

// proj
import { createClientVehicle } from 'core/client/duck';
import { AddClientVehicleForm } from 'forms';
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
export default class ClientRequisitesContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { clientEntity, clientId } = this.props;

        // Client
        return (
            <div>
                Vitalya
            </div>
        );
    }
}
