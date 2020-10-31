// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { DatePicker, Icon, Radio, Button, Dropdown, Menu } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Catcher } from 'commons';

// own
import Styles from './styles.m.css';
const { RangePicker } = DatePicker;
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
            documentTypeFilter,
            documentStatusFilter,
            type,
        } = this.props;

        return (
            <div className={ Styles.filtersWrap }>
               {!isTransfer && 
               <div className={ Styles.filterRadioButtonGroup }>
                    <Radio.Group
                        //buttonStyle="solid"
                        onChange={ event => {
                            documentTypeFilter(event.target.value);
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
                </div>}
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

    render() {
        const {
            dateRange,
            onDateChange,
        } = this.props;

        const dateFormat = this.props.dateFormat || 'DD.MM.YYYY';
        const currentYear = new Date().getFullYear();
        const yearOptions = [];

        for(let year = currentYear-1; year > currentYear - 4; year--) {
            yearOptions.push(year);
        }

        return (
            <div className={ Styles.filterDatePicker }>
                    <RangePicker
                        allowClear={ false }
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
                                </Menu>
                            }
                        >
                            <Button>
                                <FormattedMessage id="datepicker.day"/>
                            </Button>
                        </Dropdown>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item
                                        onClick={()=>{
                                            onDateChange([
                                                moment().startOf('week'),
                                                moment(new Date(), dateFormat)
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
                                </Menu>
                            }
                        >
                            <Button>
                                <FormattedMessage id="datepicker.week"/>
                            </Button>
                        </Dropdown>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item
                                        onClick={()=>{
                                            onDateChange([
                                                moment().startOf('month'),
                                                moment(new Date(), dateFormat)
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
                            overlay={
                                <Menu>
                                    <Menu.Item
                                        onClick={()=>{
                                            onDateChange([
                                                moment().startOf('quarter'),
                                                moment(new Date(), dateFormat)
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
                            overlay={
                                <Menu>
                                    <Menu.Item
                                        onClick={()=>{
                                            onDateChange([
                                                moment().startOf('year'),
                                                moment(new Date(), dateFormat)
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
        );
    }
}