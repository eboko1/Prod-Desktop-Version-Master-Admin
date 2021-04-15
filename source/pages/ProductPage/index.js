// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Tabs, Input, InputNumber, Button, notification, Checkbox, Select, Radio, Table } from "antd";
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout, Catcher, Spinner } from 'commons';
import { TrackingTable, WarehouseSelect, DateRangePicker } from 'components';
import { WMSCellsModal } from 'modals';
import { permissions, isForbidden, fetchAPI } from "utils";
import { StoreProductForm } from 'forms';
import { fetchSuppliers } from "core/suppliers/duck";
import { fetchWarehouses } from 'core/warehouses/duck';
import { fetchPriceGroups, selectPriceGroups } from 'core/storage/priceGroups';

// own
import Styles from "./styles.m.css";
const { TabPane } = Tabs;
const Option = Select.Option;

const mapStateToProps = state => ({
    suppliers: state.suppliers.suppliers,
    warehouses: state.warehouses.warehouses,
    priceGroups: selectPriceGroups(state),
    user: state.auth,
});

const mapDispatchToProps = {
    fetchSuppliers,
    fetchWarehouses,
    fetchPriceGroups,
};

@injectIntl
@connect(
    mapStateToProps,
    mapDispatchToProps,
)
export default class ProductPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product: undefined,
            movementData: [],
            activeKey: 'general',
            warehouseId: undefined,
            startDate: moment().startOf('year'),
            endDate: moment(),
            cells: [],
            productCells: [],
            selectedCell: undefined,
        };
        this.cellTabColumns = [
            {
                title: <FormattedMessage id="navigation.storage" />,
                key: 'warehouse',
                dataIndex: 'warehouse',
                render: (data, row)=>{
                    return (
                        data.name
                    )
                }
            },
            {
                title: <FormattedMessage id="Ячейка" />,
                key: 'address',
                dataIndex: 'wmsCellOptions',
                render: (data, row)=>{
                    return (
                        data.address
                    )
                }
            },
            {
                title: <FormattedMessage id="count" />,
                key: 'sum',
                dataIndex: 'sum',
            },
            {
                title: <FormattedMessage id="Заполненность" />,
                key: 'fullness',
                dataIndex: 'fullness',
            },
            {
                key: 'action',
                dataIndex: 'address',
                render: (data, row)=>{
                    return (
                        <Button
                            type='primary'
                            onClick={()=>{
                                this.setState({
                                    selectedCell: row,
                                });
                            }}
                        >
                            <FormattedMessage id='Переместить'/>
                        </Button>
                    )
                }
            }
        ]
    }

    _fetchProductMovement = async () => {
        const { id } = this.props;
        const { warehouseId, startDate, endDate } = this.state;
        const productMovement = await fetchAPI(
            'GET',
            `store_doc_products`,
            {
                productId: id, 
                warehouseId,
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD'),
            }
        );
        this.setState({
            movementData: productMovement.list
        })
    }

    _fetchProductCells = async () => {
        const { id } = this.props;
        const productCells = await fetchAPI(
            'GET',
            `wms/cells/statuses`,
            {
                storeProductId: id,
            }
        );
        this.setState({
            productCells: productCells.list
        })
    }

    _fetchProduct = async () => {
        this.setState({
            product: undefined,
        })
        const { id } = this.props;
        const product = await fetchAPI('GET', `store_products/${id}`);
        product.saveOnStock = Boolean(product.saveOnStock);
        product.multiplicity = product.multiplicity || 1;
        product.min = product.min || 1;
        product.max = product.max || 1;
        this.setState({
            product,
        });
    }

    _updateProduct = async () => {
        const { product } = this.state;
        
        await fetchAPI(
            'PUT',
            `store_products/${product.id}`,
            null,
            _.pick(
                product,
                [
                    'multiplicity',
                    'min',
                    'max',
                    'saveOnStock',
                    'defaultBusinessSupplierId',
                    'defaultWarehouseId',
                    'fixedSellingPrice',
                    'minSellingPrice',
                    'fixedPurchasePrice',
                    'getSellingPriceFrom',
                    'getPurchasePriceFrom',
                    'priceGroupNumber',
                    'width',
                    'height',
                    'depth',
                    'weight',
                    'cellAddresses'
                ]
                ),
            {
                handleErrorInternally: true,
            },
        );
        this._fetchProduct();
    }

    _fetchWMSCells = async () => {
        const { product } = this.state;
        if(product.defaultWarehouseId) {
            const cells = await fetchAPI('GET', `wms/cells`, {warehouseId: product.defaultWarehouseId});
            
            this.setState({
                cells: cells.list,
            });
        }
    }

    componentDidMount = async () => {
        this.props.fetchWarehouses();
        this.props.fetchSuppliers();
        this.props.fetchPriceGroups();
        await this._fetchProduct();
        this._fetchProductMovement();
        this._fetchProductCells();
        this._fetchWMSCells();
    }

    componentDidUpdate(prevProps) {

    }

    render() {
        const { intl: { formatMessage }, user, id, warehouses, suppliers, priceGroups } = this.props;
        const { product, activeKey, movementData, startDate, endDate, cells, productCells, selectedCell } = this.state;
        return !product ? (
            <Spinner spin={ true }/>
        ) : (
            <Layout
                title={`${formatMessage({id: 'navigation.product'})} ${product.code}`}
                description={product.name}
            >
                <Catcher>
                    <Tabs
                        tabPosition={'right'}
                        type='card'
                        activeKey={activeKey}
                        onChange={(key)=>{
                            this.setState({
                                activeKey: key
                            })
                        }}
                    >
                        <TabPane
                            tab={
                                <FormattedMessage
                                    id={"client_container.general_info"}
                                />
                            }
                            key="general"
                        >
                            <div className={Styles.generalInfoTab}>
                                <StoreProductForm
                                    editing={ true }
                                    modalProps={ { 
                                        id: product.id,
                                        onSubmit: this._fetchProduct,
                                    } }
                                />
                            </div>
                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage
                                    id={"prices"}
                                />
                            }
                            key="price"
                        >
                            <div className={Styles.pricesTab}>
                                <div className={Styles.pricesBlock}>
                                    <div className={Styles.pricesBlockRow}>
                                        <span className={Styles.pricesFieldLabel}>
                                            <FormattedMessage id='product.sale_price'/>
                                        </span>
                                        <div className={Styles.pricesFieldDoubleRow}>
                                            <div className={Styles.pricesFirstRow}>
                                                <InputNumber
                                                    className={Styles.pricesFieldElement}
                                                    value={product.sellingPrice || 0}
                                                    disabled
                                                    style={{color: 'var(--text)'}}
                                                    precision={2}
                                                />
                                                <span className={Styles.pricesFieldCur}>
                                                    <FormattedMessage id='cur'/>
                                                </span>
                                            </div>
                                            <div className={Styles.pricesMarkupMargeWrap}>
                                                <div className={Styles.pricesMarkupMarge} style={{marginRight: 8}}>
                                                    <span className={Styles.pricesFieldLabel}>
                                                        <FormattedMessage id='product.markup'/>
                                                    </span>
                                                    <InputNumber
                                                        value={product.markup || 0}
                                                        disabled
                                                        style={{color: 'var(--text)'}}
                                                        formatter={(value)=>value + '%'}
                                                        precision={2}
                                                    />
                                                </div>
                                                <div className={Styles.pricesMarkupMarge}>
                                                    <span className={Styles.pricesFieldLabel}>
                                                        <FormattedMessage id='product.marge'/>
                                                    </span>
                                                    <InputNumber
                                                        value={product.margin || 0}
                                                        disabled
                                                        style={{color: 'var(--text)'}}
                                                        formatter={(value)=>value + '%'}
                                                        precision={2}
                                                    />
                                                    <span className={Styles.pricesFieldCurHidden}>
                                                        <FormattedMessage id='cur'/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={Styles.pricesBlockRow}>
                                        <span className={Styles.pricesFieldLabel}>
                                            <FormattedMessage id='product.markup-price_group'/>
                                        </span>
                                        <div className={Styles.pricesField}>
                                            <Select
                                                className={Styles.pricesFieldElement}
                                                value={product.priceGroupNumber}
                                                onChange={(value)=>{
                                                    product.priceGroupNumber = value;
                                                    this.setState({});
                                                }}
                                            >
                                                {priceGroups.map(({number, multiplier})=>{
                                                    return (
                                                        <Option value={number} key={number}>
                                                            {`${formatMessage({id: 'storage.price_group'})} ${number}, ${formatMessage({id: 'product.markup'})} ${multiplier}`}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                            <span className={Styles.pricesFieldCurHidden}>
                                                <FormattedMessage id='cur'/>
                                            </span>
                                            <Radio
                                                className={Styles.pricesRadio}
                                                checked={product.getSellingPriceFrom == 'PRICE_GROUP'}
                                                onChange={()=>{
                                                    product.getSellingPriceFrom = 'PRICE_GROUP';
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={Styles.pricesBlockRow}>
                                        <span className={Styles.pricesFieldLabel}>
                                            <FormattedMessage id='product.fixed_sale_price'/>
                                        </span>
                                        <div className={Styles.pricesField}>
                                            <InputNumber
                                                className={Styles.pricesFieldElement}
                                                value={product.fixedSellingPrice || 0}
                                                precision={2}
                                                onChange={(value)=>{
                                                    product.fixedSellingPrice = value;
                                                    this.setState({});
                                                }}
                                            />
                                            <span className={Styles.pricesFieldCur}>
                                                <FormattedMessage id='cur'/>
                                            </span>
                                            <Radio
                                                className={Styles.pricesRadio}
                                                checked={product.getSellingPriceFrom == 'FIXED'}
                                                onChange={()=>{
                                                    product.getSellingPriceFrom = 'FIXED';
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={Styles.pricesBlock}>
                                    <div className={Styles.pricesBlockRow}>
                                        <span className={Styles.pricesFieldLabel}>
                                            <FormattedMessage id='product.purchase_price'/>
                                        </span>
                                        <div className={Styles.pricesField}>
                                            <InputNumber
                                                className={Styles.pricesFieldElement}
                                                value={product.purchasePrice || 0}
                                                disabled
                                                style={{color: 'var(--text)'}}
                                                precision={2}
                                            />
                                            <span className={Styles.pricesFieldCur}>
                                                <FormattedMessage id='cur'/>
                                            </span>
                                        </div>
                                    </div>
                                    <div className={Styles.pricesBlockRow}>
                                        <span className={Styles.pricesFieldLabel}>
                                            <FormattedMessage id='product.last_purchase_price'/>
                                        </span>
                                        <div className={Styles.pricesField}>
                                            <InputNumber
                                                className={Styles.pricesFieldElement}
                                                value={product.lastPurchasePrice || 0}
                                                disabled
                                                style={{color: 'var(--text)'}}
                                                precision={2}
                                            />
                                            <span className={Styles.pricesFieldCur}>
                                                <FormattedMessage id='cur'/>
                                            </span>
                                            <Radio
                                                className={Styles.pricesRadio}
                                                checked={product.getPurchasePriceFrom == 'LAST_INCOME'}
                                                onChange={()=>{
                                                    product.getPurchasePriceFrom = 'LAST_INCOME';
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={Styles.pricesBlockRow}>
                                        <span className={Styles.pricesFieldLabel}>
                                            <FormattedMessage id='product.fixed_purchase_price'/>
                                        </span>
                                        <div className={Styles.pricesField}>
                                            <InputNumber
                                                className={Styles.pricesFieldElement}
                                                value={product.fixedPurchasePrice || 0}
                                                precision={2}
                                                onChange={(value)=>{
                                                    product.fixedPurchasePrice = value;
                                                    this.setState({});
                                                }}
                                            />
                                            <span className={Styles.pricesFieldCur}>
                                                <FormattedMessage id='cur'/>
                                            </span>
                                            <Radio
                                                className={Styles.pricesRadio}
                                                checked={product.getPurchasePriceFrom == 'FIXED'}
                                                onChange={()=>{
                                                    product.getPurchasePriceFrom = 'FIXED';
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={Styles.pricesBlock}>
                                    <div className={Styles.pricesBlockRow}>
                                        <span className={Styles.pricesFieldLabel}>
                                            <FormattedMessage id='product.minimal_sale_price'/>
                                        </span>
                                        <div className={Styles.pricesFieldDoubleRow}>
                                            <div className={Styles.pricesFirstRow}>
                                                <InputNumber
                                                    className={Styles.pricesFieldElement}
                                                    value={product.minSellingPrice || 0}
                                                    precision={2}
                                                    onChange={(value)=>{
                                                        product.minSellingPrice = value;
                                                        this.setState({});
                                                    }}
                                                />
                                                <span className={Styles.pricesFieldCur}>
                                                    <FormattedMessage id='cur'/>
                                                </span>
                                            </div>
                                            <div className={Styles.pricesMarkupMargeWrap}>
                                                <div className={Styles.pricesMarkupMarge} style={{marginRight: 8}}>
                                                    <span className={Styles.pricesFieldLabel}>
                                                        <FormattedMessage id='product.markup'/>
                                                    </span>
                                                    <InputNumber
                                                        value={product.minMarkup || 0}
                                                        disabled
                                                        style={{color: 'var(--text)'}}
                                                        formatter={(value)=>value + '%'}
                                                        precision={2}
                                                    />
                                                </div>
                                                <div className={Styles.pricesMarkupMarge}>
                                                    <span className={Styles.pricesFieldLabel}>
                                                        <FormattedMessage id='product.marge'/>
                                                    </span>
                                                    <InputNumber
                                                        value={product.minMargin || 0}
                                                        disabled
                                                        style={{color: 'var(--text)'}}
                                                        formatter={(value)=>value + '%'}
                                                        precision={2}
                                                    />
                                                    <span className={Styles.pricesFieldCurHidden}>
                                                        <FormattedMessage id='cur'/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={Styles.saveButtonWrap}>
                                    <Button
                                        type='primary'
                                        onClick={this._updateProduct}
                                    >
                                        <FormattedMessage id='save'/>
                                    </Button>
                                    <span className={Styles.pricesFieldCurHidden}>
                                        <FormattedMessage id='cur'/>
                                    </span>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage
                                    id={"navigation.storage"}
                                />
                            }
                            key="storage"
                        >
                            <div className={Styles.storeTab}>
                                <div className={Styles.storeTabRow}>
                                    <span className={Styles.storeFieldLabel}>
                                        <FormattedMessage id='storage.default_supplier'/>
                                    </span>
                                    <Select
                                        className={Styles.storeField}
                                        value={product.defaultBusinessSupplierId || undefined}
                                        placeholder={formatMessage({id: 'storage.default_supplier'})}
                                        showSearch
                                        optionFilterProp={'children'}
                                        onChange={async (value)=>{
                                            product.defaultBusinessSupplierId = value;
                                            this.setState({});
                                        }}
                                    >
                                        {suppliers.map((elem, i)=>
                                            <Option key={i} value={elem.id}>
                                                {elem.name}
                                            </Option>
                                        )}
                                    </Select>
                                </div>
                                <div className={Styles.storeTabRow}>
                                    <span className={Styles.storeFieldLabel}>
                                        <FormattedMessage id='storage.default_warehouse'/>
                                    </span>
                                    <Select
                                        className={Styles.storeField}
                                        value={product.defaultWarehouseId || undefined}
                                        placeholder={formatMessage({id: 'storage.default_warehouse'})}
                                        showSearch
                                        optionFilterProp={'children'}
                                        onChange={async (value)=>{
                                            product.defaultWarehouseId = value;
                                            await this.setState({});
                                            this._fetchWMSCells();
                                        }}
                                    >
                                        {warehouses.map((elem, i)=>
                                            <Option key={i} value={elem.id}>
                                                {elem.name}
                                            </Option>
                                        )}
                                    </Select>
                                </div>
                                <div className={Styles.storeTabRow}>
                                    <span className={Styles.storeFieldLabel}>
                                        <FormattedMessage id='Ячейка по умолчанию'/>
                                    </span>
                                    <Select
                                        className={Styles.storeField}
                                        value={product.cellAddresses ? product.cellAddresses[0] : undefined}
                                        placeholder={formatMessage({id: 'Ячейка по умолчанию'})}
                                        showSearch
                                        disabled={!product.defaultWarehouseId}
                                        optionFilterProp={'children'}
                                        onChange={(value)=>{
                                            product.cellAddresses = [value];
                                            this.setState({});
                                        }}
                                    >
                                        {cells.map((elem, i)=>
                                            <Option key={i} value={elem.address}>
                                                {elem.address}
                                            </Option>
                                        )}
                                    </Select>
                                </div>
                                <div className={Styles.storeTabRow}>
                                    <span className={Styles.storeFieldLabel}>
                                        <FormattedMessage id='storage_document.store_in_warehouse'/>
                                    </span>
                                    <Checkbox
                                        style={{marginLeft: 5}}
                                        checked={product.saveOnStock}
                                        onChange={()=>{
                                            product.saveOnStock = !product.saveOnStock;
                                            this.setState({});
                                        }}
                                    />
                                </div>
                                {product.saveOnStock &&
                                    <div className={Styles.storeTabRow}>
                                        <div>
                                            <span className={Styles.storeFieldLabel}>
                                                <FormattedMessage id='storage_document.multiplicity'/>
                                            </span>
                                            <InputNumber
                                                value={product.multiplicity}
                                                step={1}
                                                min={1}
                                                onChange={(value)=>{
                                                    product.multiplicity = value;
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span className={Styles.storeFieldLabel}>
                                                <FormattedMessage id='storage.min'/>
                                            </span>
                                            <InputNumber
                                                value={product.min*product.multiplicity}
                                                precision={0}
                                                step={product.multiplicity}
                                                min={0}
                                                onChange={(value)=>{
                                                    product.min = Math.floor(value/product.multiplicity);
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span className={Styles.storeFieldLabel}>
                                                <FormattedMessage id='storage.max'/>
                                            </span>
                                            <InputNumber
                                                value={product.max*product.multiplicity}
                                                precision={0}
                                                step={product.multiplicity}
                                                min={product.min*product.multiplicity }
                                                onChange={(value)=>{
                                                    product.max = Math.floor(value/product.multiplicity);
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                    </div>
                                }
                                <div className={Styles.storeTabRow}>
                                        <div>
                                            <div>
                                                <FormattedMessage id='Ширина (см)'/>
                                            </div>
                                            <InputNumber
                                                value={product.width}
                                                min={0}
                                                onChange={(value)=>{
                                                    product.width = value;
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div>
                                                <FormattedMessage id='Высота (см)'/>
                                            </div>
                                            <InputNumber
                                                value={product.height}
                                                min={0}
                                                onChange={(value)=>{
                                                    product.height = value;
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div>
                                                <FormattedMessage id='Глубина (см)'/>
                                            </div>
                                            <InputNumber
                                                value={product.depth}
                                                min={0}
                                                onChange={(value)=>{
                                                    product.depth = value;
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div>
                                                <FormattedMessage id='Вес (кг)'/>
                                            </div>
                                            <InputNumber
                                                value={product.weight}
                                                min={0}
                                                onChange={(value)=>{
                                                    product.weight = value;
                                                    this.setState({});
                                                }}
                                            />
                                        </div>
                                </div>
                                <div className={Styles.saveButtonWrap}>
                                    <Button
                                        type='primary'
                                        onClick={this._updateProduct}
                                    >
                                        <FormattedMessage id='save'/>
                                    </Button>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage
                                    id={"storage.movement"}
                                />
                            }
                            key="movement"
                        >
                            <div className={Styles.movementFilters}>
                                <WarehouseSelect
                                    onChange={async (warehouseId)=>{
                                        await this.setState({warehouseId});
                                        this._fetchProductMovement();
                                    }}
                                    style={{
                                        width: 240
                                    }}
                                />
                                <DateRangePicker
                                    minimize
                                    dateRange={[ startDate, endDate ]}
                                    onDateChange={async (daterange) => {
                                        const [ startDate, endDate ] = daterange;
                                        await this.setState({
                                            startDate,
                                            endDate,
                                        });
                                        this._fetchProductMovement();
                                    } }
                                />
                            </div>
                            <TrackingTable
                                rawData
                                hideCode
                                dataSource={movementData}
                            />
                        </TabPane>
                        <TabPane
                            tab={
                                <FormattedMessage
                                    id={"Ячейки"}
                                />
                            }
                            key="cell"
                        >
                            <div className={Styles.cellsTab}>
                                <Table
                                    size={'small'}
                                    columns={this.cellTabColumns}
                                    dataSource={productCells}
                                />
                                <WMSCellsModal
                                    warehouseId={product.defaultWarehouseId}
                                    visible={Boolean(selectedCell)}
                                    confirmAction={(address)=>{

                                    }}
                                    hideModal={()=>{
                                        this.setState({selectedCell: undefined})
                                    }}
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </Catcher>
            </Layout>
        );
    }
}
