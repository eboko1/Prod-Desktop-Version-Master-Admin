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
            relatedServices: [],
            relatedServicesCheckbox: false,
            laborSearchValue: "",
        }
        this.labors = [];
        this.masterLabors = [];
        this.storeGroups = [];
        this.laborsTreeData = [];
        this.brandOptions = [];
        this.servicesOptions = [];
        this.employeeOptions = [];
        this.relatedDetailsOptions = [];

        this.mainTableColumns = [
            {
                key:       'checked',
                dataIndex: 'checked',
                width: 'min-content',
                render: (data, elem)=>{
                    return elem.related ? (
                        <Checkbox
                            checked={data}
                            onChange={({target})=>{
                                elem.checked = target.checked;
                                this.setState({});
                            }}
                        />
                    ) : null
                }
            },
            {
                title:  <FormattedMessage id="services_table.store_group" />,
                key:       'storeGroupId',
                dataIndex: 'storeGroupId',
                width:     '10%',
                render: (data, elem)=>{
                    return (
                        <TreeSelect
                            className={Styles.groupsTreeSelect}
                            disabled={this.state.editing || Boolean(elem.masterLaborId)}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.store_group'})}
                            style={{maxWidth: 180, minWidth: 100, color: 'var(--text)'}}
                            value={data}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999" }}
                            treeData={this.props.detailsTreeData}
                            filterTreeNode={(input, node) => {
                                return (
                                    node.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(node.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onSelect={(value, option)=>{
                                elem.storeGroupId = value;
                                elem.laborId = undefined;
                                elem.serviceName = undefined;
                                this.filterOptions(elem.masterLaborId, value);
                                this.setState({});
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
                            disabled={this.state.editing || Boolean(elem.storeGroupId)}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.service_type'})}
                            style={{maxWidth: 180, minWidth: 100, color: 'var(--text)'}}
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
                                elem.masterLaborId = value;
                                this.filterOptions(value, elem.storeGroupId);
                                this.setState({});
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
                            allowClear
                            disabled={this.state.editing || elem.related}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.labor'})}
                            value={!elem.related ? data : elem.name}
                            style={{minWidth: 100, color: 'var(--text)'}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", minWidth: 380 }}
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
                                    if(!elem.related) this.getRelatedLabors(value);
                                } else {
                                    elem.laborId = value;
                                    elem.serviceName = value;
                                    elem.masterLaborId = value;
                                    elem.storeGroupId = value;
                                    this.state.relatedLabors = [];
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
                width:     '15%',
                render: (data, elem)=>{
                    return (
                        <Input
                            placeholder={this.props.intl.formatMessage({id: 'order_form_table.detail_name'})}
                            disabled={this.state.editing && elem.stage != 'INACTIVE'}
                            style={{minWidth: 160}}
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
                            setComment={(comment, positions, problems)=>{
                                elem.comment = {
                                    comment: comment,
                                    positions: positions,
                                    problems: problems,
                                };
                                elem.serviceName = comment || elem.serviceName;
                                this.setState({});
                            }}
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
                                elem.purchasePrice = value;
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
                width:     '3%',
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
                title:  <FormattedMessage id="services_table.norm_hours" />,
                key:       'hours',
                dataIndex: 'hours',
                width:     '3%',
                render: (data, elem)=>{
                    return (
                        <LaborsNormHourModal
                            user={this.props.user}
                            tecdocId={this.props.tecdocId}
                            storeGroupId={elem.storeGroupId}
                            onSelect={(hours)=>{
                                elem.hours = hours;
                                elem.count = hours * this.props.laborTimeMultiplier;
                                this.setState({});
                            }}
                            hours={data}
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
                                elem.comment = undefined;
                                elem.purchasePrice = 0;
                                elem.price = 1;
                                elem.count = 1;
                                elem.hours = 0;
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
            if(relatedServicesCheckbox) {
                relatedServices.map((element)=>{
                    if(element.checked) {
                        data.services.push({
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
                    }
                });
            }
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

    async getRelatedLabors(id) {
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = __API_URL__ + `/labors/related?id=${id}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if(result.labors && result.labors.length) {
                this.setState({
                    relatedServices: result.labors[0].relatedLabors.map((labor, key)=>{
                        return ({
                            ...labor,
                            key: key,
                            related: true,
                            serviceName: labor.name,
                            storeGroupId: labor.productId,
                            defaultName: labor.name,
                            count: labor.normHours || 1,
                            employeeId: this.props.defaultEmployeeId,
                            comment: {
                                comment: undefined,
                                positions: [],
                                problems: [],
                            },
                            checked: true,
                        })
                    })
                })
            }
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

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

    componentDidMount() {
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
        const { relatedServicesCheckbox, mainTableSource, relatedServices, editing } = this.state;
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
                            <div style={{display: 'block'}}><FormattedMessage id='services_table.labor'/></div>
                        </div>
                        <Table
                            dataSource={mainTableSource}
                            columns={this.mainTableColumns}
                            pagination={false}
                        />
                    </div>
                    <div style={{marginTop: 15}}>
                        <FormattedMessage id="add_order_form.related"/>: <FormattedMessage id="add_order_form.services"/>
                        <Checkbox
                            style={{marginLeft: 5}}
                            disabled={editing}
                            checked={relatedServicesCheckbox}
                            onChange={()=>{
                                this.setState({
                                    relatedServicesCheckbox: !relatedServicesCheckbox
                                })
                            }}
                        />
                        {relatedServicesCheckbox && 
                            <div className={Styles.tableWrap} style={{overflowX: 'scroll'}}>
                                <Table
                                    dataSource={relatedServices}
                                    columns={this.mainTableColumns}
                                    pagination={false}
                                />
                            </div>
                        }
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