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

};


@withRouter
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
export default class WMSCellsModal extends Component {
	constructor(props) {
        super(props);
		
        this.state = {
			dataSource: [],
        };

		this.columns = [
            {
                title: <FormattedMessage id="Адрес" />,
                key: 'address',
                dataIndex: 'address',
            },
            {
                title: <FormattedMessage id="Ширина (см)" />,
                key: 'width',
                dataIndex: 'width',
            },
            {
                title: <FormattedMessage id="Высота (см)" />,
                key: 'height',
                dataIndex: 'height',
            },
            {
                title: <FormattedMessage id="Глубина (см)" />,
                key: 'depth',
                dataIndex: 'depth',
            },
            {
                title: <FormattedMessage id="Объем (см3)" />,
                key: 'volume',
                dataIndex: 'volume',
            },
            {
                title: <FormattedMessage id="Нагрузка (кг)" />,
                key: 'weight',
                dataIndex: 'weight',
            },
			{
                title: <FormattedMessage id="Заполненность" />,
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
		]
	}

	_showModal = async () => {
		const { warehouseId } = this.props;
        const dataSource = await fetchAPI('GET', 'wms/cells', {warehouseId});
		this.setState({
			dataSource: dataSource.list,
		});
	}

	_hideModal = async () => {
		this.setState({
			dataSource: [],
		});
        this.props.hideModal();
	}

    _handleOk = async (address) => {
        await this.props.confirmAction(address);
        await this._hideModal();
    }

	componentDidUpdate(prevProps, prevState) {
		if(this.props.visible && !prevProps.visible) {
            this._showModal();
        } 
	}
	
    render() {
        const { user, intl: { formatMessage }, visible } = this.props;
		const { dataSource } = this.state;
		
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
						<Table 
							columns={this.columns}
							dataSource={dataSource}
							rowKey={'address'}
						/>
				</Modal>
            </Catcher>
        );
    }
}
