// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Icon, Checkbox, InputNumber, AutoComplete, Tabs } from 'antd';
import { FormattedMessage } from 'react-intl';
// proj
import {
    API_URL
} from 'core/forms/orderDiagnosticForm/saga';
// own
import Styles from './styles.m.css';

class ConfirmDiagnosticModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: props.dataSource,
            diagnosticList: [],
            servicesList: [],
            detailsList: [],
            labors: null,
            storeGroups: null,
        }
        this.state.servicesList=[
            {key:1, id:"1", name:"Замена амортизатора пер. прав.", count:1, checked: true},
            {key:2, id:"2", name:"Замена амортизатора пер. лев.", count:1, checked: true},
            {key:3, id:"3", name:"Ремонт стойки", count:2, checked: true},
            {key:4, id:"4", name:"Замена лобового стекла", count:1, checked: true},
            {key:5, id:"5", name:"Ремонт ходовой части", count:1, checked: true},
        ];
        this.state.detailsList=[
            {key:1, id:"1", name:"Амортизатор пер. прав.", count:1, checked: true},
            {key:2, id:"2", name:"Амортизатор пер. лев.", count:1, checked: true},
            {key:3, id:"3", name:"Стойка", count:2, checked: true},
            {key:4, id:"4", name:"Лобовое стекло", count:1, checked: true},
            {key:5, id:"5", name:"Шина", count:1, checked: true},
        ];
        this.tmp = {};
        this.servicesOptions = null;
        this.detailsOptions = null;
        this.allDetails = null;
        this.lastServiceInput = React.createRef();
        this.lastDetailInput = React.createRef();
        this.diagnosticKey = 1;
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = () => {
        this.setState({ visible: false });
        console.log(this.state.diagnosticList, this.state.servicesList, this.state.detailsList);
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
            dataSource: this.props.dataSource,
            diagnosticList: [],
        });
    };

    updateState() {
        this.state.dataSource = this.props.dataSource;
        this.state.diagnosticList = [];
        this.diagnosticKey = 1;
    }

    componentWillMount() {
        
    }

    componentDidMount() {
        this.fetchOptionsSourceData();
    }

    componentWillUpdate() {
        this.updateState();
    }

    componentDidUpdate() {
        if(this.state.labors != null && this.servicesOptions == null) {
            this.servicesOptions = this.getServicesOptions();
        }
        if(this.state.storeGroups != null && this.detailsOptions == null) {
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
        params = `/store_groups`;
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
                storeGroups: data,
            });
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getLaborByPartId(id) {
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
            that.addServicesByLaborId(data.laborId);
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    addServicesByLaborId(id) {
        if(id == undefined) return;
        const service = this.state.labors.labors.find(x => x.laborId == id);
        let index = this.state.servicesList.findIndex(x => x.id == service.productId);
        if( index == -1 ) {
            this.state.servicesList[this.state.servicesList.length-1] = {
                key: this.state.servicesList.length,
                id: service.productId,
                name: service.name,
                count: 1,
                checked: true,
            };
        }
        else {
            this.state.servicesList[index].count = this.state.servicesList[index].count + 1;
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

    addDetailsByGroupId(id) {
        const detail = this.allDetails.find(x => x.id == id);
        let index = this.state.detailsList.findIndex(x => x.id == id);
        if(index == -1) {
            this.state.detailsList[this.state.detailsList.length-1] = {
                key: this.state.detailsList.length,
                id: detail.id,
                name: detail.name,
                count: 1,
                checked: true,
            };
        }
        else {
            this.state.detailsList[index].count = this.state.detailsList[index].count + 1;
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

    getDiagnostics(stage) {
        const { dataSource } = this.props;
        var diagnosticList = this.state.diagnosticList;
        let tmpSource = [];
        for(let i = 0; i < dataSource.length; i++) {
            if(dataSource[i].stage == stage && Number(dataSource[i].status) > 1) {
                tmpSource.push(dataSource[i]);
                if(this.state.diagnosticList.findIndex(x => x.id == dataSource[i].partId) == -1){
                    diagnosticList.push({key: this.diagnosticKey, id: dataSource[i].partId, resolved: false, type:'', disabled: false, checked: true});
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
                    onClick={()=>{
                        this.changeResolved(index, 'automaticly');
                        this.getLaborByPartId(data.partId);
                        this.getGroupByPartId(data.partId);
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
        if(this.state.servicesList[this.state.servicesList.length-1].name != null) {
            this.state.servicesList.push(
                {key:this.state.servicesList[this.state.servicesList.length-1].key+1, id:null, name: null, count: 1, checked: true},
            );
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
                    value={ data.name }
                    key={index}
                    labor_id={data.laborId}
                    master_labor_id={data.masterLaborId}
                    product_id={data.productId}
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
        var servicesList = [...this.state.servicesList];

        return this.state.servicesList.map((data)=>
            <div className={Styles.confirm_diagnostic_modal_row}>
                <div style={{ width: '10%' }}>
                    {data.key} <Checkbox
                        checked={data.checked}
                        onClick={()=>this.servicesCheckboxClick(data.key-1)}
                    />
                </div>
                <div style={{ width: '60%', padding: '0 5px'}}>
                    <AutoComplete
                        defaultActiveFirstOption={false}
                        className="service_input"
                        ref={(node)=>{this.lastServiceInput=node}}
                        disabled={!data.checked}
                        style={{ width: "100%"}}
                        onChange={(inputValue)=>{
                            this.state.servicesList[data.key-1].name = inputValue;
                            this.setState({update: true});
                            this.addNewServicesRow();
                        }}
                        onSelect={(value, option)=>{
                            this.addDetailsByGroupId(option.props.product_id);
                        }}
                        placeholder={<FormattedMessage id='order_form_table.service.placeholder'/>}
                        value={data.name?data.name:undefined}
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
                        style={{ width: '70%' }}
                        min={1}
                        max={50}
                        value={data.count?data.count:1}
                        onChange={(value)=>{
                            this.state.servicesList[data.key-1].count = value;
                            this.setState({update: true});
                        }}
                    />
                    <Icon
                        onClick={()=>this.deleteServiceRow(data.key-1)}
                        style={{margin: '0 5%'}}
                        type="delete"
                        className={Styles.delete_diagnostic_button}
                    />
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
        if(this.state.detailsList[this.state.detailsList.length-1].name != null) {
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
        const { storeGroups } = this.state;
        let details = [];
        
        for (let i = 0; i < storeGroups.length; i++) {
            const childGroups = storeGroups[i].childGroups;
            for (let j = 0; j < childGroups.length; j++) {
                const groupDetails = childGroups[j].childGroups;
                for (let k = 0; k < groupDetails.length; k++) {
                    details.push(groupDetails[k]);
                }
            }
        }

        this.allDetails = details;
        
        return details.map(
            (data, index) => (
                <Option
                    value={ data.name }
                    key={index}
                    detail_id={data.id}
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

        return this.state.detailsList.map((data)=>
            <div className={Styles.confirm_diagnostic_modal_row}>
                <div style={{ width: '10%' }}>
                    {data.key} <Checkbox
                        checked={this.state.detailsList[data.key-1].checked}
                        onClick={()=>this.detailsCheckboxClick(data.key-1)}
                    />
                </div>
                <div style={{ width: '60%', padding: '0 5px'}}>
                <AutoComplete
                        defaultActiveFirstOption={false}
                        className="service_input"
                        ref={(node)=>{this.lastDetailInput=node}}
                        disabled={!data.checked}
                        style={{ width: "100%"}}
                        onChange={(inputValue)=>{
                            this.state.detailsList[data.key-1].name = inputValue;
                            this.setState({update: true});
                            this.addNewServicesRow();
                        }}
                        placeholder={<FormattedMessage id='order_form_table.service.placeholder'/>}
                        value={data.name?data.name:undefined}
                        getPopupContainer={()=>document.getElementById(`${Styles.diagnosticModalDetails}`)}
                        filterOption={(inputValue, option) =>
                            option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                    >
                        {this.detailsOptions}
                    </AutoComplete>
                </div>
                <div style={{ width: '30%' }}>
                    <InputNumber
                        disabled={!this.state.detailsList[data.key-1].checked}
                        style={{ width: '70%' }}
                        min={1}
                        max={50}
                        value={data.count?data.count:1}
                        onChange={(value)=>{
                            this.state.detailsList[data.key-1].count = value;
                            this.setState({update: true});
                        }}
                    />
                    <Icon
                        onClick={()=>this.deleteDetailRow(data.key-1)}
                        style={{margin: '0 5%'}}
                        type="delete"
                        className={Styles.delete_diagnostic_button}
                    />
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
                <Button style={isMobile?{ width: "100%" }:{ width: "80%" }} type="primary" onClick={this.showModal}>
                {!isMobile ? (
                    <FormattedMessage id='order_form_table.diagnostic.create_order'/>
                ):(
                    <FormattedMessage id='submit'/>
                )}
                </Button>
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
                            <div className={Styles.confirm_diagnostic_modal_element_title}>
                                <FormattedMessage id='order_form_table.diagnostic.results' />
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