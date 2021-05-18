// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Popconfirm, Tooltip } from 'antd';

export function columnsConfig(props) {

	const numberCol = {
		title: '№',
		dataIndex: 'id',
		key: 'numberCol',
		width: '5%',
	};
	const nameCol = {
		title: <FormattedMessage id='cash-table.name' />,
		dataIndex: 'name',
		key: 'nameCol',
		width: '15%',
	};

	const typeCol = {
		title: <FormattedMessage id='cash-table.type' />,
		dataIndex: 'type',
		key: 'typeCol',
		width: '10%',
		render: (type) => (
			<FormattedMessage id={`cash-creation-form.type-${type}`} />
		),
	};

	const fiscalNumberCol = {
		title: <FormattedMessage id='cash-table.fiscalNumber' />,
		dataIndex: 'fiscalNumber',
		key: 'fiscalNumberCol',
		width: '20%',
	};

	const infoCol = {
		title: <FormattedMessage id='cash-table.description' />,
		dataIndex: 'description',
		key: 'infoCol',
		width: '20%',
	};

	const deleteCol = {
		width: 'auto',
		dataIndex: 'delete',
		key: 'deleteCol',
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
		deleteCol
	];
}
