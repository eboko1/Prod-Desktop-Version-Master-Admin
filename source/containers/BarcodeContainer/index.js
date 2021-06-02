// vendor
import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button, Input, Modal, Icon, Table, notification } from "antd";
import { permissions, isForbidden, fetchAPI } from "utils";
import moment from "moment";
import { withRouter } from 'react-router';
import { setModal, resetModal, MODALS } from 'core/modals/duck';

// proj
import { Catcher } from "commons";
import { Barcode } from "components";
import { StoreProductModal, WMSCellsModal } from "modals";
import book from 'routes/book';

// own
import Styles from "./styles.m.css";

const mapStateToProps = state => ({
    user: state.auth,
});

const mapDispatchToProps = {
	setModal,
    resetModal,
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
			{
                key: 'barcode',
                dataIndex: 'barcode',
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
			const tableData = await fetchAPI('GET', 'orders', {query: modalInput, status: `not_complete,reserve,required,call,progress`});
			// query=818&        status=not_complete%2Creserve%2Crequired%2Cprogress
			// query=818&page=1& status=not_complete%2Crequired%2Ccall%2Creserve&    sortField=datetime&sortOrder=desc
			// status=%2%2C%2Creserve&sortField=datetime&sortOrder=desc
			modalData = tableData.orders.map((elem)=>{
				return ({
					id: elem.id,
					displayId: `${elem.num}\n${moment(elem.createdDatetime).format('DD.MM.YYYY HH:mm')}`,
					name: `${elem.clientName || ""} ${elem.clientSurname || ""}\n${elem.clientPhone || ""}`,
					additional: `${elem.vehicleMakeName || ""} ${elem.vehicleModelName || ""}\n${elem.vehicleNumber || ""}`,
					barcode: this.props.intl.formatMessage({id: `order-status.${elem.status}`}),
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
		} else if(table == 'CELLS') {

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
				message: this.props.intl.formatMessage({id: 'barcode.barcode_setted'}),
			});
		} catch(e) {
			notification.error({
				message: this.props.intl.formatMessage({id: 'barcode.barcode_already_set'}),
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

			const response = await fetchAPI(
				'POST',
				`orders`,
				null,
				{
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
				}, 
				{handleErrorInternally: true}
			);
			if(response && response.created) {
				history.push({
					pathname: `${book.order}/${response.created[0].id}`,
				});
			} else {
				notification.error({
					message: response.message
				})
			}
		}
	}

	_addToOrder = async (table) => {
		const { history } = this.props;
		const { selectedRowId, inputCode } = this.state;
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
					supplierId: 0,
					count: 1,
					price: 0,
					purchasePrice: 0,
				})
			} else if(barcodeData.table == 'LABORS') {
				const labor = await fetchAPI('GET', `labors/${barcodeData.referenceId}`);
				activeTab = 'services';
				payload.services.push({
					serviceId: labor.id,
					serviceName: labor.name || labor.defaultName,
					employeeId: this.props.defaultEmployeeId,
					serviceHours: 0,
					purchasePrice: 0,
					count: Number(labor.laborPrice.normHours) || 0,
					servicePrice: Number(labor.laborPrice.price) || this.props.normHourPrice,
				})
			}

			await fetchAPI('PUT', `orders/${selectedRowId}`, null, payload);
			history.push({
				pathname: `${book.order}/${selectedRowId}`,
				state: { activeTab }
			});
		} else {
			if(inputCode.length > 2) {
				const tecDocProducts = await fetchAPI('GET', 'tecdoc/ean', {ean: inputCode}, undefined, {handleErrorInternally: true});
				if(tecDocProducts && tecDocProducts.length) {
					payload.details.push({
						storeGroupId: tecDocProducts[0].storeGroupId,
						name: tecDocProducts[0].description,
						productCode: tecDocProducts[0].partNumber,
						supplierBrandId: tecDocProducts[0].brandId,
						count: 1,
						price: 0,
						purchasePrice: 0,
					})
					await fetchAPI('PUT', `orders/${selectedRowId}`, null, payload);
					history.push({
						pathname: `${book.order}/${selectedRowId}`,
						state: { activeTab }
					});
				}
			}
		}
	}

	_productStorageOperation = async (action) => {
		const warehouses = await fetchAPI('GET', `warehouses`);
		const barcodeData = await this._getByBarcode('STORE_PRODUCTS');
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
			if(response && response.created) {
				notification.success({
					message: this.props.intl.formatMessage({id: 'barcode.success'}),
				});
				this.setState({
					inputCode: "",
				})
			} else {
				notification.error({
					message: this.props.intl.formatMessage({id: 'storage_document.error.available'}),
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
        const { user, intl: { formatMessage }, history, setModal } = this.props;
		const { inputCode, modalInput, modalVisible, confirmAction, modalData, selectedRowId, tables, table, WMSModal } = this.state;
		const isValidCode = Boolean(inputCode) && (/\w+-\d+\-\w+/).test(inputCode);
		const prefix = inputCode.slice(0, 3);
		const isOrder = isValidCode && prefix == 'MRD' && inputCode.length == 15,
			  isStoreProduct = isValidCode && prefix == 'STP' || tables.includes("STORE_PRODUCTS"),
			  isVehicle = isValidCode && prefix == 'CVH' || tables.includes("CLIENTS_VEHICLES"),
			  isEmployee = isValidCode && prefix == 'EML' || tables.includes("EMPLOYEES"),
			  isLabor = isValidCode && prefix == 'LBS' || tables.includes("LABORS"),
			  isCell = isValidCode && prefix == 'WMS' || tables.includes("CELLS"),
			  isTecDoc = tables.includes("TECDOC");

        const pageData = [
        	{
        		title: 'barcode.set_barcode',
        		childs: [
        			{
        				title: 'barcode.product_code',
        				disabled: !inputCode || isValidCode,
						table: 'STORE_PRODUCTS',
						onClick: this._showModal,
						confirmAction: this._setBarcode,
        			},
        			{
        				title: 'barcode.employee_code',
        				disabled: !inputCode || isValidCode,
						table: 'EMPLOYEES',
						onClick: this._showModal,
						confirmAction: this._setBarcode,
        			},
        			{
        				title: 'barcode.vehicle_code',
        				disabled: !inputCode || isValidCode,
						table: 'CLIENTS_VEHICLES',
						onClick: this._showModal,
						confirmAction: this._setBarcode,
        			},
        			{
        				title: 'barcode.cell_code',
        				disabled: !inputCode || isValidCode,
						table: 'CELLS',
						onClick: ()=>{
							this.setState({WMSModal: true})
						}
        			}
        		]
        	},
        	{
        		title: 'document',
        		childs: [
        			{
        				title: 'barcode.open_card',
        				disabled: !isOrder,
						table: 'ORDERS',
						onClick: () => {
							history.push(`${book.order}/${inputCode.slice(-6)}`);
						},
        			},
        			{
        				title: 'barcode.document.payment',
        				disabled: !isOrder,
						onClick: () => {
							history.push({
								pathname: `${book.order}/${inputCode.slice(-6)}`,
								state: { openCashOrderModal: true }
							});
						},
        			},
        			{
        				title: 'barcode.document.return',
        				disabled: !isOrder || true,
        			},
        			{
        				title: 'barcode.document.diagnostics',
        				disabled: !isOrder,
						onClick: () => {
							history.push({
								pathname: `${book.order}/${inputCode.slice(-6)}`,
								state: { activeTab: 'diagnostic' }
							});
						},
        			},
        			{
        				title: 'barcode.document.workshop',
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
        		title: 'vehicle',
        		childs: [
        			{
        				title: 'barcode.open_card',
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
        				title: 'barcode.vehicle.create_order',
        				disabled: !isVehicle,
						onClick: this._createOrder,
        			},
        		]
        	},
        	{
        		title: 'product',
        		childs: [
					{
        				title: 'barcode.create_product',
        				disabled: !inputCode || isValidCode || isStoreProduct,
						onClick: async () => {
							let code, brandId, groupId, name, brandName;
							if(inputCode.length > 2) {
								const tecDocProducts = await fetchAPI('GET', 'tecdoc/ean', {ean: inputCode}, undefined, {handleErrorInternally: true});
								if(tecDocProducts && tecDocProducts.length) {
									code = tecDocProducts[0].partNumber;
									brandId = tecDocProducts[0].brandId;
									brandName = tecDocProducts[0].supplierName;
									groupId = tecDocProducts[0].storeGroupId;
									name = tecDocProducts[0].description;
								}
							}
							setModal(MODALS.STORE_PRODUCT, {
								code,
								brandId,
								brandName,
								name,
								groupId,
								barcode: inputCode,
								onSubmit: async () => {
									const barcodes = await fetchAPI('GET', 'barcodes',{
										barcode: inputCode,
									});
									const tables = barcodes.map(({table})=>table);
									this.setState({
										tables: tables,
									});
								}
							});
							this.setState({
								modalVisible: false,
							})
						},
        			},
        			{
        				title: 'barcode.open_card',
        				disabled: !isStoreProduct,
						onClick: async () => {
							const barcodeData = await this._getByBarcode('STORE_PRODUCTS');
							if(barcodeData) {
								history.push({
									pathname: `${book.product}/${barcodeData.referenceId}`,
									
								});
							}
						},
        			},
        			{
        				title: 'barcode.add_to_order',
        				disabled: !isStoreProduct && !isTecDoc,
						table: 'ORDERS',
						onClick: this._showModal,
						confirmAction: ()=>this._addToOrder('STORE_PRODUCTS'),
        			},
					{
        				title: 'barcode.product.reception',
        				disabled: !isStoreProduct,
						table: 'STORE_DOCS',
						onClick: this._showModal,
						confirmAction: this._addToStoreDoc,
        			}
        		]
        	},
			{
				childs: [
					{
        				title: 'barcode.product.to_repair',
						onClick: this._productStorageOperation,
        				disabled: !isStoreProduct,
						onClick: ()=>this._productStorageOperation('TO_REPAIR'),
        			},
        			{
        				title: 'barcode.product.to_tool',
						onClick: this._productStorageOperation,
        				disabled: !isStoreProduct,
						onClick: ()=>this._productStorageOperation('TO_TOOL'),
        			}
				]
			},
        	{
        		title: 'labor',
        		childs: [
        			{
        				title: 'barcode.open_card',
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
        				title: 'barcode.add_to_order',
        				disabled: !isLabor,
						table: 'ORDERS',
						onClick: this._showModal,
						confirmAction: ()=>this._addToOrder('LABORS'),
        			},
        		]
        	},
        	{
        		title: 'employee',
        		childs: [
        			{
        				title: 'barcode.open_card',
        				disabled: !isEmployee,
						onClick: async () => {
							const barcodeData = await this._getByBarcode('EMPLOYEES');
							if(barcodeData) {
								history.push({
									pathname: `${book.employeesPage}/${barcodeData.referenceId}`,
								});
							}
						},
        			},
        		]
        	},
			{
        		title: 'wms.cell',
        		childs: [
					{
        				title: 'barcode.wms.put_product',
        				disabled: !isCell,
						table: 'STORE_PRODUCTS',
						onClick: this._showModal,
						confirmAction: async ()=>{
							const barcodeData = await this._getByBarcode('CELLS');
							console.log(barcodeData)
							if(barcodeData) {
								const warehouseId = barcodeData.referenceId.split('.');
								await fetchAPI('POST', 'wms/cells/products', null, [
									{
										warehouseId: warehouseId[0],
										storeProductId: this.state.selectedRowId,
										address: barcodeData.referenceId,
										count: 1,
									}
								])
								this._hideModal();
							}
						},
        			},
        			{
        				title: 'barcode.wms.inventorization',
        				disabled: !isCell,
						onClick: async () => {
							const barcodeData = await this._getByBarcode('CELLS');
							if(barcodeData) {
								const warehouseId = barcodeData.referenceId.split('.');
								history.push({
									pathname: book.wms,
									state: {
										warehouseId: warehouseId[0],
										address: barcodeData.referenceId,
									}
								});
							}
							
						},
        			},
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
	                		placeholder={formatMessage({id: 'barcode.scan_barcode'})}
							value={inputCode}
							onChange={async ({target})=>{
								const value = target.value.replace(/[^0-9A-Za-z-]/g, '')
								this.setState({
									inputCode: value,
								});
								if(value) {
									const barcodes = await fetchAPI('GET', 'barcodes',{
										barcode: value,
									});
									const tables = barcodes.map(({table})=>table);
									if(value.length > 2) {
										const tecDocProducts = await fetchAPI('GET', 'tecdoc/ean', {ean: value}, undefined, {handleErrorInternally: true});
										if(tecDocProducts && tecDocProducts.length) {
											tables.push('TECDOC');
										}
									}
									this.setState({
										tables: tables,
									});
								} else {
									this.setState({
										tables: [],
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
								if(value.length > 2) {
									const tecDocProducts = await fetchAPI('GET', 'tecdoc/ean', {ean: value}, undefined, {handleErrorInternally: true});
									if(tecDocProducts && tecDocProducts.length) {
										tables.push('TECDOC');
									}
								}
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
	                				{title && <FormattedMessage id={title} />}
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
                    title={<FormattedMessage id="barcode.search" />}
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
							placeholder={formatMessage({id: 'barcode.search_by_fields'})}
							value={modalInput}
							onChange={({target})=>{
								this.setState({
									modalInput: target.value,
								})
							}}
						/>
						<Barcode
							zIndex={500}
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
						{table == 'STORE_PRODUCTS' &&
							<Icon
								type='plus'
								style={{
									marginLeft: 14,
									fontSize: 24,
								}}
								onClick={()=>{
									setModal(MODALS.STORE_PRODUCT, {
										barcode: inputCode,
										onSubmit: async () => {
											const barcodes = await fetchAPI('GET', 'barcodes',{
												barcode: inputCode,
											});
											const tables = barcodes.map(({table})=>table);
											this.setState({
												tables: tables,
											});
										}
									});
									this.setState({
										modalVisible: false,
									})
								}}
							/>
						}
					</div>
					<div>
						<Table 
							columns={this.columns}
							dataSource={
								table != 'ORDERS' && modalInput 
									? modalData.filter(({id, displayId, name, additional, barcode})=>{
										const input = modalInput.toLowerCase();
										return (
											String(id).toLowerCase().replace(/\W/g, '').includes(input) ||
											String(displayId).toLowerCase().replace(/\W/g, '').includes(input) ||
											String(name).toLowerCase().replace(' ', '').includes(input) ||
											String(additional).toLowerCase().replace(' ', '').includes(input) ||
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
				<StoreProductModal/>
				<WMSCellsModal
					visible={Boolean(WMSModal)}
					confirmAction={async (address, modalWarehouseId, count)=>{
						try {
							await fetchAPI(
								'POST', 
								'barcodes', 
								undefined, 
								[{
									referenceId: address,
									table: 'CELLS',
									customCode: inputCode,
								}],
								{handleErrorInternally: true}
							);
							this.setState({
								inputCode : "",
							})
							notification.success({
								message: this.props.intl.formatMessage({id: 'barcode.barcode_setted'}),
							});
						} catch(e) {
							notification.error({
								message: this.props.intl.formatMessage({id: 'barcode.barcode_already_set'}),
							});
						}
					}}
					hideModal={()=>{
						this.setState({WMSModal: undefined})
					}}
				/>
            </Catcher>
        );
    }
}
