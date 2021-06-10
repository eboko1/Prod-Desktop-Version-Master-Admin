//Vendor
import React from 'react';
import { connect } from "react-redux";
import {FormattedMessage, injectIntl} from 'react-intl';
import {Table, Spin, Input} from 'antd';
import { v4 } from 'uuid';
import _ from "lodash";

//proj
import {
    selectVehicleNormHours,
    selectVehicleNormHoursStats,
    selectVehicleNormHoursSort,

    setPageNormHours,
    selectVehicleNormHoursFetching,
    setNormHoursSearchQuery,
} from 'core/vehicles/duck';

//Own
import { columnsConfig } from './config';
import Styles from './styles.m.css';

const mapStateToProps = state => ({
    user: state.auth,
    normHours: selectVehicleNormHours(state),
    stats: selectVehicleNormHoursStats(state),
    sort: selectVehicleNormHoursSort(state),
    fetching: selectVehicleNormHoursFetching(state)
});

const mapDispatchToProps = {
    setPageNormHours,
    setNormHoursSearchQuery,
}

@connect(
    mapStateToProps,
    mapDispatchToProps,
)
@injectIntl
export default class VehicleNormHoursTable extends React.Component {

    constructor(props) {
        super(props);
        /** When user want to search just pass here its input, if no mere was provided in a second it will perform a search action */
        this.handleSearch = _.debounce(value => {
            this.props.setNormHoursSearchQuery({
                query: _.toLower(value.replace(/[+()]/g,''))
            });
        }, 1000).bind(this);

    }

    onSearch = e => {
        const value = e.target.value;
        this.handleSearch(value);
    }

    render() {
        const {
            normHours,
            stats,
            sort,
            intl: {formatMessage},
            setPageNormHours,
            fetching
        } = this.props;

        const pagination = {
            pageSize: 25,
            size: "large",
            total: Math.ceil(stats.totalRowsCount / 25) * 25,
            current: sort.page,
            onChange: page => {
                setPageNormHours({page})
            },
        }

        return (
             <div>
                 <div className={Styles.filtersCont}>
                     <div className={Styles.textCont}>{<FormattedMessage id={ 'vehicles_page.search' }/>}</div>
                     <div className={Styles.inputCont}><Input onChange={this.onSearch} allowClear/></div>

                 </div>

                 <div className={Styles.tableCont}>
                     <Table
                         loading={fetching}
                         rowClassName={() => Styles.tableRow}
                         className={Styles.table}
                         dataSource={normHours}
                         pagination={pagination}
                         columns={columnsConfig({formatMessage})}
                         scroll={{x: 'auto', y: '80vh'}}
                         rowKey={() => v4()}
                         bordered
                     />
                 </div>
             </div>
        );
    }
}