// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter} from 'react-router-dom';
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

    createOrder,

    selectVehicle,
    selectClient,
    selectGeneralData
} from 'core/vehicles/duck';

// own
import Styles from './styles.m.css';
import Block from '../../Block';
import DataItem from '../../DataItem';

const TabPane = Tabs.TabPane;
const DATE_FORMATT = "DD.MM.YYYY";

const mapStateToProps = state => ({
    user:        state.auth,
    vehicle:     selectVehicle(state),
    client:      selectClient(state),
    generalData: selectGeneralData(state),
});

const mapDispatchToProps = {
    fetchVehicle,
    createOrder
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
        this.props.fetchVehicle({vehicleId: id});
    }

    /**
     * This event handler is used to create an order which will contain specific client and may contain vehicle if id was provided
     * @param {*} param0 Contains clientId which is used to define client in order and vehicleId of this client
     */
    onCreateOrder = ({clientId, vehicleId}) => {
        const {user} = this.props;
        this.props.createOrder({clientId, managerId: user.id, vehicleId});
    }

    render() {

        const {
            client,
            vehicle,
            generalData,
        } = this.props;

        console.log("Vehicle: ", this.props.vehicle);
        console.log("Client: ", this.props.client);
        console.log("generalData: ", generalData);

        return (
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
                            <Button
                                className={Styles.iconButton}
                                type="primary"
                                onClick={() => this.onCreateOrder({clientId: _.get(client, 'clientId'), vehicleId: _.get(vehicle, 'id')})}
                            >
                                <Icon className={Styles.plusIcon} type="plus" />
                            </Button>
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
                        <DataItem label="Name">
                            <Link to={ `${book.client}/${_.get(client, 'clientId')}` }>{`${client.name} ${client.surname}`}</Link>
                        </DataItem>
                        
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
        )
    }
}