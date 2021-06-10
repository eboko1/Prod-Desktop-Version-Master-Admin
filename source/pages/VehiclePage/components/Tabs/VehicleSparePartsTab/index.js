// vendor
import React, {Component} from 'react';
import { injectIntl } from 'react-intl';
import {connect} from 'react-redux';

// proj
import VehicleAppurtenancesTable from './VehicleAppurtenancesTable';
import {
    fetchVehicle,

    selectVehicle,
    selectClient,
    setExpandedVehicleId,
    fetchVehicleAppurtenances
} from 'core/vehicles/duck';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    vehicle:     selectVehicle(state),
    client:      selectClient(state),
});

const mapDispatchToProps = {
    fetchVehicle,
    setExpandedVehicleId,
    fetchVehicleAppurtenances
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleSparePartsTab extends Component {

    render() {

        const {
        } = this.props;

        return (
            <div className={Styles.tabContent}>
                <VehicleAppurtenancesTable />
            </div>
        )
    }
}