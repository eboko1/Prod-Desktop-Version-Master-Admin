// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button } from 'antd';
import { v4 } from 'uuid';

// proj
import { Layout, Paper } from 'commons';
import { CashboxesTable } from 'components/Tables';
import { permissions, isForbidden } from 'utils';
import { AddCashboxModal } from 'modals';
import { setModal, MODALS } from "core/modals/duck";

const mapStateToProps = (state) => ({
	user: state.auth,
});

const mapDispatchToProps = {
	setModal,
};

/**
 * Cash setting page is used to work with cashboxes, you can delere create and setting them up.
 * Currently there are different types of cash boxes, some of them are carbook internal features,
 * and others are connected to government servers(via cashdesk api service for example)
 */
@connect(mapStateToProps, mapDispatchToProps)
export default class CashSettingsPage extends Component {
	constructor(props) {
		super(props);
	}

	onAddCashboxModal = () => {
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
						onClick={() => this.onAddCashboxModal()}
						key={v4()}
						disabled={isForbidden(this.props.user, permissions.ACCESS_CATALOGUE_CASH_CRUD)}
					>
						<FormattedMessage id='add' />
					</Button>,
				]}
			>
				
				<Paper>
					<CashboxesTable/>
				</Paper>

                <AddCashboxModal/>
			</Layout>
		);
	}
}
