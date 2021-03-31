// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Input, Modal, Icon, Table, notification } from "antd";
import { permissions, isForbidden, fetchAPI } from "utils";
import moment from "moment";
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
			tables: [],
        };

		this.columns = [
			{
                key: 'id',
                dataIndex: 'id',
				render: (id, row) => {
					return row.displayId || id
				}
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
					displayId: elem.code,
					name: elem.name,
					additional: elem.brand.name,
					barcode: elem.barcode,
				})
			});
		} else if(table == 'EMPLOYEES') {
			const tableData = await fetchAPI('GET', 'employees', {disabled: false});
			modalData = tableData.map((elem)=>{
				return ({
					id: elem.id,
					displayId: `${elem.name} ${elem.surname}`,
					name: elem.phone,
					additional: elem.email,
					barcode: elem.barcode,
				})
			});
		} else if(table == 'CLIENTS_VEHICLES' && modalInput && modalInput.length > 2) {
			const tableData = await fetchAPI('GET', 'clients/search', {query: modalInput});
			tableData.clients.map((elem)=>{
				if(elem.vehicles) {
					elem.vehicles.map((vehicle)=>{
						modalData.push({
							id: vehicle.id,
							displayId: `${elem.name} ${elem.surname || ""}\n${elem.phones && elem.phones[0]}`,
							name: `${vehicle.make} ${vehicle.model} ${vehicle.modification}\n${vehicle.vin || ""}`,
							additional: vehicle.number,
							barcode: vehicle.barcode,
						})
					})
				}
			});
		} else if(table == 'ORDERS' && modalInput && modalInput.length > 2) {
			const tableData = await fetchAPI('GET', 'orders', {query: modalInput});
			modalData = tableData.orders.map((elem)=>{
				return ({
					id: elem.id,
					displayId: `${elem.num}\n${moment(elem.createdDatetime).format('DD.MM.YYYY HH:mm')}`,
					name: `${elem.clientName || ""} ${elem.clientSurname || ""}\n${elem.clientPhone || ""}`,
					additional: `${elem.vehicleMakeName || ""} ${elem.vehicleModelName || ""}\n${elem.vehicleNumber || ""}`,
					barcode: elem.barcode,
				})
			});
		} else if(table == 'STORE_DOCS') {
			const tableData = await fetchAPI('GET', `store_docs?types=["INCOME"]&documentTypes=["SUPPLIER"]&contexts=["STOCK"]&status=NEW`);
			modalData = tableData.list.map((elem)=>{
				return ({
					id: elem.id,
					displayId: elem.documentNumber,
					name: moment(elem.createdDatetime).format('DD.MM.YYYY HH:mm'),
					additional: `${elem.counterpartBusinessSupplierName || ""}`,
					barcode: elem.barcode,
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
		try {
			await fetchAPI(
				'POST', 
				'barcodes', 
				undefined, 
				[{
					referenceId: String(selectedRowId),
					table,
					customCode: inputCode,
				}],
				{handleErrorInternally: true}
			);
			this.setState({
				inputCode : "",
			})
			notification.success({
				message: `Штрих-код задан`,
			});
		} catch(e) {
			notification.error({
				message: `Штрих-код уже задан`,
			});
		}
		
		this._hideModal();
	}

	_getByBarcode = async (tbl) => {
		const { inputCode } = this.state;
		const barcodeData = await fetchAPI('GET', 'barcodes',{
			barcode: inputCode,
		});
		return barcodeData.find(({table})=>table == tbl);
	}

	_createOrder = async () => {
		const { history, user } = this.props;
		const { selectedRowId } = this.state;
		const payload = {};
		const barcodeData = await this._getByBarcode('CLIENTS_VEHICLES');
		if(barcodeData) {
			const vehicle = await fetchAPI('GET', `clients/vehicles/${barcodeData.referenceId}`);
			const client = await fetchAPI('GET', `clients/${vehicle.clientId}`);

			const response = await fetchAPI('POST', `orders`, null, {
				clientId: vehicle.clientId,
				clientVehicleId: vehicle.id,
				duration: 0.5,
				clientPhone: client.phones[0],
				stationLoads: [{
					beginDatetime: moment().startOf('hour').toISOString(),
					duration: 0.5,
					status: "TO_DO",
				}],
				status: 'not_complete',
				managerId: user.id,
				beginDatetime: moment().startOf('hour').toISOString(),
			});
			if(response.created) {
				history.push({
					pathname: `${book.order}/${response.created[0].id}`,
				});
			}
		}
	}

	_addToOrder = async (table) => {
		const { history } = this.props;
		const { selectedRowId } = this.state;
		const payload = {
			insertMode: true,
			details: [],
			services: [],
		};
		let activeTab;
		const barcodeData = await this._getByBarcode(table);
		if(barcodeData) {
			if(barcodeData.table == 'STORE_PRODUCTS') {

				const product = await fetchAPI('GET', `store_products/${barcodeData.referenceId}`);
				console.log(product);
				activeTab = 'details';
				payload.details.push({
					productId: product.id,
					storeGroupId: product.groupId,
					name: product.name,
					productCode: product.code,
					supplierBrandId: product.brandId,
					//supplierId: product.brand.supplierId,
					count: 1,
					price: 0,
					purchasePrice: 0,
				})
			} else if(barcodeData.table == 'LABORS') {
				activeTab = 'services';
				payload.services.push({
					serviceId: barcodeData.referenceId,
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
		const barcodeData = await this._getByBarcode('STORE_PRODUCTS');
		console.log(warehouses);
		if(barcodeData) {
			let payload = {}
			if(action == 'TO_TOOL') {
				payload = {
					status: "DONE",
					type: "EXPENSE",
					documentType: "TRANSFER",
					payUntilDatetime: null,
					docProducts:[
						{
							productId: barcodeData.referenceId,
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
							productId: barcodeData.referenceId,
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

	_addToStoreDoc = async () => {
		const { history } = this.props;
		const { selectedRowId } = this.state;
		const barcodeData = await this._getByBarcode('STORE_PRODUCTS');
		if(barcodeData) {
			history.push({
				pathname: `${book.storageDocument}/${selectedRowId}`,
				productId: barcodeData.referenceId,
			});
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
		const { inputCode, modalInput, modalVisible, confirmAction, modalData, selectedRowId, tables } = this.state;
		const isValidCode = Boolean(inputCode) && (/\w+-\d+\-\w+/).test(inputCode);
		const prefix = inputCode.slice(0, 3);
		const isOrder = isValidCode && prefix == 'MRD' && inputCode.length == 15,
			  isStoreProduct = isValidCode && prefix == 'STP' || tables.includes("STORE_PRODUCTS"),
			  isVehicle = isValidCode && prefix == 'CVH' || tables.includes("CLIENTS_VEHICLES"),
			  isEmployee = isValidCode && prefix == 'EML' || tables.includes("EMPLOYEES"),
			  isLabor = isValidCode && prefix == 'LBS' || tables.includes("LABORS");

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
        				title: 'Код ячейки',
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
        				title: 'Возврат',
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
							const barcodeData = await this._getByBarcode('CLIENTS_VEHICLES');
							if(barcodeData) {
								const client = await fetchAPI(
									'GET', `clients/vehicles/${barcodeData.referenceId}`,
									null,
									null,
									{ handleErrorInternally: true },
								);
								if(client) {
									history.push(`${book.client}/${client.clientId}`);
								}
							}
							
						},
        			},
        			{
        				title: 'Создать н/з',
        				disabled: !isVehicle,
						onClick: this._createOrder,
        			},
        		]
        	},
        	{
        		title: 'Товар',
        		childs: [
        			{
        				title: 'Открыть карточку',
        				disabled: !isStoreProduct || true,
						onClick: async () => {
							const barcodeData = await this._getByBarcode('STORE_PRODUCTS');
							if(barcodeData) {
								history.push({
									pathname: book.products,
									state: {
										productId: barcodeData.referenceId,
									}
								});
							}
						},
        			},
        			{
        				title: 'Добавить в н/з',
        				disabled: !isStoreProduct,
						table: 'ORDERS',
						onClick: this._showModal,
						confirmAction: ()=>this._addToOrder('STORE_PRODUCTS'),
        			},
					{
        				title: 'Принять на склад',
        				disabled: !isStoreProduct,
						table: 'STORE_DOCS',
						onClick: this._showModal,
						confirmAction: this._addToStoreDoc,
        			},
        			{
        				title: 'Выдать в цех',
						onClick: this._productStorageOperation,
        				disabled: !isStoreProduct || true,
						onClick: ()=>this._productStorageOperation('TO_REPAIR'),
        			},
        			{
        				title: 'Вернуть из цеха',
						onClick: this._productStorageOperation,
        				disabled: !isStoreProduct || true,
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
							const barcodeData = await this._getByBarcode('LABORS');
							if(barcodeData) {
								history.push({
									pathname: book.laborsPage,
									state: {
										laborId: barcodeData.referenceId,
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
						confirmAction: ()=>this._addToOrder('LABORS'),
        			},
        			{
        				title: 'Начать в текущем н/з',
        				disabled: !isLabor || true,
        			},
        			{
        				title: 'Окончить в текущем н/з',
        				disabled: !isLabor || true,
        			},
        			{
        				title: 'Прервать в текущем н/з',
        				disabled: !isLabor || true,
        			}
        		]
        	},
        	{
        		title: 'Сотрудник',
        		childs: [
        			{
        				title: 'Начать смену',
        				disabled: !isEmployee || true,
        			},
        			{
        				title: 'Окончить смену',
        				disabled: !isEmployee || true,
        			},
        			{
        				title: 'Начать перерыв',
        				disabled: !isEmployee || true,
        			},
        			{
        				title: 'Окончить перерыв',
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
							autoFocus
							allowClear
	                		placeholder={formatMessage({id: 'Введите или отсканируйте штрих-код'})}
							value={inputCode}
							onChange={async ({target})=>{
								if(target.value) {
									const barcodes = await fetchAPI('GET', 'barcodes',{
										barcode: target.value,
									});
									const tables = barcodes.map(({table})=>table);
									this.setState({
										tables: tables,
										inputCode: target.value,
									});
								} else {
									this.setState({
										tables: [],
										inputCode: target.value,
									});
								}
							}}
							onPressEnter={()=>{
                                if(scanedInputValue) {
                                    this.setState({
                                        scanedCode: String(scanedInputValue).replace(`${prefix}-${user.businessId}-`, '').toUpperCase(),
                                        scanedInputValue: undefined,
                                    })
                                }
                            }}
	                	/>
                        <Barcode
                            iconStyle={{
                                marginLeft: 14,
								fontSize: 24,
                            }}
							value={inputCode}
							onConfirm={async (value)=>{
								this.setState({
									inputCode: value,
								})
								const barcodes = await fetchAPI('GET', 'barcodes',{
									barcode: value,
								});
								const tables = barcodes.map(({table})=>table);
								this.setState({
									tables: tables,
								});
							}}
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
						minWidth: 580,
					}}
					width={'fit-content'}
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
							autoFocus
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
							dataSource={
								modalInput 
									? modalData.filter(({id, displayId, name, additional, barcode})=>{
										const input = modalInput.toLowerCase();
										return (
											String(id).toLowerCase().replace(/\W/g, '').includes(input) ||
											String(displayId).toLowerCase().replace(/\W/g, '').includes(input) ||
											String(name).toLowerCase().replace(/\W/g, '').includes(input) ||
											String(additional).toLowerCase().replace(/\W/g, '').includes(input) ||
											String(barcode).toLowerCase().includes(input)
										)
									})
									: modalData
							}
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
