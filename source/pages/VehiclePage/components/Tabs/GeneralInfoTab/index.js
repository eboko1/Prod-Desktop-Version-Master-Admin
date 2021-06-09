// vendor
import React, {Component} from 'react';
import {FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Button, Tabs, Icon, Row, Col, Spin, Popover, notification} from 'antd';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import {Barcode, FormattedDatetime} from "components";
import book from 'routes/book';
import history from 'store/history';
import { VehicleModal, TecDocInfoModal } from 'modals';
import {setModal, MODALS} from 'core/modals/duck';
import {
    fetchVehicle,
    fetchVehicleOrdersLatest,
    fetchVehicleAttributes,

    createOrder,

    /*-------Selectors----*/
    selectVehicle,
    selectClient,
    selectGeneralData,
    selectVehicleAttributes,
    selectFetchingOrdersLatest,
    selectFetchingVehicleAttributes,
    selectFetchingVehicleClient,
    selectFetchingVehicle,
    deleteVehicle,
} from 'core/vehicles/duck';

// own
import Styles from './styles.m.css';
import Block from '../../Block';
import DataItem from '../../DataItem';
import {isForbidden, linkTo, permissions} from "utils";
import { ClientVehicleTransfer } from "modals";

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
    deleteVehicle
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
        this.props.fetchVehicleAttributes({vehicleId: id});
        this.props.fetchVehicleOrdersLatest({vehicleId: id});
    }

    /**
     * This event handler is used to create an order which will contain specific client and may contain vehicle if id was provided
     * @param {*} param0 Contains clientId which is used to define client in order and vehicleId of this client
     */
    onCreateOrder = ({clientId, vehicleId}) => {
        const {user} = this.props;

        if (!clientId) {
            notification.error({
                message: this.props.intl.formatMessage({
                    id: `vehicle_page.add_owner_vehicle`,
                })
            })
        } else {
            this.props.createOrder({clientId, managerId: user.id, vehicleId});
        }
    }

    onEditVehicle = ({vehicleId}) => {
        this.props.setModal(MODALS.VEHICLE, {
            mode: "EDIT",
            vehicleId,
            onSubmit: () => window.location.reload()
        });
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
            fetchingVehicleAttributes,
            deleteVehicle
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
                                    <Popover content={<FormattedMessage id="vehicle_page.hint_barcode_modal"/>}>
                                        <span style={{ width: '2em'}}>
                                               <Barcode
                                                   value={vehicle.barcode}
                                                   referenceId={vehicle.id}
                                                   table={'CLIENTS_VEHICLES'}
                                                   prefix={'CVH'}
                                                   iconStyle={{
                                                       fontSize: 24,
                                                       marginLeft: 4,
                                                   }}
                                                   onConfirm={()=>{
                                                       // TODO reload page
                                                       window.location.reload();
                                                       // fetchClient(clientId)
                                                   }}
                                               />
                                        </span>

                                    </Popover>
                                    
                                    <Popover content={<FormattedMessage id="vehicle_page.hint_vehicle_info_modal"/>}>
                                        <TecDocInfoModal
                                            modificationId={vehicle && vehicle.tecdocId}
                                            />
                                    </Popover>

                                    <Popover content={<FormattedMessage id="vehicle_page.hint_view_vehicle_modal"/>}>
                                        <Icon
                                            className={Styles.editIcon}
                                            type="eye"
                                            onClick={() => this.onViewVehicle({vehicleId: _.get(vehicle, 'id')})}
                                        />
                                    </Popover>

                                    <Popover content={<FormattedMessage id="vehicle_page.hint_edit_vehicle_modal"/>}>
                                        <Icon
                                            className={Styles.editIcon}
                                            type="edit"
                                            onClick={() => this.onEditVehicle({vehicleId: _.get(vehicle, 'id')})}
                                        />
                                    </Popover>

                                    <Popover content={<FormattedMessage id="vehicle_page.hint_add_vehicle_modal"/>}>
                                        <Icon
                                            className={Styles.editIcon}
                                            type="folder-add"
                                            onClick={() => this.onAddVehicle({clientId: _.get(client, 'clientId')})}
                                        />
                                    </Popover>

                                    <Popover content={<FormattedMessage id="vehicle_page.hint_delete_vehicle"/>}>
                                        <Icon
                                            className={Styles.deleteIcon}
                                            type="delete"
                                            onClick={() => {
                                                deleteVehicle({vehicleId: _.get(vehicle, 'id')});
                                                history.push({
                                                    pathname: `${book.vehicles}`
                                                });
                                            }}
                                        />
                                    </Popover>

                                    <Popover content={<FormattedMessage id="vehicle_page.hint_change_vehicle_owner"/>}>
                                        {fetchingVehicleClient 
                                            ? (<Spin />)
                                            :(
                                                <span className={Styles.changeVehicleOwnerIcon}>
                                                    <ClientVehicleTransfer
                                                        clientId={client.clientId}
                                                        vehicleId={vehicle.id}
                                                        vehicles={[vehicle]}
                                                    />
                                                </span>
                                            )
                                        }
                                    </Popover>

                                    <Popover content={<FormattedMessage id="vehicle_page.hint_create_order_for_this_vehicle"/>}>
                                        <Button
                                            className={Styles.iconButton}
                                            type="primary"
                                            onClick={() => this.onCreateOrder({clientId: _.get(client, 'clientId'), vehicleId: _.get(vehicle, 'id')})}
                                        >
                                            <Icon className={Styles.plusIcon} type="plus" />
                                        </Button>
                                    </Popover>
                                </div>
                            }
                        >
                            <div>
                                <DataItem label={<FormattedMessage id='add_client_form.number' />}>{vehicle.vehicleNumber}</DataItem>
                                <DataItem className={Styles.dataItem} label={<FormattedMessage id='add_order_form.vin' />}>{vehicle.vehicleVin}</DataItem>
                                <DataItem className={Styles.dataItem} label={<FormattedMessage id='add_client_form.make' />}>{vehicle.make}</DataItem>
                                <DataItem className={Styles.dataItem} label={<FormattedMessage id='add_client_form.model' />}>{vehicle.model}</DataItem>
                                <DataItem className={Styles.dataItem} label={<FormattedMessage id='add_client_form.modification' />}>{vehicle.modification}</DataItem>
                                <DataItem className={Styles.dataItem} label={<FormattedMessage id='add_client_form.year' />}>{vehicle.year}</DataItem>

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
                                        <Popover content={<FormattedMessage id="vehicle_page.hint_send_via_sms"/>}>
                                            <Icon className={Styles.sendSMSIcon} type="message" />
                                        </Popover>
                                        <Popover content={<FormattedMessage id="vehicle_page.hint_send_via_email"/>}>
                                            <Icon className={Styles.sendMailIcon} type="mail" />
                                        </Popover>
                                        <Popover content={<FormattedMessage id="vehicle_page.hint_copy_to_clipboard"/>}>
                                            <Icon className={Styles.copyIcon} type="copy" />
                                        </Popover>
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
                            <Popover content={<FormattedMessage id="vehicle_page.hint_change_vehicle_owner"/>}>
                                {fetchingVehicleClient 
                                    ? (<Spin />)
                                    :(
                                        <span className={Styles.changeVehicleOwnerIcon}>
                                            <ClientVehicleTransfer
                                                clientId={client.clientId}
                                                vehicleId={vehicle.id}
                                                vehicles={[vehicle]}
                                            />
                                        </span>
                                    )
                                }
                            </Popover>
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
                                <DataItem label={<FormattedMessage id={'order-status.order'} />}>
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
                                        <Button className={Styles.button} type="primary" onClick={() => {
                                            const orderId = _.get(generalData, 'latestOrderData.orderId')

                                            if (orderId)
                                                linkTo(`${book.order}/${orderId}`)
                                        }}>
                                            <FormattedMessage id='vehicle_page.record' />
                                            <FormattedDatetime format={DATE_FORMATT} datetime={_.get(generalData, 'latestOrderData.datetime')} />
                                        </Button>
                                    </Col>
                                    <Col span={18}>
                                        <Popover content={<FormattedMessage id="vehicle_page.hint_send_via_sms"/>}>
                                            <Icon className={Styles.sendSMSIcon} type="message" />
                                        </Popover>
                                        <Popover content={<FormattedMessage id="vehicle_page.hint_send_via_email"/>}>
                                            <Icon className={Styles.sendMailIcon} type="mail" />
                                        </Popover>
                                        <Popover content={<FormattedMessage id="vehicle_page.hint_copy_to_clipboard"/>}>
                                            <Icon className={Styles.copyIcon} type="copy" onClick={() => this.handleCopy(`${book.order}/${_.get(generalData, 'latestOrderData.orderId')}`)} />
                                        </Popover>
                                    </Col>
                                </Row>

                                <Row className={Styles.row}>
                                    <Col span={6}>
                                        <a href={`${_.get(generalData, 'linkData.link') || '#!'}`}>
                                            <Button className={Styles.button} type="primary" >
                                                {<FormattedMessage id='vehicle_page.calculation' />}
                                            </Button>
                                        </a>

                                    </Col>
                                    <Col span={18}>
                                        <Popover content={<FormattedMessage id="vehicle_page.hint_send_via_sms"/>}>
                                            <Icon className={Styles.sendSMSIcon} type="message" />
                                        </Popover>
                                        <Popover content={<FormattedMessage id="vehicle_page.hint_send_via_email"/>}>
                                            <Icon className={Styles.sendMailIcon} type="mail" />
                                        </Popover>
                                        <Popover content={<FormattedMessage id="vehicle_page.hint_copy_to_clipboard"/>}>
                                            <Icon className={Styles.copyIcon} type="copy" onClick={() => this.handleCopy(`${_.get(generalData, 'linkData.link')}`)} />
                                        </Popover>
                                    </Col>
                                </Row>
                            </div>

                        </div>
                    )}



                </Block>

                <VehicleModal />
            </div>
        )
    }
}