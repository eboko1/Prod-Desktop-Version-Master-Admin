// vendor
import React, { Component } from 'react';
import {
    Table,
    InputNumber,
    Icon,
    Popconfirm,
    Select,
    Button,
    Input,
    Modal,
    notification,
    Checkbox,
    Dropdown,
    Menu,
} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from "react-redux";
import _ from 'lodash';
import { Link } from 'react-router-dom';

// proj
import { Catcher } from 'commons';
import { permissions, isForbidden, images, fetchAPI } from 'utils';
import { DetailProductModal, FavouriteDetailsModal, StoreProductTrackingModal, SetBarcodeModal, DetailStorageModal, DetailSupplierModal, DetailWarehousesCountModal } from 'modals';
import { AvailabilityIndicator } from 'components';
import { MODALS, setModal } from 'core/modals/duck';
import { Barcode } from "components";
import book from 'routes/book';

// own
import Styles from './styles.m.css';
import { value } from 'numeral';
const Option = Select.Option;
const { confirm, warning } = Modal;
const INACTIVE = 'INACTIVE',
      AGREED = 'AGREED',
      ORDERED = 'ORDERED',
      ACCEPTED = 'ACCEPTED',
      RESERVED = 'RESERVED',
      GIVEN = 'GIVEN',
      INSTALLED = 'INSTALLED',
      NO_SPARE_PART = 'NO_SPARE_PART',
      RETURNED = 'RETURNED',
      CANCELED = 'CANCELED';

