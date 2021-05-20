// vendor
import React, {Component} from 'react';
import { injectIntl } from 'react-intl';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

// proj
import { Spinner} from 'commons';
import VehicleAppurtenancesTable from '../../VehicleAppurtenancesTable';
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

@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleSparePartsTab extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { match: {params: {id}}} = this.props;
        this.props.setExpandedVehicleId({vehicleId: id});
        this.props.fetchVehicleAppurtenances();
    }

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