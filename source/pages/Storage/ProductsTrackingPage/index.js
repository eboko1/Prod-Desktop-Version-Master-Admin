// vendor
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import moment from 'moment';

// proj
import {
    setTrackingFilters,
    selectTrackingFilters,
    selectTrackingLoading,
} from 'core/storage/tracking';

import { Layout, ResponsiveView } from 'commons';
import { TrackingTable, DatePickerGroup, DateRangePicker, WarehouseSelect, BrandSelect } from 'components';
import { StoreProductsSelect } from 'forms/_formkit';
import { StoreProductModal, DetailStorageModal } from 'modals';
import { BREAKPOINTS } from 'utils';

import { media } from 'theme/media';

// own

const getWarehouses = () => {
    var that = this;
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = __API_URL__ + '/warehouses';
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token,
        }
    })
    .then(function (response) {
        if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText))
        }
        return Promise.resolve(response)
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        that.setState({
            warehouses: data,
        })
    })
    .catch(function (error) {
        console.log('error', error)
    });
}

const mapStateToProps = state => ({
    collapsed: state.ui.collapsed,
    filters:   selectTrackingFilters(state),
    loading:   selectTrackingLoading(state),
    user:      state.auth,
});

export const ProductsTrackingPage = withRouter(
    connect(
        mapStateToProps,
        { setTrackingFilters },
    )(props => {
        const type = props.type || "tracking";
        console.log(type);
        const { filters } = props;
        const [ period, setPeriod ] = useState('month');

        const setDaterange = daterange => {
            const [ startDate, endDate ] = daterange;
            props.setTrackingFilters({ startDate, endDate });
        };

        const handlePeriod = period => {
            setPeriod(period);
            period === 'month'
                ? setDaterange([ moment(filters.endDate).subtract(30, 'days'), moment(filters.endDate) ])
                : setDaterange([ moment(filters.endDate).subtract(1, period), moment(filters.endDate) ]);
        };

        const renderFilters = (
            <Filters>
                <ResponsiveView view={ { min: BREAKPOINTS.xxl.min, max: null } }>
                    <DateRangePicker
                        minimize
                        dateRange={[moment(filters.startDate), moment(filters.endDate)]}
                        onDateChange={ setDaterange }
                        style={{margin: '0 8px 0 0'}}
                    />
                    <BrandSelect
                        style={{margin: '0 8px 0 8px'}}
                        onSelect={ (brandId) => props.setTrackingFilters({brandId: brandId}) }
                    />
                    <WarehouseSelect 
                        style={{margin: '0 8px 0 8px'}}
                        onChange={ (warehouseId) => props.setTrackingFilters({warehouseId: warehouseId})}
                    />
                    <StoreProductsSelect
                        setFilters={ props.setTrackingFilters }
                        filters={ props.filters }
                    />
                    <div style={{margin: '0 0 0 8px'}}>
                        <DetailStorageModal
                            stockMode={true}
                            user={props.user}
                            selectProduct={(productId)=>{
                                props.setTrackingFilters({
                                    productId: productId,
                                    page: 1
                                })
                            }}
                        />
                    </div>
                </ResponsiveView>
            </Filters>
        );

        return (
            <Layout
                title={ <FormattedMessage id={`navigation.products_${type}`} /> }
                controls={ renderFilters }
                paper={ false }
            >
                <ResponsiveView view={ { min: null, max: BREAKPOINTS.xl.max } }>
                    <FiltersSubPanel collapsed={ props.collapsed }>
                        <DateRangePicker
                            minimize
                            dateRange={[moment(filters.startDate), moment(filters.endDate)]}
                            onDateChange={ setDaterange }
                            style={{margin: '0 8px 0 0'}}
                        />
                        <BrandSelect
                            style={{margin: '0 8px 0 8px'}}
                            onSelect={ (brandId) => props.setTrackingFilters({brandId: brandId}) }
                        />
                        <WarehouseSelect 
                            style={{margin: '0 8px 0 8px'}}
                            onChange={ (warehouseId) => props.setTrackingFilters({warehouseId: warehouseId})}
                        />
                        <StoreProductsSelect
                            setFilters={ props.setTrackingFilters }
                            filters={ props.filters }
                        />
                        <div style={{margin: '0 0 0 8px'}}>
                            <DetailStorageModal
                                stockMode={true}
                                user={props.user}
                                selectProduct={(productId)=>{
                                    props.setTrackingFilters({
                                        productId: productId,
                                        page: 1
                                    })
                                }}
                            />
                        </div>
                    </FiltersSubPanel>
                </ResponsiveView>
                <TrackingTableWrapper>
                    <TrackingTable
                        filters={ props.filters }
                        loading={ props.loading }
                        type={ type } 
                    />
                </TrackingTableWrapper>
                <StoreProductModal visible={ props.modal } />
            </Layout>
        );
    }),
);

const Filters = styled.div`
    display: flex;
    align-items: center;
`;

const TrackingTableWrapper = styled.div`
    margin: 0 16px;
    padding-top: 40px;
    ${media.xs`
        margin-top: 60px;
     `};
    ${media.sm`
        margin-top: 60px;
     `};
    ${media.md`
        margin-top: 60px;
     `};
    ${media.lg`
        margin-top: 60px;
     `};
    ${media.xl`
        margin-top: 60px;
     `};
`;

const FiltersSubPanel = styled.div`
    display: flex;
    overflow: initial;
    box-sizing: border-box;
    background-color: rgb(255, 255, 255);
    padding: 16px;
    margin-bottom: 24px;
    z-index: 210;
    border-top: 1px dashed var(--primary);
    border-bottom: 1px dashed var(--primary);
    position: fixed;
    top: 128px;
    left: ${props => props.collapsed ? '80px' : '256px'};
    width: ${props =>
        props.collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)'};
`;