@injectIntl
class DetailsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productModalVisible:  false,
            productModalKey:      0,
            dataSource:           [],
            reserveWarehouseId:   undefined,
            mainWarehouseId:      undefined,
            fetched:              false,
            reserveModalVisible: false,
            reserveModalData: undefined,
            productBarcode: undefined,
            selectedRowKeys: [],
            selectedRows: [],
        };

        this.storeGroups = [];

        this.updateDetail = this.updateDetail.bind(this);
        this.updateDataSource = this.updateDataSource.bind(this);

        this.brands = this.props.allDetails.brands.map(
            ({ supplierId, brandId, brandName }) => (
                <Option value={ String(brandId) } key={ `allBrands-${brandId}` }>
                    { brandName }
                </Option>
            ),
        );

        this.columns = [
            {
                title:      ()=>(
                    <div className={Styles.headerActions}>
                        <Barcode
                            button
                            multipleMode
                            prefix={'STP'}
                            onConfirm={async (code, pref, fullCode) => {
                                const barcodeData = await fetchAPI('GET', 'barcodes',{
                                    barcode: fullCode,
                                });
                                const productBarcode = barcodeData.find(({table})=>table == 'STORE_PRODUCTS');
                        
                                if(productBarcode) {
                                    const payload = {
                                        insertMode: true,
                                        details: [],
                                        services: [],
                                    };
                                    const product = await fetchAPI('GET', `store_products/${productBarcode.referenceId}`);
                                    payload.details.push({
                                        productId: product.id,
                                        storeGroupId: product.groupId,
                                        name: product.name,
                                        productCode: product.code,
                                        supplierBrandId: product.brandId,
                                        supplierId: 0,
                                        count: 1,
                                        price: product.sellingPrice || 0,
                                        purchasePrice: product.purchasePrice || 0,
                                    })
                                    await fetchAPI('PUT', `orders/${this.props.orderId}`, null, payload);
                                    await this.updateDataSource();
                                } else if(code.length > 2) {
                                    //4019064001232
                                    const tecDocProducts = await fetchAPI('GET', 'tecdoc/ean', {ean: code});
                                    if(tecDocProducts && tecDocProducts.length) {
                                        const payload = {
                                            insertMode: true,
                                            details: [],
                                            services: [],
                                        };
                                        payload.details.push({
                                            storeGroupId: tecDocProducts[0].storeGroupId,
                                            name: tecDocProducts[0].description,
                                            productCode: tecDocProducts[0].partNumber,
                                            supplierBrandId: tecDocProducts[0].brandId,
                                            count: 1,
                                            price: 0,
                                            purchasePrice: 0,
                                        })
                                        await fetchAPI('PUT', `orders/${this.props.orderId}`, null, payload);
                                        await this.updateDataSource();
                                    } else {
                                        this.setState({
                                            productBarcode: code,
                                        })
                                        notification.warning({
                                            message: this.props.intl.formatMessage({id: 'order_form_table.code_not_found'}),
                                        });
                                    }                                                
                                } else {
                                    this.setState({
                                        productBarcode: code,
                                    })
                                    notification.warning({
                                        message: this.props.intl.formatMessage({id: 'order_form_table.code_not_found'}),
                                    });
                                }
                            }}
                        />
                    </div>
                ),
                align: 'center',
                key:       'position',
                render:    (row) => {
                    const prewOrder = row.key-1 >= 0 && this.state.dataSource[row.key-1].order;
                    const nextOrder = row.key+1 < this.state.dataSource.length && this.state.dataSource[row.key+1].order;
                    return (
                        <div>
                            <Icon
                                type="up-square"
                                className={`${Styles.positionArrows} ${(!prewOrder || !row.id) && Styles.disabledIcon}`}
                                onClick={async ()=>{
                                    await fetchAPI('PUT', 'orders/swap_details', 
                                        {
                                            orderId: this.props.orderId,
                                            order1: row.order,
                                            order2: prewOrder, 
                                        },
                                        undefined,
                                        { handleErrorInternally: true }
                                    );
                                    await this.updateDataSource();
                                }}
                            />
                            <Icon
                                type="down-square"
                                className={`${Styles.positionArrows} ${(!nextOrder || !row.id) && Styles.disabledIcon}`}
                                onClick={async ()=>{
                                    await fetchAPI('PUT', 'orders/swap_details', 
                                        {
                                            orderId: this.props.orderId,
                                            order1: row.order,
                                            order2: nextOrder, 
                                        }
                                    );
                                    await this.updateDataSource();
                                }}
                            />
                        </div>
                    )
                },
            },
            {
                title:      ()=>(
                                <div className={Styles.headerActions}>
                                    <div>
                                        <Button
                                            type={'primary'}
                                            disabled={ this.props.disabled }
                                            onClick={ () => {
                                                this.showDetailProductModal(-1);
                                            } }
                                        >
                                            <Icon type='plus'/>
                                        </Button>
                                    </div>
                                    <div>
                                        <FavouriteDetailsModal
                                            treeData={ this.props.detailsTreeData }
                                            disabled={ this.props.disabled}
                                            user={ this.props.user }
                                            tecdocId={ this.props.tecdocId }
                                            orderId={ this.props.orderId }
                                            brands={ this.props.allDetails.brands }
                                            detail={
                                                this.state.dataSource[
                                                    this.state.productModalKey
                                                ]
                                            }
                                            updateDataSource={ this.updateDataSource }
                                        />
                                    </div>
                                </div>
                            ),
                align: 'left',
                key:       'buttonGroup',
                dataIndex: 'key',
                render:    (data, elem) => {
                    const confirmed = elem.agreement.toLowerCase();
                    const stageDisabled = elem.stage == AGREED || elem.stage == ORDERED || elem.stage == ACCEPTED || elem.stage == RESERVED || elem.stage == GIVEN || elem.stage == INSTALLED;
                    return (
                        <div
                            style={ {
                                display:        'flex',
                                justifyContent: 'space-evenly',
                            } }
                        >
                            <Button
                                type='primary'
                                disabled={
                                    confirmed != 'undefined' ||
                                    this.props.disabled ||
                                    elem.reserved ||
                                    stageDisabled
                                }
                                onClick={ () => {
                                    this.showDetailProductModal(data);
                                } }
                                title={ this.props.intl.formatMessage({
                                    id: 'details_table.add_edit_button',
                                }) }
                            >
                                <div
                                    style={ {
                                        width:           18,
                                        height:          18,
                                        backgroundColor:
                                            confirmed != 'undefined' ||
                                            this.props.disabled ||
                                            elem.reserved ||
                                            stageDisabled
                                                ? 'black'
                                                : 'white',
                                        mask:       `url(${images.pistonIcon}) no-repeat center / contain`,
                                        WebkitMask: `url(${images.pistonIcon}) no-repeat center / contain`,
                                    } }
                                ></div>
                            </Button>
                            <QuickEditModal
                                treeData={ this.props.detailsTreeData }
                                brands={ this.props.allDetails.brands }
                                allDetails={ this.props.allDetails.details }
                                disabled={
                                    !elem.detailName || this.props.disabled || elem.reserved || stageDisabled
                                }
                                confirmed={ confirmed != 'undefined' }
                                detail={ elem }
                                onConfirm={ this.updateDetail }
                                tableKey={ elem.key }
                            />
                        </div>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_code' />,
                key:       'code',
                dataIndex: 'detailCode',
                render:    (data, row) => {
                    return (
                        <div>
                            <div style={{fontWeight: 700, textDecoration: row.detailCode && 'underline'}}>
                                {row.productId 
                                    ? <Link to={ `${book.product}/${row.productId}` }>
                                        { row.detailCode }
                                    </Link> 
                                    : <span
                                        style={{
                                            cursor: 'pointer'
                                        }}
                                        onClick={()=>{
                                            this.props.setModal(MODALS.STORE_PRODUCT, {
                                                code: row.detailCode,
                                                brandId: row.brandId,
                                                brandName: row.brandName,
                                                name: row.detailName,
                                                groupId: row.storeGroupId,
                                                onSubmit: async () => {
                                                    this.updateDataSource();
                                                }
                                            });
                                        }}
                                    >
                                        {row.detailCode || <FormattedMessage id='long_dash' />}
                                    </span>
                                }
                            </div>
                            <div>
                                {row.detailName}
                            </div>
                        </div>
                    )
                },
            },
            {
                title:      <FormattedMessage id='order_form_table.brand' />,
                key:       'brand',
                dataIndex: 'brandName',
                render:    (data, row) => {
                    return data ?
                        <div
                            style={{
                                cursor: 'pointer',
                                textDecoration: data && 'underline'
                            }}
                            onClick={()=>{
                                this.setState({
                                    storageModalSelectedRow: row,
                                })
                            }}
                        >
                            {data}
                        </div> :
                        <FormattedMessage id='long_dash' />;
                },
            },
            {
                title:  <div style={{whiteSpace: 'pre', textAlign: 'left'}}>
                            <FormattedMessage id='storage' /> / <FormattedMessage id='order_form_table.supplier' />
                        </div>,
                key:       'supplierName',
                render:    row => {
                    return (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-around'
                            }}
                        >
                            <div
                                style={{width: '50%', cursor: 'pointer', textDecoration: row.supplierName && 'underline'}}
                                onClick={()=>{
                                    if(row.supplierId !== 0) {
                                        this.setState({
                                            supplierModalSelectedRow: row,
                                        })
                                    } else {
                                        this.setState({
                                            warehousesModalSelectedRow: row,
                                        })
                                    }
                                }}
                            >
                                {row.supplierName || <FormattedMessage id='long_dash' />}
                            </div>
                            {row.supplierId === 0 ?
                                <div style={{width: '50%'}}>
                                    {row.cellAddress}
                                </div> :
                                <div style={{width: '50%'}}>
                                    <AvailabilityIndicator indexArray={ row.store } />
                                </div>
                            }
                        </div>
                    )
                },
            },
            {
                title: (
                    <div>
                        <div className={ Styles.numberColumn }>
                            <FormattedMessage id='order_form_table.purchasePrice' />
                        </div>
                        <div className={ Styles.numberColumn }>
                            <FormattedMessage id='order_form_table.markup' /> %
                        </div>
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                render:    (data, row) => {
                    let strVal = Number(data).toFixed(2);
                    let markup = row.price && row.purchasePrice 
                                ? ((row.price / row.purchasePrice) - 1) * 100
                                : 0;

                    return (
                        <div>
                            <div>
                                { data ? 
                                    `${strVal}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ' ',
                                    ) : (
                                        <FormattedMessage id='long_dash' />
                                    ) }
                            </div>
                            <div>
                                {markup.toFixed(0)}%
                            </div>
                        </div>
                    );
                },
            },
            {
                title: (
                    <div>
                        <div className={ Styles.numberColumn }>
                            <FormattedMessage id='order_form_table.price' />
                        </div>
                        <div className={ Styles.numberColumn }>
                            <FormattedMessage id='order_form_table.marge' /> %
                        </div>
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'price',
                dataIndex: 'price',
                render:    (data, row) => {
                    let strVal = Number(data).toFixed(2);
                    let marge = row.price || row.purchasePrice 
                                ? (row.price - row.purchasePrice) * 100 / row.price
                                : 100;
                    return (
                        <div>
                            <div>
                                { data ? 
                                    `${strVal}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ' ',
                                    )
                                    : (
                                        <FormattedMessage id='long_dash' />
                                    ) }
                            </div>
                            <div>
                                {marge.toFixed(0)}%
                            </div>
                        </div>
                        
                    );
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='order_form_table.count' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'count',
                dataIndex: 'count',
                render:    data => {
                    return (
                        <span>
                            { data
                                ? `${data}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                )
                                : 0 }
                        </span>
                    );
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <div>
                            <FormattedMessage id='storage.RESERVE' />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-evenly'
                            }}
                        >
                            <Icon
                                type="lock"
                                style={{
                                    fontSize: 18
                                }}
                                onClick={async () => {
                                    await fetchAPI(
                                        'POST',
                                        `store_docs/reserve_all_possible`,
                                        {
                                            ordersAppurtenanciesIds: `[${this.state.selectedRows.map(({id})=>id)}]`,
                                        },
                                        undefined,
                                        { handleErrorInternally: true }
                                    );
                                    await notification.success({
                                        message: `Зарезервировано`,
                                    });
                                    await this.updateDataSource();
                                }}
                            />
                            <Icon
                                type="unlock"
                                style={{
                                    fontSize: 18
                                }}
                                onClick={async () => {
                                    await fetchAPI(
                                        'POST',
                                        `store_docs/unreserve_all_possible`,
                                        {
                                            ordersAppurtenanciesIds: `[${this.state.selectedRows.map(({id})=>id)}]`,
                                        },
                                        undefined,
                                        { handleErrorInternally: true }
                                    );
                                    await notification.success({
                                        message: `Резерв снят`,
                                    });
                                    await this.updateDataSource();
                                }}
                            />
                        </div>
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'reserve',
                render:    elem => {
                    const disabled = this.props.disabled || !elem.id || elem.stage == INSTALLED && elem.agreement != 'REJECTED' || isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK);
                    return (
                        <ReserveButton
                            detail={elem}
                            updateDetail={this.updateDetail}
                            disabled={disabled}
                            reserveWarehouseId={this.state.reserveWarehouseId}
                            mainWarehouseId={this.state.mainWarehouseId}
                            orderId={this.props.orderId}
                            brands={ this.props.allDetails.brands }
                            onClick={()=>{
                                this.setState({
                                    fetched: false,
                                })
                            }}
                            onExit={()=>{
                                this.setState({
                                    fetched: true,
                                })
                            }}
                            showReserveModal={(productId)=>{
                                this.setState({
                                    reserveModalVisible: true,
                                    reserveModalData: productId,
                                })
                            }}
                        />
                    );
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='order_form_table.discount' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'discount',
                render:    row => {
                    const discount = _.get(this.props, 'discount', 0)
                    return (
                        <span>
                            { `${discount || 0}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                )
                            }%
                        </span>
                    );
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='order_form_table.sum' />
                        <p style={{
                            color: 'var(--text2)',
                            fontSize: 12,
                            fontWeight: 400,
                        }}>
                            <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                        </p>
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'sum',
                dataIndex: 'sum',
                render:    data => {
                    const discount = _.get(this.props, 'discount', 0);
                    const sum = data - (data * discount / 100);
                    let strVal = Number(sum).toFixed(2);

                    return (
                        <span>
                            { data ? 
                                `${strVal}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                )
                                : (
                                    <FormattedMessage id='long_dash' />
                                ) }
                        </span>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.PD' />,
                key:        'agreement',
                dataIndex:  'agreement',
                render:     (data, row) => {
                    const key = row.key;
                    const confirmed = data.toLowerCase();
                    let color, icon;
                    switch (confirmed) {
                        case 'rejected':
                            color = 'rgb(255, 126, 126)';
                            icon = 'close-circle';
                            break;
                        case 'agreed':
                            color = 'var(--green)';
                            icon = 'check-circle';
                            break;
                        default:
                            color = null;
                            icon = 'question-circle';
                    }
                    const updateAgreement = (value) => {
                        row.agreement = value.toUpperCase();
                        this.updateDetail(key, row);
                    }
                    const menu = (
                        <Menu onClick={this.handleMenuClick}>
                            <Menu.Item
                                key="undefined"
                                onClick={()=>{
                                    updateAgreement('undefined')
                                }}
                            >
                                <Icon
                                    type={'question-circle'}
                                    style={{
                                        fontSize: 18,
                                        verticalAlign: 'sub',
                                        marginRight: 8
                                    }}
                                />
                                <FormattedMessage id='agreement.undefined' />
                            </Menu.Item>
                            <Menu.Item
                                key="agreed"
                                style={{color: 'var(--green)'}}
                                onClick={()=>{
                                    updateAgreement('agreed')
                                }}
                            >
                                <Icon
                                    type={'check-circle'}
                                    style={{
                                        fontSize: 18,
                                        verticalAlign: 'sub',
                                        marginRight: 8,
                                    }}
                                />
                                <FormattedMessage id='agreement.agreed' />
                            </Menu.Item>
                            <Menu.Item
                                key="rejected"
                                style={{color: 'rgb(255, 126, 126)'}}
                                onClick={()=>{
                                    updateAgreement('rejected')
                                }}
                            >
                                <Icon
                                    type={'close-circle'}
                                    style={{
                                        fontSize: 18,
                                        marginRight: 8,
                                    }}
                                />
                                <FormattedMessage id='agreement.rejected' />
                            </Menu.Item>
                        </Menu>
                    );
                    return isForbidden(this.props.user, permissions.ACCESS_ORDER_DETAILS_CHANGE_STATUS) ? (
                        <Icon
                            type={icon}
                            style={{
                                fontSize: 24,
                                color,
                            }}
                        />
                    ) : (
                        <div>
                            <Dropdown
                                overlay={menu}
                            >
                                <Icon
                                    type={icon}
                                    style={{
                                        fontSize: 24,
                                        color,
                                    }}
                                />
                            </Dropdown>
                        </div>
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.status' />,
                key:       'status',
                dataIndex: 'status',
                render:    (data, row) => {
                    let color;
                    switch (data) {
                        case 'UNDEFINED':
                            color = 'var(--disabled)';
                            break;
                        case 'SPECIFY':
                            color = 'var(--db-comment)';
                            break;
                        case 'SUPPLIER_CONFIRMED':
                            color = 'var(--db_approve)';
                            break;
                        case 'ORDERED':
                            color = 'var(--db_progress)';
                            break;
                        case 'RESERVE':
                            color = 'var(--db_success)';
                            break;
                        default:
                            color = null;
                    }

                    return row.id && (
                        <div 
                            style={ { 
                                background: color,
                                padding: '6px 4px',
                                textAlign: 'center',
                                fontWeight: 500,
                                // textTransform: 'uppercase',
                                // border: '1px solid black',
                            } }
                        >
                            <FormattedMessage id={`status.${data}`}/>
                        </div>
                    );
                },
            },
            {
                title: <FormattedMessage id='order_form_table.actions' />,
                key: 'actions',
                children: [
                    {
                        title: ()=>(
                            <Icon
                                type="shopping"
                                style={ { fontSize: 18 } }
                                onClick={async () => {
                                    await fetchAPI(
                                        'POST',
                                        `store_docs/order_all_possible`,
                                        {
                                            ordersAppurtenanciesIds: `[${this.state.selectedRows.map(({id})=>id)}]`,
                                        },
                                        undefined,
                                        { handleErrorInternally: true }
                                    );
                                    await notification.success({
                                        message: `Заказано`,
                                    });
                                    await this.updateDataSource();
                                }}
                            />
                        ),
                        key: 'cart',
                        render: row => {
                            return (
                                <Icon
                                    type="shopping"
                                    style={ { fontSize: 18 } }
                                    onClick={async () => {
                                        await fetchAPI(
                                            'POST',
                                            `store_docs/order_all_possible`,
                                            {
                                                ordersAppurtenanciesIds: `[${row.id}]`
                                            }
                                        );
                                        await notification.success({
                                            message: `Заказано`,
                                        });
                                        await this.updateDataSource();
                                    }}
                                />
                            )
                        }
                    },
                    {
                        title: ()=>(
                            <Icon
                                type="plus-square"
                                style={ { fontSize: 18 } }
                                onClick={async () => {
                                    const payload = {
                                        insertMode: true,
                                        details: [
                                            ...this.state.selectedRows.map((row)=>(
                                                {
                                                    storeGroupId: row.storeGroupId,
                                                    name: row.detailName,
                                                    productCode: row.detailCode,
                                                    supplierId: row.supplierId,
                                                    supplierBrandId: row.supplierBrandId || row.brandId,
                                                    purchasePrice: row.purchasePrice,
                                                    count: row.count,
                                                    price: row.price,
                                                }
                                            ))
                                        ],
                                    }
                                    await fetchAPI(
                                        'PUT',
                                        `orders/${this.props.orderId}`,
                                        undefined,
                                        payload,
                                    );
                                    await this.updateDataSource();
                                }}
                            />
                        ),
                        key: 'duplicate',
                        render: row => {
                            return (
                                <Icon
                                    type="plus-square"
                                    style={ { fontSize: 18 } }
                                    onClick={async () => {
                                        await fetchAPI(
                                            'PUT',
                                            `orders/${this.props.orderId}`,
                                            undefined,
                                            {
                                                insertMode: true,
                                                details: [
                                                    {
                                                        storeGroupId: row.storeGroupId,
                                                        name: row.detailName,
                                                        productCode: row.detailCode,
                                                        supplierId: row.supplierId,
                                                        supplierBrandId: row.supplierBrandId || row.brandId,
                                                        purchasePrice: row.purchasePrice,
                                                        count: row.count,
                                                        price: row.price,
                                                    }
                                                ],
                                            }
                                        );
                                        await this.updateDataSource();
                                    }}
                                />
                            )
                        }
                    },
                    {
                        title: ()=>(
                            <Icon
                                type="star"
                                style={ { fontSize: 18, color: 'gold' } }
                                theme={ 'filled' }
                                onClick={async () => {
                                    await fetchAPI(
                                        'POST',
                                        `orders/frequent/details`,
                                        {
                                            storeGroupIds: `[${this.state.selectedRows.map(({storeGroupId, frequentDetailId})=>{
                                                if(!frequentDetailId) return storeGroupId;
                                                }
                                            )}]`,
                                        },
                                        undefined,
                                        { handleErrorInternally: true }
                                    );
                                    await notification.success({
                                        message: `Добавлено`,
                                    });
                                    await this.updateDataSource();
                                }}
                            />
                        ),
                        key:    'favourite',
                        render: elem => {
                            return (
                                <Popconfirm
                                    title={
                                        elem.frequentDetailId ? (
                                            <FormattedMessage id='add_order_form.favourite_remove' />
                                        ) : (
                                            <FormattedMessage id='add_order_form.favourite_confirm' />
                                        )
                                    }
                                    onConfirm={ async () => {
                                        if(elem.frequentDetailId) {
                                            await fetchAPI('DELETE', 'orders/frequent/details', { ids: `[${elem.frequentDetailId}]`});
                                            await this.updateDataSource();
                                        } else {
                                            await fetchAPI('POST', 'orders/frequent/details', {storeGroupIds: `[${elem.storeGroupId}]`})
                                            await this.updateDataSource();
                                        }
                                    } }
                                >
                                    <Icon
                                        type='star'
                                        theme={ elem.frequentDetailId ? 'filled' : '' }
                                        style={ { color: 'gold', fontSize: 18 } }
                                        title={ this.props.intl.formatMessage({
                                            id: elem.frequentDetailId
                                                ? 'delete_from_favorites'
                                                : 'add_to_favorites',
                                        }) }
                                    />
                                </Popconfirm>
                            );
                        },
                    },
                    {
                        title: ()=>(
                            <Popconfirm
                                title={
                                    <FormattedMessage id='add_order_form.delete_confirm' />
                                }
                                onConfirm={ async () => {
                                    await fetchAPI(
                                        'DELETE',
                                        `orders/${this.props.orderId}/details`,
                                        {
                                            ids: `[${this.state.selectedRows.map(({id})=>id)}]`,
                                        },
                                        undefined,
                                        { handleErrorInternally: true }
                                    );
                                    await notification.success({
                                        message: `Удалено`,
                                    });
                                    await this.updateDataSource();
                                } }
                            >
                                <Icon
                                    type="delete"
                                    className={Styles.deleteIcon}
                                />
                            </Popconfirm>
                        ),
                        key:    'delete',
                        render: elem => {
                            const confirmed = elem.agreement.toLowerCase();
                            const stageDisabled = elem.stage == AGREED || elem.stage == ORDERED || elem.stage == ACCEPTED || elem.stage == RESERVED || elem.stage == GIVEN || elem.stage == INSTALLED;
                            const disabled =
                                confirmed != 'undefined' || this.props.disabled || elem.reserved;
        
                            return (
                                <Popconfirm
                                    disabled={ disabled || stageDisabled }
                                    title={
                                        <FormattedMessage id='add_order_form.delete_confirm' />
                                    }
                                    onConfirm={ async () => {
                                        await fetchAPI('DELETE', `orders/${this.props.orderId}/details`, { ids: `[${elem.id}]`});
                                        await this.updateDataSource();
                                    } }
                                >
                                    <Icon
                                        type='delete'
                                        className={
                                            disabled || stageDisabled
                                                ? Styles.disabledIcon
                                                : Styles.deleteIcon
                                        }
                                    />
                                </Popconfirm>
                            );
                        },
                    },
                ]
            },
            
        ];
    }

    showDetailProductModal(key) {
        this.setState({
            productModalVisible: true,
            productModalKey:     key,
        });
    }
    hideDetailProductModal() {
        this.setState({
            productModalVisible: false,
        });
    }

    fetchData() {
        if(!isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_STOCK)) {
            var that = this;
            let token = localStorage.getItem('_my.carbook.pro_token');
            let url = __API_URL__ + `/warehouses`;
            fetch(url, {
                method:  'GET',
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
                const warehousesData = {};
                data.map((warehouse)=>{
                    if(warehouse.attribute == 'MAIN') {
                        warehousesData.main = warehouse.id;
                    }
                    if(warehouse.attribute == 'RESERVE') {
                        warehousesData.reserve = warehouse.id;
                    }
                })
                that.setState({
                    mainWarehouseId: warehousesData.main,
                    reserveWarehouseId: warehousesData.reserve,
                    fetched: true,
                })
            })
            .catch(function(error) {
                console.log('error', error);
                that.setState({
                    fetched: true,
                })
            });
        } else {
            this.setState({
                fetched: true,
            })
        }
        this.storeGroups = this.props.details;
    }

    
    updateDataSource() {
        if(this.state.fetched) {
            this.setState({
                fetched: false,
            })
        }
        const callback = (data) => {
            data.orderDetails.map((elem, index) => {
                elem.key = index;
                elem.brandId = elem.supplierBrandId || undefined;
                elem.brandName = elem.supplierBrandName;
            });
            this.setState({
                dataSource: data.orderDetails,
                selectedRowKeys: [],
                selectedRows: [],
                fetched: true,
            });
        }
        this.props.reloadOrderForm(callback, 'details');
    }

    async updateDetail(key, detail) {
        if(this.state.fetched) {
            this.setState({
                fetched: false,
            })
        }

        this.state.dataSource[ key ] = detail;
        const newDetail = detail.productId ? 
        {
            id: detail.id,
            storeGroupId: detail.storeGroupId,
            name: detail.detailName,
            productId: detail.storeId || detail.productId,
            productCode: detail.detailCode,
            purchasePrice: Math.round(detail.purchasePrice*10)/10 || 0,
            count: detail.count ? detail.count : 1,
            price: detail.price ? Math.round(detail.price*10)/10  : 1,
            reservedFromWarehouseId: detail.reservedFromWarehouseId || this.state.mainWarehouseId,
            reserved: detail.reserved,
            reservedCount: detail.reservedCount,
            supplierBrandId: detail.supplierBrandId || detail.brandId,
            supplierId: detail.supplierId,
            supplierOriginalCode: detail.supplierOriginalCode,
            supplierProductNumber: detail.supplierProductNumber,
            supplierPartNumber: detail.supplierPartNumber,
            cellAddress: detail.cellAddress,
            comment: detail.comment || {
                comment: undefined,
                positions: [],
            },
        } : 
        {
            id:              detail.id,
            storeGroupId:    detail.storeGroupId,
            name:            detail.detailName,
            productCode:     detail.detailCode ? detail.detailCode : null,
            supplierId:      detail.supplierId,
            supplierBrandId: detail.supplierBrandId || detail.brandId,
            supplierOriginalCode: detail.supplierOriginalCode,
            supplierProductNumber: detail.supplierProductNumber,
            supplierPartNumber: detail.supplierPartNumber,
            purchasePrice:
                Math.round(detail.purchasePrice * 10) / 10 || 0,
            count:   detail.count,
            price:   detail.price ? Math.round(detail.price * 10) / 10 : 1,
            comment: detail.comment || {
                comment:   undefined,
                positions: [],
            },
        }
        const data = {
            updateMode: true,
            details:    [
                newDetail,
            ],
        };
        if (
            !isForbidden(
                this.props.user,
                permissions.ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,
            )
        ) {
            data.details[ 0 ].agreement = detail.agreement;
        }

        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/orders/${this.props.orderId}`;
        url += params;
        try {
            const response = await fetch(url, {
                method:  'PUT',
                headers: {
                    Authorization:  token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.success) {
                this.updateDataSource();
            } else {
                console.log('BAD', result);
            }
        } catch (error) {
            console.error('ERROR:', error);
            this.updateDataSource();
        }
        
        this.setState({
            update: true,
        });
    }

    componentDidMount() {
        this.fetchData();
        let tmp = [ ...this.props.orderDetails ];
        tmp.map((elem, i) => {
            elem.key = i;
            elem.brandId = elem.supplierBrandId || undefined;
            elem.brandName = elem.supplierBrandName;
        });
        this.setState({
            dataSource: tmp,
        });
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.showOilModal && this.props.showOilModal) {
            this.setState({
                productModalVisible: true,
                productModalKey: this.state.dataSource.length ? this.state.dataSource.length-1 : 0,
            })
        }
        if(
            prevProps.activeKey != 'details' && this.props.activeKey == 'details' ||
            prevProps.orderDetails != this.props.orderDetails
        ) {
            let tmp = [ ...this.props.orderDetails ];
            tmp.map((elem, i) => {
                elem.key = i;
                elem.brandId = elem.supplierBrandId || undefined;
                elem.brandName = elem.supplierBrandName;
            });
            this.setState({
                dataSource: tmp,
            });
        }
    }

    render() {
        const { 
            detailsSuggestionsFetching,
            suggestionsFetching,
            labors,
            detailsTreeData,
            user,
            tecdocId,
            orderId,
            allDetails,
            clientVehicleVin,
            showOilModal,
            oilModalData,
            clearOilData,
        } = this.props;
        const {
            fetched,
            dataSource,
            productModalVisible,
            productModalKey,
            reserveModalVisible,
            reserveModalData,
            productBarcode,
            selectedRowKeys,
            storageModalSelectedRow,
            supplierModalSelectedRow,
            warehousesModalSelectedRow,
        } = this.state;

        const columns = this.columns;
        
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows,
                })
            },
            getCheckboxProps: record => ({
                disabled: !record.id,
            }),
        };

        return (
            <Catcher>
                <Table
                    className={ Styles.detailsTable }
                    loading={
                        detailsSuggestionsFetching ||
                        suggestionsFetching ||
                        !fetched
                    }
                    columns={ columns }
                    dataSource={ dataSource }
                    pagination={ false }
                    rowSelection={rowSelection}
                    rowClassName={Styles.detailsTableRow}
                    //scroll={{ x: 1980 }}
                />
                <DetailProductModal
                    labors={ labors }
                    treeData={ detailsTreeData }
                    user={ user }
                    tecdocId={ tecdocId }
                    visible={ productModalVisible }
                    orderId={ orderId }
                    hideModal={ () => {
                        this.hideDetailProductModal();
                    } }
                    brands={ allDetails.brands }
                    allDetails={ allDetails.details }
                    detail={ productModalKey < 0 ? {} : dataSource[ productModalKey ] }
                    tableKey={ productModalKey }
                    updateDetail={ this.updateDetail }
                    updateDataSource={ this.updateDataSource }
                    clientVehicleVin={ clientVehicleVin }
                    showOilModal={ showOilModal }
                    oilModalData={ oilModalData }
                    clearOilData={ clearOilData }
                />
                <DetailStorageModal
                    hideButton
                    user={ user }
                    onSelect={(...args)=>{
                        console.log(args);
                        storageModalSelectedRow.detailCode = args[0];
                        storageModalSelectedRow.brandId = args[1];
                        storageModalSelectedRow.supplierBrandId = args[1];
                        storageModalSelectedRow.detailName = args[5];
                        storageModalSelectedRow.supplierOriginalCode = args[6];
                        storageModalSelectedRow.supplierPartNumber = args[8];
                        this.setState({})
                    }}
                    tecdocId={ tecdocId }
                    setSupplier={(...args)=>{
                        console.log(args);

                        storageModalSelectedRow.supplierId = args[0];
                        storageModalSelectedRow.purchasePrice = args[3];
                        storageModalSelectedRow.price = args[4];
                        storageModalSelectedRow.supplierOriginalCode = args[6];
                        storageModalSelectedRow.supplierPartNumber = args[8];
                        this.updateDetail(storageModalSelectedRow.key, storageModalSelectedRow);
                    }}
                    codeSearch
                    storeGroupId={_.get(storageModalSelectedRow, 'storeGroupId')}
                    codeFilter={_.get(storageModalSelectedRow, 'detailCode')}
                    stockMode={false}
                    visible={Boolean(storageModalSelectedRow)}
                    hideModal={()=>{
                        this.setState({
                            storageModalSelectedRow: undefined,
                        })
                    }}
                />
                <DetailSupplierModal
                    hideButton
                    user={user}
                    onSelect={(...args)=>{
                        console.log(args);
                        supplierModalSelectedRow.supplierId = args[0];
                        supplierModalSelectedRow.purchasePrice = args[3];
                        supplierModalSelectedRow.price = args[4];
                        supplierModalSelectedRow.supplierOriginalCode = args[6];
                        supplierModalSelectedRow.supplierPartNumber = args[8];
                        this.updateDetail(supplierModalSelectedRow.key, supplierModalSelectedRow);
                    }}
                    storeGroupId={_.get(supplierModalSelectedRow, 'storeGroupId')}
                    brandId={_.get(supplierModalSelectedRow, 'brandId')}
                    detailCode={_.get(supplierModalSelectedRow, 'detailCode')}
                    visible={Boolean(supplierModalSelectedRow)}
                    hideModal={()=>{
                        this.setState({
                            supplierModalSelectedRow: undefined,
                        })
                    }}
                />
                <StoreProductTrackingModal
                    visible={reserveModalVisible}
                    productId={reserveModalData}
                    hideModal={()=>{
                        this.setState({
                            reserveModalVisible: false,
                            reserveModalData: undefined,
                        })
                    }}
                />
                <SetBarcodeModal
                    visible={Boolean(productBarcode)}
                    barcode={productBarcode}
                    confirmAction={async (id)=>{
                        const payload = {
                            insertMode: true,
                            details: [],
                            services: [],
                        };
                        const product = await fetchAPI('GET', `store_products/${id}`);
                        payload.details.push({
                            productId: product.id,
                            storeGroupId: product.groupId,
                            name: product.name,
                            productCode: product.code,
                            supplierBrandId: product.brandId,
                            supplierId: 0,
                            count: 1,
                            price: product.sellingPrice || 0,
                            purchasePrice: product.purchasePrice || 0,
                        })
                        await fetchAPI('PUT', `orders/${this.props.orderId}`, null, payload);
                        await this.updateDataSource();
                    }}
                    hideModal={()=>{
                        this.setState({
                            productBarcode: undefined,
                        })
                    }}
                />
                <DetailWarehousesCountModal
                    hideButton
                    productId={_.get(warehousesModalSelectedRow, 'productId')}
                    visible={ Boolean(warehousesModalSelectedRow)}
                    orderId={ orderId }
                    hideModal={ () => {
                        this.setState({
                            warehousesModalSelectedRow: undefined,
                        })
                    } }
                    onSelect={(address, warehouseId)=>{
                        warehousesModalSelectedRow.cellAddress = address;
                        this.updateDetail(warehousesModalSelectedRow.key, warehousesModalSelectedRow);
                    }}
                />
            </Catcher>
        );
    }
}

export default DetailsTable;

@injectIntl
class QuickEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:          false,
            brandId:          undefined,
            brandSearchValue: '',
        };
        this.brandOptions = [];

        this.columns = [
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'detailName',
                dataIndex: 'detailName',
                width:     '20%',
            },
            {
                title:     <FormattedMessage id='order_form_table.brand' />,
                width:     '20%',
                key:       'brand',
                dataIndex: 'brandName',
                render:    (data, elem) => {
                    return (
                        <Select
                            showSearch
                            value={ data ? data : undefined }
                            dropdownStyle={ {
                                maxHeight: 400,
                                overflow:  'auto',
                                zIndex:    '9999',
                                minWidth:  220,
                            } }
                            filterOption={ (input, option) => {
                                return (
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0 ||
                                    String(option.props.value).indexOf(
                                        input.toLowerCase(),
                                    ) >= 0
                                );
                            } }
                            onSelect={ (value, option) => {
                                elem.brandName = value;
                                elem.supplierBrandId = option.props.brand_id;
                                elem.brandId = option.props.brand_id;
                                elem.productId = undefined;
                                this.setState({
                                    update: true,
                                });
                            } }
                            onSearch={ input => {
                                this.setState({
                                    brandSearchValue: input,
                                });
                            } }
                            onBlur={ () => {
                                this.setState({
                                    brandSearchValue: '',
                                });
                            } }
                        >
                            { this.state.brandSearchValue.length > 1 ? 
                                this.props.brands.map((elem, index) => (
                                    <Option
                                        key={ index }
                                        value={ elem.brandName }
                                        supplier_id={ elem.supplierId }
                                        brand_id={ elem.brandId }
                                    >
                                        { elem.brandName }
                                    </Option>
                                ))
                                : elem.brandName ? (
                                    <Option
                                        key={ 0 }
                                        value={ elem.brandName }
                                        brand_id={ this.state.brandId }
                                    >
                                        { elem.brandName }
                                    </Option>
                                ) : 
                                    []
                            }
                        </Select>
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_code' />,
                width:     '20%',
                key:       'code',
                dataIndex: 'detailCode',
                render:    data => {
                    return (
                        <Input
                            style={ { minWidth: 150 } }
                            value={ data }
                            onChange={ event => {
                                this.state.dataSource[ 0 ].detailCode =
                                    event.target.value;
                                this.setState({
                                    update: true,
                                });
                            } }
                        />
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.purchasePrice' />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '10%',
                render:    (data, elem) => {
                    return (
                        <InputNumber
                            value={ data ? Math.round(data * 10) / 10 : 0 }
                            className={ Styles.detailNumberInput }
                            min={ 0 }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={ value => {
                                const storeGroup = this.props.allDetails.find((detail)=>detail.id == elem.storeGroupId);
                                elem.purchasePrice = value;
                                elem.price = elem.purchasePrice * (storeGroup ? storeGroup.priceGroupMultiplier : 1);
                                this.setState({
                                    update: true,
                                });
                            } }
                        />
                    );
                },
            },
            {
                title:  <div>   
                            <FormattedMessage id='order_form_table.price' />
                            <p style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                                fontWeight: 400,
                            }}>
                                <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                            </p>
                        </div>,
                key:       'price',
                dataIndex: 'price',
                width:     '10%',
                render:    data => {
                    return (
                        <InputNumber
                            value={ data ? Math.round(data * 10) / 10 : 0 }
                            className={ Styles.detailNumberInput }
                            min={ 0 }
                            disabled={ this.props.confirmed }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={ value => {
                                this.state.dataSource[ 0 ].price = value;
                                this.state.dataSource[ 0 ].sum =
                                    value * this.state.dataSource[ 0 ].count;
                                this.setState({
                                    update: true,
                                });
                            } }
                        />
                    );
                },
            },
            {
                title:     <FormattedMessage id='order_form_table.count' />,
                key:       'count',
                dataIndex: 'count',
                width:     '10%',
                render:    data => {
                    return (
                        <InputNumber
                            value={ data ? Math.round(data * 10) / 10 : 0 }
                            className={ Styles.detailNumberInput }
                            disabled={ this.props.confirmed }
                            min={ 0.1 }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={ value => {
                                this.state.dataSource[ 0 ].count = value;
                                this.state.dataSource[ 0 ].sum =
                                    value * this.state.dataSource[ 0 ].price;
                                this.setState({
                                    update: true,
                                });
                            } }
                        />
                    );
                },
            },
            {
                title:  <div>   
                            <FormattedMessage id='order_form_table.sum' />
                            <p style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                                fontWeight: 400,
                            }}>
                                <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                            </p>
                        </div>,
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
                render:    data => {
                    return (
                        <InputNumber
                            disabled
                            className={ Styles.detailNumberInput }
                            style={ { color: 'black' } }
                            value={ Math.round(data * 10) / 10 }
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                        />
                    );
                },
            },
        ];
    }

    handleOk = () => {
        this.props.onConfirm(this.props.tableKey, {
            ...this.state.dataSource[ 0 ],
        });
        this.handleCancel();
    };

    handleCancel = () => {
        this.setState({
            visible:    false,
            brandId:    undefined,
            dataSource: [],
        });
    };

    componentDidUpdate(_, prevState) {
        if (prevState.visible == false && this.state.visible) {
            const brand = this.props.brands.find(
                elem => elem.brandName == this.props.detail.brandName,
            );
            if (brand) {
                this.setState({
                    brandId: brand.brandId,
                });
            }
        }
    }

    render() {
        const { detail } = this.props;

        return (
            <div>
                <Button
                    type='primary'
                    disabled={ this.props.disabled }
                    onClick={ () => {
                        this.setState({
                            visible:    true,
                            dataSource: [ detail ],
                        });
                    } }
                    title={ this.props.intl.formatMessage({ id: 'quick_edit' }) }
                >
                    <div
                        style={ {
                            width:           18,
                            height:          18,
                            backgroundColor: this.props.disabled
                                ? 'black'
                                : 'white',
                            mask:       `url(${images.pencilIcon}) no-repeat center / contain`,
                            WebkitMask: `url(${images.pencilIcon}) no-repeat center / contain`,
                        } }
                    ></div>
                </Button>
                <Modal
                    width='80%'
                    visible={ this.state.visible }
                    title={
                        <FormattedMessage id='order_form_table.quick_edit' />
                    }
                    onOk={ this.handleOk }
                    onCancel={ this.handleCancel }
                    maskClosable={false}
                >
                    <Table
                        columns={ this.columns }
                        dataSource={ this.state.dataSource }
                        pagination={ false }
                    />
                </Modal>
            </div>
        );
    }
}


