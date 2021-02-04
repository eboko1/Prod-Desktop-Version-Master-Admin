// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Select, Button, Icon, Modal, Input, Checkbox, Table, notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import { permissions, isForbidden } from 'utils';

// own
const Option = Select.Option;
const MAIN = 'MAIN',
      RESERVE = 'RESERVE',
      TOOL = 'TOOL',
      REPAIR_AREA= 'REPAIR_AREA';

const mapStateToProps = state => {
    return {
        user: state.auth,
    };
};

@connect(
    mapStateToProps,
    void 0,
)
class WarehousesPage extends Component {
    constructor(props) {
        super(props);
        this.state={
            warehouses: [],
            isMain: false,
            isReserve: false,
            isTool: false,
            isRepairArea: false,
            modalVisible: false,
        }

        this.getWarehouses = this.getWarehouses.bind(this);

        this.columns = [
            {
                title:     '№',
                key:       'key',
                dataIndex: 'key',
                width:     '5%',
                render:     (data, elem)=>{
                    return (
                        data+1
                    )
                }
            },
            {
                title:      <FormattedMessage id='storage'/>,
                key:       'name',
                dataIndex: 'name',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        data
                    )
                }
            },
            {
                title:     <FormattedMessage id='storage.attribute'/>,
                key:       'attribute',
                dataIndex: 'attribute',
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        data || <FormattedMessage id='long_dash' />
                    )
                }
            },
            {
                title:     <FormattedMessage id='storage.consider_quantity'/>,
                key:       'considerQuantity',
                dataIndex: 'considerQuantity',
                //sorter:    (a, b) => a.considerQuantity ? 1 : b.considerQuantity ? -1 : 0,
                width:     'auto',
                render:     (data, elem)=>{
                    return (
                        data ? 
                        <Icon type='check' style={{color: 'var(--green)'}}/> :
                        <Icon type='close' style={{color: 'var(--warning)'}}/>
                    )
                }
            },
            {
                key:       'edit',
                width:     '5%',
                render:     (elem)=>{
                    return (
                        <Icon
                            type='edit'
                            style={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK_CRUD) ? {
                                fontSize: 18,
                                color: 'var(--text2)',
                                pointerEvents: 'none',
                            } : {
                                fontSize: 18
                            }}
                            onClick={()=>{
                                if(!isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK_CRUD))
                                    this.setState({
                                        editMode: true,
                                        warehouse: elem,
                                    })
                            }}
                        />
                    )
                }
            },
            {
                key:       'delete',
                width:     '5%',
                render:     (elem)=>{
                    return (
                        <Icon
                            type='delete'
                            style={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK_CRUD) ? {
                                fontSize: 18,
                                color: 'var(--text2)',
                                pointerEvents: 'none',
                            } : {
                                fontSize: 18
                            }}
                            onClick={()=>{
                                if(!isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK_CRUD))
                                    this.deleteWarehouse(elem.id)
                            }}
                        />
                    )
                }
            },
        ]
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
            var isMain = false,
                isReserve = false,
                isTool = false,
                isRepairArea = false;
            data.map((warehouse, i)=>{
                warehouse.key = i;
                if(warehouse.attribute == MAIN) {
                    isMain = true;
                }
                if(warehouse.attribute == RESERVE) {
                    isReserve = true;
                }
                if(warehouse.attribute == TOOL) {
                    isTool = true;
                }
                if(warehouse.attribute == REPAIR_AREA) {
                    isRepairArea = true;
                }
            })
            that.setState({
                warehouses: data,
                isMain: isMain,
                isReserve: isReserve,
                isTool: isTool,
                isRepairArea: isRepairArea,
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
            notification.error({
                message: 'Этот склад нельзя удалить',
            });
        });
    }

    componentDidMount() {
        this.getWarehouses()
        if(this.props.location.state && this.props.location.state.showForm) {
            this.setState({
                modalVisible: true,
            })
        }
    }

    render() {
        const { warehouses, isMain, isReserve, isTool, isRepairArea, editMode, warehouse, modalVisible } = this.state;
        return (
            <Layout
                title={ <FormattedMessage id='navigation.warehouses' /> }
                controls={
                    <AddWarehousesModal
                        disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK_CRUD)}

                        getWarehouses={this.getWarehouses} 
                        isMain={isMain}
                        isReserve={isReserve}
                        isTool={isTool}
                        isRepairArea={isRepairArea}
                        modalVisible={modalVisible}

                        editMode={editMode}
                        warehouse={warehouse}
                        finishEdit={()=>{
                            this.setState({
                                editMode: false,
                                warehouse: undefined,
                            })
                        }}

                        unsetVisible={()=>{
                            this.setState({
                                modalVisible: false,
                            })
                        }}
                    />
                }
            >
                <Table
                    columns={this.columns}
                    dataSource={warehouses}
                    pagination={false}
                />
            </Layout>
        );
    }
}

export default WarehousesPage;

@injectIntl
class AddWarehousesModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            visible: false,
            name: undefined,
            attribute: null,
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
        const editData = {
            name: this.state.name,
            attribute: this.state.attribute,
            considerQuantity: this.state.considerQuantity,
        };

        if(!this.state.attribute) delete editData.attribute;


        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify(editData)
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
            attribute: null,
            considerQuantity: true,
        });
        this.props.finishEdit();
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.editMode && this.props.editMode) {
            const { warehouse } = this.props;
            this.setState({
                visible: true,
                name: warehouse.name,
                attribute: warehouse.attribute,
                considerQuantity: warehouse.considerQuantity,
            })
        } 
        if(this.props.modalVisible) {
            this.setState({
                visible: true,
            });
            this.props.unsetVisible();
        }
    }


    render() {
        const { isMain, isReserve, isTool, isRepairArea, editMode, intl: {formatMessage}, disabled } = this.props;
        return (
            <>
            <Button
                disabled={disabled}
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
                title={`${formatMessage({id: editMode ? 'edit' : 'add'})} ${formatMessage({id: 'storage'}).toLowerCase()}`}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                maskClosable={false}
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
                        disabled={
                            this.state.attribute == MAIN && isMain || 
                            this.state.attribute == RESERVE && isReserve ||
                            this.state.attribute == TOOL && isTool ||
                            this.state.attribute == REPAIR_AREA && isRepairArea
                        }
                        defaultActiveFirstOption
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                        onChange={(value)=>{
                            this.setState({
                                attribute: value
                            })
                        }}
                    >
                        <Option
                            value={null}
                        >
                            <FormattedMessage id='long_dash' />
                        </Option>
                        <Option
                            value={MAIN}
                            disabled={isMain && this.state.attribute != MAIN}
                        >
                            {MAIN}
                        </Option>
                        <Option
                            value={RESERVE}
                            disabled={isReserve && this.state.attribute != RESERVE}
                        >
                            {RESERVE}
                        </Option>
                        <Option
                            value={TOOL}
                            disabled={isTool && this.state.attribute != TOOL}
                        >
                            {TOOL}
                        </Option>
                        <Option
                            value={REPAIR_AREA}
                            disabled={isRepairArea&& this.state.attribute != REPAIR_AREA}
                        >
                            {REPAIR_AREA}
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
                    <FormattedMessage id='storage.consider_quantity'/>: 
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