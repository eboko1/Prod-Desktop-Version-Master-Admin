// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { DatePicker, Icon, Radio, Button, Dropdown, Menu, Popover, Select } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';
import { DateRangePicker } from 'components';
// own
import Styles from './styles.m.css';
const { RangePicker } = DatePicker;
const Option = Select.Option;
var isOrder, isTransfer;
const INCOME = 'INCOME',
      EXPENSE = 'EXPENSE',
      SUPPLIER = 'SUPPLIER',
      RESERVE = 'RESERVE',
      CLIENT = 'CLIENT',
      INVENTORY = 'INVENTORY',
      OWN_CONSUMPTION = 'OWN_CONSUMPTION',
      TRANSFER = 'TRANSFER',
      ADJUSTMENT = 'ADJUSTMENT',
      ORDERINCOME = 'ORDERINCOME',
      ORDER = 'ORDER',
      NEW = 'NEW',
      DONE = 'DONE',
      MAIN = 'MAIN',
      TOOL = 'TOOL',
      REPAIR_AREA= 'REPAIR_AREA';
      
const typeToDocumentType = {
    income: {
        type: INCOME,
        documentType: [SUPPLIER, CLIENT, INVENTORY],
    },
    expense: {
        type: EXPENSE,
        documentType: [CLIENT, SUPPLIER, INVENTORY, OWN_CONSUMPTION],
    },
    transfer: {
        type: EXPENSE,
        documentType: [TRANSFER, RESERVE, TOOL, REPAIR_AREA],
    },
    order: {
        type: ORDER,
        documentType: [SUPPLIER, ADJUSTMENT, ORDERINCOME],
    }, 
}

@withRouter
@injectIntl
class StorageDocumentsFilters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: undefined,
            documentType: undefined,
        };

        const { pathname } = props.history.location;
        isOrder = pathname == '/storage-orders';
        isTransfer = pathname == '/storage-transfers';
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.isFetched && this.props.isFetched && this.props.location.state && this.props.location.state.showForm) {

            const {
                dateRange,
                dateFormat,
                onDateChange,
                typeFilter,
                documentTypeFilter,
                documentStatusFilter,
                type,
            } = this.props;
            const {
                documentType
            } = this.state;

            const value = this.props.location.state.formData.documentType;
            console.log(value)
            if(type == ORDER) {
                if(value == null) {
                    typeFilter(null);
                    documentTypeFilter(null);
                } else if(value == ORDERINCOME) {
                    typeFilter(EXPENSE);
                    documentTypeFilter(SUPPLIER, ORDERINCOME);
                } else if(value == SUPPLIER) {
                    typeFilter(INCOME);
                    documentTypeFilter(value);
                } else {
                    typeFilter(null);
                    documentTypeFilter(value);
                }
            } else {
                documentTypeFilter(value);
            }
            this.setState({
                documentType: value,
            })
        }
    }

    render() {
        const {
            dateRange,
            dateFormat,
            onDateChange,
            typeFilter,
            documentTypeFilter,
            documentStatusFilter,
            type,
        } = this.props;
        const {
            documentType
        } = this.state;

        return (
            <div className={ Styles.filtersWrap }>
               <div className={ Styles.filterRadioButtonGroup }>
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlay={
                            <Radio.Group
                                //buttonStyle="solid"
                                onChange={ event => {
                                    const { value } = event.target;
                                    if(type == ORDER) {
                                        if(value == null) {
                                            typeFilter(null);
                                            documentTypeFilter(null);
                                        } else if(value == ORDERINCOME) {
                                            typeFilter(EXPENSE);
                                            documentTypeFilter(SUPPLIER, ORDERINCOME);
                                        } else if(value == SUPPLIER) {
                                            typeFilter(INCOME);
                                            documentTypeFilter(value);
                                        } else {
                                            typeFilter(null);
                                            documentTypeFilter(value);
                                        }
                                    } else {
                                        documentTypeFilter(value);
                                    }
                                    this.setState({
                                        documentType: event.target.value
                                    })
                                } }
                                defaultValue={
                                    this.props.location.state && this.props.location.state.showForm ? 
                                    this.props.location.state.formData.documentType :
                                    null 
                                }
                            >
                                <Radio.Button value={ null }>
                                    <FormattedMessage id='storage_document.all' />
                                </Radio.Button>
                                {typeToDocumentType[type.toLowerCase()].documentType.map((counterpart, i)=>{
                                    return (
                                    <Radio.Button value={ counterpart } key={ i }>
                                        <FormattedMessage id={`storage_document.docType.${type}.${counterpart}`}/>
                                    </Radio.Button>
                                    )
                                })}
                            </Radio.Group>
                        }
                    >
                        <Button>
                            {documentType ? <FormattedMessage id={`storage_document.docType.${type}.${documentType}`}/> : <FormattedMessage id='storage_document.all' />}
                        </Button>
                    </Dropdown>
                </div>
                <div className={ Styles.filterRadioButtonGroup }>
                    <Radio.Group
                        //buttonStyle="solid"
                        onChange={ event => {
                            documentStatusFilter(event.target.value);
                        } }
                        defaultValue={ null }
                    >
                        <Radio.Button value={ null }>
                            <FormattedMessage id='storage_document.all' />
                        </Radio.Button>
                        <Radio.Button value='NEW'>
                            <FormattedMessage id='storage_document.status_created' />{ ' ' }
                            <Icon
                                type='clock-circle'
                                theme='filled'
                                style={ { color: 'var(--orange)' } }
                            />
                        </Radio.Button>
                        <Radio.Button value='DONE'>
                            <FormattedMessage id='storage_document.status_confirmed' />{ ' ' }
                            <Icon
                                type='check-circle'
                                theme='filled'
                                style={ { color: 'var(--green)' } }
                            />
                        </Radio.Button>
                    </Radio.Group>
                </div>
                <DateRangePicker
                    autoMinimize
                    dateRange={dateRange}
                    dateFormat={dateFormat}
                    onDateChange={onDateChange}
                />
                
            </div>
        );
    }
}

