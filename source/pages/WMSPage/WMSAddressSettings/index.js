// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Switch, Input, Button, notification, Select, Table, InputNumber, Dropdown, Icon, Menu, Modal } from "antd";
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
            addressSettings: [],
            setAllModalVisible: false,
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
        const { warehouseId, fetchCells } = this.props;
        const { addressSettings, setAllModalVisible } = this.state;
        const menu = (
            <Menu>
                <Menu.Item>
                    <div>
                        <FormattedMessage id='Импортировать' />
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={()=>this.setState({setAllModalVisible: true})}>
                        <FormattedMessage id='Задать все' />
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={()=>{
                        addressSettings.map(({height, width, depth}, key)=>{
                            addressSettings[key].changed = true;
                            addressSettings[key].volume = height * width * depth;
                            this._saveCellsSettings();
                        })
                    }}
                >
                        <FormattedMessage id='Расчитать объем' />
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={()=>{
                        addressSettings.map((elem, key)=>{
                            addressSettings[key].changed = true;
                            addressSettings[key].height = null;
                            addressSettings[key].width = null;
                            addressSettings[key].depth = null;
                            addressSettings[key].weight = null;
                            addressSettings[key].volume = null;
                            this._saveCellsSettings();
                        })
                    }}
                >
                        <FormattedMessage id='Удалить все' />
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
                <SetAllModal
                    visible={setAllModalVisible}
                    hideModal={()=>{
                        this.setState({setAllModalVisible: false})
                    }}
                    confirmAction={async (width, height, depth, volume, weight)=>{
                        await fetchAPI('PUT', 'wms/cell_options/all', {warehouseId}, {width, height, depth, volume, weight});
                        fetchCells();
                    }}
                />
            </div>
        );
    }
}

@injectIntl
class SetAllModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render () {
        const { visible, hideModal, confirmAction } = this.props;
        const { width, height, depth, volume, weight } = this.state;
        return (
            <Modal
                visible={visible}
                title={<FormattedMessage id='Задать все' />}
                onCancel={hideModal}
                onOk={()=>confirmAction(width, height, depth, volume, weight)}
                destroyOnClose
                width={'fit-content'}
            >
                <div className={Styles.setAllModalRow}>
                    <FormattedMessage id='Ширина (см)'/>
                    <InputNumber
                        min={0}
                        onChange={(width)=>{
                            this.setState({width})
                        }}
                    />
                </div>
                <div className={Styles.setAllModalRow}>
                    <FormattedMessage id='Высота (см)'/>
                    <InputNumber
                        min={0}
                        onChange={(height)=>{
                            this.setState({height})
                        }}
                    />
                </div>
                <div className={Styles.setAllModalRow}>
                    <FormattedMessage id='Глубина (см)'/>
                    <InputNumber
                        min={0}
                        onChange={(depth)=>{
                            this.setState({depth})
                        }}
                    />
                </div>
                <div className={Styles.setAllModalRow}>
                    <FormattedMessage id='Объем (см3)'/>
                    <InputNumber
                        min={0}
                        onChange={(volume)=>{
                            this.setState({volume})
                        }}
                    />
                </div>
                <div className={Styles.setAllModalRow}>
                    <FormattedMessage id='Вес (кг)'/>
                    <InputNumber
                        min={0}
                        onChange={(weight)=>{
                            this.setState({weight})
                        }}
                    />
                </div>
            </Modal>
        )
    }
}