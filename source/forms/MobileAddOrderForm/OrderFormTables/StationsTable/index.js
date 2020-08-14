// vendor
import React, { Component } from "react";
import { Table } from "antd";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash";

// proj
import { Catcher } from "commons";

import { permissions, isForbidden } from "utils";

// own
import { columnsConfig } from "./tableConfig.js";
import Styles from "./styles.m.css";

@injectIntl
export default class StationsTable extends Component {
    constructor(props) {
        super(props);
        const stationLoads = props.stationLoads || [];

        this.uuid = stationLoads.length;
        this.state = {
            keys: [..._.keys(stationLoads), this.uuid++],
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(nextProps, this.props) ||
            !_.isEqual(nextState, this.state)
        );
    }

    componentDidUpdate() {
        const loads = _.get(this.props.fields, "stationLoads", []);
        const propsLoadsLength = loads.length;
        const keysLength = this.state.keys.length;

        if (
            propsLoadsLength === keysLength &&
            !loads.some(load => _.values(load).some(_.isNil))
        ) {
            this._handleAdd();
        }
    }

    _bodyUpdateIsForbidden = () =>
        isForbidden(this.props.user, permissions.ACCESS_ORDER_BODY);

    _onDelete = redundantKey => {
        const { keys } = this.state;

        this.setState({ keys: keys.filter(key => redundantKey !== key) });
        this.props.form.setFieldsValue({
            [`stationLoads[${redundantKey}]`]: void 0,
        });
    };

    _handleAdd = () => {
        const { keys } = this.state;
        this.setState({ keys: [...keys, this.uuid++] });
    };

    render() {
        const {
            fetchedOrder,
            intl: { formatMessage },
        } = this.props;
        const { keys } = this.state;

        const columns = columnsConfig(
            this.props,
            this.state,
            formatMessage,
            this._onDelete,
            this._bodyUpdateIsForbidden,
            fetchedOrder,
        );

        return (
            <Catcher>
                <Table
                    className={Styles.stationLoadsTable}
                    // dataSource={ orderStationLoads }
                    dataSource={keys.map(key => ({ key }))}
                    columns={columns}
                    rowClassName={({ key }) => {
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
                    }}
                    pagination={false}
                    size="small"
                    locale={{
                        emptyText: <FormattedMessage id="no_data" />,
                    }}
                />
            </Catcher>
        );
    }
}
