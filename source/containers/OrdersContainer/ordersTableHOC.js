// vendor
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Icon, Tooltip, Button } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import _ from 'lodash';

// proj
import { OrderStatusIcon, Numeral } from 'components';
import book from 'routes/book';
import { getDisplayName } from 'utils';

// own
import { columnsConfig, rowsConfig, scrollConfig } from './ordersTableConfig';
import Styles from './styles.m.css';

// /// /// //
// if class in construc
// const TableMagic = (props) => {
// columnConfig(activeRo){}
//   return (
//     <orderTab props={columnConfig}
//   );
// };
// withRouter(TableMagic)
// // //

// const mapStateToProps = state => {
//     return {
//         count:          state.orders.count,
//         orders:         state.orders.data,
//         filter:         state.orders.filter,
//         ordersFetching: state.ui.get('ordersFetching'),
//     };
// };
//
// const mapDispatchToProps = dispatch => {
//     return bindActionCreators(
//         {
//             fetchOrders,
//             setOrdersStatusFilter,
//             setOrdersPageFilter,
//         },
//         dispatch,
//     );
// };

export const ordersTableHOC = Enhanceable => {
    // @connect(mapStateToProps, mapDispatchToProps)
    class CostumizedOrdersTable extends Component {
        render() {
            // columnsConfig()
            // rowsConfig()
            // scrollConfig()

            return (
                <Enhanceable
                    columnsConfig={ () => this.columnsConfig }
                    { ...this.props }
                />
            );
        }
    }

    CostumizedOrdersTable.displayName = `ordersTableHoc(${getDisplayName(
        Enhanceable,
    )})`;

    return CostumizedOrdersTable;
};