export default StorageDocumentsFilters;

@injectIntl
export class WarehouseSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            warehouses: [],
        };
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
            data.map((warehouse, i)=>{
                warehouse.key = i;
            })
            that.setState({
                warehouses: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidMount() {
        this.getWarehouses();
    }

    render() {
        const { intl: { formatMessage }, style, onChange } = this.props;
        const { warehouses } = this.state;
        const options = warehouses.map((warehouse, key)=>(
            <Option 
                key={key}
                value={warehouse.id}
                warehouse_attribute={warehouse.attribute}
            >
                {warehouse.name}
            </Option>
        ))
        return (
            <div className={Styles.warehouseSelect} style={style} >
                <Select
                    showSearch
                    allowClear
                    style={{ minWidth: 220 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                    placeholder={formatMessage({id: 'storage'})}
                    onChange={(value)=>{
                        onChange(value);
                    }}
                >
                    {options}
                </Select>
            </div>
        )
    }
}

@injectIntl
export class BrandSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            brands: [],
            searchValue: "",
        };
    }

    getBrands() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + '/brands';
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
            data.map((brand, i)=>{
                brand.key = i;
            })
            that.setState({
                brands: data,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    componentDidMount() {
        this.getBrands();
    }

    render() {
        const { intl: { formatMessage }, style, onSelect } = this.props;
        const { brands, searchValue } = this.state;
        const options = brands.map((brand, key)=>(
            <Option 
                key={key}
                value={brand.brandId}
            >
                {brand.brandName}
            </Option>
        ))
        return (
            <div className={Styles.warehouseSelect} style={style} >
                <Select
                    showSearch
                    allowClear
                    style={{ minWidth: 220 }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220 }}
                    placeholder={formatMessage({id: 'order_form_table.brand'})}
                    filterOption={(input, option) => {
                        return (
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                            String(option.props.value).indexOf(input.toLowerCase()) >= 0
                        )
                    }}
                    onSelect={(value)=>{
                        onSelect(value);
                        
                    }}
                    onSearch={(input)=>{
                        this.setState({
                            searchValue: input,
                        })
                    }}
                    onBlur={()=>{
                        this.setState({
                            searchValue: "",
                        })
                    }}
                >
                    {searchValue.length > 1 ? options : []}
                </Select>
            </div>
        )
    }
}