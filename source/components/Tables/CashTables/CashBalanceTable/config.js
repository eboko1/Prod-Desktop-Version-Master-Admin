// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Popover, Button, Icon } from 'antd';
import { permissions, isForbidden } from 'utils';

// proj
import { Numeral } from 'commons';
import { images } from 'utils';

// own
import Styles from './styles.m.css';

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

	//Use message popup if hint provided
	return hint
		?	(<Popover content={hint}>{btn}</Popover>)
		:   (btn)
}


export function columnsConfig(props) {
	const {
		user,
		onOpenCashOrderModal,
		openShift,
		onOpenServiceInputModal,
		onOpenServiceOutputModal,
		fetchXReport,
		closeShift
	} = props;

	const numberCol = {
		title: '№',
		key: 'numberCol',
		dataIndex: 'id',
		width: '5%',
	};

	const nameCol = {
		title: <FormattedMessage id='cash-table.name' />,
		width: '20%',
		dataIndex: 'name',
		key: 'nameCol',
	};

	const typeCol = {
		title: <FormattedMessage id='cash-table.type' />,
		width: '20%',
		dataIndex: 'type',
		key: 'typeCol',
		render: (type) => (
			<FormattedMessage id={`cash-creation-form.type-${type}`} />
		),
	};

	const sumCol = {
		title: <FormattedMessage id='cash-table.sum' />,
		key: 'sumCol',
		dataIndex: 'balance',
		width: '25%',
		render: (key) => <Numeral>{key}</Numeral>,
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
					<Icon
						className={[
							Styles.cashboxStatusIcon,
							isShiftOpen? Styles.openCashboxIcon: Styles.closedCashboxIcon
						].join(", ")}
						type="check-square"
					/>
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
					<Icon onClick={() => onOpenCashOrderModal({cashboxId})} className={Styles.createCashOrderIcon} type="dollar" />
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
					() => openShift(obj.id),
					user,
					(<FormattedMessage id="cash-table.hint_open_shift"/>),
					{disabled: obj.isShiftOpen}
				)
				: null;
		},
	}

	const serviceInputCol = {
		width:     'auto',
		dataIndex: 'rst',
		key:       'serviceInputCol',
		render: (rst, obj) => {
			return generateIcon(
				images.cashboxIcon,
				() => onOpenServiceInputModal(obj.id),
				user,
				(<FormattedMessage id="cash-table.hint_service_input"/>),
				{disabled: rst && !obj.isShiftOpen}
			);
		},
	}

	const serviceOutputCol = {
		width:     'auto',
		dataIndex: 'rst',
		key:       'serviceOutputCol',
		render: (rst, obj) => {
			return generateIcon(
				images.cashboxIcon,
				() => onOpenServiceOutputModal(obj.id),
				user,
				(<FormattedMessage id="cash-table.hint_service_output"/>),
				{disabled: rst && !obj.isShiftOpen}
			);
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
					() => fetchXReport(obj.id),
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
					() => closeShift(obj.id),
					user,
					(<FormattedMessage id="cash-table.hint_close_shift"/>)
				)
				: null;
		},
	}

	return [
		numberCol,
		nameCol,
		typeCol,
		sumCol,
		isCashOrderRSTCol,
		addCashOrderCol,
		openShiftCol,
		serviceInputCol,
		serviceOutputCol,
		xReportCol,
		zReportCol,
	];
}
