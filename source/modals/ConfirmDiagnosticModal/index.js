// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Checkbox, InputNumber, AutoComplete, Tabs } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
// proj
import {
    API_URL,
    confirmDiagnostic,
    createAgreement,
    lockDiagnostic,
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
    }

    async endСonfirmation(orderId, data) {
        await confirmDiagnostic(orderId, data);
        await lockDiagnostic(orderId);
        //await this.props.reloadOrderPageComponents();
        //await createAgreement(this.props.orderId, this.props.intl.locale);
        await window.location.reload();
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
        this.getCurrentOrderDetailsAndServices();
    };

    handleOk = () => {
        this.setState({ visible: false });
        var data = {
            labors: [],
            details: [],
        }
        this.state.servicesList.map((element)=>{
            if(element.checked && element.id != null) {
                data.labors.push({
                    serviceId: element.id,
                    serviceHours: element.hours,
                    servicePrice: element.price,
                    comment: {comment: element.comment},
                })
            }
        });
        this.state.detailsList.map((element)=>{
            if(element.checked && element.id != null) {
                data.details.push({
                    storeGroupId: element.id,
                    count: element.count,
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
            comment: data.comment,
        }));
        this.state.detailsList = orderDetails.map((data, index)=>({
            key: index+1,
            id: data.storeGroupId,
            name: data.detailName,
            count: data.count,
            checked: true,
        }));
    }

    updateState() {
        this.state.dataSource = this.props.dataSource;
        this.state.diagnosticList = [];
        this.diagnosticKey = 1;
    }

    componentWillMount() {
        
    }

    componentDidMount() {
        if(this.props.orderId) {
            this.fetchOptionsSourceData();
        }
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

    getLaborByPartId(id, comment = "") {
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
            that.addServicesByLaborId(data.laborId, -1, comment);
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    addServicesByLaborId(id, index = -1, comment = "") {
        const service = this.state.labors.labors.find(x => x.laborId == id);
        let cur_index = this.state.servicesList.findIndex(x => x.id == id);
        if(service == undefined) return;

        if(index == -1) {
            if(cur_index == -1) {
                this.state.servicesList[this.state.servicesList.length-1] = {
                    key: this.state.servicesList.length,
                    id: id,
                    productId: service.productId,
                    name: service.name,
                    hours: Number(service.normHours) || 1,
                    checked: true,
                    comment: comment,
                };
            }
            else {
                this.state.servicesList[cur_index].hours += Number(service.normHours) || 1;
            }
        }
        else {
            if(cur_index == -1) {
                this.state.servicesList[index].id = id;
                this.state.servicesList[index].name = service.name;
                this.state.servicesList[index].productId= service.productId;
                this.state.servicesList[index].hours = Number(service.normHours) || 1;
            }
            else {
                this.state.servicesList[cur_index].hours += Number(service.normHours) || 1;
                this.deleteServiceRow(index);
            }
        }
        this.setState({
            update: true,
        });
    }

    getGroupByPartId(id) {
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
            that.addDetailsByGroupId(data.storeGroupId);
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    addDetailsByGroupId(id, index = -1) {
        const detail = this.state.allDetails.find(x => x.id == id);
        let cur_index = this.state.detailsList.findIndex(x => x.id == id);
        if(detail == undefined) return;

        if(index == -1) {
            if(cur_index == -1) {
                this.state.detailsList[this.state.detailsList.length-1] = {
                    key: this.state.detailsList.length,
                    id: detail.id,
                    name: detail.name,
                    count: 1,
                    checked: true,
                };
            }
            else {
                this.state.detailsList[cur_index].count += 1;
            }
        }
        else {
            if(cur_index == -1) {
                this.state.detailsList[index].id = id;
                this.state.detailsList[index].count = 1;
                this.state.detailsList[index].name = detail.name;
            }
            else {
                this.state.detailsList[cur_index].count += 1;
                this.deleteDetailRow(index);
            }
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
            this.state.servicesList[this.state.servicesList.length-1].comment = this.state.diagnosticList[index].comment;
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
        this.state.diagnosticList.map(async (data, index)=>{
            await this.changeResolved(index, 'automaticly');
            await this.getLaborByPartId(data.id, data.comment.comment);
            await this.getGroupByPartId(data.id);
        });
    }

    getDiagnostics(stage) {
        const { dataSource } = this.props;
        var diagnosticList = this.state.diagnosticList;
        let tmpSource = [];
        for(let i = 0; i < dataSource.length; i++) {
            if(dataSource[i].stage == stage && Number(dataSource[i].status) > 1) {
                tmpSource.push(dataSource[i]);
                if(this.state.diagnosticList.findIndex(x => x.id == dataSource[i].partId) == -1){
                    diagnosticList.push({
                        key: this.diagnosticKey,
                        id: dataSource[i].partId,
                        comment: dataSource[i].commentary,
                        resolved: false,
                        type:'',
                        disabled: false,
                        checked: true
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
                        await this.getLaborByPartId(data.partId, data.commentary.comment);
                        await this.getGroupByPartId(data.partId);
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
                comment: null,
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
                comment: null,
                checked: true
            });
            this.setState({
                update: true,
            })
        }
    }

    getServicesOptions() {
        const { Option } = AutoComplete;

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
            <div className={Styles.confirm_diagnostic_modal_row}>
                <div style={{ width: '10%' }}>
                    {data.key} <Checkbox
                        checked={data.checked}
                        onClick={()=>this.servicesCheckboxClick(index)}
                    />
                </div>
                <div style={{ width: '60%', padding: '0 5px'}}>
                    <AutoComplete
                        value={data?data.name:undefined}
                        defaultActiveFirstOption={false}
                        className="service_input"
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
                        placeholder={<FormattedMessage id='order_form_table.service.placeholder'/>}
                        getPopupContainer={()=>document.getElementById(`${Styles.diagnosticModalServices}`)}
                        filterOption={(inputValue, option) =>
                            option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                    >
                        {this.servicesOptions}
                    </AutoComplete>
                </div>
                <div style={{ width: '30%' }}>
                    <InputNumber
                        disabled={!data.checked}
                        style={{ width: '60%' }}
                        step={0.1}
                        min={0.1}
                        value={data.hours?data.hours:default_hours}
                        onChange={(value)=>{
                            this.state.servicesList[index].hours = value;
                            this.setState({update: true});
                        }}
                    />
                    <div style={{width: "20%", paddingLeft: '5px', display: 'inline-block'}}>
                        <CommentaryModal
                                comment={data.comment}
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
        const { Option } = AutoComplete;
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
            <div className={Styles.confirm_diagnostic_modal_row}>
                <div style={{ width: '10%' }}>
                    {data.key} <Checkbox
                        checked={data.checked}
                        onClick={()=>this.detailsCheckboxClick(index)}
                    />
                </div>
                <div style={{ width: '60%', padding: '0 5px'}}>
                    <AutoComplete
                        value={data?data.name:undefined}
                        defaultActiveFirstOption={false}
                        className="service_input"
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
                        placeholder={<FormattedMessage id='order_form_table.service.placeholder'/>}
                        getPopupContainer={()=>document.getElementById(`${Styles.diagnosticModalDetails}`)}
                        filterOption={(inputValue, option) =>
                            option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                    >
                        {this.detailsOptions}
                    </AutoComplete>
                </div>
                <div style={{ width: '30%'}}>
                    <InputNumber
                        disabled={!data.checked}
                        style={{ width: '70%' }}
                        min={1}
                        max={50}
                        value={data.count?data.count:1}
                        onChange={(value)=>{
                            this.state.detailsList[index].count = value;
                            this.setState({update: true});
                        }}
                    />
                    <div className={Styles.delete_diagnostic_button_wrap} style={{width: '30%', display: 'inline-block'}}>
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
        const { isMobile, confirmed } = this.props;
        const { TabPane } = Tabs;
        return (
            <div>
                {confirmed ? (
                    <Button
                        style={isMobile?{ width: "100%" }:{ width: "80%" }}
                        type="primary"
                        onClick={()=>{createAgreement(this.props.orderId, this.props.intl.locale)}}
                    >
                    {!isMobile ? (
                        <FormattedMessage id='send_message'/>
                    ):(
                        <FormattedMessage id='send_message'/>
                    )}
                    </Button>
                ) : (
                    <Button
                        style={isMobile?{ width: "100%" }:{ width: "80%" }}
                        type="primary"
                        onClick={this.showModal}
                    >
                    {!isMobile ? (
                        <FormattedMessage id='order_form_table.diagnostic.create_order'/>
                    ):(
                        <FormattedMessage id='submit'/>
                    )}
                    </Button>
                )}
                <Modal
                    width={!isMobile?"75%":"95%"}
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
            <p>{this.props.comment ? this.props.comment : <FormattedMessage id='no_data' />}</p>
            </Modal>
        </div>
        );
    }
}