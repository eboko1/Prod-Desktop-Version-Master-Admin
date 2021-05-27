// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Button, Tabs, Icon, Row, Col, Input} from 'antd';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import {Layout, Spinner} from 'commons';
import { FormattedDatetime } from "components";
import book from 'routes/book';
import {
    fetchVehicle,

    selectVehicle,
    selectClient,
    selectGeneralData
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
});

const mapDispatchToProps = {
    fetchVehicle
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
    }

    render() {

        return (
            <Layout
                title={<FormattedMessage id={ 'vehicle_page.title'}/>}
                description={<FormattedMessage id={ 'vehicle_page.description'}/>}
                controls={<FormattedMessage id={ 'vehicle_page.controls'}/>}
            >
                <Tabs type="card" tabPosition="right" tabBarGutter={15}>
                    <TabPane tab={<FormattedMessage id={ 'vehicle_page.general_info'}/>} key="general_info">
                        <GeneralInfoTab />
                    </TabPane>

                    <TabPane tab={<FormattedMessage id={ 'vehicle_page.norm_hours'}/>} key="norm_hours">
                        <VehicleNormHoursTab />
                    </TabPane>

                    <TabPane tab={<FormattedMessage id={ 'vehicle_page.orders'}/>} key="orders">
                        <VehicleOrdersTab />
                    </TabPane>

                    <TabPane tab={<FormattedMessage id={ 'vehicle_page.labors'}/>} key="labors">
                        <VehicleLaborsTab />
                    </TabPane>

                    <TabPane tab={<FormattedMessage id={ 'vehicle_page.spare_parts'}/>} key="spare_parts">
                        <VehicleSparePartsTab />
                    </TabPane>

                    <TabPane tab={<FormattedMessage id={ 'vehicle_page.recommendations'}/>} key="recommendations">
                        <VehicleRecomendationsTab />
                    </TabPane>

                    <TabPane tab={<FormattedMessage id={ 'vehicle_page.inspection_intervals'}/>} key="inspection_intervals">
                        <VehicleInspectionIntervalsTab />
                    </TabPane>
                </Tabs>
            </Layout>
        )
    }
}