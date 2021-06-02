// vendor
import React, {Component} from 'react';
import { injectIntl } from 'react-intl';
import {connect} from 'react-redux';

// proj
import { Spinner} from 'commons';
import VehicleLaborsTable from './VehicleLaborsTable';
import {
    fetchVehicle,

    selectVehicle,
    selectClient,
    selectGeneralData,
    setExpandedVehicleId,
    fetchVehicleLabors
} from 'core/vehicles/duck';

// own
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    vehicle:     selectVehicle(state),
    client:      selectClient(state),
    generalData: selectGeneralData(state),
});

const mapDispatchToProps = {
    fetchVehicle,
    setExpandedVehicleId,
    fetchVehicleLabors,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleLaborsTab extends Component {

    render() {

        const {
        } = this.props;

        return (
            <div className={Styles.tabContent}>
                <VehicleLaborsTable />
            </div>
        )
    }
}