// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';

// proj
import { Layout, Paper } from 'commons';
import { CashboxesTable } from 'components/Tables';
import { permissions, isForbidden } from 'utils';
import { AddCashboxModal } from 'modals';
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
	}

	showModal = () => {
		this.props.setModal(MODALS.ADD_CASHBOX);
	};

	render() {
		return (
			<Layout
				title={<FormattedMessage id='navigation.cash_settings' />}
				paper={false}
				controls={[
					<Button
						type='primary'
						onClick={() => this.showModal()}
						disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_CASH_CRUD)}
					>
						<FormattedMessage id='add' />
					</Button>,
				]}
				// description={ <FormattedMessage id='chart-page.description' /> }
			>
				<AddCashboxModal/>

				<Paper>
					<CashboxesTable />
				</Paper>
			</Layout>
		);
	}
}
