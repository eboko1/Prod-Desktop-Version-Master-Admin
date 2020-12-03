// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table, Button, Checkbox, Select, Modal, Icon, Input, InputNumber } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import {Layout} from 'commons';
// own
const Option = Select.Option;
const { confirm } = Modal;
const   HEADER_CLIENT_SEARCH = 'HEADER_CLIENT_SEARCH',
        HEADER_STATION = 'HEADER_STATION',
        HEADER_EMPLOYEE = 'HEADER_EMPLOYEE',
        HEADER_REQUISITES = 'HEADER_REQUISITES',
        HEADER_CHANGE_STATUS = 'HEADER_CHANGE_STATUS',
        DIAGNOSTICS_ADD = 'DIAGNOSTICS_ADD',
        DIAGNOSTICS_ELEMENTS = 'DIAGNOSTICS_ELEMENTS',
        DIAGNOSTICS_COMPLETE = 'DIAGNOSTICS_COMPLETE',
        DIAGNOSTICS_CALCULATION = 'DIAGNOSTICS_CALCULATION',
        LABORS = 'LABORS',
        DETAILS = 'DETAILS',
        LABORS_DISCOUNTS = 'LABORS_DISCOUNTS',
        DETAILS_DISCOUNTS = 'DETAILS_DISCOUNTS',
        HEADER_SEND_AGREEMENT = 'HEADER_SEND_AGREEMENT',
        PRINT_INVOICE = 'PRINT_INVOICE',
        HEADER_PAY = 'HEADER_PAY',
        STOCK_BUTTON_ORDERED = 'STOCK_BUTTON_ORDERED',
        STOCK_BUTTON_ACCEPTED = 'STOCK_BUTTON_ACCEPTED',
        STOCK_BUTTON_RESERVED = 'STOCK_BUTTON_RESERVED',
        PRINT_ACT_OF_ACCEPTANCE = 'PRINT_ACT_OF_ACCEPTANCE',
        STOCK_BUTTON_GIVEN = 'STOCK_BUTTON_GIVEN',
        CREATE_DOC_TOL = 'CREATE_DOC_TOL',
        PRINT_BUSINESS_ORDER = 'PRINT_BUSINESS_ORDER',
        WORKSHOP = 'WORKSHOP',
        WORKSHOP_BUTTON_FINISH = 'WORKSHOP_BUTTON_FINISH',
        STOCK_BUTTON_RETURNED = 'STOCK_BUTTON_RETURNED',
        CREATE_DOC_TOR = 'CREATE_DOC_TOR',
        ORDER_CHECK = 'ORDER_CHECK',
        PRINT_COMPLETED_WORK = 'PRINT_COMPLETED_WORK';
const OPERATIONS = [
    HEADER_CLIENT_SEARCH,
    HEADER_STATION,
    HEADER_EMPLOYEE,
    HEADER_REQUISITES,
    HEADER_CHANGE_STATUS,
    DIAGNOSTICS_ADD,
    DIAGNOSTICS_ELEMENTS,
    DIAGNOSTICS_COMPLETE,
    DIAGNOSTICS_CALCULATION,
    LABORS,
    DETAILS,
    LABORS_DISCOUNTS,
    DETAILS_DISCOUNTS,
    HEADER_SEND_AGREEMENT,
    PRINT_INVOICE,
    HEADER_PAY,
    STOCK_BUTTON_ORDERED,
    STOCK_BUTTON_ACCEPTED,
    STOCK_BUTTON_RESERVED,
    PRINT_ACT_OF_ACCEPTANCE,
    STOCK_BUTTON_GIVEN,
    CREATE_DOC_TOL,
    PRINT_BUSINESS_ORDER,
    WORKSHOP,
    WORKSHOP_BUTTON_FINISH,
    STOCK_BUTTON_RETURNED,
    CREATE_DOC_TOR,
    ORDER_CHECK,
    PRINT_COMPLETED_WORK
];

