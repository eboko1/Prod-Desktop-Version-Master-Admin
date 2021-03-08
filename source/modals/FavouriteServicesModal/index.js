// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, AutoComplete, Table, TreeSelect, Checkbox, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import {
    API_URL,
    confirmDiagnostic,
    createAgreement,
    lockDiagnostic,
} from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
import { DetailStorageModal, DetailSupplierModal } from 'modals'
import { permissions, isForbidden } from "utils";
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;
const Option = Select.Option;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@injectIntl
class FavouriteServicesModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            dataSource: [],
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

        this.columns = [
            {
                title:  <FormattedMessage id="order_form_table.service_type" />,
                key:       'masterLaborId',
                dataIndex: 'masterLaborId',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <TreeSelect
                            className={Styles.groupsTreeSelect}
                            disabled
                            showSearch
                            placeholder='ID'
                            style={{maxWidth: 220, color: 'black'}}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.props.laborsTreeData}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.state.dataSource[elem.key].masterLaborId = value;
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
                title:  <FormattedMessage id="order_form_table.store_group" />,
                key:       'storeGroupId',
                dataIndex: 'storeGroupId',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <TreeSelect
                            className={Styles.groupsTreeSelect}
                            disabled
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.store_group'})}
                            style={{maxWidth: 220, color: 'black'}}
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
                                this.state.dataSource[elem.key].storeGroupId = value;
                                this.state.dataSource[elem.key].laborId = undefined;
                                this.state.dataSource[elem.key].serviceName = undefined;
                                this.filterOptions(elem.masterLaborId, value);
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
                
            },
            /*{
                title:  <FormattedMessage id="order_form_table.service_type" />,
                key:       'laborId',
                dataIndex: 'laborId',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <Select
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.service_type'})}
                            value={data ? data : undefined}
                            style={{maxWidth: 220, minWidth: 100}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 380 }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                this.state.dataSource[elem.key].laborId = value;
                                this.state.dataSource[elem.key].serviceName = option.props.children;
                                this.state.dataSource[elem.key].masterLaborId = option.props.master_id;
                                this.state.dataSource[elem.key].storeGroupId = option.props.product_id;
                                this.setState({
                                    update: true
                                })
                            }}
                        >
                            {this.servicesOptions}
                        </Select>
                    )
                }
            },*/
            {
                title:  <FormattedMessage id="order_form_table.detail_name" />,
                key:       'serviceName',
                dataIndex: 'serviceName',
                width:     '20%',
                render: (data, elem)=>{
                    return (
                        <Input
                            disabled
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            style={{minWidth: 150, color: 'black'}}
                            value={data}
                            onChange={(event)=>{
                                this.state.dataSource[elem.key].serviceName = event.target.value;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="comment" />,
                key:       'comment',
                dataIndex: 'comment',
                width:     '5%',
                render: (data, elem)=>{
                    var detail = elem.serviceName;
                    if(detail && detail.indexOf(' - ') > -1) {
                        detail = detail.slice(0, detail.indexOf(' - '));
                    }
                    return (
                        <CommentaryButton
                            disabled={elem.laborId == null}
                            commentary={
                                data || 
                                {
                                    comment: undefined,
                                    positions: [],
                                }
                            }
                            detail={detail}
                            setComment={this.setComment}
                            tableKey={elem.key}
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
                            value={Math.round(data*10)/10 || 0}
                            className={Styles.serviceNumberInput}
                            min={0}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.dataSource[elem.key].purchasePrice = value;
                                this.setState({
                                    update: true
                                })
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
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <InputNumber
                            value={Math.round(data*10)/10 || 1}
                            className={Styles.serviceNumberInput}
                            min={1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.dataSource[elem.key].price = value;
                                this.state.dataSource[elem.key].sum = value * this.state.dataSource[elem.key].count;
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
                            value={Math.round(data*10)/10 || 0}
                            className={Styles.serviceNumberInput}
                            min={1}
                            formatter={ value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                            }
                            parser={ value =>
                                `${value}`.replace(/\$\s?|(\s)/g, '')
                            }
                            onChange={(value)=>{
                                this.state.dataSource[elem.key].count = value;
                                this.state.dataSource[elem.key].sum = value * this.state.dataSource[elem.key].price;
                                this.setState({
                                    update: true
                                })
                            }}
                        />
                    )
                }
            },
            {
                title:  <FormattedMessage id="hours" />,
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
                            hours={Math.round(data*10)/10}
                            tableKey={elem.key}
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
                width:     '5%',
                render: (elem)=>{
                    const sum = this.state.dataSource[elem.key].price *  this.state.dataSource[elem.key].count;
                    return (
                        <InputNumber
                            className={Styles.serviceNumberInput}
                            disabled
                            value={Math.round(sum*10)/10 || 0}
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
                key:       'select',
                width:     '3%',
                render: (elem)=>{
                    return (
                        <Button
                            type='primary'
                            onClick={()=>{
                                this.handleOk(elem.key);
                            }}
                        >
                            <FormattedMessage id='select'/>
                        </Button>
                    )
                }
            },
        ];
    }

    handleOk = (index) => {
        var data = {
            insertMode: true,
            details: [],
            services: [],
        }
        data.services.push({
            //storeGroupId: this.state.dataSource[index].storeGroupId,
            serviceId: this.state.dataSource[index].laborId,
            serviceName: this.state.dataSource[index].serviceName,
            employeeId: this.state.dataSource[index].employeeId,
            serviceHours: this.state.dataSource[index].hours ? this.state.dataSource[index].hours : 1,
            purchasePrice: this.state.dataSource[index].purchasePrice,
            count: this.state.dataSource[index].count ? this.state.dataSource[index].count : 1,
            servicePrice: this.state.dataSource[index].price,
            comment: this.state.dataSource[index].comment || {
                comment: undefined,
                positions: [],
            },
        })
        this.addDetailsAndLabors(data);
        this.setState({
            visible: false,
        })
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    };

    setComment(comment, positions, index) {
        this.state.dataSource[index].comment = {
            comment: comment,
            positions: positions,
        };
        this.state.dataSource[index].serviceName = comment || this.state.dataSource[index].serviceName;
        this.setState({
            update: true
        })
    }

    setHours(hours, index) {
        this.state.dataSource[index].hours = hours;
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
        let url = __API_URL__ + `/orders/frequent/labors`;
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
            data.labors.map((elem, i)=>{
                elem.key = i;
                elem.employeeId = that.props.defaultEmployeeId;
                elem.masterLaborId = elem.laborData[0].masterLaborId;
                elem.storeGroupId = elem.laborData[0].productId;
                elem.serviceName = elem.name;
                elem.price = elem.price ? elem.price : that.props.normHourPrice;
            });
            that.setState({
                dataSource: data.labors,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
        this.labors = this.props.labors;
        this.storeGroups = this.props.details;
        this.buildStoreGroupsTree();
        this.getOptions();
    }

    buildStoreGroupsTree() {
        var treeData = [];
        for(let i = 0; i < this.storeGroups && this.storeGroups.length ? this.storeGroups.length : 0; i++) {
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

    getOptions() {
        this.servicesOptions = this.props.labors.map((elem, index)=>(
            <Option key={index} value={elem.laborId} master_id={elem.masterLaborId} product_id={elem.productId} norm_hours={elem.normHours} price={elem.price}>
                {elem.name ? elem.name : elem.defaultName}
            </Option>
        ));
        
        this.employeeOptions = this.props.employees.map((elem, i)=>(
            <Option key={i} value={elem.id}>
                {elem.name} {elem.surname}
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

    componentDidMount() {
        this.fetchData();
    }

    componentWillUpdate(_, nextState) {
        if(this.state.visible==false && nextState.visible==true) {
            this.fetchData();
        }
    }

    render() {
        return (
            <>
                <Button
                    type="primary"
                    disabled={this.props.disabled}
                    onClick={()=>{
                        this.setState({
                            visible: true,
                        })
                    }}
                    title={this.props.intl.formatMessage({id: "labors_table.favorite_labors"})}
                >
                    <Icon 
                        type="star"
                        theme="filled"
                        style={{fontSize: 18}}
                    />
                </Button>
                <Modal
                    width="95%"
                    visible={this.state.visible}
                    title={null}
                    onCancel={this.handleCancel}
                    onOk={this.handleOk}
                    footer={null}
                    maskClosable={false}
                >
                    <div className={Styles.tableWrap} style={{overflowX: 'scroll'}}>
                        <div className={Styles.modalSectionTitle}>
                            <div style={{display: 'block'}}><FormattedMessage id='services_table.labor'/></div>
                        </div>
                        <Table
                            dataSource={this.state.dataSource}
                            columns={this.columns}
                            pagination={false}
                        />
                    </div>
                </Modal>
            </>
        )
    }
}
export default FavouriteServicesModal;

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
                            {Math.round((elem.price*elem.worktime)*10)/10} <FormattedMessage id="cur" />
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
                                this.props.onSelect(elem.worktime, this.props.tableKey);
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
                    title={this.props.intl.formatMessage({id: "labors_table.check_labor_hours"})}
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
                    maskClosable={false}
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
            currentCommentaryProps: {
                name: props.detail,
                positions : [],
            },
            currentCommentary: undefined,
        }
        this.commentaryInput = React.createRef();
        this.positions = [
            "front_axle",
            "ahead",
            "overhead",
            "rear_axle",
            "behind",
            "down_below",
            "Right_wheel",
            "on_right",
            "outside",
            "left_wheel",
            "left",
            "inside",
            "lever_arm",
            "at_both_sides",
            "centered",
        ];
        this._isMounted = false;
    }

    showModal = () => {
        this.setState({
            currentCommentary: this.props.commentary.comment ? this.props.commentary.comment : this.props.detail,
            visible: true,
        });
        if(this.commentaryInput.current != undefined) {
            this.commentaryInput.current.focus();
        }
    };

    handleOk = async () => {
        const {currentCommentary, currentCommentaryProps} = this.state;
        this.setState({
            loading: true,
        });
        this.props.setComment(currentCommentary, currentCommentaryProps.positions, this.props.tableKey);
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 500);
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            currentCommentary: this.props.detail, 
            currentCommentaryProps: {
                name: this.props.detail,
                positions : [],
            },
        });
    };

    renderHeader = () => {
        return (
            <div>
              <p>
                  {this.props.detail}
              </p>
            </div>
          );
    }

    getCommentary() {
        const { currentCommentaryProps } = this.state;
        var currentCommentary = this.props.detail

        if(currentCommentaryProps.positions.length) {
            currentCommentary += ' -'
            currentCommentary += currentCommentaryProps.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`) + ';';
        }
        this.setState({
            currentCommentary: currentCommentary
        });
    }

    setCommentaryPosition(position) {
        const { currentCommentaryProps } = this.state;
        const positionIndex = currentCommentaryProps.positions.indexOf(position);
        if(positionIndex == -1) {
            currentCommentaryProps.positions.push(position);
        }
        else {
            currentCommentaryProps.positions = currentCommentaryProps.positions.filter((value, index)=>index != positionIndex);
        }
        this.getCommentary();
    }


    componentDidMount() {
        this._isMounted = true;
        const { commentary, detail } = this.props;
        if(this._isMounted) {
            this.setState({
                currentCommentaryProps: {
                    name: detail,
                    positions: commentary.positions || [],
                }
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { TextArea } = Input;
        const { visible, loading, currentCommentaryProps, currentCommentary } = this.state;
        const { disabled, commentary } = this.props;
        const { positions } = this;

        return (
            <div>
                {commentary.comment ? (
                    <Button
                        className={Styles.commentaryButton}
                        onClick={this.showModal}
                        title={this.props.intl.formatMessage({id: "commentary.edit"})}
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
                        title={this.props.intl.formatMessage({id: "commentary.add"})}
                    >
                        <Icon type="message" />
                    </Button>
                )}
                <Modal
                    visible={visible}
                    title={this.renderHeader()}
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
                    maskClosable={false}
                >
                    <>
                    <div className={Styles.commentaryVehicleSchemeWrap}>
                        <p className={Styles.commentarySectionHeader}>
                            <FormattedMessage id='commentary_modal.where'/>?
                        </p>
                        <div className={Styles.blockButtonsWrap}>
                            {positions.map((position, key)=> {
                                return (
                                    <Button
                                        key={key}
                                        type={currentCommentaryProps.positions.findIndex((elem)=>position==elem) > -1 ? 'normal' : 'primary'}
                                        className={Styles.commentaryBlockButton}
                                        onClick={()=>{this.setCommentaryPosition(position)}}
                                    >
                                        <FormattedMessage id={position}/>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <p className={Styles.commentarySectionHeader}>
                            <FormattedMessage id='order_form_table.diagnostic.commentary' />
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
                    </>
                </Modal>
            </div>
        );
    }
}