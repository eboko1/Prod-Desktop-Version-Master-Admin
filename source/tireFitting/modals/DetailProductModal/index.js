// vendor
import React, { Component } from 'react';
import { Button, Modal, Icon, Select, Input, InputNumber, Radio, Table, TreeSelect, Checkbox, Spin, Slider } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { DetailStorageModal, DetailSupplierModal, OilModal } from 'modals';
import { AvailabilityIndicator } from 'components';
import { permissions, isForbidden, images } from 'utils';
// own
import Styles from './styles.m.css';
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const { TreeNode } = TreeSelect;
const { confirm } = Modal;
const Option = Select.Option;

@injectIntl
class DetailProductModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            mainTableSource: [],
            brandSearchValue: "",
            defaultBrandName: undefined,
        }
        this.labors = [];
        this.storeGroups = [];
        this.suppliers = [];
        this.treeData = [];
        this.servicesOptions = [];
        this.suppliersOptions = [];

        this.mainTableColumns = [
            {
                title:  <FormattedMessage id="order_form_table.store_group" />,
                key:       'storeGroupId',
                dataIndex: 'storeGroupId',
                width:     '12%',
                render: (data, elem)=>{
                    return (
                        <TreeSelect
                            className={Styles.groupsTreeSelect}
                            disabled={this.state.editing || elem.related}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.store_group'})}
                            style={{minWidth: 240, color: 'var(--text)'}}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, maxWidth: '95%', overflow: 'auto', zIndex: "9999" }}
                            treeData={this.props.treeData}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                elem.storeGroupId = value;
                                elem.detailName = option.props.name;
                                elem.multiplier = option.props.multiplier;
                                this.filterOptions(value);
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.detail_name" />,
                key:       'detailName',
                dataIndex: 'detailName',
                render: (data, elem)=>{
                    return (
                        <Input
                            disabled={elem.storeGroupId == null}
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            style={{minWidth: 240}}
                            value={data}
                            onChange={(event)=>{
                                elem.detailName = event.target.value;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  <div>   
                            <FormattedMessage id='order_form_table.price' />
                            <p style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                                fontWeight: 400,
                            }}>
                                <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                            </p>
                        </div>,
                key:       'price',
                dataIndex: 'price',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null}
                            value={Math.round(data*10)/10 || 1}
                            className={Styles.detailNumberInput}
                            min={1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                elem.price = value;
                                elem.sum = value * elem.count;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.count" />,
                key:       'count',
                dataIndex: 'count',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            disabled={elem.storeGroupId == null}
                            value={Math.round(data*10)/10 || 1}
                            className={Styles.detailNumberInput}
                            min={0.1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                elem.count = value;
                                elem.sum = value * elem.price;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  <div>   
                            <FormattedMessage id='order_form_table.sum' />
                            <p style={{
                                color: 'var(--text2)',
                                fontSize: 12,
                                fontWeight: 400,
                            }}>
                                <FormattedMessage id='without' /> <FormattedMessage id='VAT'/>
                            </p>
                        </div>,
                key:       'sum',
                render: (elem)=>{
                    const sum = elem.price * (elem.count || 1);
                    return (
                        <InputNumber
                            disabled
                            className={Styles.detailNumberInput}
                            value={sum ? Math.round(sum*10)/10 : 1}
                            style={{color: "black"}}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                        />
                    )
                }
            },
            {
                key:       'delete',
                render: (elem)=>{
                    return (
                        <Icon
                            type="close"
                            onClick={()=>{
                                elem.storeGroupId = this.state.editing || elem.related ? elem.storeGroupId : undefined;
                                elem.detailName = undefined;
                                elem.price = 1;
                                elem.count = 1;
                                elem.sum = undefined;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
        ];
    }

    handleOk = () => {
        const { editing, mainTableSource } = this.state;
        if(editing) {
            this.props.updateDetail(this.props.tableKey, {...mainTableSource[0]});
        }
        else {
            var data = {
                insertMode: true,
                details: [],
                services: [],
            }
            mainTableSource.map((element)=>{
                data.details.push({
                    storeGroupId: element.storeGroupId,
                    name: element.detailName,
                    count: element.count ? element.count : 1,
                    price: element.price ? Math.round(element.price*10)/10  : 1,
                })
            });
            this.addDetailsAndLabors(data);
        }
        this.props.hideModal();
    };
    
    handleCancel = () => {
        this.setState({
            mainTableSource: [],
        });
        this.props.hideModal();
    };

    async addDetailsAndLabors(data) {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__;
        let params = `/orders/${this.props.orderId}`;
        url += params;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if(result.success) {
                this.props.updateDataSource();
            }
            else {
                console.log("BAD", result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    fetchData() {
        
    }


    getOptions() {
        this.servicesOptions = this.props.labors.map((elem, index)=>(
            <Option key={index} value={elem.laborId} product_id={elem.productId} norm_hours={elem.normHours} price={elem.price}>
                {elem.name ? elem.name : elem.defaultName}
            </Option>
        ));
        
        this.suppliersOptions = this.suppliers.map((elem, index)=>(
            <Option key={index} value={elem.id}>
                {elem.name}
            </Option>
        ));
    };

    filterOptions(id) {
        const servicesOptions = [];
        this.labors.map((elem, index)=>{
            if(elem.productId == id) {
                servicesOptions.push(
                    <Option key={index} value={elem.laborId} product_id={elem.productId} norm_hours={elem.normHours} price={elem.price}>
                        {elem.name ? elem.name : elem.defaultName}
                    </Option>
                )
            }
            else return;
        });

        this.servicesOptions = [...servicesOptions];
    }

    deleteDetail = async () => {
        let token = localStorage.getItem(
            '_my.carbook.pro_token',
        );
        let url = __API_URL__;
        let params = `/orders/${this.props.orderId}/details?ids=[${this.props.detail.id}]`;
        url += params;
        try {
            const response = await fetch(url, {
                method:  'DELETE',
                headers: {
                    Authorization:  token,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.success) {
                this.props.updateDataSource();
            } else {
                console.log('BAD', result);
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    confirmDelete = () => {
        const { formatMessage } = this.props.intl;
        const that = this;
        confirm({
            title: formatMessage({id: 'add_order_form.delete_confirm'}),
            onOk() {
                that.deleteDetail();
            },
            okType: 'danger',
        });
    }

    getMobileForm() {
        const { mainTableSource } = this.state;
        const dataSource = mainTableSource[0] || {};
        const columns = [...this.mainTableColumns];
        columns.pop();

        return columns.map(({title, key, render, dataIndex})=>{
            return (
                <div className={`${Styles.mobileTable} ${(key == 'price' || key == 'count' || key == 'sum') && Styles.mobileTableNumber}`}>
                    {title}
                    <div>
                        {dataIndex ? 
                            render(dataSource[dataIndex], dataSource) :
                            render(dataSource)
                        }
                    </div>
                </div>
            )
        })
    }

    componentWillMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.visible == false && this.props.visible) {
            const editing = Boolean(this.props.detail && this.props.detail.storeGroupId);
            this.setState({
                editing: editing,
                mainTableSource: [{...this.props.detail, key: 0}],
            })
        }
    }

    render() {
        const { visible, tableMode, isMobile } = this.props;
        const { editing } = this.state;
        return (
            <div>
                <Modal
                    width={'min-content'}
                    visible={visible}
                    title={null}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    maskClosable={false}
                    style={!isMobile ? {
                        minWidth: 560,
                    } : {
                        minWidth: '95%',
                    }}
                    footer={
                        isMobile && editing ? 
                        <div>
                            <Button
                                type='danger'
                                style={{
                                    float:'left'
                                }}
                                onClick={()=>this.confirmDelete()}
                            >
                                <Icon type='delete'/>
                            </Button>
                            <Button
                                onClick={()=>this.handleCancel()}
                            >
                                <FormattedMessage id="cancel"/>
                            </Button>
                            <Button 
                                type='primary'
                                onClick={()=>this.handleOk()}
                            >
                                <FormattedMessage id="save"/>
                            </Button>
                        </div> :
                        void 0
                    }
                >
                    <div className={Styles.tableWrap}>
                        <div className={Styles.modalSectionTitle}>
                            <div style={{display: 'block'}}>
                                <FormattedMessage id="order_form_table.diagnostic.detail"/>
                            </div>
                        </div>
                        {!isMobile ?
                            <Table
                                dataSource={this.state.mainTableSource}
                                columns={this.mainTableColumns}
                                pagination={false}
                            /> :
                            this.getMobileForm()
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}
export default DetailProductModal;