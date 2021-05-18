// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
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
import Styles from './styles.m.css';
import VehiclesTable from './components/VehiclesTable';

const DATE_FORMATT = "DD.MM.YYYY";

const mapStateToProps = state => ({
    vehicle:     selectVehicle(state),
    client:      selectClient(state),
    generalData: selectGeneralData(state),
});

const mapDispatchToProps = {
    fetchVehicle
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehiclePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <Layout
                title={"Vehicles"}
                description={"List of all vehicles on this business."}
                controls={"Controls here"}
            >
               <VehiclesTable />
            </Layout>
        )
    }
}