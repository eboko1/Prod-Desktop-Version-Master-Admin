// vendor
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';
import { Button, notification, Modal, Icon, DatePicker, Select } from 'antd';
import { saveAs } from 'file-saver';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import { fetchAPI } from 'utils';
import { StoreBalanceTable, StorageBalanceTotals, WarehouseSelect } from 'components';

// own
const { Option } = Select;

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
            products: [],
            fetched: false,
            warehouseId: undefined,
            startDate: undefined,
            endDate: undefined,
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            dataSource: [],
            fetched: false,
        })
    }

    handleOk = async () => {
        const { warehouseId, startDate, endDate, productId } = this.state;
        const response = await fetchAPI(
            'GET',
            'store_doc_products/movement_report',
            {
                warehouseId,
                startDate: moment(startDate).format('YYYY-MM-DD'),
                endDate: moment(endDate).format('YYYY-MM-DD'),
                date: moment(startDate).add( -1, 'day').format('YYYY-MM-DD'),
                productId,
            },
            null,
            { rawResponse: true },
        );

        const reportFile = await response.blob();

        const contentDispositionHeader = response.headers.get(
            'content-disposition',
        );
        const fileName = contentDispositionHeader.match(
            /^attachment; filename="(.*)"/,
        )[ 1 ];
        await saveAs(reportFile, fileName);
    }

    componentDidMount = async () => {
        const products = await fetchAPI('GET', 'store_products');
        this.setState({
            products: products.list,
        })
    }

    render() { 
        const { visible, products } = this.state;

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
                    title={<FormattedMessage id="Печать" />}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    destroyOnClose
                    zIndex={230}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>
                        <DatePicker onChange={(startDate) => this.setState({startDate})} />
                        <DatePicker onChange={(endDate) => this.setState({endDate})} />
                    </div>
                    <WarehouseSelect 
                        style={{width: '100%'}}
                        onChange={ (warehouseId) => this.setState({warehouseId}) }
                    />
                    <Select
                        showSearch
                        placeholder={this.props.intl.formatMessage({id: "product"})}
                        onChange={ (productId) => this.setState({productId}) }
                    >
                        {products.map(({id, name, code, brand})=>
                            <Option value={id} key={id}>
                                {code} / {brand.name} / {name}
                            </Option>
                        )}
                    </Select>
                </Modal>
            </>
    )}
}
