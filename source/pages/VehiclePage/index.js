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
import { permissions, isForbidden } from "utils";
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
    user:        state.auth,
    vehicle:     selectVehicle(state),
    client:      selectClient(state),
    generalData: selectGeneralData(state),

    // stats
    ordersStats:          selectVehicleOrdersStats(state),
    normHoursStats:       selectVehicleNormHoursStats(state),
    laborsStats:          selectVehicleLaborsStats(state),
    appurtenancesStats:   selectVehicleAppurtenancesStats(state),
    recommendationsStats: selectVehicleRecommendationsStats(state),
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

        const { user } = props;

        this.tabsPermisions = {
            orderDetailsForbidden:   isForbidden(user, permissions.ACCESS_ORDER_DETAILS),
            orderNormHoursForbidden: isForbidden(user, permissions.ACCESS_NORM_HOURS_MODAL_WINDOW),
            orderServicesForbidden:  isForbidden(user, permissions.ACCESS_ORDER_SERVICES),
            orderCommentsForbidden:  isForbidden(user, permissions.ACCESS_ORDER_COMMENTS),
        }
    }

    componentDidMount() {
        const { match: {params: {id}}} = this.props;

        this.props.fetchVehicle({vehicleId: id});
        this.props.setExpandedVehicleId({vehicleId: id});

        this.props.fetchVehicleOrders();
        this.props.fetchVehicleNormHours();
        !this.tabsPermisions.orderServicesForbidden && this.props.fetchVehicleLabors();
        !this.tabsPermisions.orderDetailsForbidden && this.props.fetchVehicleAppurtenances();
        !this.tabsPermisions.orderCommentsForbidden && this.props.fetchVehicleRecommendations();

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
                        disabled={this.tabsPermisions.orderNormHoursForbidden}
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
                        disabled={this.tabsPermisions.orderServicesForbidden}
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
                        disabled={this.tabsPermisions.orderDetailsForbidden}
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
                        disabled={this.tabsPermisions.orderCommentsForbidden}
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