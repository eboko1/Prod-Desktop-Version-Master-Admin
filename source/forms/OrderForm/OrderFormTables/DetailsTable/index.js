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
    Popover,
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
                                <div>
                                    <div className={Styles.headerActions}>
                                        <Button
                                            disabled={ this.props.disabled }
                                            onClick={ () => {
                                                this.showDetailProductModal(-1);
                                            } }
                                            style={{
                                                padding: '0px 8px',
                                                fontSize: 18,
                                            }}
                                            title={this.props.intl.formatMessage({id: 'add'})}
                                        >
                                            <Icon type='plus'/>
                                        </Button>
                                        <Barcode
                                            button
                                            buttonStyle={{
                                                padding: '0px 8px',
                                            }}
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
                                    <div
                                        className={Styles.headerActions}
                                        style={{
                                            paddingTop: 6,
                                            opacity: this.state.selectedRowKeys.length == 0 && 0,
                                            marginTop: this.state.selectedRowKeys.length == 0 && '-20px',
                                            transitionDuration: "0.5s",
                                            pointerEvents: this.state.selectedRowKeys.length == 0 && 'none',
                                        }}
                                    >
                                        <Icon
                                            type="shopping"
                                            className={Styles.icon}
                                            title={this.props.intl.formatMessage({id: 'details_table.order'})}
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
                                                    message: this.props.intl.formatMessage({id: 'details_table.ordered'}),
                                                });
                                                await this.updateDataSource();
                                            }}
                                        />
                                        <Icon
                                            type="plus-square"
                                            className={Styles.icon}
                                            title={this.props.intl.formatMessage({id: 'copy'})}
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
                                        <Icon
                                            type="star"
                                            style={ { color: 'gold' } }
                                            className={Styles.icon}
                                            theme={ 'filled' }
                                            title={this.props.intl.formatMessage({id: 'details_table.add_to_favorite'})}
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
                                                    message: this.props.intl.formatMessage({id: 'details_table.added'}),
                                                });
                                                await this.updateDataSource();
                                            }}
                                        />
                                        <Popconfirm
                                            title={
                                                <FormattedMessage id='add_order_form.delete_confirm' />
                                            }
                                            onConfirm={ async () => {
                                                await fetchAPI(
                                                    'DELETE',
                                                    `orders/${this.props.orderId}/details`,
                                                    {
                                                        ids: `[${
                                                                this.state.selectedRows
                                                                    .filter(({reservedCount, agreement}) => !reservedCount && agreement == 'UNDEFINED')
                                                                    .map(({id})=>id)
                                                        }]`,
                                                    },
                                                    undefined,
                                                    { handleErrorInternally: true }
                                                );
                                                await notification.success({
                                                    message: this.props.intl.formatMessage({id: 'details_table.deleted'}),
                                                });
                                                await this.updateDataSource();
                                            } }
                                        >
                                            <Icon
                                                type="delete"
                                                className={Styles.deleteIcon}
                                                title={this.props.intl.formatMessage({id: 'delete'})}
                                            />
                                        </Popconfirm>
                                    </div>
                                </div>
                            ),
                align: 'left',
                width: 'min-content',
                key:       'buttonGroup',
                dataIndex: 'key',
                render:    (data, row) => {
                    const confirmed = row.agreement.toLowerCase();
                    const disabled = confirmed != 'undefined' || this.props.disabled || row.reservedCount;
                    const prewOrder = row.key-1 >= 0 && this.state.dataSource[row.key-1].order;
                    const nextOrder = row.key+1 < this.state.dataSource.length && this.state.dataSource[row.key+1].order;
                    return (
                        <div className={Styles.buttonsBlock}>
                            <div className={Styles.rowActions}>
                                <Icon
                                    type="up-square"
                                    className={`${Styles.icon} ${(!prewOrder || !row.id) && Styles.disabledIcon}`}
                                    style={{ fontSize: 22 }}
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
                                    className={`${Styles.icon} ${(!nextOrder || !row.id) && Styles.disabledIcon}`}
                                    style={{ fontSize: 22 }}
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
                                <Button
                                    disabled={disabled}
                                    onClick={ () => {
                                        this.showDetailProductModal(data);
                                    } }
                                    title={ this.props.intl.formatMessage({
                                        id: 'details_table.add_edit_button',
                                    }) }
                                    className={!disabled && Styles.ownIcon}
                                    style={{
                                        padding: '0px 8px'
                                    }}
                                >
                                    <div
                                        style={ {
                                            width:           18,
                                            height:          18,
                                            backgroundColor:
                                                disabled
                                                    ? 'var(--text2)'
                                                    : 'var(--text3)',
                                            mask:       `url(${images.pistonIcon}) no-repeat center / contain`,
                                            WebkitMask: `url(${images.pistonIcon}) no-repeat center / contain`,
                                        } }
                                    ></div>
                                </Button>
                                <QuickEditModal
                                    treeData={ this.props.detailsTreeData }
                                    brands={ this.props.allDetails.brands }
                                    allDetails={ this.props.allDetails.details }
                                    disabled={this.props.disabled || row.reservedCount}
                                    confirmed={ confirmed != 'undefined' }
                                    detail={ row }
                                    onConfirm={ this.updateDetail }
                                    tableKey={ row.key }
                                />
                            </div>
                            <div className={Styles.rowActions + " " + Styles.iconsRow}>
                                <Icon
                                    className={Styles.icon}
                                    type="shopping"
                                    title={this.props.intl.formatMessage({id: 'details_table.order'})}
                                    onClick={async () => {
                                        await fetchAPI(
                                            'POST',
                                            `store_docs/order_all_possible`,
                                            {
                                                ordersAppurtenanciesIds: `[${row.id}]`
                                            }
                                        );
                                        await notification.success({
                                            message: this.props.intl.formatMessage({id: 'details_table.ordered'}),
                                        });
                                        await this.updateDataSource();
                                    }}
                                />
                                <Icon
                                    type="plus-square"
                                    className={Styles.icon}
                                    title={this.props.intl.formatMessage({id: 'copy'})}
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
                                <Popconfirm
                                    title={
                                        row.frequentDetailId ? (
                                            <FormattedMessage id='add_order_form.favourite_remove' />
                                        ) : (
                                            <FormattedMessage id='add_order_form.favourite_confirm' />
                                        )
                                    }
                                    onConfirm={ async () => {
                                        if(row.frequentDetailId) {
                                            await fetchAPI('DELETE', 'orders/frequent/details', { ids: `[${row.frequentDetailId}]`});
                                            await this.updateDataSource();
                                        } else {
                                            await fetchAPI('POST', 'orders/frequent/details', {storeGroupIds: `[${row.storeGroupId}]`})
                                            await this.updateDataSource();
                                        }
                                    } }
                                >
                                    <Icon
                                        className={Styles.icon}
                                        type='star'
                                        theme={ row.frequentDetailId ? 'filled' : '' }
                                        style={ { color: 'gold' } }
                                        title={ this.props.intl.formatMessage({
                                            id: row.frequentDetailId
                                                ? 'delete_from_favorites'
                                                : 'add_to_favorites',
                                        }) }
                                    />
                                </Popconfirm>
                                <Popconfirm
                                    disabled={ disabled}
                                    title={
                                        <FormattedMessage id='add_order_form.delete_confirm' />
                                    }
                                    onConfirm={ async () => {
                                        await fetchAPI('DELETE', `orders/${this.props.orderId}/details`, { ids: `[${row.id}]`});
                                        await this.updateDataSource();
                                    } }
                                >
                                    <Icon
                                        type='delete'
                                        title={this.props.intl.formatMessage({id: 'delete'})}
                                        className={
                                            disabled
                                                ? Styles.disabledIcon
                                                : Styles.deleteIcon
                                        }
                                    />
                                </Popconfirm>
                            </div>
                        </div>
                    );
                },
            },
            {
                title:     ()=>(
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <FormattedMessage id='order_form_table.detail_code' />
                                    <div
                                        className={Styles.headerActions}
                                        style={{
                                            paddingLeft: 6,
                                            opacity: this.state.selectedRowKeys.length == 0 && 0,
                                            marginTop: this.state.selectedRowKeys.length == 0 && '-20px',
                                            transitionDuration: "0.5s",
                                            pointerEvents: this.state.selectedRowKeys.length == 0 && 'none',
                                            justifyContent: 'left'
                                        }}
                                    >
                                        <Icon
                                            type={'close-circle'}
                                            style={{
                                                fontSize: 24,
                                                color: 'var(--disabled)'
                                            }}
                                            title={this.props.intl.formatMessage({id: 'details_table.remove_code'})}
                                            onClick={async ()=>{
                                                const payload = {
                                                    updateMode: true,
                                                    details:    [],
                                                }
                                                this.state.selectedRows.map((elem)=>{
                                                    if(!elem.reservedCount && elem.agreement == 'UNDEFINED') {
                                                        payload.details.push({
                                                            id: elem.id,
                                                            productCode: null,
                                                            productId: null,
                                                            cellAddress: null,
                                                            warehouseId: null,
                                                            supplierBrandId: null,
                                                            supplierId: null,
                                                        })
                                                    }
                                                })
                                                await fetchAPI('PUT', `orders/${this.props.orderId}`, undefined, payload)
                                                this.updateDataSource();
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                key:       'code',
                dataIndex: 'detailCode',
                render:    (data, row) => {
                    return (
                        <div>
                            <div style={{fontWeight: 700, textDecoration: row.detailCode && 'underline'}} title={this.props.intl.formatMessage({id: 'details_table.product_card'})}>
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
                            <div style={{fontSize: 12}}>
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
                                if(!row.reservedCount) {
                                    this.setState({
                                        storageModalSelectedRow: row,
                                    })
                                }
                            }}
                            title={this.props.intl.formatMessage({id: 'details_table.catalog_modal_title'})}
                        >
                            {data}
                        </div> :
                        <FormattedMessage id='long_dash' />;
                },
            },
            {
                title:  ()=>(
                        <div style={{whiteSpace: 'pre', textAlign: 'left', display: 'flex', alignItems: 'center'}}>
                            <FormattedMessage id='storage' /> / <FormattedMessage id='order_form_table.supplier' />
                            <div
                                className={Styles.headerActions}
                                style={{
                                    paddingLeft: 6,
                                    opacity: this.state.selectedRowKeys.length == 0 && 0,
                                    marginTop: this.state.selectedRowKeys.length == 0 && '-20px',
                                    transitionDuration: "0.5s",
                                    pointerEvents: this.state.selectedRowKeys.length == 0 && 'none',
                                    justifyContent: 'left'
                                }}
                            >
                                <Icon
                                    type={'close-circle'}
                                    style={{
                                        fontSize: 24,
                                        color: 'var(--disabled)'
                                    }}
                                    title={this.props.intl.formatMessage({id: 'details_table.remove_supplier'})}
                                    onClick={async ()=>{
                                        const payload = {
                                            updateMode: true,
                                            details:    [],
                                        }
                                        this.state.selectedRows.map((elem)=>{
                                            if(!elem.reservedCount && elem.agreement == 'UNDEFINED') {
                                                payload.details.push({
                                                    id: elem.id,
                                                    productId: null,
                                                    cellAddress: null,
                                                    warehouseId: null,
                                                    supplierId: null,
                                                })
                                            }
                                        })
                                        await fetchAPI('PUT', `orders/${this.props.orderId}`, undefined, payload)
                                        this.updateDataSource();
                                    }}
                                />
                            </div>
                        </div>),
                key:       'supplierName',
                render:    row => {
                    return (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-around'
                            }}
                            title={row.supplierId === 0
                                ? this.props.intl.formatMessage({id: 'details_table.stock_availability'})
                                : this.props.intl.formatMessage({id: 'details_table.suppliers_availability'})
                            }
                        >
                            <div
                                style={{width: '50%', cursor: 'pointer', textDecoration: row.supplierName && 'underline'}}
                                onClick={()=>{
                                    if(!row.reservedCount) {
                                        if(row.supplierId !== 0) {
                                            this.setState({
                                                supplierModalSelectedRow: row,
                                            })
                                        } else {
                                            this.setState({
                                                warehousesModalSelectedRow: row,
                                            })
                                        }
                                    }
                                }}
                            >
                                {row.supplierName || <FormattedMessage id='long_dash' />}
                            </div>
                            {row.supplierId === 0 ?
                                <div style={{width: '50%'}}>
                                    {row.cellAddress}
                                </div> :
                                <div style={{width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <AvailabilityIndicator indexArray={ row.store } />
                                </div>
                            }
                        </div>
                    )
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='order_form_table.purchasePrice' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                render:    (data, row) => {
                    let strVal = Number(data).toFixed(2);
                    
                    const discount = _.get(this.props, 'discount') || 0;
                    const marge = row.price || row.purchasePrice 
                                ? (row.price - row.purchasePrice) * 100 / row.price
                                : 100;
                    const markup = row.price && row.purchasePrice 
                                ? ((row.price / row.purchasePrice) - 1) * 100
                                : 0;
                    const content = (
                        <div>
                            <div>
                                <FormattedMessage id='order_form_table.marge' />: {marge.toFixed(0)}%
                            </div>
                            <div>
                                <FormattedMessage id='order_form_table.markup' />: {markup.toFixed(0)}%
                            </div>
                            <div>
                                <FormattedMessage id='order_form_table.discount' />: {discount.toFixed(0)}%
                            </div>
                        </div>
                    );
                    return (
                        <Popover content={content} trigger="hover">
                            <span style={{cursor: 'pointer', whiteSpace: 'nowrap'}}>
                                { data ? 
                                    `${strVal}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ' ',
                                    )
                                    : (
                                        <FormattedMessage id='long_dash' />
                                    ) }
                            </span>
                        </Popover>
                    );
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='order_form_table.price' />
                    </div>
                ),
                className: Styles.numberColumn,
                key:       'price',
                dataIndex: 'price',
                render:    (data, row) => {
                    let strVal = Number(data).toFixed(2);
                    
                    const discount = _.get(this.props, 'discount') || 0;
                    const marge = row.price || row.purchasePrice 
                                ? (row.price - row.purchasePrice) * 100 / row.price
                                : 100;
                    const markup = row.price && row.purchasePrice 
                                ? ((row.price / row.purchasePrice) - 1) * 100
                                : 0;
                    const content = (
                        <div>
                            <div>
                                <FormattedMessage id='order_form_table.marge' />: {marge.toFixed(0)}%
                            </div>
                            <div>
                                <FormattedMessage id='order_form_table.markup' />: {markup.toFixed(0)}%
                            </div>
                            <div>
                                <FormattedMessage id='order_form_table.discount' />: {discount.toFixed(0)}%
                            </div>
                        </div>
                    );
                    return (
                        <Popover content={content} trigger="hover">
                            <span style={{cursor: 'pointer', whiteSpace: 'nowrap'}}>
                                { data ? 
                                    `${strVal}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ' ',
                                    )
                                    : (
                                        <FormattedMessage id='long_dash' />
                                    ) }
                            </span>
                        </Popover>
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
                title: () => (
                    <div className={ Styles.numberColumn }>
                        <div>
                            <FormattedMessage id='storage.RESERVE' />
                        </div>
                        <div
                            className={Styles.headerActions}
                            style={{
                                paddingTop: 6,
                                opacity: this.state.selectedRowKeys.length == 0 && 0,
                                marginTop: this.state.selectedRowKeys.length == 0 && '-20px',
                                transitionDuration: "0.5s",
                                pointerEvents: this.state.selectedRowKeys.length == 0 && 'none',
                            }}
                        >
                            <Icon
                                type="lock"
                                className={Styles.icon}
                                title={this.props.intl.formatMessage({id: 'details_table.reserve'})}
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
                                        message: this.props.intl.formatMessage({id: 'details_table.reserved'}),
                                    });
                                    await this.updateDataSource();
                                }}
                            />
                            <Icon
                                type="unlock"
                                className={Styles.icon}
                                title={this.props.intl.formatMessage({id: 'details_table.unreserve'})}
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
                                        message: this.props.intl.formatMessage({id: 'details_table.unreserved'}),
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
                render:    (data, row) => {
                    let strVal = Number(data).toFixed(2);
                    
                    const discount = _.get(this.props, 'discount') || 0;
                    const marge = row.price || row.purchasePrice 
                                ? (row.price - row.purchasePrice) * 100 / row.price
                                : 100;
                    const markup = row.price && row.purchasePrice 
                                ? ((row.price / row.purchasePrice) - 1) * 100
                                : 0;
                    const content = (
                        <div>
                            <div>
                                <FormattedMessage id='order_form_table.marge' />: {marge.toFixed(0)}%
                            </div>
                            <div>
                                <FormattedMessage id='order_form_table.markup' />: {markup.toFixed(0)}%
                            </div>
                            <div>
                                <FormattedMessage id='order_form_table.discount' />: {discount.toFixed(0)}%
                            </div>
                        </div>
                    );
                    return (
                        <Popover content={content} trigger="hover">
                            <span style={{cursor: 'pointer', whiteSpace: 'nowrap'}}>
                                { data ? 
                                    `${strVal}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ' ',
                                    )
                                    : (
                                        <FormattedMessage id='long_dash' />
                                    ) }
                            </span>
                        </Popover>
                    );
                },
            },
            {
                title:  ()=>{
                            const updateAgreement = async (value) => {
                                const payload = {
                                    updateMode: true,
                                    details:    [],
                                }
                                this.state.selectedRows.map((elem)=>{
                                    payload.details.push({
                                        id: elem.id,
                                        agreement: value.toUpperCase(),
                                    })
                                })
                                await fetchAPI('PUT', `orders/${this.props.orderId}`, undefined, payload)
                                this.updateDataSource();
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
                            return (
                                <div>
                                    <FormattedMessage id='order_form_table.PD' />
                                    <div
                                        className={Styles.headerActions}
                                        style={{
                                            paddingTop: 6,
                                            opacity: this.state.selectedRowKeys.length == 0 && 0,
                                            marginTop: this.state.selectedRowKeys.length == 0 && '-20px',
                                            transitionDuration: "0.5s",
                                            pointerEvents: this.state.selectedRowKeys.length == 0 && 'none',
                                        }}
                                    >
                                        <Dropdown
                                            overlay={menu}
                                        >
                                            <Icon
                                                type={'question-circle'}
                                                style={{
                                                    fontSize: 24,
                                                }}
                                            />
                                        </Dropdown>
                                    </div>
                                </div>
                            )
                        },
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
                        case 'ENTER_DATA':
                            color = 'var(--disabled)';
                            break;
                        case 'CHOOSE_SUPPLIER':
                            color = 'var(--approve)';
                            break;
                        case 'ORDER':
                            color = 'var(--db_approve)';
                            break;
                        case 'RESERVE':
                            color = 'var(--db_progress)';
                            break;
                        case 'READY':
                            color = 'var(--db_success)';
                            break;
                        default:
                            color = null;
                    }

                    return row.id && (
                        <div 
                            style={ { 
                                background: color,
                                padding: '6px 2px',
                                textAlign: 'center',
                                fontWeight: 500,
                                // textTransform: 'uppercase',
                                // border: '1px solid black',
                            } }
                            title={this.props.intl.formatMessage({id: `status.${data}.title`})}
                        >
                            <FormattedMessage id={`status.${data}`}/>
                        </div>
                    );
                },
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
            warehouseId: detail.warehouseId,
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
                        warehousesModalSelectedRow.warehouseId = warehouseId;
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
                            disabled={ this.props.confirmed }
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
                    disabled={ this.props.disabled }
                    onClick={ () => {
                        this.setState({
                            visible:    true,
                            dataSource: [ detail ],
                        });
                    } }
                    title={ this.props.intl.formatMessage({ id: 'quick_edit' }) }
                    className={!this.props.disabled && Styles.ownIcon}
                    style={{
                        padding: '0px 8px'
                    }}
                >
                    <div
                        style={ {
                            width:           18,
                            height:          18,
                            backgroundColor: this.props.disabled
                                ? 'var(--text2)'
                                : 'var(--text3)',
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

    reserveProduct = async () => {
        const { detail, setModal, updateDetail, orderId, reserveWarehouseId, mainWarehouseId, onExit, showReserveModal, intl:{formatMessage} } = this.props;
        if(!detail.reserved) {
            await fetchAPI(
                'POST',
                `store_docs/reserve_all_possible`,
                {
                    ordersAppurtenanciesIds: `[${detail.id}]`,
                },
                undefined,
                { handleErrorInternally: true }
            );
            await notification.success({
                message: this.props.intl.formatMessage({id: 'details_table.reserved'}),
            });
        } else {
            await fetchAPI(
                'POST',
                `store_docs/unreserve_all_possible`,
                {
                    ordersAppurtenanciesIds: `[${detail.id}]`,
                },
                undefined,
                { handleErrorInternally: true }
            );
            await notification.success({
                message: this.props.intl.formatMessage({id: 'details_table.unreserved'}),
            });
        }

        await updateDetail(detail.key, detail);
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
