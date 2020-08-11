// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, message, notification, Table, TreeSelect, Checkbox, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { API_URL } from 'core/forms/orderDiagnosticForm/saga';
import { images } from 'utils';
import { permissions, isForbidden } from "utils";
import { DetailStorageModal, DetailSupplierModal, LaborsNormHourModal } from 'modals'
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
            laborSearchValue: "",
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
                            disabled={this.state.editing || elem.masterLaborId}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.store_group'})}
                            style={{maxWidth: 180, minWidth: 100}}
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
                            disabled={this.state.editing || elem.storeGroupId}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.service_type'})}
                            style={{maxWidth: 180, minWidth: 100}}
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
                    const currentServiceOption = this.servicesOptions.find((labor)=>labor.laborId==data);
                    return (
                        <Select
                            disabled={this.state.editing}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.labor'})}
                            value={data}
                            style={{minWidth: 100}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 380 }}
                            filterOption={(input, option) => {
                                //if(!option.props.children) return false;
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                let price = option.props.price ? option.props.price : Number(this.props.normHourPrice);
                                let count = option.props.norm_hours ? option.props.norm_hours : 1;
                                this.state.mainTableSource[0].laborId = value;
                                this.state.mainTableSource[0].serviceName = option.props.children;
                                //this.state.mainTableSource[0].masterLaborId = option.props.master_id;
                                this.state.mainTableSource[0].tmpStoreGroupId = option.props.product_id;
                                this.state.mainTableSource[0].count = count;
                                this.state.mainTableSource[0].price = price;
                                this.state.mainTableSource[0].sum = price * count;
                                this.setState({
                                    update: true
                                })
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
                                this.state.laborSearchValue.length > 2 || elem.storeGroupId || elem.masterLaborId ? 
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
                                    elem.laborId ? 
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
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <Input
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            style={{minWidth: 120}}
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
                            style={{maxWidth: 180, minWidth: 80}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 220}}
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
                                    problems: [],
                                }
                            }
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
                            className={Styles.serviceNumberInput}
                            value={Math.round(data*10)/10 || 0}
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
                            className={Styles.serviceNumberInput}
                            value={data || 1}
                            min={0.1}
                            step={0.1}
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
                        <LaborsNormHourModal
                            user={this.props.user}
                            tecdocId={this.props.tecdocId}
                            storeGroupId={elem.tmpStoreGroupId}
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
                    const sum = elem.price *  elem.count;
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
        if(this.state.mainTableSource[0].laborId == undefined) {
            notification.warning({
                message: 'Заполните все необходимые поля',
              });
            return;
        }
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
                    purchasePrice: Math.round(element.purchasePrice*10)/10 || 0,
                    count: element.count ? element.count : 1,
                    servicePrice:  Math.round(element.price*10)/10 || 1,
                    comment: element.comment || {
                        comment: undefined,
                        positions: [],
                    },
                })
            });
            this.addDetailsAndLabors(data);
        }
        this.props.hideModal();
    };
    
    handleCancel = () => {
        this.props.hideModal();
    };

    setComment(comment, positions, problems) {
        this.state.mainTableSource[0].comment = {
            comment: comment,
            positions: positions,
            problems: problems,
        };
        this.state.mainTableSource[0].serviceName = comment || this.state.mainTableSource[0].serviceName;
        this.setState({
            update: true
        })
    }

    setHours(hours) {
        this.state.mainTableSource[0].hours = hours;
        this.state.mainTableSource[0].count = hours * this.props.laborTimeMultiplier;
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
        this.masterLabors = this.props.masterLabors;
        this.labors = this.props.labors;
        this.storeGroups = this.props.details;
        this.buildLaborsTree();
        this.buildStoreGroupsTree();
        this.getOptions();
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
                selectable: false,
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
                    selectable: false,
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
                selectable: false,
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
                    selectable: false,
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
        this.servicesOptions = [...this.labors];
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

        this.servicesOptions = [...servicesOptions];
    }

    componentWillMount() {
        this.fetchData();
    }

    componentDidUpdate(prevState) {
        if(prevState.visible == false && this.props.visible) {
            const editing = Boolean(this.props.labor.laborId);
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
                    <div style={{marginTop: 15}}>
                        <FormattedMessage id="add_order_form.related"/>: <FormattedMessage id="add_order_form.details"/>
                        <Checkbox
                            style={{marginLeft: 5}}
                            disabled
                            checked={this.state.relatedDetailsCheckbox}
                            onChange={()=>{
                                this.setState({
                                    relatedDetailsCheckbox: !this.state.relatedDetailsCheckbox
                                })
                            }}
                        /> 
                    </div>
                </Modal>
            </>
        )
    }
}
export default AddServiceModal;

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
                problems: [],
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
        this.props.setComment(currentCommentary, currentCommentaryProps.positions, currentCommentaryProps.problems);
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
                positions: [],
                problems: [],
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
                    problems: commentary.problems || [],
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