// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Button, Icon, Modal, Input, InputNumber, Checkbox, Table, notification, Switch } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import {getReport} from 'core/order/duck';
import { ClientSearchTable } from 'components';
// own
import Styles from './styles.m.css';
const Option = Select.Option;

const mapDispatchToProps = {
    getReport,
};

@connect(
    void 0,
    {getReport},
)
@injectIntl
export default class VehicleLocationModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            locations: [],
            clients: [],
            selectedLocation: undefined,
            printAct: true,
            clientId: undefined,
            vehicles: [],
            vehicleId: undefined,
            clientSearchQuery: "",
        };
        this._isMounted = false;
    }

    fetchClients() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/clients`;
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: token,
            },
        })
        .then(function(response) {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText));
            }
            return Promise.resolve(response);
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            that.setState({
                clients: data.clients,
            })
        })
        .catch(function(error) {
            console.log("error", error);
        });
    }

    fetchLocations() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_locations`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            that.setState({
                locations: data,
            })
        })
        .catch(function (error) {
            console.log('error', error);
        });
    }

    postMovement() {
        const { receiveMode, transferMode, currentLocation, onConfirm, orderId, getReport } = this.props;
        const { selectedLocation, vehicleId, clientId, printAct } = this.state;
        const returnMode = this.props.returnMode || transferMode && !selectedLocation;

        const postData = {
            businessLocationId: selectedLocation,
            clientVehicleId: vehicleId,
            count: 1,
        };

        if(receiveMode) {
            postData.type = 'INCOME';
            postData.documentType = 'CLIENT';
        } else if(returnMode) {
            postData.type = 'EXPENSE';
            postData.documentType = 'CLIENT';
            postData.businessLocationId = currentLocation;
        } else if(transferMode) {
            postData.type = 'EXPENSE';
            postData.documentType = 'TRANSFER';
            postData.businessLocationId = currentLocation;
            postData.counterpartBusinessLocationId = selectedLocation;
        }

        console.log(postData)
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/business_locations/movements`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(postData),
        })
        .then(function (response) {
            if (response.status !== 200) {
            return Promise.reject(new Error(response.statusText))
            }
            return Promise.resolve(response)
        })
        .then(function (response) {
            return response.json()
        })
        .then(async function (data) {
            if(onConfirm) {
                await onConfirm(selectedLocation);
            };
            if(printAct && (returnMode || receiveMode)) {
                await getReport({
                    link: `/orders/reports/actOfAcceptanceReport/${orderId || 0}?clientVehicleId=${vehicleId}&reverse=${Boolean(returnMode)}`,
                    name: 'actOfAcceptanceReport'
                });
            }
        })
        .catch(function (error) {
            console.log('error', error);
            notification.error({
                message: that.props.intl.formatMessage({
                    id: `error`,
                }),
            });
        });
    }

    receiveModeContent() {
        const { locations, clients, clientId, vehicles, vehicleId, selectedLocation, printAct, clientSearchQuery } = this.state;
        return (
            <div>
                <div className={Styles.modalTitle}>
                    <FormattedMessage id='vehicle_location_modal.title.receive' />
                </div>
                <div className={Styles.modalContent}>
                    <div>
                        <Input
                            width={'100%'}
                            value={clientSearchQuery}
                            placeholder={this.props.intl.formatMessage({id: "add_order_form.search_client.placeholder"})}
                            onChange={({target})=>{
                                this.setState({
                                    clientSearchQuery: target.value,
                                })
                            }}
                        />
                        <ClientSearchTable
                            searchQuery={clientSearchQuery}
                            visible={clientSearchQuery.length > 2}
                            onSelect={({clientId, vehicles})=>{
                                this.setState({
                                    clientSearchQuery: "",
                                    clientId: clientId,
                                    vehicleId: vehicles.length && vehicles[0].id,
                                    vehicles: vehicles,
                                })
                            }}
                        />
                    </div>  
                    <div>
                        {clientId && 
                            <Select
                                disabled
                                style={{color: 'var(--text)'}}
                                value={clientId}
                                placeholder={this.props.intl.formatMessage({id:'vehicle_location_modal.client'})}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                filterOption={(input, option) => {
                                    const searchValue = String(option.props.children).toLowerCase().replace(/[+\-()., ]/g,'');
                                    const inputValue = input.toLowerCase();
                                    // let matchClientVehicle = false;
                                    // option.props.vehicles.map(({number, make, model, modification, year})=>{
                                    //     const vehicleData = `${make} ${model} ${modification} (${year})`.toLowerCase().replace(/[+\-()., ]/g,'');
                                    //     console.log(vehicleData);
                                    // })
                                    return searchValue.indexOf(inputValue) >= 0;
                                }}
                                onChange={(value, option)=>{
                                    this.setState({
                                        clientId: value,
                                        vehicles: option.props.vehicles,
                                        vehicleId: option.props.vehicles.length ? option.props.vehicles[0].id : undefined,
                                    })
                                }}
                            >
                                {clients.map(({clientId, name, surname, phones, vehicles}, key)=>
                                    <Option value={clientId} key={key} vehicles={vehicles}>
                                        {name} {surname} {phones[0]}
                                    </Option>
                                )}
                            </Select>
                        }
                    </div>
                    <div>
                        {clientId && 
                            <Select
                                showSearch
                                value={vehicleId}
                                placeholder={this.props.intl.formatMessage({id:'vehicle_location_modal.vehicle'})}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                filterOption={(input, option) => {
                                    const searchValue = String(option.props.children).toLowerCase().replace(/[+\-()., ]/g,'');
                                    const inputValue = input.toLowerCase();
                                    return searchValue.indexOf(inputValue) >= 0;
                                }}
                                onChange={(value, option)=>{
                                    this.setState({
                                        vehicleId: value,
                                    })
                                }}
                            >
                                {vehicles.map(({id, number, make, model, year}, key)=>
                                    <Option value={id} key={key}>
                                        {number} {make} {model} ({year})
                                    </Option>
                                )}
                            </Select>
                        }
                    </div>
                    <div className={Styles.locationPrintWrapper}>
                        <div className={Styles.locationWrapper}>
                            <FormattedMessage id='location'/>
                            <Select
                                showSearch
                                value={selectedLocation}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                placeholder={this.props.intl.formatMessage({id:'location'})}
                                onChange={(value)=>{
                                    this.setState({
                                        selectedLocation: value,
                                    })
                                }}
                            >
                                {locations.map(({id, name}, key)=>
                                    <Option
                                        key={key}
                                        value={id}
                                    >
                                        {name}
                                    </Option>
                                )}
                            </Select>
                        </div>
                        <div className={Styles.printWrapper}>
                            <FormattedMessage id='vehicle_location_modal.print_act' />
                            <Checkbox
                                style={{marginLeft: 6}}
                                checked={printAct}
                                onChange={({target})=>{
                                    this.setState({printAct: target.checked})
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className={Styles.modalButton}>
                    <Button
                        type='primary'
                        onClick={this.handleOk}
                    >
                        <FormattedMessage id='vehicle_location_modal.button.receive' />
                    </Button>
                </div>
            </div>
        )
    }

    returnModeContent() {
        const { locations, clients, clientId, vehicles, vehicleId, selectedLocation, printAct } = this.state;
        return (
            <div>
                <div className={Styles.modalTitle}>
                    <FormattedMessage id='vehicle_location_modal.title.return' />
                </div>
                <div className={Styles.modalContent}>
                    <div>
                        <Select
                            disabled
                            style={{color: 'var(--text)'}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            value={vehicleId}
                        >
                            {vehicles.map(({id, number, make, model, year}, key)=>
                                <Option value={id} key={key}>
                                    {number} {make} {model} ({year})
                                </Option>
                            )}
                        </Select>
                    </div>
                    <div className={Styles.printWrapper}>
                        <FormattedMessage id='vehicle_location_modal.print_act' />
                        <Checkbox
                            style={{marginLeft: 6}}
                            checked={printAct}
                            onChange={({target})=>{
                                this.setState({printAct: target.checked})
                            }}
                        />
                    </div>
                </div>
                <div className={Styles.modalButton}>
                    <Button
                        type='primary'
                        onClick={this.handleOk}
                    >
                        <FormattedMessage id='vehicle_location_modal.button.return' />
                    </Button>
                </div>
            </div>
        )
    }

    transferReturnModeContent() {
        const { currentLocation } = this.props;
        const { locations, clients, clientId, vehicles, vehicleId, selectedLocation, printAct } = this.state;
        return (
            <div>
                <div className={Styles.modalTitle}>
                    <FormattedMessage id={`vehicle_location_modal.title.${selectedLocation ? 'transfer' : 'return'}`} />
                </div>
                <div className={Styles.modalContent}>
                    <div>
                        <Select
                            disabled
                            style={{color: 'var(--text)'}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            value={vehicleId}
                        >
                            {vehicles.map(({id, number, make, model, year}, key)=>
                                <Option value={id} key={key}>
                                    {number} {make} {model} ({year})
                                </Option>
                            )}
                        </Select>
                    </div>
                    <div className={Styles.locationToLocationWrapper}>
                        <div className={Styles.locationWrapper}>
                            <FormattedMessage id='vehicle_location_modal.from'/>
                             <Select
                                disabled
                                value={currentLocation}
                                style={{color: 'var(--text)'}}
                            >
                                {locations.map(({id, name}, key)=>
                                    <Option
                                        key={key}
                                        value={id}
                                    >
                                        {name}
                                    </Option>
                                )}
                            </Select>
                        </div>
                        <div className={Styles.locationWrapper}>
                            <FormattedMessage id='vehicle_location_modal.to'/>
                             <Select
                                allowClear
                                showSearch
                                value={selectedLocation}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                placeholder={this.props.intl.formatMessage({id:'location'})}
                                onChange={(value)=>{
                                    this.setState({
                                        selectedLocation: value,
                                    })
                                }}
                            >
                                {locations.map(({id, name}, key)=>
                                    <Option
                                        key={key}
                                        value={id}
                                    >
                                        {name}
                                    </Option>
                                )}
                            </Select>
                        </div>
                    </div>
                    {!selectedLocation &&
                        <div className={Styles.printWrapper}>
                            <FormattedMessage id='vehicle_location_modal.print_act' />
                            <Checkbox
                                style={{marginLeft: 6}}
                                checked={printAct}
                                onChange={({target})=>{
                                    this.setState({printAct: target.checked})
                                }}
                            />
                        </div>
                    }
                </div>
                <div className={Styles.modalButton}>
                    <Button
                        type='primary'
                        onClick={this.handleOk}
                    >
                        <FormattedMessage id={`vehicle_location_modal.button.${selectedLocation ? 'transfer' : 'return'}`} />
                    </Button>
                </div>
            </div>
        )
    }

    handleOk = () => {
        this.postMovement();
        this.handleCancel();
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            selectedLocation: undefined,
            printAct: true,
            clientId: undefined,
            vehicles: [],
            vehicleId: undefined,
        });
        this.props.hideModal(this.state.selectedLocation);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.modalVisible && !prevProps.modalVisible || this.state.visible && !prevState.visible) {
            const { selectedLocation, vehicleId, clientId, orderId } = this.props;
            const { clients } = this.state;
            this.setState({
                selectedLocation: selectedLocation,
                orderId: orderId,
                clientId: clientId,
                vehicleId: vehicleId,
                vehicles: clientId ? clients.find((client)=>client.clientId == clientId).vehicles : [],
            })
        }

        if(!prevProps.showModal && this.props.showModal) {
            this.setState({
                visible: true,
            })
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            this.fetchClients();
            this.fetchLocations();
        }
        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { disabled, modalVisible, hideModal, receiveMode, returnMode, transferMode, showIcon, style } = this.props;
        const { visible } = this.state;
        let content;
        if(receiveMode) content = this.receiveModeContent();
        else if(returnMode) content = this.returnModeContent();
        else if(transferMode) content = this.transferReturnModeContent();
        
        return (
            <div className={Styles.modalWrap} style={style}>
                {showIcon && 
                    <Icon
                        type="double-right"
                        className={`${Styles.modalIcon} ${disabled ? Styles.disabledIcon : null}`}
                        onClick={()=>{
                            this.setState({
                                visible: true,
                            })
                        }}
                    />
                }
                <Modal
                    visible={modalVisible || visible}
                    footer={null}
                    onCancel={this.handleCancel}
                    style={{minWidth: 840}}
                >
                    {content}
                </Modal>
            </div>
        );
    }
}