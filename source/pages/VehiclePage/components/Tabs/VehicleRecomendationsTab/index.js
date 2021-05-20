// vendor
import React, {Component} from 'react';
import { injectIntl } from 'react-intl';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import { Spinner} from 'commons';
import DataItem from '../../DataItem';
import { FormattedDatetime } from 'components';
import {
    fetchVehicle,

    selectVehicle,
    selectClient,
    selectVehicleRecommendations,
    setExpandedVehicleId,
    fetchVehicleRecommendations,
} from 'core/vehicles/duck';

// own
import Styles from './styles.m.css';

const DEFAULT_DATETIME = 'DD.MM.YYYY HH:mm';

const mapStateToProps = state => ({
    vehicle:     selectVehicle(state),
    client:      selectClient(state),
    recomendations: selectVehicleRecommendations(state)
});

const mapDispatchToProps = {
    fetchVehicle,
    setExpandedVehicleId,
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
        const { match: {params: {id}}} = this.props;
        this.props.setExpandedVehicleId({vehicleId: id});
        this.props.fetchVehicleRecommendations();
    }

    generateRecoemndationBlock = (recomendation) => {
        const {
            orderId,
            recommendation,
            orderDatetime,
        } = recomendation;

        return (
            <div key={v4()}>
                <DataItem label={(
                    <div>
                        {orderId} <span><FormattedDatetime datetime={orderDatetime} format={DEFAULT_DATETIME}/></span>
                    </div>
                )}>
                    {recommendation}
                </DataItem>
            </div>
        );
    }

    render() {

        const {
            recomendations
        } = this.props;

        console.log("recomendations: ", recomendations);

        return (
            <div className={Styles.tabContent}>
                {_.map(recomendations, this.generateRecoemndationBlock)}
            </div>
        )
    }
}