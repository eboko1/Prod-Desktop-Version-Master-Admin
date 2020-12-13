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

// own
import Styles from './styles.m.css';
const Option = Select.Option;

@injectIntl
export default class VehicleLocationModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            locations: [],
            clients: [],
            selectedLocation: undefined,
            printAct: true,
            clientId: undefined,
            vehicles: [],
            vehicleId: undefined,
        };
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
        const { receiveMode, returnMode, transferMode } = this.props;
        const { selectedLocation, vehicleId } = this.state;
        const postData = {
            businessLocationId: selectedLocation,
            clientVehicleId: vehicleId,
            count: 1,
        };

        if(receiveMode) {
            postData.type = 'INCOME';
            postData.documentType = 'CLIENT';
        } else if(returnMode) {

        } else if( transferMode) {

        }

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
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.log('error', error);
        });
    }

    receiveModeContent() {
        const { locations, clients, clientId, vehicles, vehicleId, selectedLocation, printAct } = this.state;
        return (
            <div>
                <div className={Styles.modalTitle}>
                    <FormattedMessage id='vehicle_location_modal.title.receive' />
                </div>
                <div className={Styles.modalContent}>
                    <div>
                        <Select
                            showSearch
                            value={clientId}
                            placeholder={this.props.intl.formatMessage({id:'vehicle_location_modal.client'})}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            filterOption={(input, option) => {
                                const searchValue = String(option.props.children).toLowerCase().replace(/[+\-()., ]/g,'');
                                const inputValue = input.toLowerCase();
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
                    </div>
                    <div>
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
                    </div>
                    <div className={Styles.locationPrintWrapper}>
                        <div className={Styles.locationWrapper}>
                            <FormattedMessage id='location'/>
                            <Select
                                showSearch
                                value={selectedLocation}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
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
        return (
            <div>
                <div className={Styles.modalTitle}>
                    <FormattedMessage id='vehicle_location_modal.title.return' />
                </div>
                <div className={Styles.modalContent}>
                    <div>
                        <Select
                            showSearch
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                        >
                            
                        </Select>
                    </div>
                    <div className={Styles.printWrapper}>
                        <FormattedMessage id='vehicle_location_modal.print_act' />
                        <Checkbox
                            style={{marginLeft: 6}}
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

    transferModeContent() {
        const { locations, clients, clientId, vehicles, vehicleId, selectedLocation, printAct } = this.state;
        return (
            <div>
                <div className={Styles.modalTitle}>
                    <FormattedMessage id='vehicle_location_modal.title.transfer' />
                </div>
                <div className={Styles.modalContent}>
                    <div>
                        <Select
                            showSearch
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                            value={vehicleId}
                        >
                            
                        </Select>
                    </div>
                    <div className={Styles.locationWrapper}>
                            <FormattedMessage id='vehicle_location_modal.new_location'/>
                             <Select
                                showSearch
                                value={selectedLocation}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
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
                <div className={Styles.modalButton}>
                    <Button
                        type='primary'
                        onClick={this.handleOk}
                    >
                        <FormattedMessage id='vehicle_location_modal.button.transfer' />
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
            selectedLocation: undefined,
            printAct: true,
            clientId: undefined,
            vehicles: [],
            vehicleId: undefined,
        });
        this.props.hideModal();
    }

    componentDidUpdate(prevProps) {
        if(this.props.visible && !prevProps.visible) {
            this.setState({
                selectedLocation: this.props.selectedLocation,
                vehicleId: this.props.vehicleId,
            })
        }
    }

    componentDidMount() {
        this.fetchClients();
        this.fetchLocations();
    }

    render() {
        const { visible, hideModal, receiveMode, returnMode, transferMode } = this.props;
        let content;
        if(receiveMode) content = this.receiveModeContent();
        if(returnMode) content = this.returnModeContent();
        if(transferMode) content = this.transferModeContent();
        return (
            <Modal
                visible={visible}
                footer={null}
                onCancel={this.handleCancel}
            >
                {content}
            </Modal>
        );
    }
}