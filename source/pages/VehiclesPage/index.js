// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import {connect} from 'react-redux';
import {Button, Tabs, Icon, Row, Col, Input} from 'antd';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import {Layout, Spinner} from 'commons';
import {
    fetchVehicle,

    selectVehicle,
    selectClient
} from 'core/vehicles/duck';

// own
import Styles from './styles.m.css';
import Block from './components/Block';
import DataItem from './components/DataItem';

const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    vehicle: selectVehicle(state),
    client: selectClient(state),
});

const mapDispatchToProps = {
    fetchVehicle
};

@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class VehiclesPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchVehicle();
    }

    render() {

        const {
            client,
            vehicle
        } = this.props;

        console.log("Vehicle: ", this.props.vehicle);
        console.log("Client: ", this.props.client);

        return (
            <Layout
                title={"Title here"}
                description={"Description"}
                controls={"Controls"}
            >
                <button onClick={() => this.props.fetchVehicle()}>
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
                                    <DataItem label="Order">val</DataItem>
                                    <DataItem className={Styles.dataItem} label="Order">val</DataItem>
                                    <DataItem className={Styles.dataItem} label="Order">val</DataItem>
                                    <DataItem className={Styles.dataItem} label="Order">val</DataItem>
                                    <DataItem className={Styles.dataItem} label="Order">val</DataItem>
                                </div>

                                <div>
                                    <DataItem label="Order">val</DataItem>
                                    <DataItem className={Styles.dataItem} label="Order">val</DataItem>
                                    <DataItem className={Styles.dataItem} label="Order">val</DataItem>
                                    <DataItem className={Styles.dataItem} label="Order">val</DataItem>
                                </div>

                                <div className={Styles.buttonsContainer}>
                                    <Row className={Styles.row}>
                                        <Col span={6}><Button className={Styles.button} type="primary">Reocord 21.04.2021</Button></Col>
                                        <Col span={6}>
                                            <Icon className={Styles.sendSMSIcon} type="message" />
                                            <Icon className={Styles.sendMailIcon} type="mail" />
                                            <Icon className={Styles.copyIcon} type="copy" />
                                        </Col>
                                        <Col span={6}></Col>
                                        <Col span={6}></Col>
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
                                    <DataItem label="Order">val</DataItem>
                                    <DataItem className={Styles.dataItem} label="Order">val</DataItem>
                                    <DataItem className={Styles.dataItem} label="Order">val</DataItem>
                                    <DataItem className={Styles.dataItem} label="Order">val</DataItem>
                                </div>

                                <div className={Styles.buttonsContainer}>
                                    <Row className={Styles.row}>
                                        <Col span={6}><Button className={Styles.button} type="primary">Reocord 21.04.2021</Button></Col>
                                        <Col span={6}></Col>
                                        <Col span={6}></Col>
                                        <Col span={6}></Col>
                                    </Row>
                                    <Row className={Styles.row}>
                                        <Col span={6}><Button className={Styles.button} type="primary">Calculation</Button></Col>
                                        <Col span={6}></Col>
                                        <Col span={6}></Col>
                                        <Col span={6}></Col>
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