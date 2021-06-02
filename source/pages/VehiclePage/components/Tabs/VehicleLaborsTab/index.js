// vendor
import React, {Component} from 'react';
import { injectIntl } from 'react-intl';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

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

@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehicleLaborsTab extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { match: {params: {id}}} = this.props;
        this.props.setExpandedVehicleId({vehicleId: id});
        this.props.fetchVehicleLabors();
    }

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