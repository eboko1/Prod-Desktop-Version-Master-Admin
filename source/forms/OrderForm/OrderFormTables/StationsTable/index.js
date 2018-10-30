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
        form.resetFields([ 'stationLoads[0].beginTime' ]);
        fetchAvailableHours(station, date, orderId);
    };

    _onDelete = redundantKey => {
        const { keys } = this.state;

        this.setState({ keys: keys.filter(key => redundantKey !== key) });
        this.props.form.setFieldsValue({
            [ `stationLoads[${redundantKey}]` ]: void 0,
        });
    };

    _handleAdd = key => {
        const { keys } = this.state;
        const stationLoads = this.props.form.getFieldValue('stationLoads');

        if (_.last(keys) === key && !stationLoads[ key ].beginTime) {
            this.setState({ keys: [ ...keys, this.uuid++ ] });
        }
    };

    // _handleAdd = key => {
    //     const { keys } = this.state;
    //     const stationLoads = this.props.form.getFieldValue('stationLoads');
    //
    //     if (_.last(keys) === key && !stationLoads[ key ].serviceName) {
    //         this.setState({ keys: [ ...keys, this.uuid++ ] });
    //     }
    // };

    render() {
        const {
            fields,
            stationLoads,
            fetchedOrder,
            intl: { formatMessage },
        } = this.props;
        const { keys } = this.state;

        const columns = columnsConfig(
            this.props,
            this.state,
            formatMessage,
            this._handleAdd,
            this._onDelete,
            this._fetchAvailableHours,
            this._bodyUpdateIsForbidden,
            fetchedOrder,
        );

        return (
            <Catcher>
                <Table
                    className={ Styles.stationLoadsTable }
                    // dataSource={ orderStationLoads }
                    dataSource={ keys.map(key => ({ key })) }
                    columns={ columns }
                    rowClassName={ ({ key }) => {
                        // const wasEdited = _.get(fields, [ 'stationLoads', key ]);
                        // const exists = _.get(stationLoads, [ key ]);

                        if (Number(key) === 0) {
                            return Styles.staticStationLoadsRow;
                        }

                        // if (!exists) {
                        //     return Styles.newStationLoadsRow;
                        // } else if (wasEdited) {
                        //     return Styles.editedStationLoadsRow;
                        // }
                    } }
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
