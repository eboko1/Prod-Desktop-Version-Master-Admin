// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Checkbox, InputNumber, notification, Select, Tabs } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import {permissions, isForbidden} from 'utils';
import {
    API_URL,
    confirmDiagnostic,
    createAgreement,
    lockDiagnostic,
    sendMessage,
} from 'core/forms/orderDiagnosticForm/saga';
// own
import Styles from './styles.m.css';

@injectIntl
class ConfirmDiagnosticModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: props.dataSource,
            diagnosticList: [],
            labors: null,
            allDetails: null,
            servicesList: [],
            detailsList: [],
        }
        this.tmp = {};
        this.servicesOptions = null;
        this.detailsOptions = null;
        this.lastServiceInput = React.createRef();
        this.lastDetailInput = React.createRef();
        this.diagnosticKey = 1;
        this._isMounted = false;
    }

    async endСonfirmation(orderId, data) {
        await confirmDiagnostic(orderId, data);
        await lockDiagnostic(orderId);
        //await window.location.reload();
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
        //this.getCurrentOrderDetailsAndServices();
    };

    handleOk = () => {
        this.setState({ visible: false });
        var data = {
            services: [],
            details: [],
            modificationId: this.props.tecdocId,
            insertMode: true,
        }
        this.state.servicesList.map((element)=>{
            if(element.checked && element.id != null) {
                data.services.push({
                    serviceName: element.name + element.commentary.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`),
                    serviceId: element.id,
                    count: element.hours,
                    servicePrice: element.price,
                    employeeId: this.props.defaultEmployeeId,
                    serviceHours: 0,
                    comment: {
                        comment: element.commentary.comment,
                        positions: element.commentary.positions,
                    },
                })
            }
        });
        this.state.detailsList.map((element)=>{
            if(element.checked && element.id != null) {
                data.details.push({
                    name: element.name + element.commentary.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`),
                    storeGroupId: element.id,
                    count: element.count,
                    comment: {
                        comment: element.commentary.comment,
                        positions: element.commentary.positions,
                    },
                })
            }
        });
        this.endСonfirmation(this.props.orderId, data);
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            dataSource: this.props.dataSource,
            diagnosticList: [],
            servicesList: [],
            detailsList: [],
        });
    };

    getCurrentOrderDetailsAndServices() {
        const { orderServices, orderDetails } = this.props;
        this.state.servicesList = orderServices.map((data, index)=>({
            key: index+1,
            id: data.laborId,
            productId: data.productId,
            name: data.serviceName,
            hours: data.hours,
            checked: true,
            price: data.price,
            commentary: {
                comment: data.commentary.comment,
                positions: data.commentary.positions
            },
        }));
        this.state.detailsList = orderDetails.map((data, index)=>({
            key: index+1,
            id: data.storeGroupId,
            name: data.detailName,
            count: data.count,
            checked: true,
            commentary: {
                comment: data.commentary.comment,
                positions: data.commentary.positions
            }
        }));
    }

    updateState() {
        this.state.dataSource = this.props.dataSource;
        this.state.diagnosticList = [];
        this.diagnosticKey = 1;
    }

    componentDidMount() {
        this._isMounted = true;
        if(this.props.orderId && this._isMounted) {
            this.fetchOptionsSourceData();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillUpdate() {
        this.updateState();
    }

    componentDidUpdate() {
        if(this.state.labors != null && this.servicesOptions == null) {
            this.servicesOptions = this.getServicesOptions();
        }
        if(this.state.allDetails != null && this.detailsOptions == null) {
            this.detailsOptions = this.getDetailsOptions();
        }
    }

    fetchOptionsSourceData() {
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
            that.setState({
                labors: data,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        });

        url = API_URL;
        params = `/store_groups?keepFlat=true`;
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
            that.setState({
                allDetails: data,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getLaborByPartId(id, commentary, status) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/diagnostics/labor_id/${id}`;
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
            that.addServicesByLaborId(data.laborId, -1, commentary, status);
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    addServicesByLaborId(id, index = -1, commentary, status) {
        const service = this.state.labors.labors.find(x => x.laborId == id);
        if(service == undefined) return;

        if(index == -1) {
            this.state.servicesList[this.state.servicesList.length-1] = {
                key: this.state.servicesList.length,
                id: id,
                productId: service.productId,
                name: service.name,
                hours: Number(service.normHours) || 1,
                checked: true,
                commentary: commentary,
                status: status,
            };
        }
        else {
            this.state.servicesList[index].id = id;
            this.state.servicesList[index].status = status;
            this.state.servicesList[index].name = service.name;
            this.state.servicesList[index].productId= service.productId;
            this.state.servicesList[index].hours = Number(service.normHours) || 1;
        }
        this.setState({
            update: true,
        });
    }

    getGroupByPartId(id, commentary, status) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/diagnostics/store_group_id/${id}`;
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
            that.addDetailsByGroupId(data.storeGroupId, -1, commentary, status);
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    addDetailsByGroupId(id, index = -1, commentary, status) {
        const detail = this.state.allDetails.find(x => x.id == id);
        if(detail == undefined) return;

        if(index == -1) {
            this.state.detailsList[this.state.detailsList.length-1] = {
                key: this.state.detailsList.length,
                id: detail.id,
                name: detail.name,
                count: 1,
                checked: true,
                commentary: commentary,
                status: status,
            }
        }
        else {
            this.state.detailsList[index].id = id;
            this.state.detailsList[index].status = status;
            this.state.detailsList[index].count = 1;
            this.state.detailsList[index].name = detail.name;
        }
        this.setState({
            update: true,
        });
    }


    changeResolved(index, type) {
        this.state.diagnosticList[index].resolved = type=='disabled'?true:!this.state.diagnosticList[index].resolved;
        this.state.diagnosticList[index].type = type;
        this.setState({
            update: true,
        })
        if(type=='manually') {
            this.state.servicesList[this.state.servicesList.length-1].commentary = this.state.diagnosticList[index].commentary;
            this.lastServiceInput.focus();
        }
    }

    disableDiagnosticRow(index){
        this.state.diagnosticList[index].checked = !this.state.diagnosticList[index].checked;
        this.state.diagnosticList[index].disabled = !this.state.diagnosticList[index].disabled;
        if(!event.target.checked) {
            {this.changeResolved(index, 'disabled')};
        }
        else {
            {this.changeResolved(index, '')};
        }
    }

    automaticlyConfirmDiagnostic() {
        let partIds = [];
        this.state.diagnosticList.map((data, index)=>{
            if(!data.resolved) {
                this.changeResolved(index, 'automaticly');
                partIds.push(data.id);
            }
        });

        this.getDataByPartIds(partIds);
    }

    async getDataByPartIds(partIds) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/diagnostics/calculation_data?partIds=[${partIds}]`;
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
            that.state.servicesList.pop();
            that.state.detailsList.pop();
            
            data.map((elem)=>{
                const diagnosticPart = that.state.diagnosticList.find((part)=>part.id==elem.partId);
                const commentary = diagnosticPart ? diagnosticPart.commentary : {comment: "", positions: []};
                const status = diagnosticPart ? diagnosticPart.status : undefined;

                elem.labor.map((labor)=>{
                    that.state.servicesList.push({
                        key: that.state.servicesList.length+1,
                        id: labor.laborId,
                        productId: labor.productId,
                        name: labor.name,
                        hours: Number(labor.normHours) || 1,
                        checked: true,
                        commentary: commentary,
                        status: status,
                    })
                })
                
                that.state.detailsList.push({
                    key: that.state.detailsList.length+1,
                    id: elem.storeGroup.id,
                    name: elem.storeGroup.name,
                    count: 1,
                    checked: true,
                    commentary: commentary,
                    status: status,
                })
            })
            that.setState({
                update: true,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getDiagnostics(stage) {
        const { dataSource } = this.props;
        var diagnosticList = this.state.diagnosticList;
        let tmpSource = [];
        for(let i = 0; i < dataSource.length; i++) {
            if(dataSource[i].stage == stage && Number(dataSource[i].status) > 1 && !dataSource[i].disabled) {
                tmpSource.push(dataSource[i]);
                if(this.state.diagnosticList.findIndex(x => x.id == dataSource[i].partId) == -1){
                    diagnosticList.push({
                        key: this.diagnosticKey,
                        id: dataSource[i].partId,
                        commentary: dataSource[i].commentary || {comment: "", positions: []},
                        resolved: false,
                        type:'',
                        disabled: false,
                        checked: true,
                        status: Number(dataSource[i].status),
                    });
                    this.diagnosticKey++;
                }
            }
        }
        this.state.diagnosticList = diagnosticList;

        return tmpSource.map((data)=>{
        let index = this.state.diagnosticList.findIndex(x => x.id == data.partId),
            key = this.state.diagnosticList[index].key,
            bgColor = this.state.diagnosticList[index].disabled?"#d9d9d9":"",
            txtColor = this.state.diagnosticList[index].disabled?"gray":"";

        if(!this.state.diagnosticList[index].resolved) {
            if(data.status == 1) {
                bgColor = "rgb(200,225,180)";
            }
            else if(data.status == 2) {
                bgColor = "rgb(255,240,180)";
            }
            else if(data.status == 3) {
                bgColor = "rgb(250,175,175)";
            }
        } else if(!this.state.diagnosticList[index].disabled){
            bgColor = "rgb(200,225,180)";
        }

        return (
        <div className={Styles.confirm_diagnostic_modal_row} style={{backgroundColor: bgColor, color: txtColor}}>
            <div style={{ width: '10%' }}>
                {key} <Checkbox
                        onChange={()=>this.disableDiagnosticRow(index)}
                        checked={this.state.diagnosticList[index].checked}
                    />
            </div>
            <div style={{ width: '50%', padding: '0 5px' }}>
                {data.detail}
            </div>
            {!this.state.diagnosticList[index].resolved ?
            <div className={Styles.confirm_diagnostic_modal_row_button} style={{ width: '40%'}}>
                <Button
                    type="primary"
                    onClick={async ()=>{
                        await this.changeResolved(index, 'automaticly');
                        await this.getLaborByPartId(data.partId, data.commentary, data.status);
                        await this.getGroupByPartId(data.partId, data.commentary, data.status);
                    }}
                    style={{width: '49%', padding: '5px'}}
                >
                    <FormattedMessage id='order_form_table.diagnostic.automaticly' />
                </Button>
                <Button
                    type="primary"
                    onClick={()=>{this.changeResolved(index, 'manually')}}
                    style={{width: '49%', padding: '5px'}}
                >
                    <FormattedMessage id='order_form_table.diagnostic.manually' />
                </Button>
            </div>
            :
            <div className={Styles.confirm_diagnostic_modal_row_button} style={{ width: '40%'}}>
                <Button
                    disabled={this.state.diagnosticList[index].disabled}
                    onClick={()=>{this.changeResolved(index, '')}}
                    style={{width: '98%'}}
                >
                    <FormattedMessage id={`order_form_table.diagnostic.${this.state.diagnosticList[index].type}`} />
                </Button>
            </div>}
        </div>
        )})
    }

    getDiagnosticContent() {
        const { dataSource } = this.props;
        let stageList = [];
        for(let i = 0; i < dataSource.length; i++) {
            if(dataSource[i].stage != "" && stageList.indexOf(dataSource[i].stage) == -1 && Number(dataSource[i].status) > 1) {
                stageList.push(dataSource[i].stage);
            }
        }

        return stageList.map((stage)=>
            <div>
                <div className={Styles.confirm_diagnostic_modal_row_title}>{stage}</div>
                {this.getDiagnostics(stage)}
            </div>
        );
    }

    servicesCheckboxClick(index) {
        this.state.servicesList[index].checked = !this.state.servicesList[index].checked;
        this.setState({
            update: true,
        })
    }

    addNewServicesRow() {
        if(this.state.servicesList.length == 0) {
            this.state.servicesList.push({
                key:1,
                id:null,
                name: null,
                hours: 1,
                commentary: {commentary: "", positions: []},
                checked: true,
            });
            this.setState({
                update: true,
            })
        }
        else if(this.state.servicesList[this.state.servicesList.length-1].name != null) {
            this.state.servicesList.push({
                key:this.state.servicesList[this.state.servicesList.length-1].key+1,
                id: null,
                name: null,
                hours: 1,
                commentary: {commentary: "", positions: []},
                checked: true
            });
            this.setState({
                update: true,
            })
        }
    }

    getServicesOptions() {
        const { Option } = Select;
        return this.state.labors.labors.map(
            (data, index) => (
                <Option
                    value={ String(data.laborId) }
                    key={index}
                    labor_id={data.laborId}
                    master_labor_id={data.masterLaborId}
                    product_id={data.productId}
                    default_hours={data.normHours}
                    price={data.price}
                >
                    { data.name }
                </Option>
            ),
        );
    }

    deleteServiceRow(index) {
        var array = [...this.state.servicesList];
        if(array.length == 1) return 0;
        array.splice(index, 1);
        for(let i = 0; i < array.length; i++) {
            array[i].key = i+1;
        }
        this.setState({servicesList: array});
    }

    getServicesContent() {
        this.addNewServicesRow();
        return this.state.servicesList.map((data, index)=>
            <div className={Styles.confirm_diagnostic_modal_row} style={data.status == 3 ? {backgroundColor: 'rgb(250,175,175)'} : null}>
                <div style={{ width: '10%' }}>
                    {data.key} <Checkbox
                        checked={data.checked}
                        onClick={()=>this.servicesCheckboxClick(index)}
                    />
                </div>
                <div style={{ width: '60%', padding: '0 5px'}}>
                    <Select
                        showSearch
                        value={data?data.name:undefined}
                        className="service_input"
                        dropdownStyle={{minWidth: 380}}
                        ref={(node)=>{this.lastServiceInput=node}}
                        disabled={!data.checked}
                        style={{ width: "100%"}}
                        onSelect={(value, option)=>{
                            this.addServicesByLaborId(value, index);
                        }}
                        onChange={(inputValue)=>{
                            this.state.servicesList[index].name = inputValue;
                            this.setState({update: true});
                        }}
                        placeholder={this.props.intl.formatMessage({id: 'order_form_table.service.placeholder'})}
                        getPopupContainer={()=>document.getElementById(`${Styles.diagnosticModalServices}`)}
                        filterOption={(inputValue, option) =>
                            option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                    >
                        {this.servicesOptions}
                    </Select>
                </div>
                <div style={{ width: '30%' }}>
                    <InputNumber
                        disabled={!data.checked}
                        style={{ width: '60%' }}
                        step={0.1}
                        min={0.1}
                        value={data.hours?data.hours:1}
                        onChange={(value)=>{
                            this.state.servicesList[index].hours = value;
                            this.setState({update: true});
                        }}
                    />
                    <div style={{width: "20%", paddingLeft: '5px', display: 'inline-block'}}>
                        <CommentaryModal
                                commentary={data.commentary || 
                                    {
                                        comment: undefined,
                                        positions: [],
                                    }
                                }
                        />
                    </div>
                    <div className={Styles.delete_diagnostic_button_wrap} style={{width: "20%", display: 'inline-block'}}>
                        <Icon
                            onClick={()=>this.deleteServiceRow(index)}
                            type="delete"
                            className={Styles.delete_diagnostic_button}
                        />
                    </div>
                </div>
            </div>
        )
    }

    detailsCheckboxClick(index) {
        this.state.detailsList[index].checked = !this.state.detailsList[index].checked;
        this.setState({
            update: true,
        })
    }

    addNewDetailsRow() {
        if(this.state.detailsList.length == 0) {
            this.state.detailsList.push(
                {key:1, id:null, name: null, count: 1, checked: true},
            );
            this.setState({
                update: true,
            })
        }
        else if(this.state.detailsList[this.state.detailsList.length-1].name != null) {
            this.state.detailsList.push(
                {key:this.state.detailsList[this.state.detailsList.length-1].key+1, id:null, name: null, count: 1, checked: true},
            );
            this.setState({
                update: true,
            })
        }
    }

    getDetailsOptions() {
        const { Option } = Select;
        const { allDetails } = this.state;
        return allDetails.map(
            (data, index) => (
                <Option
                    value={ String(data.id) }
                    key={index}
                    detail_id={data.id}
                    detail_name={data.name}
                >
                    { data.name }
                </Option>
            ),
        );
    }

    deleteDetailRow(index) {
        var array = [...this.state.detailsList];
        if(array.length == 1) return 0;
        array.splice(index, 1);
        for(let i = 0; i < array.length; i++) {
            array[i].key = i+1;
        }
        this.setState({detailsList: array});
    }

    getDetailsContent() {
        this.addNewDetailsRow();
        return this.state.detailsList.map((data, index)=>
            <div className={Styles.confirm_diagnostic_modal_row} style={data.status == 3 ? {backgroundColor: 'rgb(250,175,175)'} : null}>
                <div style={{ width: '10%' }}>
                    {data.key} <Checkbox
                        checked={data.checked}
                        onClick={()=>this.detailsCheckboxClick(index)}
                    />
                </div>
                <div style={{ width: '60%', padding: '0 5px'}}>
                    <Select
                        showSearch
                        value={data?data.name:undefined}
                        className="service_input"
                        dropdownStyle={{minWidth: 380}}
                        ref={(node)=>{this.lastDetailInput=node}}
                        disabled={!data.checked}
                        style={{ width: "100%"}}
                        onSelect={(value, option)=>{
                            this.addDetailsByGroupId(value, index);
                        }}
                        onChange={(inputValue)=>{
                            this.state.detailsList[index].name = inputValue;
                            this.setState({update: true});
                        }}
                        placeholder={this.props.intl.formatMessage({id: 'order_form_table.service.placeholder'})}
                        getPopupContainer={()=>document.getElementById(`${Styles.diagnosticModalDetails}`)}
                        filterOption={(inputValue, option) =>
                            option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                    >
                        {this.detailsOptions}
                    </Select>
                </div>
                <div style={{ width: '30%'}}>
                    <InputNumber
                        disabled={!data.checked}
                        style={{ width: '60%' }}
                        min={1}
                        max={50}
                        value={data.count?data.count:1}
                        onChange={(value)=>{
                            this.state.detailsList[index].count = value;
                            this.setState({update: true});
                        }}
                    />
                    <div style={{width: "20%", paddingLeft: '5px', display: 'inline-block'}}>
                        <CommentaryModal
                                commentary={data.commentary || 
                                    {
                                        comment: undefined,
                                        positions: [],
                                    }
                                }
                        />
                    </div>
                    <div className={Styles.delete_diagnostic_button_wrap} style={{width: '20%', display: 'inline-block'}}>
                        <Icon
                            onClick={()=>this.deleteDetailRow(index)}
                            type="delete"
                            className={Styles.delete_diagnostic_button}
                        />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { visible } = this.state;
        const { isMobile } = this.props;
        const { TabPane } = Tabs;
        return (
            <div>
                <>
                    {isMobile ? 
                    <Button
                        style={{ width: "80%" }}
                        type="primary"
                        onClick={()=>{
                            notification.success({
                                message: 'Сообщение отправлено!',
                            });
                            sendMessage(this.props.orderId);
                        }}
                        disabled={isForbidden(this.props.user, permissions.ACCESS_TELEGRAM)}
                    >
                        <FormattedMessage id='end'/>
                    </Button>
                    :
                    <>
                        <Button
                            style={{ width: "35%", marginRight: 5 }}
                            type="primary"
                            onClick={this.showModal}
                            disabled={isForbidden(this.props.user, permissions.ACCESS_ORDER_CREATIONG_OF_DIAGNOSTICS_MODAL_WINDOW)}
                        >
                            <FormattedMessage id='order_form_table.diagnostic.create_order'/>
                        </Button>
                        <Button
                            style={{ width: "35%" }}
                            type="primary"
                            onClick={()=>{
                                notification.success({
                                    message: 'Сообщение отправлено!',
                                });
                                sendMessage(this.props.orderId);
                            }}
                            disabled={isForbidden(this.props.user, permissions.ACCESS_TELEGRAM)}
                        >
                            <FormattedMessage id='end'/>
                        </Button>
                    </>
                    }
                </>
                <Modal
                    width={!isMobile?"85%":"95%"}
                    visible={visible}
                    title={<FormattedMessage id='order_form_table.diagnostic.create_order' />}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            {<FormattedMessage id='cancel' />}
                        </Button>,
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            {<FormattedMessage id='order_form_table.diagnostic.confirm' />}
                        </Button>,
                    ]}
                >
                    {!isMobile ? (
                    <div className={Styles.confirm_diagnostic_modal_wrap}>
                        <div className={Styles.confirm_diagnostic_modal_element}>
                            <div className={Styles.confirm_diagnostic_modal_element_title} style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <FormattedMessage id='order_form_table.diagnostic.results' />
                                <Button
                                    type="primary"
                                    onClick={()=>{this.automaticlyConfirmDiagnostic()}}
                                >
                                    <FormattedMessage id='order_form_table.diagnostic.automaticly' />
                                </Button>
                            </div>
                            <div className={Styles.confirm_diagnostic_modal_element_content}>
                                {this.getDiagnosticContent()}
                            </div>
                        </div>
                        <div id={Styles.diagnosticModalServices} className={Styles.confirm_diagnostic_modal_element}>
                            <div className={Styles.confirm_diagnostic_modal_element_title}>
                                <FormattedMessage id='add_order_form.services' />
                            </div>
                            <div className={Styles.confirm_diagnostic_modal_element_content}>
                                {this.getServicesContent()}
                            </div>
                        </div>
                        <div id={Styles.diagnosticModalDetails} className={Styles.confirm_diagnostic_modal_element}>
                            <div className={Styles.confirm_diagnostic_modal_element_title}>
                                <FormattedMessage id='add_order_form.details' />
                            </div>
                            <div className={Styles.confirm_diagnostic_modal_element_content}>
                                {this.getDetailsContent()}
                            </div>
                        </div>
                    </div> 
                    ):(
                        <div className={Styles.confirm_diagnostic_modal_wrap}>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={<Icon type="reconciliation" className={Styles.modal_tab_icon} />} key="1">
                                    <div className={Styles.confirm_diagnostic_modal_element_mobile}>
                                        <div className={Styles.confirm_diagnostic_modal_element_title}>
                                            <FormattedMessage id='order_form_table.diagnostic.results' />
                                        </div>
                                        <div className={Styles.confirm_diagnostic_modal_element_content}>
                                            {this.getDiagnosticContent()}
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tab={<Icon type="tool" className={Styles.modal_tab_icon} />} key="2">
                                    <div id={Styles.diagnosticModalServices} className={Styles.confirm_diagnostic_modal_element_mobile}>
                                        <div className={Styles.confirm_diagnostic_modal_element_title}>
                                            <FormattedMessage id='add_order_form.services' />
                                        </div>
                                        <div className={Styles.confirm_diagnostic_modal_element_content}>
                                            {this.getServicesContent()}
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tab={<Icon type="setting" className={Styles.modal_tab_icon} />} key="3">
                                    <div id={Styles.diagnosticModalDetails} className={Styles.confirm_diagnostic_modal_element_mobile}>
                                        <div className={Styles.confirm_diagnostic_modal_element_title}>
                                            <FormattedMessage id='add_order_form.details' />
                                        </div>
                                        <div className={Styles.confirm_diagnostic_modal_element_content}>
                                            {this.getDetailsContent()}
                                        </div>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    )}
                </Modal>
            </div>
        );
    }
}
export default ConfirmDiagnosticModal;

class CommentaryModal extends React.Component {
    state = { visible: false };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };


    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };


    render() {
        return (
        <div>
            <Icon type="message" onClick={this.showModal}/>
            <Modal
                title={<FormattedMessage id='order_form_table.diagnostic.commentary' />}
                footer={null}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
            <p>{this.props.commentary.comment ? this.props.commentary.comment : <FormattedMessage id='no_data' />}</p>
            </Modal>
        </div>
        );
    }
}