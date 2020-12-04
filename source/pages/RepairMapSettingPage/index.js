// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table, Button, Checkbox, Select, Modal, Icon, Input, InputNumber, Switch } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import {Layout} from 'commons';
// own
import Styles from './styles.m.css';
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
                title:     <FormattedMessage id='repair_map_setting.position' />,
                key:       'level2ShowPosition',
                dataIndex: 'level2ShowPosition',
                width: 'min-content', 
                render: (position, row) => {
                    const key = position - 1;
                    return (
                        <div
                            style={{width: '70px'}}
                        >
                            <Icon
                                className={position>1 ? Styles.arrowUp : Styles.arrowDisabled}
                                type="up-square"
                                onClick={() => {
                                    if(position > 1) {
                                        row.level2ShowPosition = position - 1;
                                        this.state.dataSource[row.parentKey].childs[key-1].level2ShowPosition = position;
                                        this.updateChild(row);
                                        this.updateChild(this.state.dataSource[row.parentKey].childs[key-1]);
                                    }
                                }}
                            />
                            <Icon
                                className={this.state.dataSource[row.parentKey].childs.length > position ? Styles.arrowDown : Styles.arrowDisabled}
                                type="down-square"
                                onClick={() => {
                                    if(this.state.dataSource[row.parentKey].childs.length > position) {
                                        row.level2ShowPosition = position + 1;
                                        this.state.dataSource[row.parentKey].childs[key+1].level2ShowPosition = position;
                                        this.updateChild(row);
                                        this.updateChild(this.state.dataSource[row.parentKey].childs[key+1]);
                                    }
                                }}
                            />
                            {position}
                        </div>
                    )
                }
            },
            {
                title:     <FormattedMessage id='repair_map_setting.name' />,
                key:       'name',
                dataIndex: 'name',
                render: (name, row) => {
                    return (
                        <Input
                            value={name}
                            onChange={(event)=>{
                                const value = event.target.value;
                                row.name = value;
                                this.setState({})
                            }}
                            onBlur={()=>{
                                this.updateChild(row);
                            }}
                        />
                    )
                }
            },
            {
                title:     <FormattedMessage id='repair_map_setting.color' />,
                key:       'noColor',
                dataIndex: 'noColor',
                width: 'min-content',
                render: (data, row)=>{
                    return (
                        <Select
                            value={data}
                            style={{width: 180}}
                            onChange={(value)=>{
                                row.noColor = value;
                                this.updateChild(row);
                            }}
                        >
                            <Option
                                value={ 'YELLOW' }
                            >
                                <div style={{border: "1px solid black", backgroundColor: "yellow", height: '12px', width: '12px', display: 'inline-block', marginRight: '10px'}}></div>
                                <FormattedMessage id='repair_map_setting.yellow' />
                            </Option>
                            <Option
                                value={ 'RED' }
                            >
                                <div style={{border: "1px solid black", backgroundColor: "red", height: '12px', width: '12px', display: 'inline-block', marginRight: '10px'}}></div>
                                <FormattedMessage id='repair_map_setting.red' />
                            </Option>
                        </Select>
                    )
                }
            },
            {
                title:     <FormattedMessage id='repair_map_setting.block' />,
                key:       'block',
                dataIndex: 'block',
                width:      120,
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
                key: 'toDefault',
                width: 'min-content',
                render: (row) => {
                    return (
                        <Icon
                            style={{width: '30px'}}
                            type='redo'
                            onClick={()=>this.importDefault(row.id)}
                        />
                    )
                }
            },
            {
                key:       'show',
                dataIndex: 'show',
                width: 'min-content',
                render: (data, row)=>{
                    return (
                        <Switch
                        style={{width: '50px'}}
                            disabled={!this.state.dataSource[row.parentKey].show}
                            checked={data}
                            onChange={(value)=>{
                                row.show = value;
                                this.updateChild(row);
                            }}
                        />
                    )
                }
            }
        ]
    }

    async updateChild(child, dontUpdate = false) {
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
            if(!dontUpdate) this.fetchData()
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

    changeGroupShow(key, show) {
        this.state.dataSource[key].show = show;
        this.state.dataSource[key].childs.map((child)=>{
            child.show = show;
        });
        this.setState({});
        this.state.dataSource[key].childs.map((child)=>{
            this.updateChild(child, true);
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
                            type='primary'
                            style={{marginRight: 10}}
                            onClick={ () =>
                                this.importDefault()
                            }
                        >
                            <FormattedMessage id='diagnostic-page.import_default' />
                        </Button>
                    </div>
                }
            >
                {dataSource.map((mapGroup, key)=>{
                    return (
                        <div key={key}>
                            <div className={Styles.groupTitle}>
                                <div>
                                    {mapGroup.name}
                                </div>
                                <div>
                                    <Switch
                                        checked={mapGroup.show}
                                        onChange={(value)=>{
                                            this.changeGroupShow(key, value)
                                        }}
                                    />
                                </div>  
                            </div>
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
