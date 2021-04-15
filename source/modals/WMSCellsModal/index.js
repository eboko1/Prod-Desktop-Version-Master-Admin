// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Select, Modal, Icon, Table, Input, notification, InputNumber } from "antd";
import { permissions, isForbidden, fetchAPI } from "utils";
import moment from "moment";
import { withRouter } from 'react-router';

// proj
import { Catcher } from "commons";
import { fetchWarehouses } from 'core/warehouses/duck';

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    user: state.auth,
    warehouses: state.warehouses.warehouses,
});

const mapDispatchToProps = {
    fetchWarehouses
};


@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class WMSCellsModal extends Component {
	constructor(props) {
        super(props);
		
        this.state = {
			dataSource: [],
            warehouseId: undefined,
            count: 1,
        };

		this.columns = [
            {
                title: () =>
                    <div>
                        <FormattedMessage id="Адрес" />
                        <Input
                            allowClear
                            value={this.state.addressFilter}
                            placeholder={this.props.intl.formatMessage({id: 'Адрес'})}
                            onChange={({target})=>{
                                this.setState({
                                    addressFilter: target.value
                                })
                            }}
                        />
                    </div>,
                key: 'address',
                dataIndex: 'address',
            },
            {
                title: () => 
                    <div>
                        <FormattedMessage id="Ширина (см)" />
                        <Input
                            allowClear
                            value={this.state.widthFilter}
                            placeholder={this.props.intl.formatMessage({id: 'Ширина (см)'})}
                            onChange={({target})=>{
                                this.setState({
                                    widthFilter: target.value.replace(/\D/g,'')
                                })
                            }}
                        />
                    </div>,
                key: 'width',
                dataIndex: 'width',
            },
            {
                title: () => 
                    <div>
                        <FormattedMessage id="Высота (см)" />
                        <Input
                            allowClear
                            value={this.state.heightFilter}
                            placeholder={this.props.intl.formatMessage({id: 'Высота (см)'})}
                            onChange={({target})=>{
                                this.setState({
                                    heightFilter: target.value.replace(/\D/g,'')
                                })
                            }}
                        />
                    </div>,
                key: 'height',
                dataIndex: 'height',
            },
            {
                title: () => 
                    <div>
                        <FormattedMessage id="Глубина (см)" />
                        <Input
                            allowClear
                            value={this.state.depthFilter}
                            placeholder={this.props.intl.formatMessage({id: 'Глубина (см)'})}
                            onChange={({target})=>{
                                this.setState({
                                    depthFilter: target.value.replace(/\D/g,'')
                                })
                            }}
                        />
                    </div>,
                key: 'depth',
                dataIndex: 'depth',
            },
            {
                title: () => 
                    <div>
                        <FormattedMessage id="Объем (см3)" />
                        <Input
                            allowClear
                            value={this.state.volumeFilter}
                            placeholder={this.props.intl.formatMessage({id: 'Объем (см3)'})}
                            onChange={({target})=>{
                                this.setState({
                                    volumeFilter: target.value.replace(/\D/g,'')
                                })
                            }}
                        />
                    </div>,
                key: 'volume',
                dataIndex: 'volume',
            },
            {
                title: () => 
                    <div>
                        <FormattedMessage id="Нагрузка (кг)" />
                        <Input
                            allowClear
                            value={this.state.weightFilter}
                            placeholder={this.props.intl.formatMessage({id: 'Нагрузка (кг)'})}
                            onChange={({target})=>{
                                this.setState({
                                    weightFilter: target.value.replace(/\D/g,'')
                                })
                            }}
                        />
                    </div>,
                key: 'weight',
                dataIndex: 'weight',
            },
			{
                title: () => 
                    <div>
                        <FormattedMessage id="Заполненность" />
                        <Input
                            allowClear
                            value={this.state.fullnessFilter}
                            placeholder={this.props.intl.formatMessage({id: 'Заполненность'})}
                            onChange={({target})=>{
                                this.setState({
                                    fullnessFilter: target.value.replace(/\D/g,'')
                                })
                            }}
                        />
                    </div>,
                key: 'fullness',
                dataIndex: 'fullness',
            },
			{
				key: 'action',
                dataIndex: 'address',
				render: (data, row)=>{
					return (
						<Button
							type='primary'
							onClick={()=>{
								this._handleOk(data);
							}}
						>
							<FormattedMessage id='Выбрать'/>
						</Button>
					)
				}
			}
		];
	}

	_showModal = async () => {
		const { warehouseId, selectedCell, warehouses } = this.props;
        if(warehouseId) {
            const dataSource = await fetchAPI('GET', 'wms/cells', {warehouseId});
            this.setState({
                dataSource: dataSource.list,
                warehouseId,
                count: (selectedCell && selectedCell.sum) || 1,
            });
        } else {
            this.setState({
                warehouseId: warehouses[0].id
            });
            const dataSource = await fetchAPI('GET', 'wms/cells', {warehouseId: warehouses[0].id});
            this.setState({
                dataSource: dataSource.list,
                count: (selectedCell && selectedCell.sum) || 1,
            });
        }
	}

	_hideModal = async () => {
        this.state = {};
		this.setState({
			dataSource: [],
            addressFilter: undefined,
            widthFilter: undefined,
            heightFilter: undefined,
            depthFilter: undefined,
            volumeFilter: undefined,
            weightFilter: undefined,
            fullnessFilter: undefined,
		});
        this.props.hideModal();
	}

    _handleOk = async (address) => {
		const { warehouseId, count } = this.state;
        await this.props.confirmAction(address, warehouseId, count);
        await this._hideModal();
    }

    componentDidMount() {
        this.props.fetchWarehouses();
    }

	componentDidUpdate(prevProps, prevState) {
		if(this.props.visible && !prevProps.visible) {
            this._showModal();
        } 
	}
	
    render() {
        const { user, intl: { formatMessage }, visible, warehouses, selectedCell, fixedWarehouse } = this.props;
		const { dataSource, warehouseId, count, addressFilter, widthFilter, heightFilter, depthFilter, volumeFilter, weightFilter, fullnessFilter } = this.state;

        let tableData = [...dataSource];
        if(addressFilter) tableData = tableData.filter((elem)=>String(elem.address).includes(String(addressFilter)));
        if(widthFilter) tableData = tableData.filter((elem)=>String(elem.width).includes(String(widthFilter)));
        if(heightFilter) tableData = tableData.filter((elem)=>String(elem.height).includes(String(heightFilter)));
        if(depthFilter) tableData = tableData.filter((elem)=>String(elem.depth).includes(String(depthFilter)));
        if(volumeFilter) tableData = tableData.filter((elem)=>String(elem.volume).includes(String(volumeFilter)));
        if(weightFilter) tableData = tableData.filter((elem)=>String(elem.weight).includes(String(weightFilter)));
        if(fullnessFilter) tableData = tableData.filter((elem)=>String(elem.fullness).includes(String(fullnessFilter)));

        return (
            <Catcher>
				<Modal
					visible={visible}
					style={{
						minWidth: 580,
					}}
					width={'fit-content'}
                    title={<FormattedMessage id="Выбор ячейки" />}
                    onCancel={this._hideModal}
                    destroyOnClose
					footer={null}
				>
                    {!fixedWarehouse &&
                        <div className={Styles.modalHeader}>
                            <div
                                style={{
                                    width: '100%'
                                }}s
                            >
                                <FormattedMessage id="storage" />
                                <Select
                                    showSearch
                                    value={warehouseId}
                                    placeholder={formatMessage({id: 'storage'})}
                                    style={{
                                        width: '100%'
                                    }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                                    onChange={async (warehouseId)=>{
                                        const dataSource = await fetchAPI('GET', 'wms/cells', {warehouseId});
                                        this.setState({
                                            dataSource: dataSource.list,
                                            warehouseId,
                                        });
                                    }}
                                >
                                    {warehouses.map(({id, name})=>
                                        <Option value={id} key={id}>
                                            {name}
                                        </Option>
                                    )}
                                </Select>
                            </div>
                            <div>
                                <FormattedMessage id="count" />
                                <InputNumber
                                    value={count}
                                    min={1}
                                    max={selectedCell && selectedCell.sum}
                                    style={{
                                        display: 'block'
                                    }}
                                    onChange={(count)=>{
                                        this.setState({
                                            count,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    }
                    <Table 
                        size={'small'}
                        columns={this.columns}
                        dataSource={tableData}
                        rowKey={'address'}
                        getPopupContainer={trigger =>
                            trigger.parentNode
                        }
                    />
				</Modal>
            </Catcher>
        );
    }
}
