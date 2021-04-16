// vendor
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Table, Button } from 'antd';
import _ from 'lodash';
import moment from 'moment';

// proj
import { Layout, Catcher, Spinner } from 'commons';
import { permissions, isForbidden, fetchAPI } from 'utils';
import { WMSCellsModal } from 'modals';

// own
const mapStateToProps = state => ({
    user: state.auth,
});

const mapDispatchToProps = {
};

@connect( mapStateToProps, mapDispatchToProps )
export default class ProductsWithoutCellPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCell: undefined,
            dataSource: [],
        };

        this.columns = [
            {
                title: <FormattedMessage id="Код товара" />,
                key: 'code',
                dataIndex: 'code',
                sorter: (a, b) => String(a.code).localeCompare(String(b.code)),
                render: (data, row) => {
                    return (
                        <div
                            style={{
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                            onClick={()=>{
                                this.props.fetchMovement(undefined, row.id)
                            }}
                        >
                            {data}
                        </div>
                    )
                }
            },
            {
                title: <FormattedMessage id="Бренд" />,
                key: 'brand',
                dataIndex: 'brand',
                sorter: (a, b) => String(a.brandName).localeCompare(String(b.brandName)),
                render: (data, row) => {
                    return (
                        data.name
                    )
                }
            },
            {
                title: <FormattedMessage id="Наименование" />,
                key: 'name',
                dataIndex: 'name',
                sorter: (a, b) => String(a.name).localeCompare(String(b.name)),
            },
            {
                title: <FormattedMessage id="count" />,
                key: 'count',
                dataIndex: 'count',
                render: (data, row) => {
                    return (
                        data - row.wmsCount
                    )
                }
            },
            {
                key: 'action',
                dataIndex: 'address',
                render: (data, row)=>{
                    return (
                        <Button
                            type='primary'
                            onClick={()=>{
                                this.setState({
                                    selectedCell: row,
                                });
                            }}
                        >
                            <FormattedMessage id='Переместить'/>
                        </Button>
                    )
                }
            }
        ]
    }

    _fetchProducts = async () => {
        const dataSource = await fetchAPI('GET', 'store_products', {whereWmsCountLessThanCount: true});
        this.setState({
            dataSource: dataSource.list,
        })
    }

    componentDidMount() {
        this._fetchProducts();
    }

    render() {
        const { user } = this.props;
        const { dataSource, selectedCell } = this.state;
        return (
            <Layout
                title={<FormattedMessage id='navigation.products_without_cell'/>}
            >
                <Catcher>
                    <Table
                        size={'small'}
                        columns={this.columns}
                        dataSource={dataSource }
                    />
                    <WMSCellsModal
                        visible={Boolean(selectedCell)}
                        confirmAction={async (address, modalWarehouseId, count)=>{
                            await fetchAPI('POST', 'wms/cells/products', null, [
                                {
                                    warehouseId: modalWarehouseId,
                                    storeProductId: selectedCell.id,
                                    address,
                                    count,
                                }
                            ])
                            await this._fetchProducts();
                        }}
                        hideModal={()=>{
                            this.setState({selectedCell: undefined})
                        }}
                    />
                </Catcher>
            </Layout>
        );
    }
}
