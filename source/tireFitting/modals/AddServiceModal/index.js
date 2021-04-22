// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Select, Input, InputNumber, message, notification, Table, TreeSelect, Checkbox, Spin } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import { images } from 'utils';
import { permissions, isForbidden, fetchAPI } from "utils";
import { DetailStorageModal, DetailSupplierModal, LaborsNormHourModal, DetailProductModal } from 'modals'
// own
import Styles from './styles.m.css';
const { TreeNode } = TreeSelect;
const Option = Select.Option;
const { confirm } = Modal;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@injectIntl
class AddServiceModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            mainTableSource: [],
        }
        this.labors = [];
        this.priceGroups = [];
        this.servicesOptions = [];
        this.employeeOptions = [];
        this.priceGroupsOptions = [];

        this.mainTableColumns = [
            {
                title:  <><FormattedMessage id="services_table.labor" /> <span style={{color: 'red'}}>*</span></>,
                key:       'laborId',
                dataIndex: 'laborId',
                render: (data, elem)=>{
                    return (
                        <Select
                            allowClear
                            disabled={this.state.editing}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.labor'})}
                            value={data}
                            style={{minWidth: 240, color: 'var(--text)'}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", maxWidth: '95%' }}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0 ||
                                    String(option.props.cross_id).toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                                if(value) {
                                    this.getPrice(value);
                                }
                                this.setState({});
                            }}
                        >
                            {
                                this.servicesOptions.map((elem, index)=>(
                                    <Option
                                        key={index}
                                        value={elem.id}
                                        master_id={elem.masterLaborId}
                                        product_id={elem.storeGroupId}
                                        norm_hours={elem.laborPrice.normHours}
                                        price={elem.laborPrice.price}
                                        cross_id={elem.crossId}
                                    >
                                        {elem.name ? elem.name : elem.defaultName}
                                    </Option>
                                ))
                            }
                        </Select>
                    )
                }
            },
            {
                title:  <FormattedMessage id="tire.priceGroup" />,
                key:       'tireStationPriceGroupId',
                dataIndex: 'tireStationPriceGroupId',
                render: (data, elem)=>{
                    return (
                        <Select
                            disabled={!elem.laborId}
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'tire.priceGroup'})}
                            value={data ? data : undefined}
                            style={{minWidth: 200}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999"}}
                            filterOption={(input, option) => {
                                return (
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 || 
                                    String(option.props.value).indexOf(input.toLowerCase()) >= 0
                                )
                            }}
                            onChange={(value, option)=>{
                                elem.tireStationPriceGroupId = value;
                                elem.price = option.props.price || elem.price;
                                this.setState({});
                            }}
                        >
                            {this.priceGroupsOptions}
                        </Select>
                    )
                }
            },
            {
                title:  <FormattedMessage id="services_table.employee" />,
                key:       'employee',
                dataIndex: 'employeeId',
                render: (data, elem)=>{
                    return (
                        <Select
                            allowClear
                            showSearch
                            placeholder={this.props.intl.formatMessage({id: 'services_table.employee'})}
                            value={data ? data : undefined}
                            style={{minWidth: 180}}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto', zIndex: "9999", maxWidth: '95%'}}
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
                key:       'comment',
                dataIndex: 'comment',
                width:     'auto',
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

    getPrice = async (laborId) => {
        const { clientVehicleTypeId, clientVehicleRadius } = this.props;
        
        if(clientVehicleTypeId && clientVehicleRadius) {
            this.priceGroups = await fetchAPI('GET', `labors/price_groups`, {
                laborId: laborId,
                vehicleTypeId: clientVehicleTypeId,
                radius: Math.round(clientVehicleRadius),
            })
            console.log(this.priceGroups);
            this.priceGroupsOptions = this.priceGroups.map((elem, i)=>(
                <Option key={i} value={elem.id} price={elem.price}>
                    {elem.name}
                </Option>
            ))
            if(this.priceGroups && this.priceGroups.length) {
                this.state.mainTableSource[0].price = this.priceGroups[0].price;
                this.state.mainTableSource[0].tireStationPriceGroupId = this.priceGroups[0].id;
                this.setState({});
            }
        }
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
                    tireStationPriceGroupId: element.tireStationPriceGroupId,
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
            this.props.updateDataSource();
        } catch (error) {
            console.error('ERROR:', error);
        }
    }

    fetchData = () => {
        this.labors = this.props.labors;
        this.getOptions();
    }

    getOptions = async () => {
        this.servicesOptions = [...this.labors];
        this.employeeOptions = this.props.employees.map((elem, i)=>(
            <Option key={i} value={elem.id}>
                {elem.name} {elem.surname}
            </Option>
        ));
    };

    deleteService = async () => {
        let token = localStorage.getItem(
            '_my.carbook.pro_token',
        );
        let url = __API_URL__;
        let params = `/orders/${this.props.orderId}/labors?ids=[${this.props.labor.id}]`;
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
                this.handleCancel();
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
                that.deleteService();
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
                <div 
                    className={
                        `${Styles.mobileTable} ${
                            (key == 'price' || key == 'count') && Styles.mobileTableNumber
                        } ${
                            (key == 'employee') && Styles.mobileTableEmployee
                        } ${
                            (key == 'comment') && Styles.mobileTableComment
                        } ${
                            (key == 'sum') && Styles.mobileTableSum
                        } `
                    } 
                    key={key}
                >
                    {key != 'comment' && title}
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
            const editing = Boolean(this.props.labor && this.props.labor.id);
            if(editing) {
                this.getPrice(this.props.labor.laborId);
            }
            this.getOptions();
            this.state.mainTableSource = [{...this.props.labor}];
            
            if(!editing) {
                this.state.mainTableSource[0].employeeId = this.props.defaultEmployeeId;
                const priceGroup = this.priceGroups.find(({id})=>id == this.props.clientVehicleTypeId);
                if(priceGroup) this.state.mainTableSource[0].tireStationPriceGroupId = priceGroup.id;
            }
            
            this.setState({
                editing: editing,
            })
        }
    }

    render() {
        const { visible, isMobile } = this.props;
        const { mainTableSource, editing } = this.state;
        return (
            <>
                <Modal
                    zIndex={200}
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