// vendor
import React from 'react';
import { Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import styled from 'styled-components';

// proj
import { Layout } from 'commons';
import { TrackingTable } from 'components';
import { DatePickerField } from 'forms/_formkit';
import { StoreProductModal } from 'modals';

// own
const Search = Input.Search;

const Filters = styled.div`
    display: flex;
    align-items: center;
`;

export const ProductsTrackingPage = props => {
    const renderFilters = (
        <Filters>
            <DatePickerField
                style={ { marginRight: 16, width: 320 } }
                date={ moment() }
            />
            <Search
                placeholder='Фильтр по товару'
                onSearch={ value => console.log(value) }
                enterButton
            />
        </Filters>
    );

    return (
        <Layout
            title={ <FormattedMessage id='navigation.products_tracking' /> }
            controls={ renderFilters }
        >
            <TrackingTable />
            <StoreProductModal visible={ props.modal } />
        </Layout>
    );
};
