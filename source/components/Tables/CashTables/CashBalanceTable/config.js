// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';

// proj
import { Numeral } from 'commons';

/* eslint-disable complexity */
export function columnsConfig() {
	const numberCol = {
		title: '№',
		dataIndex: 'id',
		width: '5%',
	};
	const nameCol = {
		title: <FormattedMessage id='cash-table.name' />,
		dataIndex: 'name',
		width: '20%',
	};
	const typeCol = {
		title: <FormattedMessage id='cash-table.type' />,
		dataIndex: 'type',
		width: '20%',
		render: (type) => {
			type;
		},
	};
	const sumCol = {
		title: <FormattedMessage id='cash-table.sum' />,
		dataIndex: 'balance',
		width: '25%',
		render: (key) => <Numeral>{key}</Numeral>,
	};

	return [numberCol, nameCol, typeCol, sumCol];
}
