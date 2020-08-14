// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Checkbox, InputNumber, notification, Select, Tabs, Input } from 'antd';
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
const { TabPane } = Tabs;

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
            autoConfirmed: false,
        }
        this.tmp = {};
        this.servicesOptions = null;
        this.detailsOptions = null;
        this.lastServiceInput = React.createRef();
        this.lastDetailInput = React.createRef();
        this.diagnosticKey = 1;
        this._isMounted = false;

        this.setServicesComment = this.setServicesComment.bind(this);
        this.setDetailsComment = this.setDetailsComment.bind(this);
    }

    async endСonfirmation(orderId, data) {
        await confirmDiagnostic(orderId, data);
        await lockDiagnostic(orderId);
        await window.location.reload();
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
                    serviceName:
                        element.commentary.positions.length ?
                        element.name + ' - ' + element.commentary.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`) :
                        element.name,
                    serviceId: element.id,
                    count: element.hours,
                    servicePrice: element.price,
                    employeeId: this.props.defaultEmployeeId,
                    serviceHours: 0,
                    comment: {
                        comment: element.commentary.comment,
                        positions: element.commentary.positions,
                        problems: element.commentary.problems,
                    },
                    isCritical: element.status == 3,
                })
            }
        });
        this.state.detailsList.map((element)=>{
            if(element.checked && element.id != null) {
                data.details.push({
                    name: element.commentary.positions.length ?
                        element.name + ' - ' + element.commentary.positions.map((data)=>` ${this.props.intl.formatMessage({id: data}).toLowerCase()}`) :
                        element.name,
                    storeGroupId: element.id,
                    count: element.count,
                    comment: {
                        comment: element.commentary.comment,
                        positions: element.commentary.positions,
                    },
                    isCritical: element.status == 3,
                })
            }
        });
        console.log(data);
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

    componentDidUpdate(prevProps, prevState) {
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
        let url = __API_URL__ + `/store_groups?keepFlat=true`;
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
                labors: that.props.labors,
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
        const service = this.props.labors.find(x => x.laborId == id);
        if(service == undefined) return;

        if(index == -1) {
            this.state.servicesList[this.state.servicesList.length-1] = Object.assign({},{
                key: this.state.servicesList.length,
                id: id,
                productId: service.productId,
                name: service.name,
                hours: Number(service.normHours) || 1,
                checked: true,
                commentary: commentary,
                status: status,
                automaticly: true,
            });
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
        this.state.diagnosticList[index].resolved = type=='disabled' ? true : !this.state.diagnosticList[index].resolved;
        this.state.diagnosticList[index].type = type;
        this.setState({
            update: true,
        })
        if(type=='manually') {
            this.state.servicesList[this.state.servicesList.length-1].commentary = Object.assign({}, this.state.diagnosticList[index].commentary);
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
                partIds.push({
                    id: data.id,
                    isCritical: data.status == 3,
                    comment: data.commentary,
                });
            }
        });
        this.getDataByPartIds(partIds);
    }

    async getDataByPartIds(partIds) {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/diagnostics/calculation_data`;
        url += params;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            },
            body: JSON.stringify({partIds: partIds})
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

            const serviceArray = [];
            const detailArrat = [];
            
            data.map((elem, index)=>{
                elem.labor.map((labor)=>{
                    let laborObjCopy = Object.assign({}, {
                        key: that.state.servicesList.length+index+1,
                        id: labor.laborId,
                        productId: labor.productId,
                        name: labor.name,
                        hours: Number(labor.normHours) || 1,
                        checked: true,
                        commentary: elem.comment,
                        status: elem.isCritical ? 3 : 2,
                        automaticly: true,
                    });
                    serviceArray.push(laborObjCopy);
                })

                let detailObjCopy = Object.assign({}, {
                    key: that.state.detailsList.length+index+1,
                    id: elem.storeGroup.id,
                    name: elem.storeGroup.name,
                    count: 1,
                    checked: true,
                    commentary: elem.comment,
                    status: elem.isCritical ? 3 : 2,
                });
                
                detailArrat.push(detailObjCopy);
            })
            that.setState({
                autoConfirmed: true,
                servicesList: serviceArray,
                detailsList: detailArrat,
            })
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getDiagnostics(stage) {
        const { dataSource } = this.props;
        var diagnosticList = this.state.diagnosticList.slice(0);
        let tmpSource = [];
        for(let i = 0; i < dataSource.length; i++) {
            if(dataSource[i].stage == stage && Number(dataSource[i].status) > 1 && !dataSource[i].disabled) {
                tmpSource.push(dataSource[i]);
                const commentary = Object.assign({}, dataSource[i].commentary);
                if(this.state.diagnosticList.findIndex(x => x.id == dataSource[i].partId) == -1){
                    let diagnosticObjCopy =  Object.assign({}, {
                        key: this.diagnosticKey,
                        id: dataSource[i].partId,
                        commentary: commentary || {comment: "", positions: [], problems: []},
                        resolved: false,
                        type:'',
                        disabled: false,
                        checked: true,
                        status: Number(dataSource[i].status),
                        templateIndex: dataSource[i].templateIndex,
                    });

                    diagnosticList.push(diagnosticObjCopy);
                    this.diagnosticKey++;
                }
            }
        }
        this.state.diagnosticList = diagnosticList;

        return tmpSource.map((data, divKey)=>{
        let index = this.state.diagnosticList.findIndex(x => x.id == data.partId && x.templateIndex == data.templateIndex),
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
        <div className={Styles.confirm_diagnostic_modal_row} style={{backgroundColor: bgColor, color: txtColor}} key={divKey}>
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
                        const servicesComment = JSON.parse(JSON.stringify(data.commentary));
                        const detailComment = JSON.parse(JSON.stringify(data.commentary));
                        await this.changeResolved(index, 'automaticly');
                        await this.getLaborByPartId(data.partId, servicesComment, data.status);
                        await this.getGroupByPartId(data.partId, detailComment, data.status);
                    }}
                    style={{width: '49%', padding: '5px'}}
                    title={this.props.intl.formatMessage({id: "confirm_diagnostic_modal.auto"})}
                >
                    <FormattedMessage id='order_form_table.diagnostic.automaticly' />
                </Button>
                <Button
                    type="primary"
                    onClick={()=>{this.changeResolved(index, 'manually')}}
                    style={{width: '49%', padding: '5px'}}
                    title={this.props.intl.formatMessage({id: "confirm_diagnostic_modal.manual"})}
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

        return stageList.map((stage, key)=>
            <div key={key}>
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
                commentary: {commentary: "", positions: [], problems: []},
                checked: true
            });
            this.setState({
                update: true,
            })
        }
    }

    getServicesOptions() {
        const { Option } = Select;
        return this.props.labors.map(
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
        let tmpServicesArray = [...this.state.servicesList];
        tmpServicesArray = tmpServicesArray.map((data, index)=>
            <div className={Styles.confirm_diagnostic_modal_row} style={data.status == 3 ? {backgroundColor: 'rgb(250,175,175)'} : null} key={index}>
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
                            this.addServicesByLaborId(value, index, data.commentary, data.status);
                        }}
                        placeholder={this.props.intl.formatMessage({id: 'order_form_table.service.placeholder'})}
                        getPopupContainer={()=>document.getElementById(`${Styles.diagnosticModalServices}`)}
                        filterOption={(inputValue, option) =>
                            option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                    >
                        {
                            data.automaticly ?
                            this.servicesOptions.filter((elem)=>elem.props.product_id == data.productId) :
                            this.servicesOptions
                        }
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
                            data.hours = value;
                            this.setState({update: true});
                        }}
                    />
                    <div style={{width: "20%", paddingLeft: '5px', display: 'inline-block'}}>
                        <CommentaryButton
                            disabled={!data.name}
                            commentary={
                                data.commentary || 
                                {
                                    comment: undefined,
                                    positions: [],
                                    problems: [],
                                }
                            }
                            detail={data.name}
                            setComment={this.setServicesComment}
                            tableKey={index}
                        />
                    </div>
                    <div className={Styles.delete_diagnostic_button_wrap} style={{width: "20%", display: 'inline-block'}}>
                        <Icon
                            onClick={()=>this.deleteServiceRow(index)}
                            type="delete"
                            className={Styles.delete_diagnostic_button}
                            style={!data.name ? {color: "rgba(0, 0, 0, 0.25)", pointerEvents: "none"} : {}}
                        />
                    </div>
                </div>
            </div>
        );
        return tmpServicesArray;
    }

    setServicesComment(comment, positions, index, problems) {
        this.state.servicesList[index].commentary = {
            comment: comment,
            positions: positions,
            problems: problems,
        };
        this.setState({
            update: true
        })
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
        let tmpDetailsArray = [...this.state.detailsList];
        tmpDetailsArray = tmpDetailsArray.map((data, index)=>
            <div className={Styles.confirm_diagnostic_modal_row} style={data.status == 3 ? {backgroundColor: 'rgb(250,175,175)'} : null} key={index}>
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
                            data.name = inputValue;
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
                            data.count = value;
                            this.setState({update: true});
                        }}
                    />
                    <div style={{width: "20%", paddingLeft: '5px', display: 'inline-block'}}>
                        <CommentaryButton
                            disabled={!data.name}
                            commentary={
                                data.commentary || 
                                {
                                    comment: undefined,
                                    positions: [],
                                }
                            }
                            detail={data.name}
                            setComment={this.setDetailsComment}
                            tableKey={index}
                        />
                    </div>
                    <div className={Styles.delete_diagnostic_button_wrap} style={{width: '20%', display: 'inline-block'}}>
                        <Icon
                            onClick={()=>this.deleteDetailRow(index)}
                            type="delete"
                            className={Styles.delete_diagnostic_button}
                            style={!data.name ? {color: "rgba(0, 0, 0, 0.25)", pointerEvents: "none"} : {}}
                        />
                    </div>
                </div>
            </div>
        )
        return tmpDetailsArray;
    }

    setDetailsComment(comment, positions, index) {
        this.state.detailsList[index].commentary = {
            comment: comment,
            positions: positions,
        };
        this.setState({
            update: true
        })
    }

    render() {
        const { visible, autoConfirmed } = this.state;
        const { isMobile, disabled, intl: {formatMessage} } = this.props;
        
        const diagnosticComponents = this.getDiagnosticContent(),
              servicesComponents = this.getServicesContent(),
              detailsComponents = this.getDetailsContent();
        return (
            <div>
                <>
                    {isMobile ? 
                    <Button
                        style={{ width: "80%" }}
                        type="primary"
                        onClick={()=>{
                            notification.success({
                                message: formatMessage({
                                    id: `message_sent`,
                                }),
                            });
                            sendMessage(this.props.orderId);
                        }}
                        disabled={isForbidden(this.props.user, permissions.ACCESS_TELEGRAM) || disabled}
                    >
                        <FormattedMessage id='end'/>
                    </Button>
                    :
                    <>
                        <Button
                            style={{ width: "35%", marginRight: 5 }}
                            type="primary"
                            onClick={this.showModal}
                            disabled={isForbidden(this.props.user, permissions.ACCESS_ORDER_CREATIONG_OF_DIAGNOSTICS_MODAL_WINDOW) || disabled}
                        >
                            <FormattedMessage id='order_form_table.diagnostic.create_order'/>
                        </Button>
                        <Button
                            style={{ width: "35%" }}
                            type="primary"
                            onClick={()=>{
                                notification.success({
                                    message: formatMessage({
                                        id: `message_sent`,
                                    }),
                                });
                                sendMessage(this.props.orderId);
                            }}
                            disabled={isForbidden(this.props.user, permissions.ACCESS_TELEGRAM) || disabled}
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
                                    disabled={autoConfirmed}
                                    type="primary"
                                    onClick={()=>{
                                        this.automaticlyConfirmDiagnostic()
                                    }}
                                    title={formatMessage({id: "confirm_diagnostic_modal.auto"})}
                                >
                                    <FormattedMessage id='order_form_table.diagnostic.automaticly' />
                                </Button>
                            </div>
                            <div className={Styles.confirm_diagnostic_modal_element_content}>
                                {diagnosticComponents}
                            </div>
                        </div>
                        <div id={Styles.diagnosticModalServices} className={Styles.confirm_diagnostic_modal_element}>
                            <div className={Styles.confirm_diagnostic_modal_element_title}>
                                <FormattedMessage id='add_order_form.services' />
                            </div>
                            <div className={Styles.confirm_diagnostic_modal_element_content}>
                                {servicesComponents}
                            </div>
                        </div>
                        <div id={Styles.diagnosticModalDetails} className={Styles.confirm_diagnostic_modal_element}>
                            <div className={Styles.confirm_diagnostic_modal_element_title}>
                                <FormattedMessage id='add_order_form.details' />
                            </div>
                            <div className={Styles.confirm_diagnostic_modal_element_content}>
                                {detailsComponents}
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
                                        {diagnosticComponents}
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab={<Icon type="tool" className={Styles.modal_tab_icon} />} key="2">
                                <div id={Styles.diagnosticModalServices} className={Styles.confirm_diagnostic_modal_element_mobile}>
                                    <div className={Styles.confirm_diagnostic_modal_element_title}>
                                        <FormattedMessage id='add_order_form.services' />
                                    </div>
                                    <div className={Styles.confirm_diagnostic_modal_element_content}>
                                        {servicesComponents}
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab={<Icon type="setting" className={Styles.modal_tab_icon} />} key="3">
                                <div id={Styles.diagnosticModalDetails} className={Styles.confirm_diagnostic_modal_element_mobile}>
                                    <div className={Styles.confirm_diagnostic_modal_element_title}>
                                        <FormattedMessage id='add_order_form.details' />
                                    </div>
                                    <div className={Styles.confirm_diagnostic_modal_element_content}>
                                        {detailsComponents}
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
            currentCommentaryProps: {
                positions: this.props.commentary.positions || [],
                problems: this.props.commentary.problems || [],
            }
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
        this.props.setComment(currentCommentary, currentCommentaryProps.positions, this.props.tableKey, currentCommentaryProps.problems);
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
        var currentCommentary = this.props.detail;

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
                        <Icon
                            onClick={this.showModal}
                            title={this.props.intl.formatMessage({id: "commentary.edit"})}
                            className={Styles.commentaryButtonIcon}
                            style={{color: "rgba(0, 0, 0, 0.65)"}}
                            type="form"
                        />
                ) : (
                        <Icon
                            style={disabled ? {color: "rgba(0, 0, 0, 0.25)", pointerEvents: "none"} : {}}
                            type="message"
                            onClick={()=>{
                                if(!disabled) this.showModal()
                            }}
                            title={this.props.intl.formatMessage({id: "commentary.add"})}
                        />
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