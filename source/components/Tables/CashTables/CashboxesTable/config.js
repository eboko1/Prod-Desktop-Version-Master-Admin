// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Popover, Button, Icon, Popconfirm, Tooltip } from 'antd';
import { permissions, isForbidden } from 'utils';

//proj
import { images } from 'utils';

// own

/**
 * Takes path to Icon and generates customized Icon component
 * @param {*} icon    file path
 * @param {*} onClick event handler
 * @param {*} user    current user object, is used for access(disables button if access is forbidden)
 * @param {*} hint    button popup hint
 * @param {*} param0  options for button: {disabled}
 * @returns Component (Icon)
 */
function generateIcon(icon, onClick, user, hint, options) {
	const {
		disabled
	} = options || {};
	const btn = (
		<Button
			onClick={onClick}
			disabled= {disabled || isForbidden(user, permissions.ACCESS_OTHER_OPERATION_RST)}
		>
			<div
				style={ {
					width:           20,
					height:          20,
					backgroundColor: 'rgb(100, 100, 100)',
					mask:       `url(${icon}) no-repeat center / contain`,
					WebkitMask: `url(${icon}) no-repeat center / contain`,
				} }
			/>
		</Button>
	);

	//If hint provided we have to wrap popover around it
	return hint
		?	(<Popover content={hint}>{btn}</Popover>)
		:   (btn)
}

export function columnsConfig(props) {
	const {
		user
	} = props;

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

	const isCashOrderRSTCol = {
		width: 'auto',
		dataIndex: 'rst',
		key: 'isCashOrderRSTCol',
		render: (rst, obj) => {

			/** Creates Styled icon for cashbox with rst(red or green) depending on cash box state(opened or closed)*/
			const cashBoxWithRST = ({isShiftOpen}) => (
				<Popover
					content={<FormattedMessage id={isShiftOpen
						? "cash-table.hint_open_cash_box_with_rst"
						: "cash-table.hint_closed_cash_box_with_rst"}
					/>}
				>
					<Icon style={{fontSize: '16px', color: isShiftOpen? 'green': 'red'}} type="check-square" />
				</Popover>
			);

			return rst
				? cashBoxWithRST({isShiftOpen: obj.isShiftOpen})
				: null;
		}
	};

	const addCashOrderCol = {
		width: 'auto',
		dataIndex: 'id',
		key: 'addCashOrderCol',
		render: (cashboxId) => {
			return (
				<Popover content={<FormattedMessage id="cash-table.hint_create_cash_order" />}>
					<Icon onClick={() => props.onOpenCashOrderModal({cashboxId})} style={{fontSize: '16px'}} type="dollar" />
				</Popover>
			);
		},
	}

	const openShiftCol = {
		width: 'auto',
		dataIndex: 'rst',
		key: 'openShiftCol',
		render: (rst, obj) => {
			return rst
				? generateIcon(
					images.openLockIcon,
					() => props.openShift(obj.id),
					user,
					(<FormattedMessage id="cash-table.hint_open_shift"/>),
					{disabled: obj.isShiftOpen}
				)
				: null;
		},
	}

	const serviceInputCol = {
		width: 'auto',
		dataIndex: 'rst',
		key: 'serviceInputCol',
		render: (rst, obj) => {
			return rst
				? generateIcon(
					images.cashboxIcon,
					() => props.onOpenServiceInputModal(obj.id),
					user,
					(<FormattedMessage id="cash-table.hint_service_input"/>),
					{disabled: !obj.isShiftOpen}
				)
				: null;
		},
	}

	const xReportCol = {
		width: 'auto',
		dataIndex: 'rst',
		key: 'xReportCol',
		render: (rst, obj) => {
			return rst
				? generateIcon(
					images.reportIcon,
					() => props.fetchXReport(obj.id),
					user,
					(<FormattedMessage id="cash-table.hint_x_report"/>),
					{disabled: !obj.isShiftOpen}
				)
				: null;
		},
	}

	const zReportCol = {
		width: 'auto',
		dataIndex: 'rst',
		key: 'zReportCol',
		render: (rst, obj) => {
			return rst
				? generateIcon(
					images.closedLockIcon,
					() => props.closeShift(obj.id),
					user,
					(<FormattedMessage id="cash-table.hint_close_shift"/>)
				)
				: null;
		},
	}

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
		isCashOrderRSTCol,
		addCashOrderCol,
		openShiftCol,
		serviceInputCol,
		xReportCol,
		zReportCol,
		deleteCol];
}
