// vendor
import React from 'react';
import { Icon } from 'antd';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

// proj
import {
    setTrackingFilters,
    selectTrackingFilters,
} from 'core/storage/tracking';

import { Layout } from 'commons';
import { TrackingTable } from 'components';
import { DatePickerField, StoreProductsSelect } from 'forms/_formkit';
import { StoreProductModal } from 'modals';

// own

const mapStateToProps = state => ({
    filters: selectTrackingFilters(state),
});

export const ProductsTrackingPage = withRouter(
    connect(
        mapStateToProps,
        { setTrackingFilters },
    )(props => {
        console.log('→ props', props);

        const renderFilters = (
            <Filters>
                <DatePickerField
                    allowClear
                    clearIcon={
                        <Icon
                            type='close-circle'
                            onClick={ () =>
                                props.setTrackingFilters({ date: void 0 })
                            }
                        />
                    }
                    onChange={ date => props.setTrackingFilters({ date }) }
                    style={ { marginRight: 16, width: 260 } }
                    date={ props.filters.date }
                />
                <StoreProductsSelect
                    setFilters={ props.setTrackingFilters }
                    filters={ props.filters }
                />
            </Filters>
        );

        return (
            <Layout
                title={ <FormattedMessage id='navigation.products_tracking' /> }
                controls={ renderFilters }
            >
                <TrackingTable filters={ props.filters } />
                <StoreProductModal visible={ props.modal } />
            </Layout>
        );
    }),
);

const Filters = styled.div`
    display: flex;
    align-items: center;
`;
