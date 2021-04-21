//Vendor
import React from 'react';
import { FormattedMessage } from 'antd';
import { injectIntl } from 'react-intl';


//Own
import {statuses} from './constants';

/**
 * The purpose of this module is to map default order stuses and its translations,
 * to get translated constant value just pass "status" variable(constant value of an order)
 * and then this node object will automatically generate translated to current locale text node.
 * 
 * @property {string} status - Order status constant(SUCCESS, CANCEL, ...)
 */
@injectIntl
export default class OrdersStatusesMapper extends React.Component {
    constructor(props) {
        super(props);
    }

    /** Get corresponging status translation base on cereivde constant value
     * 
     * @param {string} status constant from order
     * @returns translated text representation
     */
    statusLangMapper = status => {
        const {
            intl: {formatMessage}
        } = this.props;

        switch(status.toUpperCase()) {
            case statuses.required:        return formatMessage( {id: "order_statuses_mapper.required"} );
            case statuses.reserve:         return formatMessage( {id: "order_statuses_mapper.reserve"} );
            case statuses.not_complete:    return formatMessage( {id: "order_statuses_mapper.not_complete"} );
            case statuses.approve:         return formatMessage( {id: "order_statuses_mapper.approve"} );
            case statuses.progress:        return formatMessage( {id: "order_statuses_mapper.progress"} );
            case statuses.success:         return formatMessage( {id: "order_statuses_mapper.success"} );
            case statuses.cancel:          return formatMessage( {id: "order_statuses_mapper.cancel"} );
            case statuses.redundant:       return formatMessage( {id: "order_statuses_mapper.redundant"} );
            case statuses.invite:          return formatMessage( {id: "order_statuses_mapper.invite"} );
            default:                       return formatMessage( {id: "order_statuses_mapper.unknown_status"} );
        }
    }

    render() {
        const {
            status
        } = this.props;
        
        return (
            <span>
                {this.statusLangMapper(status)}
            </span>
        );
    }
}
