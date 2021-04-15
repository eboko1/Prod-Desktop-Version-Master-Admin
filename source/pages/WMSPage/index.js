// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Tabs, Input, InputNumber, Button, notification, Table, Select, Radio } from "antd";
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout, Catcher, Spinner } from 'commons';
import { TrackingTable, WarehouseSelect, DateRangePicker } from 'components';
import { permissions, isForbidden, fetchAPI } from "utils";
import { StoreProductForm } from 'forms';
import { fetchSuppliers } from "core/suppliers/duck";
import { fetchWarehouses } from 'core/warehouses/duck';
import { fetchPriceGroups, selectPriceGroups } from 'core/storage/priceGroups';

// own
import WMSAddressSettings from './WMSAddressSettings';
import WMSGenerateCells from './WMSGenerateCells';
import WMSStoragePlan from './WMSStoragePlan';
import Styles from "./styles.m.css";
const { TabPane } = Tabs;
const Option = Select.Option;

const mapStateToProps = state => ({
    suppliers: state.suppliers.suppliers,
    warehouses: state.warehouses.warehouses,
    user: state.auth,
});

const mapDispatchToProps = {
    fetchSuppliers,
    fetchWarehouses,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class WMSPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
           cells: [],
           generateSettings: [],
           activeKey: 'plan',
           warehouseId: undefined,
        };

        this.columns = [
            {
                title: <FormattedMessage id="Дата" />,
                key: 'datetime',
                dataIndex: 'datetime',
                sorter: (a, b) => moment(a.datetime).format('DD/MM/YYYY').localeCompare(moment(b.datetime).format('DD/MM/YYYY')),
                render: (data, row) => {
                    return (
                        moment(data).format('DD/MM/YYYY')
                    )
                }
            },
            {
                title: <FormattedMessage id="Ячейка" />,
                key: 'address',
                dataIndex: 'address',
                sorter: (a, b) => String(a.address).localeCompare(String(b.address)),
            },
            {
                title: <FormattedMessage id="Код товара" />,
                key: 'code',
                dataIndex: 'code',
                sorter: (a, b) => String(a.code).localeCompare(String(b.code)),
            },
            {
                title: <FormattedMessage id="Бренд" />,
                key: 'brandName',
                dataIndex: 'brandName',
                sorter: (a, b) => String(a.brandName).localeCompare(String(b.brandName)),
            },
            {
                title: <FormattedMessage id="Наименование" />,
                key: 'name',
                dataIndex: 'name',
                sorter: (a, b) => String(a.name).localeCompare(String(b.name)),
            },
            {
                title: <FormattedMessage id="count" />,
                key: 'count',
                dataIndex: 'count',
                sorter: (a, b) => a.count - b.count,
            },
            {
                title: <FormattedMessage id="Номер документа" />,
                key: 'storeDocId',
                dataIndex: 'storeDocId',
            }
        ]
    }

    _fetchCells = async () => {
        const { warehouseId } = this.state;
        await this.setState({
            cells: undefined,
        })
        const cells = await fetchAPI('GET', `wms/cells`, {warehouseId});
        const generateSettings = await fetchAPI('GET', `wms/address_options`, {warehouseId})
        if(cells.stats.count == 0) {
            this.state.activeKey = 'generate';
        }
        await this.setState({
            cells: cells.list,
            generateSettings,
        })
    }

    _fetchMovement = async (address, storeProductId) => {
        const { warehouseId } = this.state;
        const movement = await fetchAPI('GET', 'wms/cells/movements', {
            warehouseId,
            address,
            storeProductId,
        });
        this.setState({
            activeKey: 'movement',
            movement: movement.list,
        })
    }

    componentDidMount() {
        this.props.fetchWarehouses();
    }

    componentDidUpdate = async (prevProps) => {
        if(this.props.warehouses.length && !prevProps.warehouses.length) {
            await this.setState({
                warehouseId: this.props.warehouses[0].id
            });
            this._fetchCells();
        }
    }

    render() {
        const { user, warehouses, intl: {formatMessage} } = this.props;
        const { cells, activeKey, warehouseId, generateSettings, movement } = this.state;
        return !cells ? (
            <Spinner spin={ true }/>
        ) : (
            <Layout
                title={<FormattedMessage id='navigation.wms'/>}
                controls={
                    <Select
                        allowClear
                        showSearch
                        autoFocus
                        value={warehouseId}
                        style={{
                            width: 240
                        }}
                        placeholder={formatMessage({id: 'storage'})}
                        onChange={async (warehouseId)=>{
                            await this.setState({warehouseId});
                            if(warehouseId) {
                                this._fetchCells();
                            } else {
                                this.setState({
                                    cells: [],
                                    activeKey: 'generate'
                                })
                            }
                        }}
                    >
                        {warehouses.map(({id, name})=>
                            <Option value={id} key={id}>
                                {name}
                            </Option>
                        )}
                    </Select>
                }
            >
                <Catcher>
                    <Tabs
                        tabPosition={'right'}
                        type='card'
                        activeKey={activeKey}
                        onChange={(activeKey)=>{
                            this.setState({
                                activeKey,
                                movement: undefined
                            })
                        }}
                    >
                        <TabPane
                            tab={<FormattedMessage id="План склада"/>}
                            key="plan"
                            disabled={!cells.length}
                        >
                            {warehouseId &&
                                <WMSStoragePlan
                                    cells={cells}
                                    fetchCells={this._fetchCells}
                                    fetchMovement={this._fetchMovement}
                                    warehouseId={warehouseId}
                                />
                            }
                        </TabPane>
                        <TabPane
                            tab={<FormattedMessage id="Настройки ячеек"/>}
                            key="settings"
                            disabled={!cells.length}
                        >
                            <WMSAddressSettings
                                cells={cells}
                                fetchCells={this._fetchCells}
                                warehouseId={warehouseId}
                            />
                        </TabPane>
                        <TabPane
                            tab={<FormattedMessage id="Сгенерировать WMS"/>}
                            key="generate"
                        >
                            <WMSGenerateCells
                                warehouseId={warehouseId}
                                generateSettings={generateSettings}
                                fetchCells={this._fetchCells}
                            />
                        </TabPane>
                        {movement && 
                            <TabPane
                                tab={<FormattedMessage id="Движение"/>}
                                key="movement"
                            >
                                <Table
                                    size={'small'}
                                    columns={this.columns}
                                    dataSource={movement}
                                />
                            </TabPane>
                        }
                    </Tabs>
                </Catcher>
            </Layout>
        );
    }
}
