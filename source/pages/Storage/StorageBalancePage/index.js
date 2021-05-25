// vendor
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';
import { Button, notification, Modal, Icon, DatePicker, Select, TreeSelect, Input } from 'antd';
import { saveAs } from 'file-saver';
import moment from 'moment';

// proj
import { Layout } from 'commons';
import { fetchAPI } from 'utils';
import { StoreBalanceTable, StorageBalanceTotals, WarehouseSelect } from 'components';
import { DropTarget } from 'react-dnd';

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
            brands: [],
            fetched: false,
            warehouseId: undefined,
            startDate: undefined,
            endDate: undefined,
            detailsTreeData: [],
        }
    }

    buildStoreGroupsTree = async () => {
        const storeGroups = await fetchAPI('GET', 'store_groups');
		var treeData = [];
        console.log(storeGroups)
		for ( let i = 0; i < storeGroups.length; i++ ) {
			const parentGroup = storeGroups[i];
			treeData.push({
				title: `${parentGroup.name} (#${parentGroup.id})`,
				name: parentGroup.singleName,
				value: parentGroup.id,
				key: `${i}`,
				children: [],
				multiplier: parentGroup.priceGroupMultiplier,
			});
			for (let j = 0; j < parentGroup.childGroups.length; j++) {
				const childGroup = parentGroup.childGroups[j];
				treeData[i].children.push({
					title: `${childGroup.name} (#${childGroup.id})`,
					name: childGroup.singleName,
					value: childGroup.id,
					key: `${i}-${j}`,
					children: [],
					multiplier: childGroup.priceGroupMultiplier,
				});
				for (let k = 0; k < childGroup.childGroups.length; k++) {
					const lastNode = childGroup.childGroups[k];
					treeData[i].children[j].children.push({
						title: `${lastNode.name} (#${lastNode.id})`,
						name: lastNode.singleName,
						value: lastNode.id,
						key: `${i}-${j}-${k}`,
						children: [],
						multiplier: lastNode.priceGroupMultiplier,
					});
					for (let l = 0; l < lastNode.childGroups.length; l++) {
						const elem = lastNode.childGroups[l];
						treeData[i].children[j].children[k].children.push({
							title: `${elem.name} (#${elem.id})`,
							name: elem.singleName,
							value: elem.id,
							key: `${i}-${j}-${k}-${l}`,
							multiplier: elem.priceGroupMultiplier,
						});
					}
				}
			}
		}
		this.setState({
			detailsTreeData: treeData,
		});
	}

    handleCancel = () => {
        this.setState({
            visible: false,
            dataSource: [],
            fetched: false,
        })
    }

    handleOk = async () => {
        const { warehouseId, startDate, endDate, brandsId, storeGroupId, productCode } = this.state;
        const response = await fetchAPI(
            'GET',
            'store_doc_products/movement_report',
            {
                warehouseId,
                startDate: moment(startDate).format('YYYY-MM-DD'),
                endDate: moment(endDate).format('YYYY-MM-DD'),
                date: moment(startDate).add( -1, 'day').format('YYYY-MM-DD'),
                brandsId,
                storeGroupId,
                productCode,
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
        this.buildStoreGroupsTree();
        const brands = await fetchAPI('GET', 'brands');
        this.setState({
            brands,
        });
    }

    render() { 
        const { visible, brands, warehouseId, detailsTreeData } = this.state;

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
                    title={<FormattedMessage id='navigation.print' />}              
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    okButtonProps={{
                        disabled: !warehouseId
                    }}
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
                        style={{width: '100%', marginTop: 8}}
                        onChange={ (warehouseId) => this.setState({warehouseId}) }
                    />
                    <TreeSelect
                        showSearch
                        placeholder={this.props.intl.formatMessage({id: 'order_form_table.store_group'})}
                        style={{marginTop: 8}}
                        treeData={detailsTreeData}
                        filterTreeNode={(input, node) => {
                            return (
                                node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                String(node.props.value).indexOf(input.toLowerCase()) >= 0
                            )
                        }}
                        onSelect={(storeGroupId)=>{
                            this.setState({storeGroupId})
                        }}
                    />
                    <Select
                        showSearch
                        allowClear
                        placeholder={this.props.intl.formatMessage({id: "order_form_table.brand"})}
                        onChange={ (brandsId) => this.setState({brandsId}) }
                        style={{marginTop: 8}}
                    >
                        {brands.map(({brandId, brandName})=>
                            <Option value={brandId} key={brandId}>
                                {brandName}
                            </Option>
                        )}
                    </Select>
                    <Input
                        allowClear
                        placeholder={this.props.intl.formatMessage({id: "order_form_table.detail_code"})}
                        style={{marginTop: 8}}
                        onChange={ ({target}) => this.setState({productCode: target.value}) }
                    />
                </Modal>
            </>
    )}
}
