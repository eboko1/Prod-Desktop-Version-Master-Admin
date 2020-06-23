// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, message, notification, Table, TreeSelect, Checkbox, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
import { permissions, isForbidden } from "utils";
import { DetailStorageModal, DetailSupplierModal } from 'modals'
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
            relatedDetailsCheckbox: false,
            groupSearchValue: "",
        }
        this.labors = [];
        this.masterLabors = [];
        this.storeGroups = [];
        this.storeGroupsTreeData = [];
        this.laborsTreeData = [];
        this.brandOptions = [];
        this.servicesOptions = [];
        this.employeeOptions = [];
        this.relatedDetailsOptions = [];

        this.setComment = this.setComment.bind(this);
        this.setHours = this.setHours.bind(this);

        this.mainTableColumns = [
            {
                title:  <FormattedMessage id="services_table.store_group" />,
                key:       'storeGroupId',
                dataIndex: 'storeGroupId',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <TreeSelect
                            className={Styles.groupsTreeSelect}
                            disabled={this.state.editing}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.store_group'})}
                            style={{maxWidth: 180, minWidth: 140}}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.storeGroupsTreeData}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.state.mainTableSource[0].storeGroupId = value;
                                this.state.mainTableSource[0].laborId = undefined;
                                this.state.mainTableSource[0].serviceName = undefined;
                                this.filterOptions(elem.masterLaborId, value);
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
                
            },
            {
                title: <FormattedMessage id='order_form_table.service_type'/>,
                key:       'masterLaborId',
                dataIndex: 'masterLaborId',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <TreeSelect
                            className={Styles.groupsTreeSelect}
                            disabled={this.state.editing}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.service_type'})}
                            style={{maxWidth: 180, minWidth: 140}}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.laborsTreeData}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.state.mainTableSource[0].masterLaborId = value;
                                this.filterOptions(value, elem.storeGroupId);
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
                
            },
            {
                title:  <><FormattedMessage id="services_table.labor" /> <span style={{color: 'red'}}>*</span></>,
                key:       'laborId',
                dataIndex: 'laborId',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <Select
                            disabled={this.state.editing}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.labor'})}
                            value={data ? data : undefined}
                            style={{minWidth: 240}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                let price = option.props.price ? option.props.price : 1;
                                let count = option.props.norm_hours ? option.props.norm_hours : 1;
                                this.state.mainTableSource[0].laborId = value;
                                this.state.mainTableSource[0].serviceName = option.props.children;
                                this.state.mainTableSource[0].masterLaborId = option.props.master_id;
                                this.state.mainTableSource[0].storeGroupId = option.props.product_id;
                                this.state.mainTableSource[0].count = count;
                                this.state.mainTableSource[0].price = price;
                                this.state.mainTableSource[0].sum = price * count;
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.servicesOptions}
                        </Select>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.detail_name" />,
                key:       'serviceName',
                dataIndex: 'serviceName',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <Input
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            style={{minWidth: 140}}
                            value={data}
                            onChange={(event)=>{
                                this.state.mainTableSource[0].serviceName = event.target.value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="services_table.employee" />,
                key:       'employeeId',
                dataIndex: 'employeeId',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <Select
                            allowClear
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.employee'})}
                            value={data ? data : undefined}
                            style={{maxWidth: 180, minWidth: 100}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.state.mainTableSource[0].employeeId = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.employeeOptions}
                        </Select>
                    )
                }
            },
            {
                title:  <FormattedMessage id="comment" />,
                key:       'comment',
                dataIndex: 'comment',
                width:     '3%',
                render: (data, elem)=>{
                    const detail = {
                        name: this.state.mainTableSource[0].serviceName,
                    }
                    return (
                        <CommentaryButton
                            disabled={elem.laborId == null}
                            commentary={data ? data : {comment: null}}
                            detail={detail}
                            setComment={this.setComment}
                        />
                    )
                }
            },
            {
                title: <FormattedMessage id="order_form_table.purchasePrice" />,
                key:       'purchasePrice',
                dataIndex: 'purchasePrice',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            value={data || 0}
                            min={0}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.mainTableSource[0].purchasePrice = value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.price" />,
                key:       'price',
                dataIndex: 'price',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            value={data || 1}
                            min={1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.mainTableSource[0].price = value;
                                this.state.mainTableSource[0].sum = value * this.state.mainTableSource[0].count;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.count" />,
                key:       'count',
                dataIndex: 'count',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            value={data || 1}
                            min={1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.mainTableSource[0].count = value;
                                this.state.mainTableSource[0].sum = value * this.state.mainTableSource[0].price;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="services_table.norm_hours" />,
                key:       'hours',
                dataIndex: 'hours',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <NormHourModal
                            user={this.props.user}
                            tecdocId={this.props.tecdocId}
                            storeGroupId={elem.storeGroupId}
                            onSelect={this.setHours}
                            hours={data}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.sum" />,
                key:       'sum',
                width:     '5%',
                render: (elem)=>{
                    const sum = this.state.mainTableSource[0].price *  this.state.mainTableSource[0].count;
                    return (
                        <InputNumber
                            disabled
                            value={sum ? sum : 1}
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
                                this.state.mainTableSource[0].storeGroupId = this.state.editing ? elem.storeGroupId : undefined;
                                this.state.mainTableSource[0].masterLaborId = this.state.editing ? elem.masterLaborId : undefined;
                                this.state.mainTableSource[0].serviceName = undefined;
                                this.state.mainTableSource[0].comment = undefined;
                                this.state.mainTableSource[0].purchasePrice = 0;
                                this.state.mainTableSource[0].price = 1;
                                this.state.mainTableSource[0].count = 1;
                                this.state.mainTableSource[0].hours = 0;
                                this.state.mainTableSource[0].sum = undefined;

                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
        ];
    }

    handleOk = () => {
        if(this.state.mainTableSource[0].labor == undefined) {
            notification.warning({
                message: 'Заполните все необходимые поля',
              });
            return;
        }
        message.error('This is an error message');
        if(this.state.editing) {
            this.props.updateLabor(this.props.tableKey, {...this.state.mainTableSource[0]});
        }
        else {
            var data = {
                insertMode: true,
                details: [],
                services: [],
            }
            this.state.mainTableSource.map((element)=>{
                data.services.push({
                    //storeGroupId: element.storeGroupId,
                    serviceId: element.laborId,
                    serviceName: element.serviceName,
                    employeeId: element.employeeId,
                    serviceHours: element.hours ? element.hours : 0,
                    purchasePrice: element.purchasePrice,
                    count: element.count ? element.count : 1,
                    servicePrice: element.price,
                    comment: element.comment,
                })
            });
            this.addDetailsAndLabors(data);
        }
        this.props.hideModal();
    };
    
    handleCancel = () => {
        this.props.hideModal();
    };

    setComment(comment) {
        this.state.mainTableSource[0].comment = {comment: comment};
        this.setState({
            update: true
        })
    }

    setHours(hours) {
        this.state.mainTableSource[0].hours = hours;
        this.setState({
            update: true
        })
    }

    async addDetailsAndLabors(data) {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
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
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/labors`;
        url += params;
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
            data.labors.map((elem, index)=>{
                elem.key = index;
                elem.laborCode = `${elem.masterLaborId}-${elem.productId}`;
            })
            that.labors = data.labors;
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/labors/master?makeTree=true`;
        url = API_URL + params;
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
            that.masterLabors = data.masterLabors;
            that.buildLaborsTree();
        })
        .catch(function (error) {
            console.log('error', error)
        });

        params = `/store_groups`;
        url = API_URL + params;
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
            that.storeGroups = data;
            that.buildStoreGroupsTree();
            that.getOptions();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    buildStoreGroupsTree() {
        var treeData = [];
        for(let i = 0; i < this.storeGroups.length; i++) {
            const parentGroup = this.storeGroups[i];
            treeData.push({
                title: `${parentGroup.name} (#${parentGroup.id})`,
                name: parentGroup.name,
                value: parentGroup.id,
                className: Styles.groupTreeOption,
                key: `${i}`,
                children: [],
            })
            for(let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[j];
                treeData[i].children.push({
                    title: `${childGroup.name} (#${childGroup.id})`,
                    name: childGroup.name,
                    value: childGroup.id,
                    className: Styles.groupTreeOption,
                    key: `${i}-${j}`,
                    children: [],
                })
                for(let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[k];
                    treeData[i].children[j].children.push({
                        title: `${lastNode.name} (#${lastNode.id})`,
                        name: lastNode.name,
                        value: lastNode.id,
                        className: Styles.groupTreeOption,
                        key: `${i}-${j}-${k}`,
                        children: [],
                    })
                    for(let l = 0; l < lastNode.childGroups.length; l++) {
                        const elem = lastNode.childGroups[l];
                        treeData[i].children[j].children[k].children.push({
                            title: `${elem.name} (#${elem.id})`,
                            name: elem.name,
                            value: elem.id,
                            className: Styles.groupTreeOption,
                            key: `${i}-${j}-${k}-${l}`,
                        })
                    }
                }
            }
        }
        this.storeGroupsTreeData = treeData;
    }

    buildLaborsTree() {
        var treeData = [];
        for(let i = 0; i < this.masterLabors.length; i++) {
            const parentGroup = this.masterLabors[i];
            treeData.push({
                title: `${parentGroup.defaultMasterLaborName} (#${parentGroup.masterLaborId})`,
                name: parentGroup.defaultMasterLaborName,
                value: parentGroup.masterLaborId,
                className: Styles.groupTreeOption,
                key: `${i}`,
                children: [],
            })
            for(let j = 0; j < parentGroup.childGroups.length; j++) {
                const childGroup = parentGroup.childGroups[j];
                treeData[i].children.push({
                    title: `${childGroup.defaultMasterLaborName} (#${childGroup.masterLaborId})`,
                    name: childGroup.defaultMasterLaborName,
                    value: childGroup.masterLaborId,
                    className: Styles.groupTreeOption,
                    key: `${i}-${j}`,
                    children: [],
                })
                for(let k = 0; k < childGroup.childGroups.length; k++) {
                    const lastNode = childGroup.childGroups[k];
                    treeData[i].children[j].children.push({
                        title: `${lastNode.defaultMasterLaborName} (#${lastNode.masterLaborId})`,
                        name: lastNode.defaultMasterLaborName,
                        value: lastNode.masterLaborId,
                        className: Styles.groupTreeOption,
                        key: `${i}-${j}-${k}`,
                    })
                }
            }
        }
        this.laborsTreeData = treeData;
    }

    getOptions() {
        this.servicesOptions = this.labors.map((elem, index)=>(
            <Option key={index} value={elem.laborId} master_id={elem.masterLaborId} product_id={elem.productId} norm_hours={elem.normHours} price={elem.price}>
                {elem.name ? elem.name : elem.defaultName}
            </Option>
        ));
        this.employeeOptions = this.props.employees.map((elem, i)=>(
            <Option key={i} value={elem.id}>
                {elem.name}
            </Option>
        ))
    };

    filterOptions(masterLaborId, storeGroupId) {
        var servicesOptions = [...this.labors];
        if(masterLaborId) {
            servicesOptions = servicesOptions.filter((elem, index)=>elem.masterLaborId == masterLaborId);
        }
        if(storeGroupId) {
            servicesOptions = servicesOptions.filter((elem, index)=>elem.productId == storeGroupId);
        }
        servicesOptions = servicesOptions.map((elem, index)=>(
            <Option key={index} value={elem.laborId}  master_id={elem.masterLaborId} product_id={elem.productId} norm_hours={elem.normHours} price={elem.price}>
                {elem.name ? elem.name : elem.defaultName}
            </Option>
        ))

        this.servicesOptions = [...servicesOptions];
    }

    componentWillMount() {
        this.fetchData();
    }

    componentDidUpdate(prevState) {
        if(prevState.visible == false && this.props.visible) {
            const editing = Boolean(this.props.labor.laborId);
            this.getOptions();
            this.setState({
                editing: editing,
                mainTableSource: [{...this.props.labor}],
            })
        }
    }

    render() {
        const { visible } = this.props;
        return (
            <>
                <Modal
                    width="95%"
                    visible={visible}
                    title={null}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                >
                    <div>
                        Сопутствующие: детали
                        <Checkbox
                            checked={this.state.relatedDetailsCheckbox}
                            onChange={()=>{
                                this.setState({
                                    relatedDetailsCheckbox: !this.state.relatedDetailsCheckbox
                                })
                            }}
                        /> 
                    </div>
                    <div className={Styles.tableWrap} style={{overflowX: 'scroll'}}>
                        <div className={Styles.modalSectionTitle}>
                            <div style={{display: 'block'}}>Работа</div>
                        </div>
                        <Table
                            dataSource={this.state.mainTableSource}
                            columns={this.mainTableColumns}
                            pagination={false}
                        />
                    </div>
                </Modal>
            </>
        )
    }
}
export default AddServiceModal;

@injectIntl
class NormHourModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: [],
            fetched: false,
            filterValue: undefined,
        };

        this.columns = [
            {
                title:  <FormattedMessage id="order_form_table.service_type" />,
                key:       'kortext',
                dataIndex: 'kortext',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <span
                            style={{textTransform: 'capitalize'}}
                        >
                            {data}
                        </span>
                    )
                }
            },
            {
                title:  () => (
                            <div>
                                <FormattedMessage id="services_table.service_type" />
                                <Input
                                    value={this.state.filterValue}
                                    placeholder={this.props.intl.formatMessage({id: 'services_table.service_type'})}
                                    onChange={(event)=>{
                                        this.setState({
                                            filterValue: event.target.value
                                        })
                                    }}
                                />
                            </div>
                        ),
                key:       'itemmptext',
                dataIndex: 'itemmptext',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <span
                            style={{textTransform: 'capitalize'}}
                        >
                            {data}
                        </span>
                    )
                }
            },
            {
                title:  <FormattedMessage id="comment" />,
                key:       'qualcoltext',
                dataIndex: 'qualcoltext',
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <span
                            style={{textTransform: 'capitalize'}}
                        >
                            {data}
                        </span>
                    )
                }
            },
            {
                title:  <FormattedMessage id="order_form_table.price" />,
                key:       'price',
                dataIndex: 'price',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <span>
                            {data} <FormattedMessage id="cur" />
                        </span>
                    )
                }
            },
            {
                title:  <FormattedMessage id="services_table.norm_hours" />,
                key:       'worktime',
                dataIndex: 'worktime',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <span>
                            {data} <FormattedMessage id="order_form_table.hours_short" />
                        </span>
                    )
                }
            },
            {
                title:  <FormattedMessage id="sum" />,
                key:       'sum',
                dataIndex: 'sum',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <span>
                            {Math.ceil((elem.price*elem.worktime)*10)/10} <FormattedMessage id="cur" />
                        </span>
                    )
                }
            },
            {
                key:       'select',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <Button
                            type="primary"
                            onClick={()=>{
                                this.props.onSelect(elem.worktime);
                                this.handleCancel();
                            }}
                        >
                            <FormattedMessage id="select" />
                        </Button>
                    )
                }
            }
        ]
    }

    fetchData() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/tecdoc/labor_times?modificationId=${this.props.tecdocId}&storeGroupId=${this.props.storeGroupId}`;
        url += params;
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
            data.laborTimes.map((elem, i)=>{
                elem.key = i;
                elem.price = data.priceOfNormHour;
                elem.worktime = Math.ceil((elem.worktime)*10)/10;
            });
            that.setState({
                dataSource: data.laborTimes,
                fetched: true,
            });

        })
        .catch(function (error) {
            console.log('error', error);
            that.setState({
                fetched: true,
            });
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            dataSource: [],
            fetched: false,
        })
    }

    componentDidUpdate() {
        if(!this.state.fetched && this.state.visible) {
            this.fetchData();
        } 
    }

    render() { 
        const { hours } = this.props;
        const { dataSource, filterValue } = this.state;
        let tblData = [...dataSource];

        if(filterValue) tblData = tblData.filter((elem)=>elem.itemmptext.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0 );

        return (
            <>
                <Button
                    disabled={isForbidden(this.props.user, permissions.ACCESS_NORM_HOURS_MODAL_WINDOW)}
                    type={hours ? null : 'primary'}
                    onClick={()=>{
                        this.setState({visible: true})
                    }}
                >
                    { hours ? 
                    <>{hours} <FormattedMessage id="order_form_table.hours_short" /></> :
                    <Icon type="clock-circle" />}
                </Button>
                <Modal
                    width="75%"
                    visible={this.state.visible}
                    title={<FormattedMessage id="services_table.norm_hours" />}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    {this.state.fetched ? 
                        <Table
                            dataSource={tblData}
                            columns={this.columns}
                            pagination={false}
                        />
                        :
                        <Spin indicator={spinIcon} />
                    }
                </Modal>
            </>
    )}
}

@injectIntl
class CommentaryButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            problems: undefined,
            currentCommentaryProps: {
                rcl: null,
                fcl: null,
                io: null,
                tb: null,
                side: [],
                front: [],
                back: [],
                problems: [],
                mm:null,
                percent: null,
                deg: null,
            },
            currentCommentary: null,
        }
        this.commentaryInput = React.createRef();
    }

    showModal = () => {
        this.setState({
            currentCommentary: this.props.commentary.comment?this.props.commentary.comment:this.state.currentCommentary,
            visible: true,
        });
        if(this.commentaryInput.current != undefined) {
            this.commentaryInput.current.focus();
        }
    };

    handleOk = () => {
        this.props.setComment(this.state.currentCommentary);
        this.setState({
            visible: false,
        });
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            currentCommentary: null, 
        });
    };

    rendetHeader = () => {
        return (
            <div>
              <p>
                  {this.props.detail.name}
              </p>
            </div>
          );
    }

    setCurrentCommentaryProps(key, value) {
        const { detail } = this.props;
        if(key == "mm" || key == "percent" || key == "deg" || key == "problems") {
            if(this.state.currentCommentaryProps[key] == value) {
                this.state.currentCommentaryProps[key] = null;
            }
            else {
                this.state.currentCommentaryProps[key] = value;
            }
        }
        else {
            if(this.state.currentCommentaryProps[key].indexOf(value) != -1) {
                this.state.currentCommentaryProps[key] = [...this.state.currentCommentaryProps[key]].filter((data) => data != value);;
            }
            else {
                this.state.currentCommentaryProps[key].push(value);
            }
        }

        const { side, back, front, problems, mm, percent, deg } = this.state.currentCommentaryProps;
        var commentary = `${detail.name} - `;
        if(side.length) commentary += ` ${side.map((data)=>this.props.intl.formatMessage({id: data}))}. `;
        if(front.length) commentary += ` ${front.map((data)=>this.props.intl.formatMessage({id: data}))}. `;
        if(back.length) commentary += ` ${back.map((data)=>this.props.intl.formatMessage({id: data}))}. `;
        if(problems.length) commentary += ` ${problems.map((data)=>data)}. `;
        if(mm) commentary += ` ${mm}mm. `;
        if(percent) commentary += ` ${percent}%. `;
        if(deg) commentary += ` ${deg}°. `;


        this.setState({
            currentCommentary: commentary,
        });
    }

    componentDidMount() {
        this.state.currentCommentaryProps.mm = this.props.commentary.mm ? this.props.commentary.mm : 0;
        this.state.currentCommentaryProps.percent = this.props.commentary.percent ? this.props.commentary.percent : 0;
        this.state.currentCommentaryProps.deg = this.props.commentary.deg ? this.props.commentary.deg : 0;
    }

    componentDidUpdate() {
        
    }

    render() {
        const { TextArea } = Input;
        const { visible, loading, currentCommentaryProps, currentCommentary } = this.state;
        const { commentary } = this.props;
        const { disabled } = this.props;
        return (
            <div>
                {commentary.comment ? (
                    <Button
                        className={Styles.commentaryButton}
                        onClick={this.showModal}
                    >
                        <Icon
                            className={Styles.commentaryButtonIcon}
                            style={{color: "rgba(0, 0, 0, 0.65)"}}
                            type="form"/>
                    </Button>
                ) : (
                    <Button
                        disabled={disabled}
                        type="primary"
                        onClick={this.showModal}
                    >
                        <Icon type="message" />
                    </Button>
                )}
                <Modal
                    visible={visible}
                    title={this.rendetHeader()}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={disabled?(
                        null
                        ):([
                            <Button key="back" onClick={this.handleCancel}>
                                {<FormattedMessage id='cancel' />}
                            </Button>,
                            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                                {<FormattedMessage id='save' />}
                            </Button>,
                        ])
                    }
                >
                    {!disabled ? 
                    <div className={Styles.commentaryContentWrap}>
                        <div className={Styles.commentaryVehicleSchemeWrap}>
                            <div style={{
                                width: "360px",
                                height: "160px",
                                margin: "0 auto",
                                position: "relative",
                                backgroundImage: `url('${images.vehicleSchemeSide}')`,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                            }}>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("TOP") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "0%", left: "50%", transform: "translateX(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'TOP')}}
                                >
                                    <FormattedMessage id='TOP'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("REAR") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", left: "0%", transform: "translateY(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'REAR')}}
                                >
                                    <FormattedMessage id='REAR'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("BOTTOM") != -1 ? null : "primary"}
                                    style={{position: "absolute", bottom: "0%", left: "50%", transform: "translateX(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'BOTTOM')}}
                                >
                                    <FormattedMessage id='BOTTOM'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("FRONT") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", right: "0%", transform: "translateY(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'FRONT')}}
                                >
                                    <FormattedMessage id='FRONT'/>
                                </Button>
                                <Button
                                    type={currentCommentaryProps.side.indexOf("MIDDLE") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'MIDDLE')}}
                                >
                                    <FormattedMessage id='MIDDLE'/>
                                </Button>
                            </div>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <div style={{
                                    width: "180px",
                                    height: "160px",
                                    position: "relative",
                                    backgroundImage: `url('${images.vehicleSchemeBack}')`,
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}>
                                    <Button
                                        type={currentCommentaryProps.back.indexOf("LEFT") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "0%", bottom: "0%"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'LEFT')}}
                                    >
                                        <FormattedMessage id='LEFT'/>
                                    </Button>
                                    <Button
                                        type={currentCommentaryProps.back.indexOf("CENTER") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "50%", bottom: "50%", transform: "translate(-50%, 50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'CENTER')}}
                                    >
                                        <FormattedMessage id='CENTER'/>
                                    </Button>
                                    <Button
                                        type={currentCommentaryProps.back.indexOf("RIGHT") != -1 ? null : "primary"}
                                        style={{position: "absolute", right: "0%", bottom: "0%"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'RIGHT')}}
                                    >
                                        <FormattedMessage id='RIGHT'/>
                                    </Button>
                                </div>
                                <div style={{
                                    width: "180px",
                                    height: "160px",
                                    position: "relative",
                                    backgroundImage: `url('${images.vehicleSchemeFront}')`,
                                    backgroundSize: "contain",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}>
                                    <Button
                                        type={currentCommentaryProps.front.indexOf("IN") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('front', 'IN')}}
                                    >
                                        <FormattedMessage id='IN'/>
                                    </Button>
                                    <Button
                                        type={currentCommentaryProps.front.indexOf("OUT") != -1 ? null : "primary"}
                                        style={{position: "absolute", right: "0%", top: "50%", transform: "translateY(-50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('front', 'OUT')}}
                                    >
                                        <FormattedMessage id='OUT'/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className={Styles.commentarySectionHeader}>Параметры:</p>
                            <div style={{display: "flex"}}>
                                <div className={Styles.commentaryParameter}>
                                    <InputNumber
                                        value={currentCommentaryProps.mm || 0}
                                        formatter={value => `${value} mm.`}
                                        parser={value => value.replace(' %', '')}
                                        onChange={(mm)=>{this.setCurrentCommentaryProps('mm', mm)}}
                                    />
                                </div>
                                <div className={Styles.commentaryParameter}>
                                    <InputNumber
                                        value={currentCommentaryProps.percent || 0}
                                        formatter={value => `${value} %`}
                                        parser={value => value.replace(' %', '')}
                                        onChange={(percent)=>{this.setCurrentCommentaryProps('percent', percent)}}
                                    /> 
                                </div>
                                <div className={Styles.commentaryParameter}>
                                    <InputNumber
                                        value={currentCommentaryProps.deg || 0}
                                        formatter={value => `${value} °`}
                                        parser={value => value.replace(' °', '')}
                                        onChange={(deg)=>{this.setCurrentCommentaryProps('deg', deg)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div> : null}
                    <div>
                        <p className={Styles.commentarySectionHeader}>
                            <FormattedMessage id='order_form_table.diagnostic.commentary' />:
                        </p>
                        <TextArea
                            disabled={disabled}
                            value={currentCommentary}
                            placeholder={`${this.props.intl.formatMessage({id: 'comment'})}...`}
                            autoFocus
                            onChange={()=>{
                                this.setState({
                                    currentCommentary: event.target.value,
                                });
                            }}
                            style={{width: '100%', minHeight: '150px', resize:'none'}}
                            ref={this.commentaryInput}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}