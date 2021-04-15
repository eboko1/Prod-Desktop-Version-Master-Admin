// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Switch, Input, Button, notification, Select, Table, InputNumber, Dropdown, Icon, Menu } from "antd";
import _ from 'lodash';
import moment from 'moment';
import { type } from "ramda";

// proj
import { permissions, isForbidden, fetchAPI } from "utils";
import { WMSCellsModal } from 'modals';

// own
import Styles from "./styles.m.css";
const Option = Select.Option;

@injectIntl
export default class WMSStoragePlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: undefined,
            type: 'CELLS',
            selectedCell: undefined,
        };

        const cell = {
            title: <FormattedMessage id="Ячейка" />,
            key: 'address',
            dataIndex: 'address',
            sorter: (a, b) => String(a.address).localeCompare(String(b.address)),
            render: (data, row) => {
                return (
                    <div
                        style={{
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }}
                        onClick={()=>{
                            this.props.fetchMovement(data)
                        }}
                    >
                        {data}
                    </div>
                )
            }
        }

        const code = {
            title: <FormattedMessage id="Код товара" />,
            key: 'code',
            dataIndex: 'code',
            sorter: (a, b) => String(a.code).localeCompare(String(b.code)),
            render: (data, row) => {
                return (
                    <div
                        style={{
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }}
                        onClick={()=>{
                            this.props.fetchMovement(undefined, row.id)
                        }}
                    >
                        {data}
                    </div>
                )
            }
        }

        const brand = {
            title: <FormattedMessage id="Бренд" />,
            key: 'brandName',
            dataIndex: 'brandName',
            sorter: (a, b) => String(a.brandName).localeCompare(String(b.brandName)),
        }

        const name = {
            title: <FormattedMessage id="Наименование" />,
            key: 'name',
            dataIndex: 'name',
            sorter: (a, b) => String(a.name).localeCompare(String(b.name)),
        }

        const count = {
            title: <FormattedMessage id="count" />,
            key: 'sum',
            dataIndex: 'sum',
            sorter: (a, b) => a.sum - b.sum,
        }

        const fullness = {
            title: <FormattedMessage id="Заполненность" />,
            key: 'fullness',
            dataIndex: 'fullness',
            sorter: (a, b) => a.fullness - b.fullness,
        }

        const action = {
            key: 'action',
            render: (row)=>{
                return (
                    <Button
                        type='primary'
                        onClick={()=>{
                            this.setState({
                                selectedCell: row,
                            })
                        }}
                    >
                        <FormattedMessage id='Переместить'/>
                    </Button>
                )
            }
        }

        this.cellsColumns = [
            cell,
            code,
            brand,
            name,
            count,
            fullness,
            action
        ]

        this.productsColumns = [
            code,
            brand,
            cell,
            name,
            count,
            fullness,
            action
        ]
    }

    _fetchData = async (type) => {
        const { warehouseId } = this.props;
        const payload = await fetchAPI(
            'GET',
            'wms/cells/statuses',
            { 
                warehouseId,
                orderBy: type == 'PRODUCTS' ? 'STORE_PRODUCT' : undefined 
            }
        );
        payload.list.map((elem, key)=>{
            payload.list[key] = {
                ...elem,
                ...elem.storeProduct,
                ...elem.wmsCellOptions,
                brandName: elem.brand.name,
            }
        })
        this.setState({
            dataSource: payload.list,
            type,
        })
    }

    componentDidMount() {
        this._fetchData('CELLS');
    }

    componentDidUpdate(prevProps) {

    }

    render() {
        const { warehouseId } = this.props;
        const { dataSource, type, selectedCell, tableFilter } = this.state;
        let tableData = dataSource ? [...dataSource] : [];
        if(tableFilter) {
            tableData = tableData.filter((elem)=>
                String(elem.address).includes(String(tableFilter)) ||
                String(elem.brandName).toLocaleLowerCase().includes(String(tableFilter).toLocaleLowerCase()) ||
                String(elem.code).includes(String(tableFilter)) ||
                String(elem.name).toLocaleLowerCase().includes(String(tableFilter).toLocaleLowerCase()) 
            );
        }
        const menu = (
            <Menu>
                {type != 'CELLS' &&
                    <Menu.Item>
                        <div onClick={()=>this._fetchData('CELLS')}>
                            <FormattedMessage id='План склада по ячейкам' />
                        </div>
                    </Menu.Item>
                }
                {type != 'PRODUCTS' &&
                    <Menu.Item>
                        <div onClick={()=>this._fetchData('PRODUCTS')}>
                            <FormattedMessage id='План склада по товарам' />
                        </div>
                    </Menu.Item>
                }
            </Menu>
        );

        return (
            <div>
                <div className={Styles.tabTitle}>
                    <FormattedMessage
                        id={ 
                            type == 'CELLS'
                                ? 'План склада по ячейкам'
                                : 'План склада по товарам'
                        } 
                    />
                    <Dropdown overlay={menu}>
                        <Icon type='menu' className={Styles.menuIcon}/>
                    </Dropdown>
                </div>
                <Input
                    allowClear
                    value={tableFilter}
                    placeholder={this.props.intl.formatMessage({id: 'barcode.search'})}
                    style={{
                        marginBottom: 8
                    }}
                    onChange={({target})=>{
                        this.setState({
                            tableFilter: target.value
                        })
                    }}
                />
                <Table
                    size={'small'}
                    columns={
                        type == 'CELLS'
                            ? this.cellsColumns
                            : this.productsColumns
                    }
                    loading={!dataSource}
                    dataSource={tableData}
                />
                <WMSCellsModal
                    warehouseId={warehouseId}
                    visible={Boolean(selectedCell)}
                    selectedCell={selectedCell}
                    confirmAction={async (address, modalWarehouseId, count)=>{
                        await fetchAPI('POST', 'wms/cells/products', null, [
                            {
                                warehouseId: modalWarehouseId,
                                storeProductId: selectedCell.id,
                                address,
                                count,
                            }
                        ])
                        await fetchAPI('DELETE', 'wms/cells/products', null, [
                            {
                                warehouseId: warehouseId,
                                storeProductId: selectedCell.id,
                                address: selectedCell.address,
                                count,
                            }
                        ])
                        await this._fetchData(type);
                    }}
                    hideModal={()=>{
                        this.setState({
                            selectedCell: undefined,
                        })
                    }}
                />
            </div>
        );
    }
}
