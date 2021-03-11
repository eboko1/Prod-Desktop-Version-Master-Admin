// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Popconfirm, Tooltip } from 'antd';

// own

/* eslint-disable complexity */
export function columnsConfig(props) {
	const numberCol = {
		title: '№',
		dataIndex: 'id',
		width: '5%',
	};
	const nameCol = {
		title: <FormattedMessage id='cash-table.name' />,
		dataIndex: 'name',
		width: '15%',
	};

	const typeCol = {
		title: <FormattedMessage id='cash-table.type' />,
		dataIndex: 'type',
		width: '10%',
		render: (type) => (
			<FormattedMessage id={`cash-creation-form.type-${type}`} />
		),
	};

	const fiscalNumberCol = {
		title: <FormattedMessage id='cash-table.fiscalNumber' />,
		dataIndex: 'fiscalNumber',
		width: '20%',
	};

	const infoCol = {
		title: <FormattedMessage id='cash-table.description' />,
		dataIndex: 'description',
		width: '20%',
	};

	const addCashOrderCol = {
		width: 'auto',
		dataIndex: 'test',
		render: () => {
			return (
				<Icon type="dollar" />
			);
		},
	}

	const openCashboxCol = {
		width: 'auto',
		dataIndex: 'test',
		render: () => {
			return (
				<Icon type="play-circle" />
			);
		},
	}

	const putMoneyCol = {
		width: 'auto',
		render: () => {
			return (
				<Icon type="money-collect" />
			);
		},
	}

	const xReportCol = {
		width: 'auto',
		render: () => {
			return (
				<Icon type="file-excel" />
			);
		},
	}

	const zReportCol = {
		width: 'auto',
		render: () => {
			return (
				<Icon type="poweroff" />
			);
		},
	}

	const deleteCol = {
		width: 'auto',
		dataIndex: 'delete',
		render: (key, { id, removable }) =>
			removable ? (
				<Popconfirm
					title={`${props.formatMessage({ id: 'delete' })} ?`}
					onConfirm={() => {
						if (!props.isCRUDForbidden) props.deleteCashbox(id);
					}}
				>
					<Icon
						type='delete'
						style={
							props.isCRUDForbidden
								? {
										fontSize: '18px',
										color: 'var(--text2)',
										pointerEvents: 'none',
								  }
								: {
										fontSize: '18px',
										color: 'var(--warning)',
										cursor: 'pointer',
								  }
						}
					/>
				</Popconfirm>
			) : (
				<Tooltip
					placement='topLeft'
					title={<FormattedMessage id='cash-table_icon.unremovable' />}
					overlayStyle={{ zIndex: 110 }}
				>
					<Icon type='question-circle' />
				</Tooltip>
			),
	};

	return [
		numberCol, 
		nameCol, 
		typeCol, 
		fiscalNumberCol, 
		infoCol, 
		addCashOrderCol,
		openCashboxCol,
		putMoneyCol,
		xReportCol,
		zReportCol,
		deleteCol];
}
