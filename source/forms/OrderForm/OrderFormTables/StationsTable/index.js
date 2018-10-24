// vendor
import React, { Component } from 'react';
import { Table, Popconfirm, Icon } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import moment from 'moment';
import _ from 'lodash';

// proj
import { Catcher } from 'commons';
import { OrderStatusIcon } from 'components';

import { getDateTimeConfig, permissions, isForbidden } from 'utils';

// own
import { columnsConfig } from './tableConfig.js';
import Styles from './styles.m.css';

@injectIntl
export default class StationsTable extends Component {
    constructor(props) {
        super(props);
        console.log('→ stationLoads', props.stationLoads);
        const stationLoads = props.stationLoads || [];

        this.uuid = stationLoads.length;
        this.state = {
            keys: [ ..._.keys(stationLoads), this.uuid++ ],
        };
    }

    _bodyUpdateIsForbidden = () =>
        isForbidden(this.props.user, permissions.ACCESS_ORDER_BODY);

    _fetchAvailableHours = (station, date) => {
        const { form, fetchAvailableHours, orderId } = this.props;

        form.resetFields([ 'beginTime' ]);
        fetchAvailableHours(station, date, orderId);
    };

    _onDelete = redundantKey => {
        const { keys } = this.state;

        this.setState({ keys: keys.filter(key => redundantKey !== key) });
        this.props.form.setFieldsValue({
            [ `stationLoads[${redundantKey}]` ]: void 0,
        });
    };

    _handleAdd = () => {
        const { keys } = this.state;
        this.setState({ keys: [ ...keys, this.uuid++ ] });
    };

    render() {
        const {
            orderStationLoads,
            intl: { formatMessage },
        } = this.props;
        const { keys } = this.state;

        const columns = columnsConfig(
            this.props,
            this.state,
            formatMessage,
            this._onDelete,
            this._fetchAvailableHours,
            this._bodyUpdateIsForbidden,
        );

        return (
            <Catcher>
                <Table
                    // className={ Styles.callsTable }
                    // dataSource={ orderStationLoads }
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    pagination={ false }
                    size='small'
                    locale={ {
                        emptyText: <FormattedMessage id='no_data' />,
                    } }
                />
            </Catcher>
        );
    }
}
