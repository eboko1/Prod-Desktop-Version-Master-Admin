// vendor
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';
import { Button, notification, Modal, Icon } from 'antd';

// proj
import { Layout } from 'commons';
import { StoreBalanceTable, StorageBalanceTotals, WarehouseSelect } from 'components';

export const StorageBalancePage = injectIntl(({intl}) => {
    return (
        <Layout
            paper={ false }
            title={ <FormattedMessage id='navigation.storage_balance' /> }
            controls={[
                <PrintModal/>,
                <Button
                    type='primary'
                    style={{
                        marginLeft: 8
                    }}
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
                            if(data.created) {
                                notification.success({
                                    message: intl.formatMessage({id: 'storage_document.reserve_all_success'})
                                })
                                window.location.reload();
                            }
                            else {
                                notification.warning({
                                    message: intl.formatMessage({id: 'storage_document.error.confirm_all'})
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

@injectIntl
class PrintModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],
            fetched: false,
            warehouseId: undefined,
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            dataSource: [],
            fetched: false,
        })
    }

    render() { 
        const { visible, dataSource, filterValue } = this.state;

        return (
            <>
                <Button
                    onClick={()=>{
                        this.setState({visible: true})
                    }}
                    title={this.props.intl.formatMessage({id: "labors_table.check_labor_hours"})}
                >
                    <Icon type="printer" />
                </Button>
                <Modal
                    width="460px"
                    visible={visible}
                    title={<FormattedMessage id="report" />}
                    onCancel={this.handleCancel}
                    destroyOnClose
                >
                    <WarehouseSelect 
                        //style={{margin: '0 0 0 8px'}}
                        onChange={ (warehouseId) => this.setState({warehouseId: warehouseId})}
                    />
                </Modal>
            </>
    )}
}
