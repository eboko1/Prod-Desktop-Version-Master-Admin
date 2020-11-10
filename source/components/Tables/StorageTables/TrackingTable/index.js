// vendor
import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';
import styled from 'styled-components';

// proj
import {
    fetchTracking,
    selectTracking,
    setTrackingPage,
} from 'core/storage/tracking';
import { setModal } from 'core/modals/duck';

import { usePrevious } from 'utils';

// own
import columns from './columns';

const TrackingTableComponent = memo(props => {
    const { tracking } = props;
    const prevTracking = usePrevious(tracking);

    useEffect(() => {
        if (!_.isEqual(tracking, prevTracking)) {
            props.fetchTracking();
        }
    }, [ tracking ]);

    const pagination = {
        pageSize:         25,
        size:             'large',
        total:            Math.ceil(_.get(tracking, 'stats.count', 0) / 25) * 25,
        hideOnSinglePage: true,
        current:          props.filters.page,
        onChange:         page => {
            props.setTrackingPage(page);
            props.fetchTracking();
        },
    };

    console.log(props);

    return (
        <StyledTable
            size='small'
            columns={ columns(props) }
            dataSource={ props.tracking.list }
            pagination={ pagination }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
            loading={ props.loading }
            rowKey={ record => record.id }
            scroll={ { x: 960 } }
        />
    );
});

const StyledTable = styled(Table)`
    background-color: rgb(255, 255, 255);
    transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px,
        rgba(0, 0, 0, 0.23) 0px 3px 10px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    box-sizing: border-box;
    padding: 10px;

    & th.income,
    & td.income {
        background: rgba(var(--secondaryRGB), 0.2) !important;
    }
    & th.expense,
    & td.expense {
        background: rgba(var(--warningRGB), 0.2) !important;
    }
`;

const mapStateToProps = state => ({
    tracking: selectTracking(state),
});

const mapDispatchToProps = {
    fetchTracking,
    setModal,
    setTrackingPage,
};

export const TrackingTable = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(TrackingTableComponent),
);
