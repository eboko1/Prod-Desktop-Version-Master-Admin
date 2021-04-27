// vendor
import React, { Component } from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Switch, Input, Button, notification, Select, Table, InputNumber, Dropdown, Icon, Menu, Modal } from "antd";
import { withRouter } from "react-router";
import _ from 'lodash';
import moment from 'moment';
import { type } from "ramda";

// proj
import { permissions, isForbidden, fetchAPI } from "utils";
import { Barcode } from 'components';

// own
import Styles from "./styles.m.css";
const Option = Select.Option;

@withRouter
@injectIntl
export default class WMSAddressSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addressSettings: [],
            setAllModalVisible: false,
            selectedRows: [],
        };

        this.columns = [
            {
                title: <FormattedMessage id="wms.address" />,
                key: 'address',
                dataIndex: 'address',
            },
            {
                title: () => 
                    <div>
                        <FormattedMessage id="wms.active" />
                        {this.state.selectedRows.length ?
                            <div>
                                <Switch
                                    onChange={(value)=>{
                                        this.state.selectedRows.map((elem)=>{
                                            elem.enabled = value;
                                            elem.changed = true;
                                        })
                                        this.setState({})
                                    }}
                                />
                            </div>
                        : null}
                    </div>,
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
                title: () => 
                    <div>
                        <FormattedMessage id="wms.width" />
                        {this.state.selectedRows.length ? 
                            <div>
                                <InputNumber
                                    min={0}
                                    onChange={(value)=>{
                                        this.state.selectedRows.map((elem)=>{
                                            elem.width = value;
                                            elem.changed = true;
                                        })
                                        this.setState({})
                                    }}
                                />
                            </div>
                        : null}
                    </div>,
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
                title: () => 
                    <div>
                        <FormattedMessage id="wms.height" />
                        {this.state.selectedRows.length ? 
                            <div>
                                <InputNumber
                                    min={0}
                                    onChange={(value)=>{
                                        this.state.selectedRows.map((elem)=>{
                                            elem.height = value;
                                            elem.changed = true;
                                        })
                                        this.setState({})
                                    }}
                                />
                            </div>
                        : null}
                    </div>,
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
                title: () => 
                    <div>
                        <FormattedMessage id="wms.depth" />
                        {this.state.selectedRows.length ? 
                            <div>
                                <InputNumber
                                    min={0}
                                    onChange={(value)=>{
                                        this.state.selectedRows.map((elem)=>{
                                            elem.depth = value;
                                            elem.changed = true;
                                        })
                                        this.setState({})
                                    }}
                                />
                            </div>
                        : null}
                    </div>,
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
                title: () => 
                    <div>
                        <FormattedMessage id="wms.volume" />
                        {this.state.selectedRows.length ? 
                            <div>
                                <InputNumber
                                    min={0}
                                    onChange={(value)=>{
                                        this.state.selectedRows.map((elem)=>{
                                            elem.volume = value;
                                            elem.changed = true;
                                        })
                                        this.setState({})
                                    }}
                                />
                            </div>
                        : null}
                    </div>,
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
                title: () => 
                    <div>
                        <FormattedMessage id="wms.weight" />
                        {this.state.selectedRows.length ? 
                            <div>
                                <InputNumber
                                    min={0}
                                    onChange={(value)=>{
                                        this.state.selectedRows.map((elem)=>{
                                            elem.weight = value;
                                            elem.changed = true;
                                        })
                                        this.setState({})
                                    }}
                                />
                            </div>
                        : null}
                    </div>,
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
            },
            {
                title: <FormattedMessage id='navigation.barcode'/>,
                key: 'barcode',
                dataIndex: 'barcode',
                render: (data, row) => {
                    return (
                        <Barcode
                            value={data}
                            enableScanIcon
                            iconStyle={{
                                margin: "0 8px 0 0",
                                fornSize: 18,
                                verticalAlign: "sub",
                            }}
                            prefix={'WMS'}
                            table={'CELLS'}
                            referenceId={row.address}
                            onConfirm={(code, pref, fullCode)=>{
                                row.barcode = fullCode;
                                this.setState({});
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
        if(payload.length) {
            await fetchAPI(
                'PUT',
                'wms/cell_options',
                {warehouseId},
                payload
            );
        }
        fetchCells();
    }


    componentDidMount() {
        this.setState({
            addressSettings: this.props.cells,
        })
    }

    componentDidUpdate(prevProps) {

    }

    render() {
        const { warehouseId, fetchCells } = this.props;
        const { addressSettings, setAllModalVisible, tableFilter } = this.state;

        let tableData = addressSettings ? [...addressSettings] : [];
        if(tableFilter) {
            tableData = tableData.filter((elem)=>
                String(elem.address).includes(String(tableFilter))
            );
        }

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows,
                })
            },
            getCheckboxProps: record => ({
                name: record.name,
            }),
        };
        const menu = (
            <Menu>
                <Menu.Item>
                    <div>
                        <FormattedMessage id='wms.import' />
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={()=>this.setState({setAllModalVisible: true})}>
                        <FormattedMessage id='wms.set_all' />
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={()=>{
                        addressSettings.map(({height, width, depth}, key)=>{
                            addressSettings[key].changed = true;
                            addressSettings[key].volume = height * width * depth;
                        })
                        this._saveCellsSettings();
                    }}
                >
                        <FormattedMessage id='wms.calculete_volume' />
                    </div>
                </Menu.Item>
                <Menu.Item>
                    <div onClick={()=>{
                        addressSettings.map((elem, key)=>{
                            elem.changed = true;
                            elem.height = null;
                            elem.width = null;
                            elem.depth = null;
                            elem.weight = null;
                            elem.volume = null;
                        })
                        this._saveCellsSettings();
                    }}
                >
                        <FormattedMessage id='wms.delete_all' />
                    </div>
                </Menu.Item>
            </Menu>
        );

        return (
            <div>
                <div className={Styles.tabTitle}>
                    <FormattedMessage id='wms.address_cell_settings' />
                    <Dropdown overlay={menu}>
                        <Icon type='menu' className={Styles.menuIcon}/>
                    </Dropdown>
                </div>
                <Input
                    allowClear
                    value={tableFilter}
                    placeholder={this.props.intl.formatMessage({id: 'barcode.search'})}
                    style={{
                        marginBottom: 8
                    }}
                    onChange={({target})=>{
                        this.setState({
                            tableFilter: target.value
                        })
                    }}
                />
                <Table
                    size={'small'}
                    columns={this.columns}
                    dataSource={tableData}
                    rowKey={'address'}
                    pagination={{
                        hideOnSinglePage: true,
                    }}
                    rowSelection={rowSelection}
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
                title={<FormattedMessage id='wms.set_all' />}
                onCancel={hideModal}
                onOk={()=>confirmAction(width, height, depth, volume, weight)}
                destroyOnClose
                width={'fit-content'}
            >
                <div className={Styles.setAllModalRow}>
                    <FormattedMessage id='wms.width'/>
                    <InputNumber
                        min={0}
                        onChange={(width)=>{
                            this.setState({width})
                        }}
                    />
                </div>
                <div className={Styles.setAllModalRow}>
                    <FormattedMessage id='wms.height'/>
                    <InputNumber
                        min={0}
                        onChange={(height)=>{
                            this.setState({height})
                        }}
                    />
                </div>
                <div className={Styles.setAllModalRow}>
                    <FormattedMessage id='wms.depth'/>
                    <InputNumber
                        min={0}
                        onChange={(depth)=>{
                            this.setState({depth})
                        }}
                    />
                </div>
                <div className={Styles.setAllModalRow}>
                    <FormattedMessage id='wms.volume'/>
                    <InputNumber
                        min={0}
                        onChange={(volume)=>{
                            this.setState({volume})
                        }}
                    />
                </div>
                <div className={Styles.setAllModalRow}>
                    <FormattedMessage id='wms.weight'/>
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