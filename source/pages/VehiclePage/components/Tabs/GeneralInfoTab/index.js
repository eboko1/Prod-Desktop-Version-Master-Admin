// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Button, Tabs, Icon, Row, Col, Spin} from 'antd';
import history from 'store/history';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import {Layout, Spinner} from 'commons';
import { FormattedDatetime } from "components";
import book from 'routes/book';
import { VehicleModal } from 'modals';
import {setModal, MODALS} from 'core/modals/duck';
import {
    fetchVehicle,
    fetchVehicleOrdersLatest,
    fetchVehicleAttributes,

    createOrder,
    selectVehicle,
    selectClient,
    selectGeneralData,
    selectVehicleAttributes,
    selectFetchingOrdersLatest,
    selectFetchingVehicleAttributes,
    selectFetchingVehicleClient,
    selectFetchingVehicle,
} from 'core/vehicles/duck';
import { deleteClientVehicle } from "core/client/duck";

// own
import Styles from './styles.m.css';
import Block from '../../Block';
import DataItem from '../../DataItem';
import {isForbidden, linkTo, permissions} from "utils";
import ClientVehicleTransfer from "modals/ClientVehicleTransfer";

const TabPane = Tabs.TabPane;
const DATE_FORMATT = "DD.MM.YYYY";

const mapStateToProps = state => ({
    user:               state.auth,
    vehicle:            selectVehicle(state),
    client:             selectClient(state),
    generalData:        selectGeneralData(state),
    vehicleAttributes:  selectVehicleAttributes(state),
    fetchingVehicle:    selectFetchingVehicle(state),
    fetchingVehicleClient: selectFetchingVehicleClient(state),
    fetchingOrdersLatest: selectFetchingOrdersLatest(state),
    fetchingVehicleAttributes: selectFetchingVehicleAttributes(state)
});

