
// vendor
import React, { Component } from "react";
import { List, Form, Row, Col, notification, Icon, Button, Modal, Select, Popover } from "antd";
import { injectIntl, FormattedMessage } from "react-intl";
import _ from "lodash";

// own
import Styles from "./styles.m.css";
const Option = Select.Option;
const { confirm } = Modal;

const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
        message,
        description,
    });
};

/**
 * This modal is used to transfer car between clients
 */


@injectIntl
export default class ClientVehicleTransfer extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            clients: [],
            clientId: undefined,
            newOwnerId: undefined,
            vehicles: [],
            vehicleId: undefined,
            searchValue: "",
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            clients: [],
            newOwnerId: undefined,
            vehicles: [],
            vehicleId: undefined,
        })
    }

    handleOk = () => {
        var that = this;
        confirm({
            title: `${that.props.intl.formatMessage({id: 'clients-page.vehicle_transfer_confirm'})}   `,
            onOk() {
                let token = localStorage.getItem('_my.carbook.pro_token');
                let url = __API_URL__ + `/clients/vehicles/${that.state.vehicleId}`;
                fetch(url, {
                    method: "PUT",
                    headers: {
                        Authorization: token,
                    },
                    body: JSON.stringify({clientId: that.state.newOwnerId})
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
                        window.location.reload();
                    })
                    .catch(function(error) {
                        console.log("error", error);
                        openNotificationWithIcon(
                            "error",
                            that.props.intl.formatMessage({
                                id: "vehicle_transfer.error",
                            }),
                        );
                    });
                that.handleCancel();
            },
        });
    }

    fetchData() {
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

    render() {
        const { visible, clients, vehicles, newOwnerId, clientId, vehicleId, searchValue } = this.state;
        return (
            <>
                <Icon
                    type="sync"
                    className={Styles.carTransferIcon}
                    onClick={() => {
                        this.setState({
                            visible: true,
                            clientId: Number(this.props.clientId),
                            vehicleId: Number(this.props.vehicleId),
                            vehicles: this.props.vehicles,
                        });
                        this.fetchData();
                    }}
                />
                <Modal
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    style={{
                        minWidth: 640
                    }}
                    maskClosable={false}
                >
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <div style={{width: '50%'}}>
                            <span style={{fontWeight: 500}}>От</span>
                            <Select
                                showSearch
                                disabled
                                value={clientId ? clientId : "Нету собственника"}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                style={{color: 'var(--text)'}}
                                onChange={(value, option)=>{
                                    this.setState({
                                        clientId: value,
                                        vehicles: option.props.vehicles,
                                        vehicleId: option.props.vehicles.length ? option.props.vehicles[0].id : undefined,
                                    })
                                }}
                            >
                                {
                                    clientId && (clients.map(({clientId, name, surname, phones, vehicles}, key)=>
                                        <Option value={clientId} key={key} vehicles={vehicles}>
                                            {name} {surname} {phones[0]}
                                        </Option>
                                    ))
                                }
                            </Select>
                            <Select
                                showSearch
                                disabled
                                style={{color: 'var(--text)'}}
                                value={vehicleId}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                onChange={(value, option)=>{
                                    this.setState({
                                        vehicleId: value,
                                    })
                                }}
                            >
                                {
                                    vehicles.map(({id, make, model}, key)=>
                                        <Option value={id} key={key}>
                                            {make} {model}
                                        </Option>
                                    )
                                }
                            </Select>
                        </div>
                        <div style={{width: '50%'}}>
                            <span style={{fontWeight: 500}}>Кому</span>
                            <Select
                                showSearch
                                value={newOwnerId}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                                onChange={(value, option)=>{
                                    this.setState({
                                        newOwnerId: value,
                                    })
                                }}
                                onSearch={(input)=>{
                                    this.setState({
                                        searchValue: input,
                                    })
                                }}
                                onBlur={()=>{
                                    this.setState({
                                        searchValue: "",
                                    })
                                }}
                                filterOption={(input, option) => {
                                    const searchValue = String(option.props.children).toLowerCase().replace(/[+\-()., ]/g,'');
                                    const inputValue = input.toLowerCase();
                                    return searchValue.indexOf(inputValue) >= 0;
                                }}
                            >
                                {
                                    searchValue.length > 2 ?
                                        clients.map(({clientId, name, surname, phones}, key)=>
                                            <Option value={clientId} key={key}>
                                                {name} {surname} {phones[0]}
                                            </Option>
                                        ) :
                                        []
                                }
                            </Select>
                        </div>
                    </div>
                </Modal>
            </>
        )
    }
}