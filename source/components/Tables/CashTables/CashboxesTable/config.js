// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon, Popconfirm, Tooltip } from 'antd';

//proj
import { images } from 'utils';

// own

/**
 * Takes path to Icon and generates customized Icon component
 * @param {*} icon file path
 * @returns 
 */
function generateIcon(icon) {
	return (
		<div
			style={ {
				width:           20,
				height:          20,
				backgroundColor: 'rgb(100, 100, 100)',
				mask:       `url(${icon}) no-repeat center / contain`,
				WebkitMask: `url(${icon}) no-repeat center / contain`,
			} }
		></div>
	);
}

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

	const isCashOrderRSTCol = {
		title: 'RST == PPO',
		dataIndex: 'rst',
		width: 'auto',
		render: (rst) => {
			return rst
				? (<Icon style={{fontSize: '16px'}} type="check-square" />)
				: null;
		}
	};

	const addCashOrderCol = {
		width: 'auto',
		dataIndex: 'test',
		render: () => {
			return (
				<Icon style={{fontSize: '16px'}} type="dollar" />
			);
		},
	}

	const openCashboxCol = {
		width: 'auto',
		dataIndex: 'x',
		render: () => {
			return generateIcon(images.openLockIcon);
		},
	}

	const putMoneyCol = {
		width: 'auto',
		render: () => {
			return generateIcon(images.cashboxIcon);
		},
	}

	const xReportCol = {
		width: 'auto',
		render: () => {
			return (
				<Icon style={{fontSize: '16px'}} type="file-excel" />
			);
		},
	}

	const zReportCol = {
		width: 'auto',
		render: () => {
			return generateIcon(images.closedLockIcon);
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
		isCashOrderRSTCol,
		addCashOrderCol,
		openCashboxCol,
		putMoneyCol,
		xReportCol,
		zReportCol,
		deleteCol];
}
