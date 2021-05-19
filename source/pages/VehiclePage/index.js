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
    VehicleOrdersTab
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
                title={"Title here"}
                description={"Description"}
                controls={"Controls"}
            >
                <Tabs type="card" tabPosition="right" tabBarGutter={15}>
                    <TabPane tab="General info" key="general_info">
                        <GeneralInfoTab />
                    </TabPane>


                    <TabPane tab="Norm hours" key="norm_hours">Content 2</TabPane>
                    <TabPane tab="Orders" key="orders">
                        <VehicleOrdersTab />
                    </TabPane>
                    <TabPane tab="Labors" key="labors">Content 4</TabPane>
                    <TabPane tab="Spare parts" key="spare_parts">Content 5</TabPane>
                    <TabPane tab="Recommendations" key="recommendations">Content 6</TabPane>
                    {/* TODO: Change key */}
                    <TabPane tab="ТО и Интервали" key="inspection_intervals">Content 7</TabPane>
                </Tabs>
            </Layout>
        )
    }
}