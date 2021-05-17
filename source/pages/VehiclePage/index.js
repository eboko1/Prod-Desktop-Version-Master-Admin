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
import Styles from './styles.m.css';
import Block from './components/Block';
import DataItem from './components/DataItem';

const TabPane = Tabs.TabPane;
const DATE_FORMATT = "DD.MM.YYYY";

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

        const {
            client,
            vehicle,
            generalData,
            match: {params: {id}}
        } = this.props;

        console.log("Vehicle: ", this.props.vehicle);
        console.log("Client: ", this.props.client);
        console.log("generalData: ", generalData);

        return (
            <Layout
                title={"Title here"}
                description={"Description"}
                controls={"Controls"}
            >
                <button onClick={() => this.props.fetchVehicle({vehicleId: id})}>
                    Fetch
                </button>
                <Tabs type="card" tabPosition="right" tabBarGutter={15}>
                    <TabPane tab="General info" key="general_info">
                        <div className={Styles.tabContent}>
                            <Block
                                title="Vehicle"
                                className={Styles.block}
                                controls={
                                    <div>
                                        <Icon className={Styles.barcodeIcon} type="barcode" />
                                        <Icon className={Styles.infoIcon} type="question-circle" />
                                        <Icon className={Styles.editIcon} type="edit" />
                                        <Icon className={Styles.deleteIcon} type="delete" />
                                        <Icon className={Styles.changeVehicleOwnerIcon} type="sync" />
                                        <Button className={Styles.iconButton} type="primary"><Icon className={Styles.plusIcon} type="plus" /></Button>
                                    </div>
                                }
                            >
                                <div>
                                    <DataItem label="Number">{vehicle.vehicleNumber}</DataItem>
                                    <DataItem className={Styles.dataItem} label="VIN">{vehicle.vehicleVin}</DataItem>
                                    <DataItem className={Styles.dataItem} label="Make">{vehicle.make}</DataItem>
                                    <DataItem className={Styles.dataItem} label="Model">{vehicle.model}</DataItem>
                                    <DataItem className={Styles.dataItem} label="Modification">{vehicle.modification}</DataItem>
                                </div>

                                <div className={Styles.buttonsContainer}>
                                    <Row className={Styles.row}>
                                        <Col span={6}><Button className={Styles.button} type="primary">Service book</Button></Col>
                                        <Col span={18}>
                                            <Icon className={Styles.sendSMSIcon} type="message" />
                                            <Icon className={Styles.sendMailIcon} type="mail" />
                                            <Icon className={Styles.copyIcon} type="copy" />
                                        </Col>
                                    </Row>
                                </div>
                            </Block>

                            {/* --------------------------------------------------------------------------- */}

                            <Block
                                title="Client"
                                className={Styles.block}
                                controls={
                                    <div>
                                        <Icon className={Styles.changeVehicleOwnerIcon} type="sync" />
                                    </div>
                                }
                            >
                                <div>
                                    <DataItem label="Name">{`${client.name} ${client.surname}`}</DataItem>
                                    <DataItem className={Styles.dataItem} label="Phone">
                                        {
                                            _.map(
                                                _.get(client, 'phones', []),
                                                (phone) => (<a key={v4()} className={Styles.phoneLink} href={`tel:${phone}`}>{phone}</a>)
                                            )
                                        }
                                    </DataItem>
                                </div>
                            </Block>

                            {/* --------------------------------------------------------------------------- */}

                            <Block
                                title="Last data and actions"
                                className={Styles.block}
                            >
                                <div>
                                    <DataItem label="Order">
                                        <a className={Styles.orderLink} href={ `${book.order}/${_.get(generalData, 'latestOrderData.orderId')}` }>
                                            <FormattedDatetime format={DATE_FORMATT} datetime={_.get(generalData, 'latestOrderData.datetime')} />
                                        </a>
                                    </DataItem>
                                    <DataItem className={Styles.dataItem} label="Call">
                                        <FormattedDatetime format={DATE_FORMATT} datetime={_.get(generalData, 'callData.datetime')} />
                                    </DataItem>
                                </div>

                                <div className={Styles.buttonsContainer}>
                                    <Row className={Styles.row}>
                                        <Col span={6}><Button className={Styles.button} type="primary">Reocord 21.04.2021</Button></Col>
                                        <Col span={18}>
                                            <Icon className={Styles.sendSMSIcon} type="message" />
                                            <Icon className={Styles.sendMailIcon} type="mail" />
                                            <Icon className={Styles.copyIcon} type="copy" />
                                        </Col>
                                    </Row>

                                    <Row className={Styles.row}>
                                        <Col span={6}><Button className={Styles.button} type="primary">Calculation</Button></Col>
                                        <Col span={18}>
                                            <Icon className={Styles.sendSMSIcon} type="message" />
                                            <Icon className={Styles.sendMailIcon} type="mail" />
                                            <Icon className={Styles.copyIcon} type="copy" />
                                        </Col>
                                    </Row>
                                </div>
                            </Block>
                        </div>
                        

                    </TabPane>



                    <TabPane tab="Norm hours" key="norm_hours">Content 2</TabPane>
                    <TabPane tab="Orders" key="orders">Content 3</TabPane>
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