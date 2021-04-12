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
} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from "react-redux";
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { permissions, isForbidden, images, fetchAPI } from 'utils';
import { DetailProductModal, FavouriteDetailsModal, StoreProductTrackingModal, SetBarcodeModal } from 'modals';
import { AvailabilityIndicator } from 'components';
import { MODALS, setModal } from 'core/modals/duck';
import { Barcode } from "components";

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
                key:       'position',
                render:    (row) => {
                    return (
                        <div>
                            <Icon type="up-square" className={Styles.positionArrows}/>
                            <Icon type="down-square"  className={Styles.positionArrows}/>
                        </div>
                    )
                },
            },
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
                                            } else {
                                                this.setState({
                                                    productBarcode: code,
                                                })
                                                notification.warning({
                                                    message: 'Код не найден',
                                                });
                                            }
                                        }}
                                    />
                                    <div style={{opacity: 0, pointerEvents: 'none'}}>
                                        <Barcode
                                            button
                                        />
                                    </div>
                                </div>
                            ),
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
                            { !elem.detailName ? (
                                <FavouriteDetailsModal
                                    treeData={ this.props.detailsTreeData }
                                    disabled={ this.props.disabled || elem.reserved }
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
                            ) : (
                                <QuickEditModal
                                    treeData={ this.props.detailsTreeData }
                                    brands={ this.props.allDetails.brands }
                                    disabled={
                                        !elem.detailName || this.props.disabled || elem.reserved || stageDisabled
                                    }
                                    confirmed={ confirmed != 'undefined' }
                                    detail={ elem }
                                    onConfirm={ this.updateDetail }
                                    tableKey={ elem.key }
                                />
                            ) }
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
                            <div>
                                {row.detailCode || <FormattedMessage id='long_dash' />}
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
                render:    data => {
                    return data ? data : <FormattedMessage id='long_dash' />;
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
                            <div style={{width: '50%'}}>
                                {row.supplierName || <FormattedMessage id='long_dash' />}
                            </div>
                            <div style={{width: '50%'}}>
                                <AvailabilityIndicator indexArray={ row.store } />
                            </div>
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

                    return (
                        <div>
                            { data ? 
                                `${strVal}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                ) : (
                                    <FormattedMessage id='long_dash' />
                                ) }
                        </div>
                    );
                },
            },
            {
                title: (
                    <div className={ Styles.numberColumn }>
                        <FormattedMessage id='order_form_table.price' />
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
                key:       'price',
                dataIndex: 'price',
                render:    data => {
                    let strVal = Number(data).toFixed(2);

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
                        <FormattedMessage id='storage.RESERVE' />
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
                dataIndex: 'discount',
                render:    data => {
                    return (
                        <span>
                            { data
                                ? `${data}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ' ',
                                )
                                : 0 }%
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
                    let strVal = Number(data).toFixed(2);

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
                title:     <FormattedMessage id='order_form_table.status' />,
                key:       'agreement',
                dataIndex: 'agreement',
                render:    (data, elem) => {
                    const key = elem.key;
                    const confirmed = data.toLowerCase();
                    let color;
                    switch (confirmed) {
                        case 'rejected':
                            color = 'rgb(255, 126, 126)';
                            break;
                        case 'agreed':
                            color = 'var(--green)';
                            break;
                        default:
                            color = null;
                    }

                    return (
                        <Select
                            disabled={ isForbidden(
                                this.props.user,
                                permissions.ACCESS_ORDER_DETAILS_CHANGE_STATUS,
                            ) }
                            style={ { color: color } }
                            value={ confirmed }
                            onChange={ value => {
                                elem.agreement = value.toUpperCase();
                                this.updateDetail(key, elem);
                            } }
                        >
                            <Option key={ 0 } value={ 'undefined' }>
                                <FormattedMessage id='status.undefined' />
                            </Option>
                            <Option
                                key={ 1 }
                                value={ 'agreed' }
                                style={ { color: 'var(--green)' } }
                            >
                                <FormattedMessage id='status.agreed' />
                            </Option>
                            <Option
                                key={ 2 }
                                value={ 'rejected' }
                                style={ { color: 'rgb(255, 126, 126)' } }
                            >
                                <FormattedMessage id='status.rejected' />
                            </Option>
                        </Select>
                    );
                },
            },
            {
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
                                var that = this;
                                let token = localStorage.getItem(
                                    '_my.carbook.pro_token',
                                );
                                let url = __API_URL__;
                                let params = '/orders/frequent/details';
                                if (elem.frequentDetailId) { params += `?ids=[${elem.frequentDetailId}]`; } else { params += `?storeGroupIds=[${elem.storeGroupId}]`; }
                                url += params;
                                try {
                                    const response = await fetch(url, {
                                        method: elem.frequentDetailId
                                            ? 'DELETE'
                                            : 'POST',
                                        headers: {
                                            Authorization:  token,
                                            'Content-Type': 'application/json',
                                        },
                                    });
                                    const result = await response.json();
                                    if (result.success) {
                                        that.updateDataSource();
                                    } else {
                                        console.log('BAD', result);
                                    }
                                } catch (error) {
                                    console.error('ERROR:', error);
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
                                var that = this;
                                let token = localStorage.getItem(
                                    '_my.carbook.pro_token',
                                );
                                let url = __API_URL__;
                                let params = `/orders/${this.props.orderId}/details?ids=[${elem.id}]`;
                                url += params;
                                try {
                                    const response = await fetch(url, {
                                        method:  'DELETE',
                                        headers: {
                                            Authorization:  token,
                                            'Content-Type': 'application/json',
                                        },
                                    });
                                    const result = await response.json();
                                    if (result.success) {
                                        that.updateDataSource();
                                    } else {
                                        console.log('BAD', result);
                                    }
                                } catch (error) {
                                    console.error('ERROR:', error);
                                }
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
        ];
    }

    showDetailProductModal(key) {
        this.setState({
            productModalVisible: true,
            productModalKey:     key,
        });
    }
    hideDetailProductModal() {
        const { dataSource } = this.state;
        const lastDetail = dataSource[dataSource.length - 1];
        lastDetail.barcode = undefined;
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
        const { fetched, dataSource, productModalVisible, productModalKey, reserveModalVisible, reserveModalData, productBarcode } = this.state;

        const columns = this.columns;
        if (
            dataSource.length == 0 ||
            dataSource[ dataSource.length - 1 ].detailName != undefined
        ) {
            dataSource.push({
                key:          dataSource.length,
                id:           undefined,
                storeGroupId: undefined,
                detailId:     undefined,
                detailName:   undefined,
                detailCode:   undefined,
                brandId:      undefined,
                brandName:    undefined,
                comment:      {
                    comment:   undefined,
                    positions: [],
                },
                count:         0,
                price:         0,
                purchasePrice: 0,
                sum:           0,
                agreement:     'UNDEFINED',
            });
        }

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
                    detail={ dataSource[ productModalKey ] }
                    tableKey={ productModalKey }
                    updateDetail={ this.updateDetail }
                    updateDataSource={ this.updateDataSource }
                    clientVehicleVin={ clientVehicleVin }
                    showOilModal={ showOilModal }
                    oilModalData={ oilModalData }
                    clearOilData={ clearOilData }
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
                render:    data => {
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
                                this.state.dataSource[ 0 ].purchasePrice = value;
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
