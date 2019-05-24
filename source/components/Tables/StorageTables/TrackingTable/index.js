// vendor
import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Table } from 'antd';
import _ from 'lodash';

// proj
import {
    fetchTracking,
    selectTracking,
    selectTrackingLoading,
    selectTrackingFilters,
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

    return (
        <Table
            size='small'
            columns={ columns(props) }
            dataSource={ props.tracking.list }
            pagination={ pagination }
            locale={ {
                emptyText: props.intl.formatMessage({ id: 'no_data' }),
            } }
            loading={ props.loading }
            rowKey={ record => record.id }
        />
    );
});

const mapStateToProps = state => ({
    tracking: selectTracking(state),
    filters:  selectTrackingFilters(state),
    loading:  selectTrackingLoading(state),
});

const mapDispatchToProps = {
    fetchTracking,
    setModal,
    setTrackingPage,
};

export const TrackingTable = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(TrackingTableComponent),
);
