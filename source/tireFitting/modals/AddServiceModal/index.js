// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, message, notification, Table, TreeSelect, Checkbox, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { images } from 'utils';
import { permissions, isForbidden } from "utils";
import { DetailStorageModal, DetailSupplierModal, LaborsNormHourModal, DetailProductModal } from 'modals'
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;
const Option = Select.Option;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@injectIntl
class AddServiceModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            mainTableSource: [],
            laborSearchValue: "",
        }
        this.labors = [];
        this.masterLabors = [];
        this.storeGroups = [];
        this.laborsTreeData = [];
        this.brandOptions = [];
        this.servicesOptions = [];
        this.employeeOptions = [];

        this.mainTableColumns = [
            {
                title:  <><FormattedMessage id="services_table.labor" /> <span style={{color: 'red'}}>*</span></>,
                key:       'laborId',
                dataIndex: 'laborId',
                render: (data, elem)=>{
                    const currentServiceOption = this.servicesOptions.find((labor)=>labor.laborId==data);
                    return (
                        <Select
                            allowClear
                            disabled={this.state.editing || elem.related}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.labor'})}
                            value={data}
                            style={{minWidth: 240, color: 'var(--text)'}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", maxWidth: 340 }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onChange={(value, option)=>{
                                if(option) {
                                    let price = option.props.price ? option.props.price : Number(this.props.normHourPrice);
                                    let count = option.props.norm_hours ? option.props.norm_hours : 1;
                                    elem.laborId = value;
                                    elem.serviceName = option.props.children;
                                    elem.masterLaborId = option.props.master_id;
                                    elem.storeGroupId = option.props.product_id;
                                    elem.count = count;
                                    elem.price = price;
                                    elem.sum = price * count;
                                } else {
                                    elem.laborId = value;
                                    elem.serviceName = value;
                                    elem.masterLaborId = value;
                                    elem.storeGroupId = value;
                                }
                                this.setState({});
                            }}
                            onSearch={(input)=>{
                                this.setState({
                                    laborSearchValue: input,
                                })
                            }}
                            onBlur={()=>{
                                this.setState({
                                    laborSearchValue: "",
                                })
                            }}
                        >
                            {
                                this.state.laborSearchValue.length > 2 || (!elem.related && (elem.storeGroupId || elem.masterLaborId)) ? 
                                    this.servicesOptions.map((elem, index)=>(
                                        <Option
                                            key={index}
                                            value={elem.laborId}
                                            master_id={elem.masterLaborId}
                                            product_id={elem.productId}
                                            norm_hours={elem.normHours}
                                            price={elem.price}
                                        >
                                            {elem.name ? elem.name : elem.defaultName}
                                        </Option>
                                    )) :
                                    elem.laborId && currentServiceOption ? 
                                    <Option
                                        key={0}
                                        value={currentServiceOption.laborId}
                                        master_id={currentServiceOption.masterLaborId}
                                        product_id={currentServiceOption.productId}
                                        norm_hours={currentServiceOption.normHours}
                                        price={currentServiceOption.price}
                                    >
                                        {currentServiceOption.name ? currentServiceOption.name : currentServiceOption.defaultName}
                                    </Option> : 
                                    []
                            }
                        </Select>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.detail_name" />,
                key:       'serviceName',
                dataIndex: 'serviceName',
                render: (data, elem)=>{
                    return (
                        <Input
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            disabled={this.state.editing && elem.stage != 'INACTIVE'}
                            style={{minWidth: 240}}
                            value={data}
                            onChange={({target})=>{
                                const { value } = target;
                                elem.serviceName = value;
                                this.setState({});
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="services_table.employee" />,
                key:       'employeeId',
                dataIndex: 'employeeId',
                render: (data, elem)=>{
                    return (
                        <Select
                            allowClear
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.employee'})}
                            value={data ? data : undefined}
                            style={{minWidth: 80}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", maxWidth: 340}}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onChange={(value, option)=>{
                                elem.employeeId = value;
                                this.setState({});
                            }}
                        >
                            {this.employeeOptions}
                        </Select>
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
                            className={Styles.serviceNumberInput}
                            value={Math.round(data*10)/10 || 1}
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
                    const value = data ? Number(data).toFixed(2) : 1;
                    return (
                        <InputNumber
                            className={Styles.serviceNumberInput}
                            value={value}
                            min={0.1}
                            step={0.1}
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
                    const sum = elem.price *  (elem.count || 1);
                    return (
                        <InputNumber
                            className={Styles.serviceNumberInput}
                            disabled
                            value={Math.round(sum*10)/10 || 1}
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
                width:     '3%',
                render: (elem)=>{
                    return (
                        <Icon
                            type="close"
                            onClick={()=>{
                                elem.storeGroupId = this.state.editing || elem.related ? elem.storeGroupId : undefined;
                                elem.masterLaborId = this.state.editing || elem.related ? elem.masterLaborId : undefined;
                                elem.serviceName = undefined;
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
        const { editing, mainTableSource, relatedServices, relatedServicesCheckbox } = this.state;
        if(mainTableSource[0].laborId == undefined) {
            notification.warning({
                message: 'Заполните все необходимые поля!',
              });
            return;
        }
        if(editing) {
            this.props.updateLabor(this.props.tableKey, {...mainTableSource[0]});
        }
        else {
            var data = {
                insertMode: true,
                details: [],
                services: [],
            }
            mainTableSource.map((element)=>{
                data.services.push({
                    serviceId: element.laborId,
                    serviceName: element.serviceName,
                    employeeId: element.employeeId || null,
                    purchasePrice: Math.round(element.purchasePrice*10)/10 || 0,
                    count: element.count ? element.count : 1,
                    servicePrice:  Math.round(element.price*10)/10 || 1,
                })
            });
            this.addDetailsAndLabors(data);
        }
        this.props.hideModal();
    };
    
    handleCancel = () => {
        this.setState({
            mainTableSource: [],
            relatedServices: [],
            relatedServicesCheckbox: false,
        });
        this.props.hideModal();
    };

    
    async addDetailsAndLabors(data) {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/orders/${this.props.orderId}`;
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
        this.masterLabors = this.props.masterLabors;
        this.labors = this.props.labors;
        this.storeGroups = this.props.details;
        this.getOptions();
    }

    getOptions() {
        this.servicesOptions = [...this.labors];
        this.employeeOptions = this.props.employees.map((elem, i)=>(
            <Option key={i} value={elem.id}>
                {elem.name} {elem.surname}
            </Option>
        ))
    };

    getMobileForm() {
        const { mainTableSource } = this.state;
        const dataSource = mainTableSource[0] || {};
        const columns = [...this.mainTableColumns];
        columns.pop();

        return columns.map(({title, key, render, dataIndex})=>{
            return (
                <div className={Styles.mobileTable}>
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

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevState) {
        if(prevState.visible == false && this.props.visible) {
            const editing = Boolean(this.props.labor && this.props.labor.laborId);
            this.getOptions();
            this.state.mainTableSource = [{...this.props.labor}];
            
            if(!editing) {
                this.state.mainTableSource[0].employeeId = this.props.defaultEmployeeId;
            }
            
            this.setState({
                editing: editing,
            })
        }
    }

    render() {
        const { visible, isMobile } = this.props;
        const { relatedServicesCheckbox, mainTableSource, relatedServices, editing } = this.state;
        return (
            <>
                <Modal
                    visible={visible}
                    title={null}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    maskClosable={false}
                    style={!isMobile ? {
                        minWidth: 560,
                        width: '"min-content',
                    } : {
                        width: '95%',
                    }}
                >
                    
                        <div className={Styles.tableWrap}>
                            <div className={Styles.modalSectionTitle}>
                                <div style={{display: 'block'}}><FormattedMessage id='services_table.labor'/></div>
                            </div>
                            {!isMobile ?
                                <Table
                                    dataSource={mainTableSource}
                                    columns={this.mainTableColumns}
                                    pagination={false}
                                /> :
                                this.getMobileForm()
                            }
                        </div>
                </Modal>
            </>
        )
    }
}
export default AddServiceModal;