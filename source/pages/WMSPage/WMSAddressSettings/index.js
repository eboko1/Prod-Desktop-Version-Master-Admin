// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Switch, Input, Button, notification, Select, Table, InputNumber, Dropdown, Icon, Menu } from "antd";
import _ from 'lodash';
import moment from 'moment';
import { type } from "ramda";

// proj
import { permissions, isForbidden, fetchAPI } from "utils";

// own
import Styles from "./styles.m.css";
const Option = Select.Option;


export default class WMSAddressSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addressSettings: []
        };

        this.columns = [
            {
                title: <FormattedMessage id="Адрес" />,
                key: 'address',
                dataIndex: 'address',
            },
            {
                title: <FormattedMessage id="Активно" />,
                key: 'enabled',
                dataIndex: 'enabled',
                render: (data, row) => {
                    return (
                        <Switch
                            checked={data}
                            onChange={(value)=>{
                                row.enabled = value;
                                row.changed = true;
                                this.setState({})
                            }}
                        />
                    )
                }
            },
            {
                title: <FormattedMessage id="Ширина (см)" />,
                key: 'width',
                dataIndex: 'width',
                render: (data, row) => {
                    return (
                        <InputNumber
                            value={data}
                            min={0}
                            onChange={(value)=>{
                                row.width = value;
                                row.changed = true;
                                this.setState({})
                            }}
                        />
                    )
                }
            },
            {
                title: <FormattedMessage id="Высота (см)" />,
                key: 'height',
                dataIndex: 'height',
                render: (data, row) => {
                    return (
                        <InputNumber
                            value={data}
                            min={0}
                            onChange={(value)=>{
                                row.height = value;
                                row.changed = true;
                                this.setState({})
                            }}
                        />
                    )
                }
            },
            {
                title: <FormattedMessage id="Глубина (см)" />,
                key: 'depth',
                dataIndex: 'depth',
                render: (data, row) => {
                    return (
                        <InputNumber
                            value={data}
                            min={0}
                            onChange={(value)=>{
                                row.depth = value;
                                row.changed = true;
                                this.setState({})
                            }}
                        />
                    )
                }
            },
            {
                title: <FormattedMessage id="Объем (см3)" />,
                key: 'volume',
                dataIndex: 'volume',
                render: (data, row) => {
                    return (
                        <InputNumber
                            value={data}
                            min={0}
                            onChange={(value)=>{
                                row.volume = value;
                                row.changed = true;
                                this.setState({})
                            }}
                        />
                    )
                }
            },
            {
                title: <FormattedMessage id="Нагрузка (кг)" />,
                key: 'weight',
                dataIndex: 'weight',
                render: (data, row) => {
                    return (
                        <InputNumber
                            value={data}
                            min={0}
                            onChange={(value)=>{
                                row.weight = value;
                                row.changed = true;
                                this.setState({})
                            }}
                        />
                    )
                }
            }
        ]
    }

    _saveCellsSettings = async () => {
        const { warehouseId, fetchCells } = this.props;
        const { addressSettings } = this.state;
        const payload = addressSettings.filter((elem)=>elem.changed);
        payload.map((elem)=>{
            delete elem.changed;
            delete elem.businessId;
            delete elem.barcode;
        })
        await fetchAPI(
            'PUT',
            'wms/cell_options',
            {warehouseId},
            payload
        );
        fetchCells();
    }


    componentDidMount() {
        this.setState({
            addressSettings: this.props.cells
        })
    }

    componentDidUpdate(prevProps) {

    }

    render() {
        const { addressSettings } = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <div>
                        <FormattedMessage id='Импортировать' />
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div>
                        <FormattedMessage id='Задать все' />
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div>
                        <FormattedMessage id='Удалить все' />
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div>
                        <FormattedMessage id='Расчитать объем' />
                    </div>
                </Menu.Item>
            </Menu>
        );

        return (
            <div>
                <div className={Styles.tabTitle}>
                    <FormattedMessage id='Настройки адресных ячеек' />
                    <Dropdown overlay={menu}>
                        <Icon type='menu' className={Styles.menuIcon}/>
                    </Dropdown>
                </div>
                <Table
                    size={'small'}
                    columns={this.columns}
                    dataSource={addressSettings}
                    rowKey={'address'}
                    pagination={{
                        hideOnSinglePage: true,
                    }}
                />
                <div className={Styles.tabFooter}>
                    <Button
                        type='primary'
                        onClick={this._saveCellsSettings}
                    >
                        <FormattedMessage id='save' />
                    </Button>
                </div>
            </div>
        );
    }
}
