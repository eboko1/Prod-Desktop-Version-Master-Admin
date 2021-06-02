// vendor
import React, {Component} from 'react';
import { injectIntl } from 'react-intl';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

// proj
import {
    selectVehicle,
    selectClient,
    selectVehicleRecommendations,
    fetchVehicleRecommendations,
} from 'core/vehicles/duck';

// own
import Styles from './styles.m.css';
import VehicleRecommendationsTable from './VehicleRecommendationsTable';

const mapStateToProps = state => ({
    vehicle:     selectVehicle(state),
    client:      selectClient(state),
    recomendations: selectVehicleRecommendations(state)
});

const mapDispatchToProps = {
    fetchVehicleRecommendations
};

@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class GeneralInfoTab extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchVehicleRecommendations();
    }

    render() {
        return (
            <div className={Styles.tabContent}>
                <VehicleRecommendationsTable />
            </div>
        )
    }
}