@injectIntl
export default class RepairMapSettingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };

        this.columns = [
            {
                title:     'Position',
                key:       'level2ShowPosition',
                dataIndex: 'level2ShowPosition',
                render: (position, row) => {
                    const key = position - 1;
                    return (
                        <InputNumber
                            value={position}
                            onChange={(value)=>{
                                if(position > value) {
                                    if(this.state.dataSource[row.parentKey].childs.length > position) {
                                        this.state.dataSource[row.parentKey].childs[key] = {
                                            ...this.state.dataSource[row.parentKey].childs[key+1],
                                            level2ShowPosition: position,
                                            key: key,
                                        };
                                        this.state.dataSource[row.parentKey].childs[key+1] = {
                                            ...row,
                                            level2ShowPosition: this.state.dataSource[row.parentKey].childs[key+1].level2ShowPosition,
                                            key: this.state.dataSource[row.parentKey].childs[key+1].key,
                                        };
                                        this.updateChild(row);
                                        this.updateChild(this.state.dataSource[row.parentKey].childs[key+1]);
                                    }
                                } else {
                                    if(position > 1) {
                                        this.state.dataSource[row.parentKey].childs[key] = {
                                            ...this.state.dataSource[row.parentKey].childs[key-1],
                                            level2ShowPosition: position,
                                            key: key,
                                        };
                                        this.state.dataSource[row.parentKey].childs[key-1] = {
                                            ...row,
                                            level2ShowPosition: this.state.dataSource[row.parentKey].childs[key-1].level2ShowPosition,
                                            key: this.state.dataSource[row.parentKey].childs[key-1].key,
                                        };
                                        this.updateChild(row);
                                        this.updateChild(this.state.dataSource[row.parentKey].childs[key-1]);
                                    }
                                }
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='order_form_table.detail_name' />,
                key:       'name',
                dataIndex: 'name',
                render: (name, row) => {
                    return (
                        <Input
                            value={name}
                            onChange={(event)=>{
                                const value = event.target.value;
                                row.name = value;
                                this.updateChild(row);
                            }}
                        />
                    )
                }
            },
            {
                title:     'No color',
                key:       'noColor',
                dataIndex: 'noColor',
                render: (data, row)=>{
                    let color;
                    switch (data) {
                        case 'YELLOW':
                            color = 'var(--orange)';
                            break;
                        case 'RED':
                            color = 'var(--disabled)';
                            break;
                        default:
                            color = null;
                    }
                    return (
                        <Select
                            value={data}
                            style={ { color: color } }
                            onChange={(value)=>{
                                row.noColor = value;
                                this.updateChild(row);
                            }}
                        >
                            <Option
                                value={ 'YELLOW' }
                                style={ { color: 'var(--orange)' } }
                            >
                                YELLOW
                            </Option>
                            <Option
                                value={ 'RED' }
                                style={ { color: 'var(--disabled)' } }
                            >
                                RED
                            </Option>
                        </Select>
                    )
                }
            },
            {
                title:     'Show',
                key:       'show',
                dataIndex: 'show',
                render: (data, row)=>{
                    return (
                        <Checkbox
                            checked={data}
                            onChange={(event)=>{
                                const value = event.target.checked;
                                row.show = value;
                                this.updateChild(row);
                            }}
                        />
                    )
                }
            },
            {
                title:     'Block',
                key:       'block',
                dataIndex: 'block',
                render: (data, row)=>{
                    return (
                        <Checkbox
                            checked={data}
                            onChange={(event)=>{
                                const value = event.target.checked;
                                row.block = value;
                                this.updateChild(row);
                            }}
                        />
                    )
                }
            },
            {
                title:     'Operation',
                key:       'operation',
                dataIndex: 'operation',
                render: (operation, row)=>{
                    return (
                        <Select
                            value={operation}
                            onChange={(value)=>{
                                row.operation = value;
                                this.updateChild(row);
                            }}
                        >
                            {OPERATIONS.map((operation, key)=>{
                                return (
                                    <Option
                                        key={key}
                                        value={ operation }
                                    >
                                        {operation}
                                    </Option>
                                )
                            })}
                            <Option
                                value={ null }
                            >
                                <FormattedMessage id='long_dash' />
                            </Option>
                        </Select>
                    )
                }
            },
            {
                title: 'Reset',
                key: 'toDefault',
                render: (row) => {
                    return (
                        <Icon
                            type='redo'
                            onClick={()=>this.importDefault(row.id)}
                        />
                    )
                }
            }
        ]
    }

    async updateChild(child) {
        const updateData = {
            id: child.id,
            show: child.show,
            operation: child.operation,
            name: child.name,
            level2ShowPosition: child.level2ShowPosition,
            noColor: child.noColor,
            block: child.block,
        };
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/repair_map`;
        try {
            const response = await fetch(url, {
                method:  'POST',
                headers: {
                    Authorization:  token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            const result = await response.json();
            this.fetchData()
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    async fetchData() {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/repair_map`;
        try {
            const response = await fetch(url, {
                method:  'GET',
                headers: {
                    Authorization:  token,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            console.log(result);
            result.map((elem, parentKey)=>{
                if(elem.childs) {
                    elem.childs.map((child, key)=>{
                        child.parentKey = parentKey;
                        child.key = key;
                    })
                }
            })
            this.setState({
                dataSource: result,
            })
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    importDefault(id) {
        const title = this.props.intl.formatMessage({id: 'agreement.confirm_title'});
        const content = this.props.intl.formatMessage({id: 'agreement.confirm_content'});
        const { confirm } = Modal;
        confirm({
            title: title,
            content: content,
            onOk: async ()=>{
                let token = localStorage.getItem('_my.carbook.pro_token');
                let url = __API_URL__ + `/repair_map/changes`;
                if(id) url += `?id=${id}`;
            
                await fetch(url, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': token,
                        }
                    });
                await this.fetchData();
            },
            onCancel: ()=>{console.log('Canceled')},
        });
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const { dataSource } = this.state;
        return (
            <Layout
                title={<FormattedMessage id='navigation.repair_map'/>}
                controls={
                    <div>
                        <Button
                            style={{marginRight: 10}}
                            onClick={ () =>
                                this.importDefault()
                            }
                        >
                            <FormattedMessage id='diagnostic-page.import_default' />
                        </Button>
                        <Button
                            type='primary'
                        >
                            <FormattedMessage id='save' />
                        </Button>
                    </div>
                }
            >
                {dataSource.map((mapGroup, key)=>{
                    return (
                        <div key={key}>
                            <div>{mapGroup.name}</div>
                            <Table
                                style={{overflowX: 'scroll'}}
                                columns={this.columns}
                                pagination={ false }
                                dataSource={ mapGroup.childs }
                            />
                        </div>
                    )
                })}
            </Layout>
        );
    }
}
