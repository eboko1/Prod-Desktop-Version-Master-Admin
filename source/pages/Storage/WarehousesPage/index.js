// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Dropdown, Button, Icon, Menu, Modal, Input, Checkbox } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';

// own

class WarehousesPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            warehouses: [],
        }

        this.getWarehouses = this.getWarehouses.bind(this);
    }

    getWarehouses() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/warehouses';
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
            console.log(data);
            that.setState({
                warehouses: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidMount() {
        this.getWarehouses()
    }


    render() {
        const { warehouses } = this.state;
        return (
            <Layout
                title={ <FormattedMessage id='navigation.warehouses' /> }
                controls={
                    <AddWarehousesModal
                        getWarehouses={this.getWarehouses}        
                    />
                }
            >
                {warehouses.map((warehouse, key)=>{
                    return(
                        <div
                            key={key}
                            style={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <span>{warehouse.name}</span>
                            <Icon type='edit'/>
                            <Icon type='delete'/>
                        </div>
                    )
                })}
            </Layout>
        );
    }
}

export default WarehousesPage;

class AddWarehousesModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            name: undefined,
        }
    }

    postWarehouse() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/warehouses';
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify({
                name: this.state.name,
                attribute: null,
            })
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
            that.props.getWarehouses();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    handleOk = () => {
        this.postWarehouse();
        this.handleCancel();
    }

    handleCancel = () => {
        this.setState({
            name: undefined,
            visible: false,
        })
    }


    render() {
        return (
            <>
            <Button
                type="primary"
                onClick={()=>{
                    this.setState({
                        visible: true
                    })
                }}
            >
                <FormattedMessage id='add' />
            </Button>
            <Modal
                visible={this.state.visible}
                title={<FormattedMessage id='storage.add_warehouse'/>}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <FormattedMessage id='storage.name'/>: 
                    <Input
                        value={this.state.name}
                        onChange={(event)=>{
                            this.setState({
                                name: event.target.value
                            })
                        }}
                    />
                </div>
            </Modal>
            </>
        );
    }
}