@injectIntl
export class ReserveButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:          false,
            brandId:          undefined,
            brandSearchValue: '',
        };
    }

    getStoreProduct = (detailCode, brandId) => {
        const { detail, updateDetail } = this.props;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_products?all=true`;
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

            const product = data.list.find((product)=>product.code == detailCode && product.brandId == brandId);
            if(product) {
                detail.productId = product.id;
                detail.defaultWarehouseId = product.defaultWarehouseId;
                updateDetail(detail.key, detail);
            }
        })
        .catch(function(error) {
            console.log("error", error);
            that.setState({
                fetched: true,
                codeFilter: that.props.codeFilter,
            })
        });
    }

    reserveProduct = () => {
        const { detail, setModal, updateDetail, orderId, reserveWarehouseId, mainWarehouseId, onExit, showReserveModal, intl:{formatMessage} } = this.props;
        const data = {
            status: "DONE",
            documentType: "TRANSFER",
            type: "EXPENSE",
            supplierDocNumber: orderId,
            payUntilDatetime: null,
            docProducts:[
                {
                    productId: detail.productId,
                    quantity: !detail.reserved ? detail.count : detail.reservedCount,
                    stockPrice: detail.purchasePrice || 0,
                }
            ],
            warehouseId: !detail.reserved ? detail.reservedFromWarehouseId || mainWarehouseId : reserveWarehouseId,
            counterpartWarehouseId: !detail.reserved ? reserveWarehouseId : detail.reservedFromWarehouseId || mainWarehouseId,
            orderId: orderId,
        };
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/store_docs`;
        fetch(url, {
            method:  'POST',
            headers: {
                Authorization: token,
            },
            body: JSON.stringify(data),
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
        .then(function(response) {
            if(response.created) {
                notification.success({
                    message: detail.reserved ? 
                        formatMessage({id: 'storage_document.notification.reserve_canceled'}) :
                        formatMessage({id: 'storage_document.notification.reserved'}, {count: data.docProducts[0].quantity}),
                    description: `${formatMessage({id: 'storage'})} ${detail.reservedFromWarehouseName}`,
                });
                detail.reservedCount = detail.reserved ? 0 : detail.count;
                detail.reserved = !detail.reserved;
                updateDetail(detail.key, detail);
            }
            else {
                const { productId } = response.notAvailableProducts[0].productId,
                      availableCount = response.notAvailableProducts[0].available,
                      reservedCount = response.notAvailableProducts[0].reservedCount;

                confirm({
                    title: formatMessage({id: 'storage_document.not_enought_for_reserve'}),
                    content: (
                        <div>
                            <p>{formatMessage({id: 'storage_document.in_stock'})} - {availableCount}.</p>
                            <p>{formatMessage({id: 'storage_document.available'})} - {availableCount- reservedCount}.</p>
                            <span
                                style={{color: 'var(--link)', textDecoration: 'underline', cursor: 'pointer'}}
                                onClick={()=>showReserveModal(productId)}
                            >
                                {formatMessage({id: 'storage_document.more_details'})}...
                            </span>
                        </div>
                    ),
                    zIndex: 1000,
                    okButtonProps: {disabled: availableCount - reservedCount < 1},
                    onOk() {
                        data.docProducts[0].quantity = availableCount - reservedCount;
                        fetch(url, {
                            method:  'POST',
                            headers: {
                                Authorization: token,
                            },
                            body: JSON.stringify(data),
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
                        .then(function(response) {
                            if(response.created) {
                                detail.reservedCount = detail.reserved ? 0 : availableCount - reservedCount;
                                detail.reserved = !detail.reserved;
                                updateDetail(detail.key, detail);
                                notification.success({
                                    message: `Зарезервировано ${data.docProducts[0].quantity} товаров со склада ${detail.reservedFromWarehouseName}`,
                                });
                            }
                            onExit();
                        })
                        .catch(function(error) {
                            console.log('error', error);
                        });
                    },
                    onCancel() {
                        onExit();
                    }
                });
            }
        })
        .catch(function(error) {
            console.log('error', error);
            onExit();
        });
    }

    addProduct = () => {
        const { detail, setModal, updateDetail, orderId, reserveWarehouseId, mainWarehouseId, brands, intl:{formatMessage} } = this.props;
        var that = this;
        confirm({
            title: formatMessage({id: 'storage_document.error.product_not_found'}),
            onOk() {
                const postData = {
                    name: detail.detailName,
                    groupId: detail.storeGroupId,
                    code: detail.detailCode,
                    brandId: detail.brandId,
                    measureUnit: 'PIECE',
                    defaultWarehouseId: mainWarehouseId,
                }
                if(detail.brandName && !(detail.brandId)) {
                    const defaultBrand = brands.find((brand)=>brand.brandName==detail.brandName);
                    if(defaultBrand) {
                        detail.brandId = defaultBrand.brandId;
                        postData.brandId = defaultBrand.brandId;
                    }
                }
                let token = localStorage.getItem('_my.carbook.pro_token');
                let url = __API_URL__ + `/store_products`;
                fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization: token,
                    },
                    body: JSON.stringify(postData)
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
                    if(data.created) {
                        updateDetail(detail.key, {...detail, productId: data.id});
                    }
                    
                })
                .catch(function(error) {
                    console.log("error", error);
                    that.getStoreProduct(detail.detailCode, detail.brandId);
                });
            }
        });
    }

    render() {
        const { detail, updateDetail, disabled, reserveWarehouseId, orderId, onClick } = this.props;
        return (
            <div>
                {detail.isFromStock ? 
                    <Button
                        style={detail.reservedFromWarehouseId && {
                            color: detail.reserved ? 'var(--green)' : null,
                        }}
                        disabled={disabled}
                        onClick={()=>{
                            onClick();
                            this.reserveProduct();
                        }}
                    > 
                        <p>{detail.reservedCount || 0}</p>
                    </Button> :
                    <Button
                        disabled={disabled}
                        onClick={this.addProduct}
                    > 
                        <Icon type='plus'/>
                    </Button>
                }
            </div>
        )
    }
}
