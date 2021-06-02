// vendor
import React, {Component} from 'react';
import { injectIntl } from 'react-intl';
import {connect} from 'react-redux';

// proj
import { Spinner} from 'commons';
import VehicleNormHoursTable from "./VehicleNormHoursTable";
import {
    fetchVehicle,

    selectVehicle,
    selectClient,
    selectGeneralData,
    setExpandedVehicleId,
    fetchVehicleNormHours
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
    fetchVehicleNormHours,
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class GeneralInfoTab extends Component {

    render() {

        const {
        } = this.props;

        return (
            <div>
                <VehicleNormHoursTable/>
            </div>
        )
    }
}