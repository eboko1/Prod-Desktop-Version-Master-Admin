// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { Tabs, Icon } from 'antd';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import {Layout, StyledButton} from 'commons';
import book from 'routes/book';
import history from 'store/history';
import {
    /*-------Fetchers----*/
    fetchVehicle,
    fetchVehicleNormHours,
    fetchVehicleOrders,
    fetchVehicleLabors,
    fetchVehicleRecommendations,
    fetchVehicleAppurtenances,

    /*-------Selectors----*/
    selectVehicle,
    selectClient,
    selectGeneralData,
    selectVehicleNormHoursStats,
    selectVehicleLaborsStats,
    selectVehicleAppurtenancesStats,
    selectVehicleOrdersStats,
    selectVehicleRecommendationsStats,

    /*-------Setters----*/
    setExpandedVehicleId,
} from 'core/vehicles/duck';

// own
import {
    GeneralInfoTab,
    VehicleOrdersTab,
    VehicleLaborsTab,
    VehicleSparePartsTab,
    VehicleNormHoursTab,
    VehicleRecomendationsTab,
    VehicleInspectionIntervalsTab,
} from './components/Tabs';

const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    vehicle:     selectVehicle(state),
    client:      selectClient(state),
    generalData: selectGeneralData(state),

    // stats
    ordersStats: selectVehicleOrdersStats(state),
    normHoursStats: selectVehicleNormHoursStats(state),
    laborsStats: selectVehicleLaborsStats(state),
    appurtenancesStats: selectVehicleAppurtenancesStats(state),
    recommendationsStats: selectVehicleRecommendationsStats(state),

    // fetchers for loader

});

const mapDispatchToProps = {
    fetchVehicle,
    fetchVehicleOrders,
    fetchVehicleNormHours,
    fetchVehicleLabors,
    fetchVehicleAppurtenances,
    fetchVehicleRecommendations,

    setExpandedVehicleId,

};

@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehiclePage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { match: {params: {id}}} = this.props;
        this.props.fetchVehicle({vehicleId: id});
        this.props.setExpandedVehicleId({vehicleId: id});
        this.props.fetchVehicleOrders();
        this.props.fetchVehicleNormHours();
        this.props.fetchVehicleLabors();
        this.props.fetchVehicleAppurtenances();
        this.props.fetchVehicleRecommendations();

    }

    render() {

        const {
            ordersStats,
            normHoursStats,
            laborsStats,
            appurtenancesStats,
            recommendationsStats,
        } = this.props;

        return (
            <Layout
                title={<FormattedMessage id={ 'vehicle_page.title'}/>}
                description={<FormattedMessage id={ 'vehicle_page.description'}/>}
                controls={
                    <div>
                        <StyledButton 
                            onClick={() => {
                                history.push({
                                    pathname: `${book.vehicles}`
                                });
                            }}
                        ><Icon type="rollback" /></StyledButton>
                    </div>
                }
            >
                <Tabs type="card" tabPosition="right">
                    <TabPane tab={<FormattedMessage id={ 'vehicle_page.general_info'}/>} key="general_info">
                        <GeneralInfoTab />
                    </TabPane>

                    <TabPane
                        tab={
                            <div>
                                <FormattedMessage id={ 'vehicle_page.norm_hours'}/>
                                ({normHoursStats.totalRowsCount})
                            </div>
                        }
                        key="norm_hours"
                    >
                        <VehicleNormHoursTab />
                    </TabPane>

                    <TabPane
                        tab={
                            <div>
                                <FormattedMessage id={ 'vehicle_page.orders'}/>
                                ({ordersStats.countOrders})
                            </div>
                        }
                        key="orders"
                    >
                        <VehicleOrdersTab />
                    </TabPane>

                    <TabPane
                        tab={
                            <div>
                                <FormattedMessage id={ 'vehicle_page.labors'}/>
                                ({laborsStats.totalRowsCount})
                            </div>
                        }
                        key="labors"
                    >
                        <VehicleLaborsTab />
                    </TabPane>

                    <TabPane
                        tab={
                            <div>
                                <FormattedMessage id={ 'vehicle_page.spare_parts'}/>
                                ({appurtenancesStats.totalRowsCount})
                            </div>
                        } key="spare_parts"
                    >
                        <VehicleSparePartsTab />
                    </TabPane>

                    <TabPane
                        tab={
                            <div>
                                <FormattedMessage id={ 'vehicle_page.recommendations'}/>
                                ({recommendationsStats.totalRowsCount})
                            </div>
                        }
                        key="recommendations"
                    >
                        <VehicleRecomendationsTab />
                    </TabPane>

                    <TabPane disabled={true} tab={<FormattedMessage id={ 'vehicle_page.inspection_intervals'}/>} key="inspection_intervals">
                        <VehicleInspectionIntervalsTab />
                    </TabPane>
                </Tabs>
            </Layout>
        )
    }
}