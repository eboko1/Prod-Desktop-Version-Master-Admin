// vendor
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';
import { Button, notification } from 'antd';

// proj
import { Layout } from 'commons';
import { StoreBalanceTable, StorageBalanceTotals } from 'components';

export const StorageBalancePage = injectIntl(({intl}) => {
    return (
        <Layout
            paper={ false }
            title={ <FormattedMessage id='navigation.storage_balance' /> }
            controls={[
                <Button
                    type='primary'
                    onClick={()=>{
                        let token = localStorage.getItem('_my.carbook.pro_token');
                        let url =  __API_URL__ +`/store_docs/reserve_all_possible`;
                        fetch(url, {
                            method: 'POST',
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
                            console.log(data);
                            if(data.created) {
                                notification.success({
                                    message: intl.formatMessage({id: 'storage_document.reserve_all_success'})
                                })
                            }
                            else {
                                notification.error({
                                    message: intl.formatMessage({id: 'error'})
                                })
                            }
                        })
                    }}
                > 
                    <FormattedMessage id='storage_document.reserve_all'/>
                </Button>
            ]}
        >
            <StorageBalanceTotals />
            <StoreBalanceTableWrapper>
                <StoreBalanceTable />
            </StoreBalanceTableWrapper>
        </Layout>
    );
})

const StoreBalanceTableWrapper = styled.section`
    padding: 136px 0 0 0;
    margin: 0 16px;
`;
