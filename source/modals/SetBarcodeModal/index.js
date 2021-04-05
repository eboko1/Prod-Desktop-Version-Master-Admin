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
import { StoreProductModal } from "modals";
import { setModal, resetModal, MODALS } from 'core/modals/duck';

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
export default class SetBarcodeModal extends Component {
	constructor(props) {
        super(props);
		
        this.state = {
			modalInput: "",
			modalVisible: false,
			confirmAction: undefined,
			table: undefined,
			modalData: [],
			selectedRowId : undefined,
			tables: [],
        };

		this._addNewProduct = this._addNewProduct.bind(this);

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
		let modalData = [];
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
		});
        this.props.hideModal();
	}

	_setBarcode = async () => {
		const { selectedRowId } = this.state;
        const { barcode } = this.props;
		try {
			await fetchAPI(
				'POST', 
				'barcodes', 
				undefined, 
				[{
					referenceId: String(selectedRowId),
					table: 'STORE_PRODUCTS',
					customCode: barcode,
				}],
				{handleErrorInternally: true}
			);
			notification.success({
				message: `Штрих-код задан`,
			});
		} catch(e) {
			notification.error({
				message: `Штрих-код уже задан`,
			});
		}
	}

    _handleOk = async () => {
		const { selectedRowId } = this.state;
        await this._setBarcode();
        await this.props.confirmAction(selectedRowId);
        await this._hideModal();
    }

	_addNewProduct = async (id) => {
		await this.props.confirmAction(id);
		this._hideModal();
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.props.visible && !prevProps.visible) {
            this._showModal();
        } 
	}
	
    render() {
        const { user, intl: { formatMessage }, barcode, visible, setModal } = this.props;
		const {  modalInput, modalVisible, confirmAction, modalData, selectedRowId } = this.state;
		
        return (
            <Catcher>
				<Modal
					visible={visible}
					style={{
						minWidth: 580,
					}}
					width={'fit-content'}
                    title={<FormattedMessage id="barcode.search" />}
                    onCancel={this._hideModal}
					onOk={this._handleOk}
                    destroyOnClose
					zIndex={300}
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
								marginLeft: 8,
								fontSize: 24,
							}}
							value={modalInput}
							onConfirm={(value)=>
								this.setState({
									modalInput: value,
								})
							}
						/>
						<Icon
							type='plus'
							style={{
								fontSize: 24,
								marginLeft: 8,
							}}
							onClick={()=>{
								this._hideModal();
								setModal(MODALS.STORE_PRODUCT, {
									barcode: barcode,
									onSubmit: this._addNewProduct,
								})
							}}
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
				<StoreProductModal/>
            </Catcher>
        );
    }
}
