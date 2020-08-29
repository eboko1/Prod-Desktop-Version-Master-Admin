// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Button, Icon, Modal, Input, Checkbox } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';

// own
const Option = Select.Option;
const MAIN = 'MAIN',
      RESERVE = 'RESERVE';

class WarehousesPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            warehouses: [],
            isMain: false,
            isReserve: false,
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
            var isMain = false,
                isReserve = false;
            data.map((warehouse)=>{
                if(warehouse.attribute == MAIN) {
                    isMain = true;
                }
                if(warehouse.attribute == RESERVE) {
                    isReserve = true;
                }
            })
            that.setState({
                warehouses: data,
                isMain: isMain,
                isReserve: isReserve,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    deleteWarehouse(id) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/warehouses/${id}`;
        fetch(url, {
            method: 'DELETE',
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
            that.getWarehouses()
        })
        .catch(function (error) {
            console.log('error', error);
        });
    }

    componentDidMount() {
        this.getWarehouses()
    }


    render() {
        const { warehouses, isMain, isReserve, editMode, warehouse } = this.state;
        return (
            <Layout
                title={ <FormattedMessage id='navigation.warehouses' /> }
                controls={
                    <AddWarehousesModal
                        getWarehouses={this.getWarehouses} 
                        isMain={isMain}
                        isReserve={isReserve}

                        editMode={editMode}
                        warehouse={warehouse}
                        finishEdit={()=>{
                            this.setState({
                                editMode: false,
                                warehouse: undefined,
                            })
                        }}
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
                                width: 300,
                            }}
                        >
                            <span
                                style={{width: 400}}
                            >
                                {`${warehouse.name}${warehouse.attribute ? `(${warehouse.attribute})` : ""}`}
                                
                            </span>
                            <span
                                style={{width: 70}}
                            >
                                {
                                    warehouse.considerQuantity ? 
                                    <Icon type='check'/> :
                                    <Icon type='cross'/>
                                }
                            </span>
                            <span
                                style={{width: 70}}
                            >
                                <Icon
                                    type='edit'
                                    onClick={()=>{
                                        this.setState({
                                            editMode: true,
                                            warehouse: warehouse,
                                        })
                                    }}
                                />
                            </span>
                            <span
                                style={{width: 70}}
                            >
                                <Icon
                                    type='delete'
                                    onClick={()=>{
                                        this.deleteWarehouse(warehouse.id)
                                    }}
                                />
                            </span>
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
            attribute: undefined,
            considerQuantity: true,
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
                attribute: this.state.attribute || null,
                considerQuantity: this.state.considerQuantity,
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

    editWarehouse() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/warehouses/${this.props.warehouse.id}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify({
                name: this.state.name,
                attribute: this.state.attribute || null,
                considerQuantity: this.state.considerQuantity,
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
            that.props.getWarehouses()
        })
        .catch(function (error) {
            console.log('error', error);
        });
    }

    handleOk = () => {
        if(this.props.editMode) {
            this.editWarehouse();
        }
        else {
            this.postWarehouse();
        }
        this.handleCancel();
    }

    handleCancel = () => {
        this.setState({
            name: undefined,
            visible: false,
            attribute: undefined,
            considerQuantity: true,
        });
        this.props.finishEdit();
    }

    componentDidUpdate(prevProps) {
        console.log(prevProps.editMode, this.props.editMode)
        if(!prevProps.editMode && this.props.editMode) {
            const { warehouse } = this.props;
            this.setState({
                visible: true,
                name: warehouse.name,
                attribute: warehouse.attribute,
                considerQuantity: warehouse.considerQuantity,
            })
        }
    }


    render() {
        const { isMain, isReserve } = this.props;
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
                        style={{marginLeft: 8}}
                        value={this.state.name}
                        onChange={(event)=>{
                            this.setState({
                                name: event.target.value
                            })
                        }}
                    />
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 16,
                    }}
                >
                    <FormattedMessage id='storage.attribute'/>: 
                    <Select
                        style={{
                            marginLeft: 8,
                            display: 'block',
                            width: '100%',
                        }}
                        value={this.state.attribute}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                        onChange={(value)=>{
                            this.setState({
                                attribute: value
                            })
                        }}
                    >
                        <Option
                            value={MAIN}
                            disabled={isMain}
                        >
                            MAIN
                        </Option>
                        <Option
                            value={RESERVE}
                            disabled={isReserve}
                        >
                            RESERVE
                        </Option>
                    </Select>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 16,
                    }}
                >
                    <FormattedMessage id='storage.considerQuantity'/>: 
                    <Checkbox
                        style={{marginLeft: 8}}
                        checked={this.state.considerQuantity}
                        onChange={()=>{
                            this.setState({
                                considerQuantity: !this.state.considerQuantity,
                            })
                        }}
                    />
                </div>
            </Modal>
            </>
        );
    }
}