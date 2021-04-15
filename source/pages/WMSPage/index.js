// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from "react-intl";
import { Tabs, Input, InputNumber, Button, notification, Table, Select, Radio } from "antd";
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout, Catcher, Spinner } from 'commons';
import { DateRangePicker } from 'components';
import { permissions, isForbidden, fetchAPI } from "utils";
import book from 'routes/book';
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
           startDate: moment().startOf('year'), 
           endDate: moment(),
           movementFilter: undefined,
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
                render: (data, row) => {
                    return (
                        <Link
                            to={`${book.storageDocument}/${data}`}
                        >
                            {data}
                        </Link>
                    )
                }
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

    _fetchMovement = async (propAddress, propStoreProductId) => {
        await this.setState({
            address: propAddress,
            storeProductId: propStoreProductId,
        })
        const { warehouseId, startDate, endDate, address, storeProductId } = this.state;
        const movement = await fetchAPI('GET', 'wms/cells/movements', {
            warehouseId,
            address,
            storeProductId,
            fromDatetime: startDate.format('YYYY-MM-DD'),
            toDatetime: endDate.format('YYYY-MM-DD'),
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
        const { cells, activeKey, warehouseId, generateSettings, movement, startDate, endDate, address, storeProductId, movementFilter } = this.state;
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
                                movement: undefined,
                                address: undefined,
                                storeProductId: undefined,
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
                                <div
                                    style={{
                                        display: 'flex',
                                        marginBottom: 8
                                    }}
                                >
                                    <Input
                                        allowClear
                                        value={movementFilter}
                                        placeholder={this.props.intl.formatMessage({id: 'barcode.search'})}
                                        onChange={({target})=>{
                                            this.setState({
                                                movementFilter: target.value
                                            })
                                        }}
                                    />
                                    <DateRangePicker
                                        minimize
                                        dateRange={[startDate, endDate]}
                                        style={{margin: '0 0 0 8px'}}//prevent default space
                                        onDateChange={async ([startDate, endDate])=>{
                                            await this.setState({
                                                startDate,
                                                endDate,
                                            });
                                            this._fetchMovement(address, storeProductId);
                                        }}
                                    />
                                </div>
                                <Table
                                    size={'small'}
                                    columns={this.columns}
                                    dataSource={
                                        !movementFilter
                                            ? movement
                                            : movement.filter((elem)=>
                                                String(elem.address).toLocaleLowerCase().includes(String(movementFilter).toLocaleLowerCase()) ||
                                                String(elem.code).toLocaleLowerCase().includes(String(movementFilter).toLocaleLowerCase()) ||
                                                String(elem.brandName).toLocaleLowerCase().includes(String(movementFilter).toLocaleLowerCase()) ||
                                                String(elem.name).toLocaleLowerCase().includes(String(movementFilter).toLocaleLowerCase())
                                            )
                                    }
                                />
                            </TabPane>
                        }
                    </Tabs>
                </Catcher>
            </Layout>
        );
    }
}
