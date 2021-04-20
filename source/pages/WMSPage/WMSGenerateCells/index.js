// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Switch, Input, Button, notification, Select, Table } from "antd";
import _ from 'lodash';
import moment from 'moment';
import { type } from "ramda";

// proj
import { permissions, isForbidden, fetchAPI } from "utils";

// own
import Styles from "./styles.m.css";
const Option = Select.Option;
const CAPITAL_LETTERS = 'CAPITAL_LETTERS';
const NUMBERS = 'NUMBERS';
const LOWER_CASE_LETTERS = 'LOWER_CASE_LETTERS';
const WAREHOUSE = 'WAREHOUSE';
const ZONE = 'ZONE';
const PLOT = 'PLOT';
const ROW = 'ROW';
const SECTION = 'SECTION';
const SHELF = 'SHELF';
const CELL = 'CELL';
const TYPES = [WAREHOUSE, ZONE, PLOT, ROW, SECTION, SHELF, CELL];

export default class WMSGenerateCells extends Component {
    constructor(props) {
        super(props);
        this.state = {
            generateSettings: [],
            warehouseId: undefined,
        };

        this.columns = [
            {
                key: 'type',
                dataIndex: 'type',
                width: '20%',
                render: (data, row) => {
                    return (
                        <FormattedMessage id={`wms.${data}`} />
                    )
                }
            },
            {
                title: <FormattedMessage id="wms.active" />,
                key: 'active',
                dataIndex: 'active',
                width: '10%',
                render: (data, row) => {
                    return (
                        <Switch
                            checked={data}
                            onChange={(value)=>{
                                row.active = value;
                                this.setState({})
                            }}
                        />
                    )
                }
            },
            {
                title: <FormattedMessage id="wms.alias" />,
                key: 'aliasType',
                dataIndex: 'aliasType',
                width: '20%',
                render: (data, row) => {
                    return row.active && (
                        <Select
                            value={data}
                            onChange={(value, {props})=>{
                                console.log(props);
                                row.aliasType = value;
                                row.minValue = props.min;
                                row.maxValue = props.max;
                                this.setState({})
                            }}
                        >
                            <Option value={CAPITAL_LETTERS} min={'A'} max={'C'}>
                                A, B, C
                            </Option>
                            <Option value={NUMBERS} min={'1'} max={'3'}>
                                1, 2, 3
                            </Option>
                            <Option value={LOWER_CASE_LETTERS} min={'a'} max={'c'}>
                                a, b, c
                            </Option>
                        </Select>
                    )
                }
            },
            {
                title: <FormattedMessage id="wms.add_zero" />,
                key: 'addZeros',
                dataIndex: 'addZeros',
                width: '12%',
                render: (data, row) => {
                    return row.active && (
                        <Switch
                            checked={data}
                            onChange={(value)=>{
                                row.addZeros = value;
                                this.setState({})
                            }}
                        />
                    )
                }
            },
            {
                title: <FormattedMessage id="wms.min" />,
                key: 'minValue',
                dataIndex: 'minValue',
                width: '19%',
                render: (data, row) => {
                    return row.active && (
                        <Input
                            value={data}
                            onChange={(event)=>{
                                row.minValue = event.target.value;
                                this.setState({})
                            }}
                        />
                    )
                }
            },
            {
                title: <FormattedMessage id="wms.max" />,
                key: 'maxValue',
                dataIndex: 'maxValue',
                width: '19%',
                render: (data, row) => {
                    return row.active && (
                        <Input
                            value={data}
                            onChange={(event)=>{
                                row.maxValue = event.target.value;
                                this.setState({})
                            }}
                        />
                    )
                }
            }
        ]
    }

    _generateAddresses = async () => {
        const { warehouseId, fetchCells } = this.props;
        const { generateSettings } = this.state;
        const payload = generateSettings.filter((row)=>row.active);
        payload.map((elem)=>{
            delete elem.active;
        })
        await fetchAPI(
            'POST',
            'wms/generate_cells',
            {warehouseId},
            payload
        );
        fetchCells();
    }

    componentDidMount() {
        const { generateSettings: propsSettings } = this.props;
        const generateSettings = TYPES.map((type)=>(
            {
                type,
                active: false,
                aliasType: CAPITAL_LETTERS,
                addZeros: false,
                minValue: 'A',
                maxValue: 'C',
            }
        ));
        propsSettings.map((propSetting)=>{
            generateSettings.map((setting, key)=>{
                if(propSetting.type == setting.type) {
                    generateSettings[key] = {
                        type: propSetting.type,
                        active: true,
                        aliasType: propSetting.aliasType,
                        addZeros: propSetting.addZeros,
                        minValue: propSetting.minValue,
                        maxValue: propSetting.maxValue,
                    }
                }
            })
        })
        this.setState({generateSettings});
    }

    componentDidUpdate(prevProps) {

    }

    render() {
        const { warehouseId } = this.props;
        const { generateSettings } = this.state;
        let isActive = false;
        generateSettings.map(({active})=>{
            isActive = isActive || active
        })
        return (
            <div>
                {warehouseId 
                    ? <>
                        <div className={Styles.tabTitle}>
                            <FormattedMessage id='wms.address_system_settings' />
                        </div>
                        <Table
                            size={'small'}
                            columns={this.columns}
                            dataSource={generateSettings}
                            pagination={false}
                            rowKey={'type'}
                        />
                        <div className={Styles.tabFooter}>
                            <Button
                                type='primary'
                                onClick={this._generateAddresses}
                                disabled={!isActive}
                            >
                                <FormattedMessage id='wms.generate_cells'/>
                            </Button>
                        </div>
                    </>
                    : <div className={`${Styles.tabTitle} ${Styles.selectWarehouse}`}>
                        <FormattedMessage id='wms.select_warehose' />
                    </div>
                }
            </div>
        );
    }
}
