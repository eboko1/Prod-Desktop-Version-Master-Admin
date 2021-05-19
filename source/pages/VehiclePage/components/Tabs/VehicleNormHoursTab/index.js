// vendor
import React, {Component} from 'react';
import { injectIntl } from 'react-intl';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

// proj
import { Spinner} from 'commons';
import VehicleLaborsTable from '../../VehicleLaborsTable';
import {
    fetchVehicle,

    selectVehicle,
    selectClient,
    selectGeneralData,
    setExpandedVehicleId
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
    setExpandedVehicleId
};

@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class GeneralInfoTab extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { match: {params: {id}}} = this.props;
        this.props.setExpandedVehicleId({vehicleId: id});
    }

    render() {

        const {
        } = this.props;

        return (
            <div className={Styles.tabContent}>
                Table here, use your imagination!(will be soon)
            </div>
        )
    }
}