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
                                        }
                                        else if(value == ORDERINCOME) {
                                            typeFilter(INCOME);
                                            documentTypeFilter(SUPPLIER);
                                        }
                                        else if(value == SUPPLIER) {
                                            typeFilter(EXPENSE);
                                            documentTypeFilter(value);
                                        }
                                    }
                                    else {
                                        documentTypeFilter(value);
                                    }
                                    this.setState({
                                        documentType: event.target.value
                                    })
                                } }
                                defaultValue={ null }
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
                <StorageDateFilter
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



export class StorageDateFilter extends React.Component {
    constructor(props) {
        super(props);
    }

    verifyDate(dateRange) {
        if (dateRange && dateRange.length != 2) {
            const thisYear = moment().startOf('year');
            const defaultDateRange = [ moment(thisYear, this.props.dateFormat), moment(new Date(), this.props.dateFormat) ];

            return defaultDateRange;
        }

        return dateRange;
    }

    updateDimensions = () => {
        this.setState({});
    };

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        const {
            dateRange,
            onDateChange,
            minimize,
            autoMinimize,
            style,
        } = this.props;

        const maxWidth = typeof autoMinimize == "number" ? autoMinimize : 1440;
        const minimizeMode = autoMinimize ? window.innerWidth < maxWidth : minimize;

        const dateFormat = this.props.dateFormat || 'DD.MM.YYYY';
        const currentYear = new Date().getFullYear();
        const yearOptions = [];

        for(let year = currentYear-1; year > currentYear - 4; year--) {
            yearOptions.push(year);
        }

        const datePicker = (
            <div className={ Styles.filterDatePicker }>
                <RangePicker
                    allowClear={ false }
                    style={{width: '100%'}}
                    value={ this.verifyDate(dateRange) }
                    format={ dateFormat }
                    onChange={ newDate => {
                        onDateChange(newDate);
                    } }
                />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment(new Date(), dateFormat),
                                            moment(new Date(), dateFormat)
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.today' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-1, 'day'),
                                            moment().add(-1, 'day'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.yesterday' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(1, 'day'),
                                            moment().add(1, 'day'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.tomorrow' />
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button>
                            <FormattedMessage id="datepicker.day"/>
                        </Button>
                    </Dropdown>
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('week'),
                                            moment().endOf('week'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.current' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('week').add(-1, 'week'),
                                            moment().endOf('week').add(-1, 'week')
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.previous' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('week').add(1, 'week'),
                                            moment().endOf('week').add(1, 'week')
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.next' />
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button>
                            <FormattedMessage id="datepicker.week"/>
                        </Button>
                    </Dropdown>
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('month'),
                                            moment().endOf('month'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.current' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-1, 'month').startOf('month'),
                                            moment().add(-1, 'month').endOf('month')
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.previous' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-2, 'month').startOf('month'),
                                            moment().add(-2, 'month').endOf('month')
                                        ]);
                                    }}
                                >
                                    2 <FormattedMessage id='datepicker.month_before' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-3, 'month').startOf('month'),
                                            moment().add(-3, 'month').endOf('month')
                                        ]);
                                    }}
                                >
                                    3 <FormattedMessage id='datepicker.month_before' />
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button>
                            <FormattedMessage id="datepicker.month"/>
                        </Button>
                    </Dropdown>
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('quarter'),
                                            moment().endOf('quarter'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.current' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-1, 'quarter').startOf('quarter'),
                                            moment().add(-1, 'quarter').endOf('quarter')
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.previous' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-2, 'quarter').startOf('quarter'),
                                            moment().add(-2, 'quarter').endOf('quarter')
                                        ]);
                                    }}
                                >
                                    2 <FormattedMessage id='datepicker.quarters_before' />
                                </Menu.Item>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().add(-3, 'quarter').startOf('quarter'),
                                            moment().add(-3, 'quarter').endOf('quarter')
                                        ]);
                                    }}
                                >
                                    3 <FormattedMessage id='datepicker.quarters_before' />
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button>
                            <FormattedMessage id="datepicker.quarter"/>
                        </Button>
                    </Dropdown>
                    <Dropdown
                        className={Styles.datePickerButton}
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={()=>{
                                        onDateChange([
                                            moment().startOf('year'),
                                            moment().endOf('year'),
                                        ]);
                                    }}
                                >
                                    <FormattedMessage id='datepicker.current' />
                                </Menu.Item>
                                {yearOptions.map((year, key)=>{
                                    return (
                                        <Menu.Item
                                            style={{
                                                textDecoration: 'lowercase'
                                            }}
                                            key={key}
                                            onClick={()=>{
                                                onDateChange([
                                                    moment(new Date('1/1/' + year), dateFormat),
                                                    moment(new Date('1/1/' + year), dateFormat).endOf('year')
                                                ]);
                                            }}
                                        >
                                            {year} <FormattedMessage id='datepicker.year' />
                                        </Menu.Item>
                                    )
                                })}
                            </Menu>
                        }
                    >
                        <Button>
                            <FormattedMessage id="datepicker.year"/>
                        </Button>
                    </Dropdown>
                </div>
            </div>
        )

        return minimizeMode ? (
            <div className={Styles.minimized} style={style}>
                <Popover content={datePicker} trigger="click">
                    <Button>
                        <Icon type='calendar' />
                    </Button>
                </Popover>
            </div>
        ) : (
            datePicker
        );
    }
}

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
        const { intl: { formatMessage }, style } = this.props;
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
                >
                    {options}
                </Select>
            </div>
        )
    }
}