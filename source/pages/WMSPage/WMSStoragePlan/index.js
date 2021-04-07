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
        }

        const code = {
            title: <FormattedMessage id="Код товара" />,
            key: 'code',
            dataIndex: 'code',
        }

        const brand = {
            title: <FormattedMessage id="Бренд" />,
            key: 'brandName',
            dataIndex: 'brandName',
        }

        const name = {
            title: <FormattedMessage id="Наименование" />,
            key: 'name',
            dataIndex: 'name',
        }

        const count = {
            title: <FormattedMessage id="count" />,
            key: 'sum',
            dataIndex: 'sum',
        }

        const fullness = {
            title: <FormattedMessage id="Заполненность" />,
            key: 'fullness',
            dataIndex: 'fullness',
        }

        const action = {
            key: 'action',
            dataIndex: 'address',
            render: (data, row)=>{
                return (
                    <Button
                        type='primary'
                        onClick={()=>{
                            this.setState({
                                selectedCell: data,
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
        const { dataSource, type, selectedCell } = this.state;
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
                <Table
                    size={'small'}
                    columns={
                        type == 'CELLS'
                            ? this.cellsColumns
                            : this.productsColumns
                    }
                    loading={!dataSource}
                    dataSource={dataSource || []}
                />
                <WMSCellsModal
                    warehouseId={warehouseId}
                    visible={Boolean(selectedCell)}
                    confirmAction={(address)=>{

                    }}
                    hideModal={()=>{
                        this.setState({selectedCell: undefined})
                    }}
                />
            </div>
        );
    }
}
