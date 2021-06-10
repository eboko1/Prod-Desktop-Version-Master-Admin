// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import {connect} from 'react-redux';
import {Button, Tabs, Icon, Row, Col, Input, Spin} from 'antd';

// proj

import VehicleOrdersTable from './VehicleOrdersTable';
import {
    fetchVehicle,

    selectVehicle,
    selectClient,
    selectGeneralData,
    setExpandedVehicleId,
    selectFetchingVehicleOrders
} from 'core/vehicles/duck';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    vehicle:     selectVehicle(state),
    client:      selectClient(state),
    generalData: selectGeneralData(state),
    fetching:    selectFetchingVehicleOrders(state)
});

const mapDispatchToProps = {
    fetchVehicle,
    setExpandedVehicleId
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class GeneralInfoTab extends Component {

    render() {

        const {
            fetching,
        } = this.props;

        return (
            fetching ? <Spin/> : (
                    <div className={Styles.tabContent}>
                        <VehicleOrdersTable />
                    </div>
                )
        )
    }
}