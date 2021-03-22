// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Input, Modal, Icon, Table, notification } from "antd";
import { permissions, isForbidden, fetchAPI } from "utils";
import { withRouter } from 'react-router';

// proj
import { Catcher } from "commons";
import { Barcode } from "components";
import book from 'routes/book';

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    user: state.auth,
});

const mapDispatchToProps = {
};


@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class BarcodeContainer extends Component {
	constructor(props) {
        super(props);
        this.state = {
            inputCode: "",
			modalInput: "",
			modalVisible: false,
			confirmAction: undefined,
			table: undefined,
			modalData: [],
			selectedRowId : undefined,
        };

		this.columns = [
			{
                key: 'id',
                dataIndex: 'id',
            },
			{
                key: 'name',
                dataIndex: 'name',
            },
			{
                key: 'additional',
                dataIndex: 'additional',
            },
		]
	}

	_showModal = async () => {
		const { table, modalInput } = this.state;
		let modalData = [];
		if(table == 'STORE_PRODUCTS') {
			const tableData = await fetchAPI('GET', 'store_products');
			modalData = tableData.list.map((elem)=>{
				return ({
					id: elem.id,
					name: elem.name,
					additional: elem.code,
				})
			});
		} else if(table == 'EMPLOYEES') {
			const tableData = await fetchAPI('GET', 'employees', {disabled: false});
			modalData = tableData.map((elem)=>{
				return ({
					id: elem.id,
					name: `${elem.name} ${elem.surname}`,
					additional: elem.phone,
				})
			});
		} else if(table == 'CLIENTS_VEHICLES' && modalInput && modalInput.length > 2) {
			const tableData = await fetchAPI('GET', 'clients/search', {query: modalInput});
			tableData.clients.map((elem)=>{
				if(elem.vehicles) {
					elem.vehicles.map((vehicle)=>{
						modalData.push({
							id: vehicle.id,
							name: `${elem.name} ${elem.surname || ""}\n${elem.phones && elem.phones[0]}`,
							additional: `${vehicle.make} ${vehicle.model} ${vehicle.modification}\n${vehicle.number}`,
						})
					})
				}
			});
		} else if(table == 'ORDERS' && modalInput && modalInput.length > 2) {
			const tableData = await fetchAPI('GET', 'orders', {query: modalInput});
			modalData = tableData.orders.map((elem)=>{
				return ({
					id: elem.id,
					name: `${elem.num}\n${elem.clientName || ""} ${elem.clientSurname || ""}\n${elem.clientPhone || ""}`,
					additional: `${elem.vehicleMakeName || ""} ${elem.vehicleModelName || ""}\n${elem.vehicleNumber || ""}`,
				})
			});
		}
		
		this.setState({
			modalVisible: true,
			modalData,
		});
	}

	_hideModal = async () => {
		this.setState({
			modalInput: "",
			modalVisible: false,
			confirmAction: undefined,
			table: undefined,
			modalData: [],
			selectedRowId : undefined,
		})
	}

	_setBarcode = async () => {
		const { selectedRowId, table, inputCode } = this.state;
		await fetchAPI('POST', 'barcodes', undefined, [{
			referenceId: String(selectedRowId),
			table,
			customCode: inputCode,
		}]);
		this.setState({
			inputCode : "",
		})
		notification.success({
			message: `Штрих-код задан`,
		});
		this._hideModal();
	}

	_getByBarcode = async () => {
		const { inputCode } = this.state;
		const barcodeData = await fetchAPI('GET', 'barcodes',{
			barcode: inputCode,
		});
		return barcodeData;
	}

	_addToOrder = async () => {
		const { history } = this.props;
		const { selectedRowId } = this.state;
		const payload = {
			insertMode: true,
			details: [],
			services: [],
		};
		let activeTab;
		const barcodeData = await this._getByBarcode();
		if(barcodeData.length) {
			const data = barcodeData[0];
			if(data.table == 'STORE_PRODUCTS') {
				activeTab = 'details';
				payload.details.push({
					productId: data.referenceId,
				})
			} else if(data.table == 'LABORS') {
				activeTab = 'services';
				payload.services.push({
					serviceId: data.referenceId,
				})
			}

			await fetchAPI('PUT', `orders/${selectedRowId}`, null, payload);
			history.push({
				pathname: `${book.order}/${selectedRowId}`,
				state: { activeTab }
			});
		}
	}

	_productStorageOperation = async (action) => {
		const warehouses = await fetchAPI('GET', `warehouses`);
		const barcodeData = await this._getByBarcode();
		console.log(warehouses);
		if(barcodeData.length) {
			const product = barcodeData[0];
			let payload = {}
			if(action == 'RECIVE') {
				payload = {
					status: "DONE",
					type: "INCOME",
					documentType: "SUPPLIER",
					payUntilDatetime: null,
					docProducts:[
						{
							productId: product.referenceId,
							quantity: 1,
							stockPrice: 0,
						}
					],
					warehouseId: warehouses.find((elem)=>elem.attribute == "MAIN").id,
				};
			} else if(action == 'TO_TOOL') {
				payload = {
					status: "DONE",
					type: "EXPENSE",
					documentType: "TRANSFER",
					payUntilDatetime: null,
					docProducts:[
						{
							productId: product.referenceId,
							quantity: 1,
							stockPrice: 0,
						}
					],
					warehouseId: warehouses.find((elem)=>elem.attribute == "REPAIR_AREA").id,
					counterpartWarehouseId: warehouses.find((elem)=>elem.attribute == "TOOL").id,
				};
			} else if(action == 'TO_REPAIR') {
				payload = {
					status: "DONE",
					type: "EXPENSE",
					documentType: "TRANSFER",
					payUntilDatetime: null,
					docProducts:[
						{
							productId: product.referenceId,
							quantity: 1,
							stockPrice: 0,
						}
					],
					warehouseId: warehouses.find((elem)=>elem.attribute == "TOOL").id,
					counterpartWarehouseId: warehouses.find((elem)=>elem.attribute == "REPAIR_AREA").id,
				};
			}
			const response = await fetchAPI('POST', `store_docs`, null, payload);
			if(response.created) {
				notification.success({
					message: `Успешно`,
				});
				this.setState({
					inputCode: "",
				})
			} else {
				notification.error({
					message: `Недостаточно товара`,
				});
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { modalInput, table } = this.state;
		if(table == 'CLIENTS_VEHICLES' && modalInput && modalInput.length > 2 && prevState.modalInput != modalInput) {
			this._showModal();
		} else if(table == 'ORDERS' && modalInput && modalInput.length > 2 && prevState.modalInput != modalInput) {
			this._showModal();
		}
	}
	
    render() {
        const { user, intl: { formatMessage }, history } = this.props;
		const { inputCode, modalInput, modalVisible, confirmAction, modalData, selectedRowId } = this.state;
		const isValidCode = Boolean(inputCode) && (/\w+-\d+\-\d+/).test(inputCode);
		const prefix = inputCode.slice(0, 3);
		const isOrder = isValidCode && prefix == 'MRD' && inputCode.length == 15,
			  isStoreProduct = isValidCode && prefix == 'STP',
			  isVehicle = isValidCode && prefix == 'CVH',
			  isEmployee = isValidCode && prefix == 'EML',
			  isLabor = isValidCode && prefix == 'LBS';

        const pageData = [
        	{
        		title: 'Присвоить',
        		childs: [
        			{
        				title: 'Код товара',
        				disabled: !inputCode || isValidCode,
						table: 'STORE_PRODUCTS',
						onClick: this._showModal,
						confirmAction: this._setBarcode,
        			},
        			{
        				title: 'Код сотрудника',
        				disabled: !inputCode || isValidCode,
						table: 'EMPLOYEES',
						onClick: this._showModal,
						confirmAction: this._setBarcode,
        			},
        			{
        				title: 'Код а/м',
        				disabled: !inputCode || isValidCode,
						table: 'CLIENTS_VEHICLES',
						onClick: this._showModal,
						confirmAction: this._setBarcode,
        			},
        			{
        				title: 'X Код ячейки',
        				disabled: true,
        			}
        		]
        	},
        	{
        		title: 'Документ',
        		childs: [
        			{
        				title: 'Открыть',
        				disabled: !isOrder,
						table: 'ORDERS',
						onClick: () => {
							history.push(`${book.order}/${inputCode.slice(-6)}`);
						},
        			},
        			{
        				title: 'Оплата',
        				disabled: !isOrder,
						onClick: () => {
							history.push({
								pathname: `${book.order}/${inputCode.slice(-6)}`,
								state: { openCashOrderModal: true }
							});
						},
        			},
        			{
        				title: 'X Возврат',
        				disabled: !isOrder || true,
        			},
        			{
        				title: 'Диагностика',
        				disabled: !isOrder,
						onClick: () => {
							history.push({
								pathname: `${book.order}/${inputCode.slice(-6)}`,
								state: { activeTab: 'diagnostic' }
							});
						},
        			},
        			{
        				title: 'Цех',
        				disabled: !isOrder,
						onClick: () => {
							history.push({
								pathname: `${book.order}/${inputCode.slice(-6)}`,
								state: { activeTab: 'workshop' }
							});
						},
        			}
        		]
        	},
        	{
        		title: 'Автомобиль',
        		childs: [
        			{
        				title: 'Открыть карточку',
        				disabled: !isVehicle,
						table: 'CLIENTS_VEHICLES',
						onClick: async () => {
							const barcodeData = await this._getByBarcode();
							if(barcodeData.length) {
								const client = await fetchAPI(
									'GET', `clients/vehicles/${barcodeData[0].referenceId}`,
									null,
									null,
									{ handleErrorInternally: true },
								);
								console.log(barcodeData, client);
								if(client) {
									history.push(`${book.client}/${client.id}`);
								}
							}
							
						},
        			},
        			{
        				title: '!!! Создать н/з',
        				disabled: !isVehicle,
						onClick: async () => {
							const barcodeData = await this._getByBarcode();
							if(barcodeData.length) {
								const client = await fetchAPI(
									'GET', `clients/vehicles/${barcodeData[0].referenceId}`,
									null,
									null,
									{ handleErrorInternally: true },
								);
								console.log(barcodeData, client);
							}
							
						},
        			},
        		]
        	},
        	{
        		title: 'Товар',
        		childs: [
        			{
        				title: 'Открыть карточку',
        				disabled: !isStoreProduct,
						onClick: async () => {
							const barcodeData = await this._getByBarcode();
							if(barcodeData.length) {
								history.push({
									pathname: book.products,
									state: {
										productId: barcodeData[0].referenceId,
									}
								});
							}
							
						},
        			},
        			{
        				title: '!!! Добавить в н/з',
        				disabled: !isStoreProduct,
						table: 'ORDERS',
						onClick: this._showModal,
						confirmAction: this._addToOrder,
        			},
        			{
        				title: '!!! Принять на склад',
        				disabled: !isStoreProduct,
						onClick: ()=>this._productStorageOperation('RECIVE'),
        			},
        			{
        				title: 'Выдать в цех',
						onClick: this._productStorageOperation,
        				disabled: !isStoreProduct,
						onClick: ()=>this._productStorageOperation('TO_REPAIR'),
        			},
        			{
        				title: 'Вернуть из цеха',
						onClick: this._productStorageOperation,
        				disabled: !isStoreProduct,
						onClick: ()=>this._productStorageOperation('TO_TOOL'),
        			}
        		]
        	},
        	{
        		title: 'Работа',
        		childs: [
        			{
        				title: 'Открыть карточку',
        				disabled: !isLabor,
						table: 'LABORS',
						onClick: async () => {
							const barcodeData = await this._getByBarcode();
							if(barcodeData.length) {
								history.push({
									pathname: book.laborsPage,
									state: {
										laborId: barcodeData[0].referenceId,
									}
								});
							}
							
						},
        			},
        			{
        				title: 'Добавить в н/з',
        				disabled: !isLabor,
						table: 'ORDERS',
						onClick: this._showModal,
						confirmAction: this._addToOrder,
        			},
        			{
        				title: 'X Начать в текущем н/з',
        				disabled: !isLabor || true,
        			},
        			{
        				title: 'X Окончить в текущем н/з',
        				disabled: !isLabor || true,
        			},
        			{
        				title: 'X Прервать в текущем н/з',
        				disabled: !isLabor || true,
        			}
        		]
        	},
        	{
        		title: 'Сотрудник',
        		childs: [
        			{
        				title: 'X Начать смену',
        				disabled: !isEmployee || true,
        			},
        			{
        				title: 'X Окончить смену',
        				disabled: !isEmployee || true,
        			},
        			{
        				title: 'X Начать перерыв',
        				disabled: !isEmployee || true,
        			},
        			{
        				title: 'X Окончить перерыв',
        				disabled: !isEmployee || true,
        			}
        		]
        	}
        ]

        return (
            <Catcher>
	            <div className={Styles.container}>
	                <div className={Styles.barcodeInput}>
	                	<Input
	                		placeholder={formatMessage({id: 'Введите или отсканируйте штрих-код'})}
							value={inputCode}
							onChange={({target})=>{
								this.setState({
									inputCode: target.value,
								})
							}}
	                	/>
                        <Barcode
                            iconStyle={{
                                marginLeft: 14,
								fontSize: 24,
                            }}
							value={inputCode}
							onConfirm={(value)=>
								this.setState({
									inputCode: value,
								})
							}
                        />
	                </div>
	                <div className={Styles.buttonBlockWrapp}>
	                	{pageData.map(({title, childs}, key)=>(
	                		<div key={key} className={Styles.buttonBlock}>
	                			<div className={Styles.buttonBlockTitle}>
	                				<FormattedMessage id={title} />
	                			</div>
	                			{childs.map(({title, disabled, table, onClick, confirmAction}, index)=>(
	                				<div key={`${key}-${index}`} className={Styles.buttonWrapp}>
		                				<Button
		                					type='primary'
		                					disabled={disabled}
		                					className={Styles.button}
		                					style={{width: '100%'}}
											onClick={async ()=>{
												await this.setState({
													table,
													confirmAction,
												})
												onClick();
											}}
		                				>
		                					<FormattedMessage id={title} />
		                				</Button>
	                				</div>
	                			))}
	                		</div>
	                	))}
	                </div>
                </div>
				<Modal
					visible={modalVisible}
					style={{
						width: 'fit-content',
						minWidth: 580,
					}}
                    title={<FormattedMessage id="Список" />}
                    onCancel={this._hideModal}
					onOk={confirmAction}
                    destroyOnClose
					zIndex={500}
					okButtonProps={{
						disabled: !selectedRowId,
					}}
				>
					<div className={Styles.modalInput}>
						<Input
							placeholder={formatMessage({id: 'Поиск по полям'})}
							value={modalInput}
							onChange={({target})=>{
								this.setState({
									modalInput: target.value,
								})
							}}
						/>
						<Barcode
							iconStyle={{
								marginLeft: 14,
								fontSize: 24,
							}}
							value={modalInput}
							onConfirm={(value)=>
								this.setState({
									modalInput: value,
								})
							}
						/>
					</div>
					<div>
						<Table 
							columns={this.columns}
							dataSource={modalData}
							rowKey={'id'}
							rowClassName={(record, index)=>{
								if(record.id == selectedRowId) {
									return Styles.selectedRow
								}
							}}
							style={{
								whiteSpace: 'pre'
							}}
							onRow={(record, rowIndex) => {
								return {
								  onClick: event => {
									  this.setState({
										selectedRowId: record.id
									  })
								  },
								};
							  }}
						/>
					</div>
				</Modal>
            </Catcher>
        );
    }
}
