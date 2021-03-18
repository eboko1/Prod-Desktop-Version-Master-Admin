// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';

// proj
import { Layout, Paper } from 'commons';
import { CashboxesTable } from 'components/Tables';
import { permissions, isForbidden } from 'utils';
import { AddCashboxModal, ServiceInputModal, CashOrderModal } from 'modals';
import { setModal, resetModal, MODALS } from "core/modals/duck";
import { clearCashOrderForm } from "core/forms/cashOrderForm/duck";


const mapStateToProps = (state) => ({
	user: state.auth,
	modal: state.modals.modal,
    modalProps: state.modals.modalProps,
});

const mapDispatchToProps = {
	setModal,
	resetModal,
	clearCashOrderForm,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class CashSettingsPage extends Component {
	constructor(props) {
		super(props);

		this.onOpenServiceInputModal = this.onOpenServiceInputModal.bind(this);
		this.onOpenCashOrderModal = this.onOpenCashOrderModal.bind(this);
		this.onCloseCashOrderModal = this.onCloseCashOrderModal.bind(this);
	}

	state = {
        cashOrderModalMounted: false,
    };

	onAddCashboxModal = () => {
		this.props.setModal(MODALS.ADD_CASHBOX);
	};

	onOpenServiceInputModal(cashboxId) {
        this.props.setModal(MODALS.SERVICE_INPUT, {cashboxId});
    }

	//----------------------

    onOpenCashOrderModal = ({cashboxId}) => {
        this.props.setModal(MODALS.CASH_ORDER, {
            cashOrderEntity: {
                cashBoxId: cashboxId,
            }
        });
        this.setState({ cashOrderModalMounted: true });
    };

    onCloseCashOrderModal = () => {
        this.props.resetModal();
        this.props.clearCashOrderForm();
        this.setState({ cashOrderModalMounted: false });
    };

	//---------------------

	render() {
		const {
			clearCashOrderForm,
			modalProps,
			modal
		} = this.props;
		
		return (
			<Layout
				title={<FormattedMessage id='navigation.cash_settings' />}
				paper={false}
				controls={[
					<Button
						type='primary'
						onClick={() => this.onAddCashboxModal()}
						disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_CASH_CRUD)}
					>
						<FormattedMessage id='add' />
					</Button>,
				]}
			>
				<AddCashboxModal/>
				<ServiceInputModal />

				<Paper>
					<CashboxesTable
						onOpenServiceInputModal={this.onOpenServiceInputModal}
						onOpenCashOrderModal={this.onOpenCashOrderModal}
					/>
				</Paper>

				{this.state.cashOrderModalMounted ? (
                    <CashOrderModal
                        resetModal={this.onCloseCashOrderModal}
                        visible={modal}
                        clearCashOrderForm={clearCashOrderForm}
                        modalProps={modalProps}
                    />
                ) : null}
			</Layout>
		);
	}
}
