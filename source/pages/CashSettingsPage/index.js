// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';

// proj
import { Layout, Paper } from 'commons';
import { CashboxesTable } from 'components/Tables';
import { permissions, isForbidden } from 'utils';
import { AddCashboxModal, ServiceInputModal } from 'modals';
import { MODALS, setModal } from 'core/modals/duck';

const mapStateToProps = (state) => ({
	user: state.auth,
});

const mapDispatchToProps = {
	setModal,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class CashSettingsPage extends Component {
	constructor(props) {
		super(props);

		this.onOpenServiceInputModal = this.onOpenServiceInputModal.bind(this);
	}

	onAddCashboxModal = () => {
		this.props.setModal(MODALS.ADD_CASHBOX);
	};

	onOpenServiceInputModal(cashboxId) {
        this.props.setModal(MODALS.SERVICE_INPUT, {cashboxId});
    }

	render() {
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
					/>
				</Paper>
			</Layout>
		);
	}
}
