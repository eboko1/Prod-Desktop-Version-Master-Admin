// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Modal } from 'antd';

// proj
import { Layout, Paper } from 'commons';
import { CashCreationForm } from 'forms';
import { CashboxesTable } from 'components/Tables';
import { permissions, isForbidden } from 'utils';
// own

const mapStateToProps = (state) => {
	return {
		user: state.auth,
	};
};

@connect(mapStateToProps, void 0)
export default class CashSettingsPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		};
	}

	showModal = () => {
		this.setState({ visible: true });
	};

	handleCancel = () => {
		this.setState({ visible: false });
	};

	render() {
		const isCRUDForbidden = isForbidden(
			this.props.user,
			permissions.ACCESS_CATALOGUE_CASH_CRUD
		);
		return (
			<Layout
				title={<FormattedMessage id='navigation.cash_settings' />}
				paper={false}
				controls={[
					<Button
						type='primary'
						onClick={() => this.showModal()}
						disabled={isCRUDForbidden}
					>
						<FormattedMessage id='add' />
					</Button>,
				]}
				// description={ <FormattedMessage id='chart-page.description' /> }
			>
				<Modal
					forceRender
					destroyOnClose
					visible={this.state.visible}
					maskClosable={false}
					title={null}
					bodyStyle={{ paddingTop: 56 }}
					okText={<FormattedMessage id='save' />}
					okButtonProps={{
						htmlType: 'submit',
						form: 'cash-creation-form',
					}}
					cancelText={<FormattedMessage id='cancel' />}
					onCancel={() => this.handleCancel()}
				>
					<CashCreationForm />
				</Modal>
				<Paper>
					<CashboxesTable />
				</Paper>
			</Layout>
		);
	}
}