const mapDispatchToProps = {
    setModal,
    fetchVehicle,
    fetchVehicleAttributes,
    fetchVehicleOrdersLatest,

    createOrder,
    deleteClientVehicle
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
        this.props.fetchVehicleAttributes({vehicleId: id});
        this.props.fetchVehicleOrdersLatest({vehicleId: id});
    }

    /**
     * This event handler is used to create an order which will contain specific client and may contain vehicle if id was provided
     * @param {*} param0 Contains clientId which is used to define client in order and vehicleId of this client
     */
    onCreateOrder = ({clientId, vehicleId}) => {
        const {user} = this.props;
        this.props.createOrder({clientId, managerId: user.id, vehicleId});
    }

    onEditVehicle = ({vehicleId}) => {
        this.props.setModal(MODALS.VEHICLE, {mode: "EDIT", vehicleId});
    }

    onAddVehicle = ({clientId}) => {
        this.props.setModal(MODALS.VEHICLE, {mode: "ADD", clientId});
    }

    onViewVehicle = ({vehicleId}) => {
        this.props.setModal(MODALS.VEHICLE, {mode: "VIEW", vehicleId});
    }

    handleCopy = (url) => {
        navigator.clipboard.writeText(url).then();
    }

    render() {

        const {
            client,
            vehicle,
            generalData,
            vehicleAttributes,
            fetchingVehicle,
            fetchingVehicleClient,
            fetchingOrdersLatest,
            fetchingVehicleAttributes
        } = this.props;

        return (
            <div className={Styles.tabContent}>
                {
                    (fetchingVehicle)
                    ? <Spin />
                    : (
                        <Block
                            title={<FormattedMessage id='orders.vehicle' />}
                            className={Styles.block}
                            controls={
                                <div>
                                    <Icon className={Styles.barcodeIcon} type="barcode" />
                                    <Icon className={Styles.infoIcon} type="question-circle" />
                                    <Icon
                                        className={Styles.editIcon}
                                        type="eye"
                                        onClick={() => this.onViewVehicle({vehicleId: _.get(vehicle, 'id')})}
                                    />
                                    <Icon
                                        className={Styles.editIcon}
                                        type="edit"
                                        onClick={() => this.onEditVehicle({vehicleId: _.get(vehicle, 'id')})}
                                    />
                                    <Icon
                                        className={Styles.editIcon}
                                        type="folder-add"
                                        onClick={() => this.onAddVehicle({clientId: _.get(client, 'clientId')})}
                                    />

                                    <Icon
                                        className={Styles.deleteIcon}
                                        type="delete"
                                        onClick={() => {
                                            deleteClientVehicle(_.get(client, 'clientId'), _.get(vehicle, 'id'));
                                            history.push({
                                                pathname: `${book.vehicles}`
                                            });
                                        }}
                                    />
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
                                <DataItem label={<FormattedMessage id='add_client_form.number' />}>{vehicle.vehicleNumber}</DataItem>
                                <DataItem className={Styles.dataItem} label={<FormattedMessage id='add_order_form.vin' />}>{vehicle.vehicleVin}</DataItem>
                                <DataItem className={Styles.dataItem} label={<FormattedMessage id='add_client_form.make' />}>{vehicle.make}</DataItem>
                                <DataItem className={Styles.dataItem} label={<FormattedMessage id='add_client_form.model' />}>{vehicle.model}</DataItem>
                                <DataItem className={Styles.dataItem} label={<FormattedMessage id='add_client_form.modification' />}>{vehicle.modification}</DataItem>

                            </div>

                            {fetchingVehicleAttributes ? <Spin/> : (
                                <div>
                                    <DataItem label={<FormattedMessage id='vehicle_page.engine' />}>{vehicleAttributes.engineCode}</DataItem>
                                    <DataItem className={Styles.dataItem} label={<FormattedMessage id='vehicle_page.capacity' />}>{vehicleAttributes.capacity}</DataItem>
                                    <DataItem className={Styles.dataItem} label={<FormattedMessage id='vehicle_page.body_type' />}>{vehicleAttributes.bodyType}</DataItem>
                                    <DataItem className={Styles.dataItem} label={<FormattedMessage id='vehicle_page.fuel_type' />}>{vehicleAttributes.fuelType}</DataItem>
                                    <DataItem className={Styles.dataItem} label={<FormattedMessage id='vehicle_page.power' />}>{vehicleAttributes.power}</DataItem>
                                    <DataItem className={Styles.dataItem} label={<FormattedMessage id='vehicle_page.drive_type' />}>{vehicleAttributes.driveType}</DataItem>
                                </div>
                            )}


                            <div className={Styles.buttonsContainer}>
                                <Row className={Styles.row}>
                                    <Col span={6}><Button className={Styles.button} type="primary">{<FormattedMessage id='vehicle_page.service_book' />}</Button></Col>
                                    <Col span={18}>
                                        <Icon className={Styles.sendSMSIcon} type="message" />
                                        <Icon className={Styles.sendMailIcon} type="mail" />
                                        <Icon className={Styles.copyIcon} type="copy" />
                                    </Col>
                                </Row>
                            </div>
                        </Block>
                    )
                }

                {/* --------------------------------------------------------------------------- */}

                <Block
                    title={<FormattedMessage id='vehicle_page.clients' />}
                    className={Styles.block}
                    controls={
                        <div>
                            {!fetchingVehicleClient && (

                                // <Icon className={Styles.changeVehicleOwnerIcon} type="sync" />
                            //
                            // {!isForbidden(user, permissions.ACCESS_CLIENTS_VEHICLE_TRANSFER) && !isEditForbidden ? (
                                <ClientVehicleTransfer
                                clientId={client.clientId}
                                vehicleId={vehicle.id}
                                vehicles={client.vehicles}
                                />
                                // ) : null}

                            ) }
                        </div>
                    }
                >
                    {fetchingVehicleClient ? <Spin/> : (
                        <div>
                            <DataItem label={<FormattedMessage id='name' />}>
                                <Link to={ `${book.client}/${_.get(client, 'clientId')}` }>{`${client.name} ${client.surname}`}</Link>
                            </DataItem>

                            <DataItem className={Styles.dataItem} label={<FormattedMessage id='add_client_form.phones' />}>
                                {
                                    _.map(
                                        _.get(client, 'phones', []),
                                        (phone) => (<a key={v4()} className={Styles.phoneLink} href={`tel:${phone}`}>{phone}</a>)
                                    )
                                }
                            </DataItem>
                        </div>
                    )}
                </Block>

                {/* --------------------------------------------------------------------------- */}

                <Block
                    title={<FormattedMessage id='vehicle_page.last_data' />}
                    className={Styles.block}
                >
                    {fetchingOrdersLatest ? <Spin/> : (
                        <div>
                            <div>
                                <DataItem label={<FormattedMessage id={<FormattedMessage id='order-status.order' />} />}>
                                    <a className={Styles.orderLink} href={ `${book.order}/${_.get(generalData, 'latestOrderData.orderId')}` }>
                                        <FormattedDatetime format={DATE_FORMATT} datetime={_.get(generalData, 'latestOrderData.datetime')} />
                                    </a>
                                </DataItem>
                                <DataItem className={Styles.dataItem} label={<FormattedMessage id='order-status.call' />}>
                                    <FormattedDatetime format={DATE_FORMATT} datetime={_.get(generalData, 'callData.datetime')} />
                                </DataItem>
                            </div>

                            <div className={Styles.buttonsContainer}>
                                <Row className={Styles.row}>
                                    <Col span={6}>
                                        <Button className={Styles.button} type="primary" onClick={() => linkTo(`${book.order}/${_.get(generalData, 'latestOrderData.orderId')}`)}>
                                            <FormattedMessage id='vehicle_page.record' />
                                            <FormattedDatetime format={DATE_FORMATT} datetime={_.get(generalData, 'latestOrderData.datetime')} />
                                        </Button>
                                    </Col>
                                    <Col span={18}>
                                        <Icon className={Styles.sendSMSIcon} type="message" />
                                        <Icon className={Styles.sendMailIcon} type="mail" />
                                        <Icon className={Styles.copyIcon} type="copy" onClick={() => this.handleCopy(`${book.order}/${_.get(generalData, 'latestOrderData.orderId')}`)}/>
                                    </Col>
                                </Row>

                                <Row className={Styles.row}>
                                    <Col span={6}>
                                        <a href={`${_.get(generalData, 'linkData.link')}`}>
                                            <Button className={Styles.button} type="primary" >
                                                {<FormattedMessage id='vehicle_page.calculation' />}
                                            </Button>
                                        </a>

                                    </Col>
                                    <Col span={18}>
                                        <Icon className={Styles.sendSMSIcon} type="message" />
                                        <Icon className={Styles.sendMailIcon} type="mail" />
                                        <Icon className={Styles.copyIcon} type="copy" onClick={() => this.handleCopy(`${_.get(generalData, 'linkData.link')}`)}/>
                                    </Col>
                                </Row>
                            </div>

                        </div>
                    )}



                </Block>

                <VehicleModal
                    onClose={() => {
                        const { match: {params: {id}}} = this.props;
                        this.props.fetchVehicle({vehicleId: id});
                    }}
                />
            </div>
        )
    }
}