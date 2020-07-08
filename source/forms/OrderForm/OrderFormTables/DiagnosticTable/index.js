// vendor
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    Table,
    Button,
    Modal,
    Upload,
    Icon,
    Checkbox,
    Select,
    Input,
    InputNumber,
    AutoComplete,
    Radio
} from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';

// proj
import { Catcher, Spinner } from 'commons';
import { images } from 'utils';
import { ConfirmDiagnosticModal } from 'modals'
import {
    API_URL,
    addNewDiagnosticTemplate,
    getDiagnosticsTemplates,
    addNewDiagnosticRow,
    sendDiagnosticAnswer,
    deleteDiagnosticProcess,
    deleteDiagnosticTemplate,
    getPartProblems
} from 'core/forms/orderDiagnosticForm/saga';

// own
import Styles from './styles.m.css';

class DiagnosticTable extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            update: false,
            orderDiagnostic: props.orderDiagnostic,
            orderId: props.orderId,
            selectedRows: [],
            rowsCount: 0,
            headerCheckboxIndeterminate: false,
            checkedAll: false,
            possibleRows : [],
            dataSource: [],
            groupsTitles: [],
            partsTitles: [],
            filterPlan: null,
            filterStage: null,
            filterStatus: null,
            filterCommentary: null,
            filterPhoto: null,
        };

        this.templatesData = this.templatesData == undefined ? {} : this.templatesData;
        this.templatesTitles = [];
        this.groupsTitles = [];
        this.partsTitles = [];
        this.planFilterOptions = [];
        this.ok = 0;
        this.bad = 0;
        this.critical = 0;
        this.open = 0;
        this.withCommentary = 0; 
        this.withPhoto = 0;
        this.getCurrentDiagnostic = this.getCurrentDiagnostic.bind(this);
        this.addNewDiagnostic = this.addNewDiagnostic.bind(this);
        this.deleteDiagnostic = this.deleteDiagnostic.bind(this);
        this.onPlanChange = this.onPlanChange.bind(this);
        this.onStageChange = this.onStageChange.bind(this);
        this.onDetailChange = this.onDetailChange.bind(this);
        this.getTemplatesList = this.getTemplatesList.bind(this);
        this.updateDataSource = this.updateDataSource.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.onCheckAll = this.onCheckAll.bind(this);
        this.editSelectedRowsStatus = this.editSelectedRowsStatus.bind(this);
        this.deleteSelectedRows = this.deleteSelectedRows.bind(this);
        this.setPhoto = this.setPhoto.bind(this);
        this.photoKeys = [];
        this.columns = [
            {
                title:  ()=>{
                    const {filterPlan, filterStage, filterStatus, filterCommentary, filterPhoto} = this.state;
                    let type = filterPlan==null&&filterStage==null&&filterStatus==null&&filterCommentary==null&&filterPhoto==null?"":"danger";
                    return(
                        <div className={Styles.filter_column_header_wrap}>
                            <p style={{paddingLeft: 10}}>#</p>
                            <Button
                                type={type}
                                style={{
                                    color: '#fff',
                                    backgroundColor: '#ff2a2c',
                                    borderColor: '#ff2a2c',
                                }}
                                style={{maxWidth: 60}}
                                onClick={()=>{
                                    this.setState({
                                        filterPlan: null,
                                        filterStage: null,
                                        filterStatus: null,
                                        filterCommentary: null,
                                        filterPhoto: null,
                                    });
                                    {this.getCurrentDiagnostic()}
                                }}
                            >
                                {this.state.dataSource.length}
                            </Button>
                        </div>
                    )
                },
                dataIndex: 'key',
                key:       'key',
                width:     '5%',
                render: (num, element)=> {
                    let checked = this.state.selectedRows.indexOf(num) > -1;
                    return(
                        <div style={{paddingLeft: 5}}>
                            <span>{num}  </span>
                            <Checkbox
                                disabled={this.props.disabled || element.disabled}
                                onChange={()=>{this.onChangeCheckbox(num)}}
                                checked = { checked }
                            />
                        </div>
                    )
                },
            },
            {
                title:  ()=>{
                    const { Option } = Select;  
                    return(
                        <div className={Styles.filter_column_header_wrap} style={{width: "100%"}}>
                            <FormattedMessage id='order_form_table.diagnostic.plan' />
                            <Select
                                allowClear
                                showSearch
                                value={this.state.filterPlan===null?undefined:this.state.filterPlan}
                                style={{width: "80%"}}
                                placeholder={<FormattedMessage id='order_form_table.diagnostic.plan' />}
                                onChange={(selectValue)=>{
                                    if(selectValue != "")
                                    this.setState({
                                        filterPlan: selectValue,
                                    });
                                    {this.getCurrentDiagnostic()}
                                }}
                            >
                                {this.templatesTitles.map((template, i) => <Option key={i+1} value={template.title}>{template.title}</Option>)}
                            </Select>
                        </div>
                    )
                },
                dataIndex: 'plan',
                key:       'plan',
                width:     '15%',
                render: (plan)=> {
                    const { Option } = Select;
                    return plan != "" ? (
                        <p>
                            {plan}
                        </p>
                    ) : (
                        <Select
                            disabled={this.props.disabled}
                            showSearch
                            placeholder={<FormattedMessage id='order_form_table.diagnostic.plan' />}
                            onChange={this.onPlanChange}
                        >
                            {this.templatesTitles.map((template, i) => <Option key={i+1} value={template.id}>{template.title}</Option>)}
                        </Select>
                    );
                },
            },
            {
                title:  ()=>{
                    const { Option } = Select;
                    let options = undefined !== this.planFilterOptions ? this.planFilterOptions : [];
                    return(
                        <div className={Styles.filter_column_header_wrap} style={{width: "100%"}}>
                            <p>
                                <FormattedMessage id='order_form_table.diagnostic.stage' />
                            </p>
                            <Select
                                allowClear
                                style={{width: "80%"}}
                                value={this.state.filterStage===null?undefined:this.state.filterStage}
                                showSearch
                                placeholder={<FormattedMessage id='order_form_table.diagnostic.stage' />}
                                onChange={(selectValue)=>{
                                    if(selectValue != "")
                                    this.setState({
                                        filterStage: selectValue,
                                    });
                                    {this.getCurrentDiagnostic()}
                                }}
                            >
                                {options.map((stage, i) => <Option key={i+1} value={stage.title}>{stage.title}</Option>)}
                            </Select>
                        </div>
                    )
                },
                dataIndex: 'stage',
                key:       'stage',
                width:     '15%',
                render: (stage)=> {
                    const { Option } = Select;
                    let options = this.state.groupsTitles ? this.state.groupsTitles : [];
                    return stage != "" ? (
                        <p>
                            {stage}
                        </p>
                    ) : (
                        <Select
                            showSearch
                            placeholder={<FormattedMessage id='order_form_table.diagnostic.stage' />}
                            disabled={this.props.disabled || options.length == 0}
                            onChange={this.onStageChange}
                        >
                            {options.map((template, i) => <Option key={i+1} value={template.id}>{template.title}</Option>)}
                        </Select>  
                    );
                },
            },
            {
                title:  ()=>{
                    let bgColorOK = this.state.filterStatus=="OK"?"rgb(81, 205, 102)":"rgb(200,225,180)",
                        bgColorBAD = this.state.filterStatus=="BAD"?"rgb(255, 255, 0)":"rgb(255,240,180)",
                        bgColorCRITICAL = this.state.filterStatus=="CRITICAL"?"rgb(255, 126, 126)":"rgb(250,175,175)",
                        bgColorBAD_AND_CRITICAL = {
                            bad: this.state.filterStatus=="BAD&CRITICAL"?"rgb(255, 255, 0)":"rgb(255,240,180)",
                            critical: this.state.filterStatus=="BAD&CRITICAL"?"rgb(255, 126, 126)":"rgb(250,175,175)",
                        },
                        bgColorOPEN = this.state.filterStatus=="OPEN"?"rgb(155, 89, 182)":"rgb(210, 190, 230)",
                        boxShadow = "1px 1px 4px -1px inset";
                    return(
                        <div className={Styles.filter_column_header_wrap}>
                            <FormattedMessage id='order_form_table.diagnostic.detail' />
                            <div style={{display: 'flex'}}>
                                <div className={Styles.filter_button_wrap}>
                                    <Button
                                        style={{width: "100%", backgroundColor: bgColorOK}}
                                        onClick={()=>{
                                            if(this.state.filterStatus == "OK") {
                                                this.setState({
                                                    filterStatus: null,
                                                });
                                            }
                                            else {
                                                this.setState({
                                                    filterStatus: "OK",
                                                });
                                            }
                                            {this.getCurrentDiagnostic()}
                                        }}
                                    >
                                        <FormattedMessage id='order_form_table.diagnostic.status.ok'/>
                                    </Button>
                                    <Input
                                        style={this.state.filterStatus=="OK"?{boxShadow: boxShadow}:{}}
                                        className={Styles.filter_input}
                                        value={this.ok}
                                    />
                                </div>
                                <div className={Styles.filter_button_wrap}>
                                    <Button
                                        style={{width: "100%", backgroundColor: bgColorBAD}}
                                        onClick={()=>{
                                            if(this.state.filterStatus == "BAD") {
                                                this.setState({
                                                    filterStatus: null,
                                                });
                                            }
                                            else {
                                                this.setState({
                                                    filterStatus: "BAD",
                                                });
                                            }
                                            {this.getCurrentDiagnostic()}
                                        }}
                                    >
                                        <FormattedMessage id='order_form_table.diagnostic.status.bad'/>
                                    </Button>
                                    <Input
                                        style={this.state.filterStatus=="BAD"?{boxShadow: boxShadow}:{}}
                                        className={Styles.filter_input}
                                        value={this.bad}
                                    />
                                </div>
                                <div className={Styles.filter_button_wrap}>
                                    <Button
                                        style={{width: "100%", backgroundColor: bgColorCRITICAL}}
                                        onClick={()=>{
                                            if(this.state.filterStatus == "CRITICAL") {
                                                this.setState({
                                                    filterStatus: null,
                                                });
                                            }
                                            else {
                                                this.setState({
                                                    filterStatus: "CRITICAL",
                                                });
                                            }
                                            {this.getCurrentDiagnostic()}
                                        }}
                                    >
                                        <FormattedMessage id='order_form_table.diagnostic.status.critical'/>
                                    </Button>
                                    <Input
                                        style={this.state.filterStatus=="CRITICAL"?{boxShadow: boxShadow}:{}}
                                        className={Styles.filter_input}
                                        value={this.critical}
                                    />
                                </div>
                                <div className={Styles.filter_button_wrap}>
                                    <Button
                                        style={{width: "100%", padding: 0}}
                                        onClick={()=>{
                                            if(this.state.filterStatus == "BAD&CRITICAL") {
                                                this.setState({
                                                    filterStatus: null,
                                                });
                                            }
                                            else {
                                                this.setState({
                                                    filterStatus: "BAD&CRITICAL",
                                                });
                                            }
                                            {this.getCurrentDiagnostic()}
                                        }}
                                    >
                                        <Button
                                            className={Styles.filter_half_button}
                                            style={{backgroundColor: bgColorBAD_AND_CRITICAL.bad, borderRadius: "4px 0px 0px 4px"}}
                                        >
                                            <FormattedMessage id='order_form_table.diagnostic.status.bad'/>
                                        </Button>
                                        <Button
                                            className={Styles.filter_half_button}
                                            style={{backgroundColor: bgColorBAD_AND_CRITICAL.critical,borderRadius: "0px 4px 4px 0px"}}
                                        >
                                            <FormattedMessage id='order_form_table.diagnostic.status.critical'/>
                                        </Button>
                                    </Button>
                                    <Input
                                        style={this.state.filterStatus=="BAD&CRITICAL"?{boxShadow: boxShadow}:{}}
                                        className={Styles.filter_input}
                                        value={this.bad+this.critical}
                                    />
                                </div>
                                <div className={Styles.filter_button_wrap}>
                                    <Button
                                        style={{width: "100%", color: "rgb(72, 72, 72)", backgroundColor: bgColorOPEN}}
                                        onClick={()=>{
                                            if(this.state.filterStatus == "OPEN") {
                                                this.setState({
                                                    filterStatus: null,
                                                });
                                            }
                                            else {
                                                this.setState({
                                                    filterStatus: "OPEN",
                                                });
                                            }
                                            {this.getCurrentDiagnostic()}
                                        }}
                                    >
                                        <FormattedMessage id='order_form_table.diagnostic.status.open'/>
                                    </Button>
                                    <Input
                                        style={this.state.filterStatus=="OPEN"?{boxShadow: boxShadow}:{}}
                                        className={Styles.filter_input}
                                        value={this.open}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                },
                dataIndex: 'detail',
                key:       'detail',
                width:     '35%',
                render: (detail, rowProp)=> {
                    const { Option } = Select;
                    let options = undefined !== this.state.partsTitles ? this.state.partsTitles : [];
                    return detail != "" ? (
                        <span>
                            <p>{detail}</p>
                            <p style={{fontStyle: "italic"}}>{rowProp.actionTitle}</p>
                        </span>
                    ) : (
                        <Select
                            disabled={this.props.disabled || options.length == 0}
                            showSearch
                            placeholder={<FormattedMessage id='order_form_table.diagnostic.detail' />}
                            onChange={this.onDetailChange}
                        >
                            {options.map((template, i) => <Option key={i+1} value={template.id}>{template.title}</Option>)}
                        </Select> 
                    );
                },
            },
            {
                title:  ()=>{
                    return(
                        <div className={Styles.filter_column_header_wrap}>
                            <p style={{whiteSpace: 'nowrap', overflowX: "hidden"}}>
                                <FormattedMessage id='order_form_table.diagnostic.commentary' />
                            </p>
                            <Button
                                type={this.state.filterCommentary == null?"primary":""}
                                onClick={()=>{
                                    if(this.state.filterCommentary != null) {
                                        this.setState({
                                            filterCommentary: null,
                                        });
                                    }
                                    else {
                                        this.setState({
                                            filterCommentary: "COMMENTARY",
                                        });
                                    }
                                    {this.getCurrentDiagnostic()}
                                }}
                            >
                                {this.withCommentary}
                            </Button>
                        </div>
                    )
                },
                dataIndex: 'commentary',
                key:       'commentary',
                width:     '5%',
                render: (commentary, rowProp) => (
                    <CommentaryButton
                        disabled={this.props.disabled || rowProp.disabled}
                        getCurrentDiagnostic={this.getCurrentDiagnostic}
                        commentary={commentary}
                        rowProp={rowProp}
                    />
                ),
            },
            {
                title:  ()=>{
                    return(
                        <div className={Styles.filter_column_header_wrap}>
                            <FormattedMessage id='order_form_table.diagnostic.photo' />
                            <Button
                                disabled
                                type={this.state.filterPhoto == null?"primary":""}
                                onClick={()=>{
                                    if(this.state.filterPhoto != null) {
                                        this.setState({
                                            filterPhoto: null,
                                        });
                                    }
                                    else {
                                        this.setState({
                                            filterPhoto: "PHOTO",
                                        });
                                    }
                                    {this.getCurrentDiagnostic()}
                                }}
                            >
                                {this.withPhoto}
                            </Button>
                        </div>
                    )
                },
                dataIndex: 'photo',
                key:       'photo',
                width:     '5%',
                render: (photo, rowProp) => (
                    <PhotoButton
                        disabled={this.props.disabled || rowProp.disabled}
                        getCurrentDiagnostic={this.getCurrentDiagnostic}
                        setPhoto={this.setPhoto}
                        rowProp={rowProp}
                        photo={photo}
                    />
                ),
            },
            {
                title:  ()=>{
                    return(
                        <div>
                            <FormattedMessage id='order_form_table.diagnostic.status' />
                        </div>
                    )
                },
                dataIndex: 'status',
                key:       'status',
                width:     '15%',
                render: (text, rowProp) => {
                    return (
                        <DiagnosticStatusButton
                            disabled={this.props.disabled || rowProp.disabled}
                            getCurrentDiagnostic={this.getCurrentDiagnostic}
                            status={text}
                            rowProp={rowProp}
                        />
                    )
                },
            },
            {
                dataIndex: 'delete',
                key:       'delete',
                width:     '5%',
                render: (text, rowProp) => (
                    <DeleteProcessButton
                        disabled={this.props.disabled || rowProp.disabled}
                        deleteRow = {this.deleteRow}
                        rowProp={rowProp}
                    />
                ),
            },
        ];
    }

    async addNewDiagnostic(data) {
        let id = this.templatesTitles.find((elem)=>elem.title==data).id;
        await addNewDiagnosticTemplate(this.state.orderId, id);
        await this.getCurrentDiagnostic();
    }

    async deleteDiagnostic(data) {
        let id = this.templatesTitles.find((elem)=>elem.title==data).id;
        await deleteDiagnosticTemplate(this.state.orderId, id);
        await this.getCurrentDiagnostic();
    }

    onPlanChange(event) {
        let tmp = [];
        for (let i = 0; i < this.groupsTitles.length; i++) {
            if(this.groupsTitles[i].parentId == event) {
                tmp.push({
                    title: this.groupsTitles[i].title,
                    id: this.groupsTitles[i].id
                });
            }
        }
        this.templateId = event;
        this.setState({
            groupsTitles: tmp,
        });
    }

    onStageChange(event) {
        let tmp = [];
        for (let i = 0; i < this.partsTitles.length; i++) {
            if(this.partsTitles[i].parentId == event) {
                tmp.push({
                    title: this.partsTitles[i].title,
                    id: this.partsTitles[i].id
                });
            }
        }
        this.groupId = event;
        this.setState({
            partsTitles: tmp,
        });
    }

    async onDetailChange(event) {
        await addNewDiagnosticRow(
            this.state.orderId,
            this.templateId,
            this.groupId, 
            event   
        );
        await this.getCurrentDiagnostic();
    }

    getCurrentDiagnostic() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/diagnostics?orderId=${this.state.orderId}`;
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
            that.state.orderDiagnostic = data.diagnosis;
            that.updateDataSource();
        })
        .catch(function (error) {
            console.log('error', error)
        });
    }

    getTemplatesList() {
        for(let i = 0 ; i < this.templatesData.diagnosticTemplatesCount; i++) {
            this.templatesTitles.push({
                title: this.templatesData.diagnosticTemplates[i].diagnosticTemplateTitle,
                id: this.templatesData.diagnosticTemplates[i].diagnosticTemplateId
            });
            let groupsCount = this.templatesData.diagnosticTemplates[i].groupsCount;
            for (let j = 0; j < groupsCount; j++) {
                let diagnostic =  this.templatesData.diagnosticTemplates[i].groups[j];
                let id = diagnostic.groupId;
                let title = diagnostic.groupTitle;

                if(this.planFilterOptions.findIndex((elem)=>elem.title==title) == -1) {
                    this.planFilterOptions.push({
                        id: id,
                        title: title,
                        parentId: this.templatesData.diagnosticTemplates[i].diagnosticTemplateId,
                        parent: this.templatesData.diagnosticTemplates[i].diagnosticTemplateTitle,
                    })
                }

                this.groupsTitles.push({
                    id: id,
                    title: title,
                    parentId: this.templatesData.diagnosticTemplates[i].diagnosticTemplateId,
                    parent: this.templatesData.diagnosticTemplates[i].diagnosticTemplateTitle,
                });

                for (let k = 0; k < diagnostic.partsCount; k++) {
                    let part =  diagnostic.parts[k];
                    let id = part.partId;
                    let title = part.partTitle;
                    this.partsTitles.push({
                        id: id,
                        title: title,
                        parentId: diagnostic.groupId,
                        parent: diagnostic.groupTitle,
                    });
                }
            }
        }
        /*this.setState({
            groupsTitles: this.groupsTitles,
            partsTitles: this.partsTitles,
        });*/
    }

    async deleteRow(index) {
        let photo_index = this.photoKeys.findIndex((elem)=>elem.partId == this.state.dataSource[index].partId && elem.groupId == this.state.dataSource[index].groupId)
        this.photoKeys.splice(photo_index, 1);
        await deleteDiagnosticProcess(
            this.props.orderId,
            this.state.dataSource[index].diagnosticTemplateId,
            this.state.dataSource[index].groupId,
            this.state.dataSource[index].partId,
        );
        this.setState({
            selectedRows: [],
            possibleRows: [],
            checkedAll: false,
            headerCheckboxIndeterminate: false,
        });
        await this.getCurrentDiagnostic();
    }

    onCheckAll() {
        if(!this.state.checkedAll) {
            this.setState({
                checkedAll: true,
                selectedRows: this.state.possibleRows,
                headerCheckboxIndeterminate: false,
            });
        }
        else {
            this.setState({
                checkedAll: false,
                selectedRows: [],
                headerCheckboxIndeterminate: false,
            });
        }
        this.getCurrentDiagnostic();
    }

    async editSelectedRowsStatus(status) {
        for(let i = 0; i < this.state.selectedRows.length; i++) {
            let key = this.state.dataSource.findIndex((element, index, array)=>{return element.key == this.state.selectedRows[i]});
            if(key != -1){
                await sendDiagnosticAnswer(
                    this.props.orderId,
                    this.state.dataSource[key].diagnosticTemplateId,
                    this.state.dataSource[key].groupId,
                    this.state.dataSource[key].partId,
                    status
                );
            }
        }
        this.setState({
            selectedRows: [],
            possibleRows: [],
            checkedAll: false,
            headerCheckboxIndeterminate: false,
        });
        await this.getCurrentDiagnostic();
    }

    async deleteSelectedRows() {
        for(let i = 0; i < this.state.selectedRows.length; i++){
            let key = this.state.dataSource.findIndex((elem)=>elem.key == this.state.selectedRows[i]);
            if(key != -1){
                let photo_index = this.photoKeys.findIndex((elem)=>elem.partId == this.state.dataSource[key].partId && elem.groupId == this.state.dataSource[key].groupId)
                this.photoKeys.splice(photo_index, 1);
                await deleteDiagnosticProcess(
                    this.props.orderId,
                    this.state.dataSource[key].diagnosticTemplateId,
                    this.state.dataSource[key].groupId,
                    this.state.dataSource[key].partId,
                );
            }
        }
        this.setState({
            selectedRows: [],
            possibleRows: [],
            checkedAll: false,
            headerCheckboxIndeterminate: false,
        });
        await this.getCurrentDiagnostic();
    }

    onChangeCheckbox(key) {
        const data = this.state.selectedRows;
        if(event.target.checked) {
            this.state.selectedRows.push(key);
        }
        else {
            let index = data.indexOf(key);
            this.state.selectedRows = data.filter((_, i) => i !== index);
        }
        let allchecked = (this.state.selectedRows.length == this.state.rowsCount),
            indeterminate = (this.state.selectedRows.length < this.state.rowsCount) && this.state.selectedRows.length > 0;
        this.setState({
            headerCheckboxIndeterminate: indeterminate,
            checkedAll: allchecked,
        });
        this.getCurrentDiagnostic();
    }

    setRowsColor() {
        let color, status;
        var rows = document.querySelectorAll(`.${Styles.diagnosticTable} tbody tr`);
        for(let i = 0; i < rows.length && i < this.state.dataSource.length; i++){
            status = this.state.dataSource[i].status;
            color = "";
            if(status == 1) {
                color = "rgb(200,225,180)";
            }
            else if(status == 2) {
                color = "rgb(255,240,180)";
            }
            else if(status == 3) {
                color = "rgb(250,175,175)";
            }
            rows[i].style.backgroundColor = color;
        };
    }

    filterDataSource(dataSource) {
        let data = dataSource;
        const { filterPlan, filterStage, filterStatus, filterCommentary, filterPhoto } = this.state;
        if(filterPlan != null) data = data.filter((data, i) => data.plan == filterPlan);
        if(filterStage != null) data = data.filter((data, i) => data.stage == filterStage);
        if(filterStatus == "OK") data = data.filter((data, i) => data.status == 1);
        if(filterStatus == "BAD") data = data.filter((data, i) => data.status == 2);
        if(filterStatus == "CRITICAL") data = data.filter((data, i) => data.status == 3);
        if(filterStatus == "BAD&CRITICAL") data = data.filter((data, i) => data.status == 2 || data.status == 3);
        if(filterStatus == "OPEN") data = data.filter((data, i) => data.status == 0);
        if(filterCommentary != null) data = data.filter((data, i) => data.commentary != null);
        if(filterPhoto != null) data = data.filter((data, i) => data.photo != null && data.photo.length > 0);
        return data;
    }

    updateDataSource() {
        const disabled = this.props.disabled;
        this.ok = 0;
        this.bad = 0;
        this.critical = 0;
        this.open = 0;
        this.withCommentary = 0; 
        this.withPhoto = 0;
        this.state.possibleRows = [];
        const { orderDiagnostic, orderId } = this.state;
        const dataSource = [];

        const diagnosticTemplatesCount = _.pick(orderDiagnostic, [
            "diagnosticTemplatesCount",
        ]).diagnosticTemplatesCount;
        const diagnosticTemplates = _.pick(orderDiagnostic, [
            "diagnosticTemplates",
        ]).diagnosticTemplates;
        let key = 1;
        for(let i = 0; i < diagnosticTemplatesCount; i++) {
            let groupsCount = _.pick(diagnosticTemplates[i], [
                "groupsCount",
            ]).groupsCount;
            let diagnosticTemplateTitle = _.pick(diagnosticTemplates[i], [
                "diagnosticTemplateTitle",
            ]).diagnosticTemplateTitle;
            let diagnosticTemplateId = _.pick(diagnosticTemplates[i], [
                "diagnosticTemplateId",
            ]).diagnosticTemplateId;
            let groups = _.pick(diagnosticTemplates[i], [
                "groups",
            ]).groups;
            for(let j = 0; j < groupsCount; j++) {
                let groupTitle = _.pick(groups[j], [
                    "groupTitle",
                ]).groupTitle;
                let groupId = _.pick(groups[j], [
                    "groupId",
                ]).groupId;
                let partsCount = _.pick(groups[j], [
                    "partsCount",
                ]).partsCount;
                let parts = _.pick(groups[j], [
                    "parts",
                ]).parts;
                for(let k = 0; k < partsCount; k++) {
                    let partTitle = _.pick(parts[k], [
                        "partTitle",
                    ]).partTitle;
                    let actionTitle = _.pick(parts[k], [
                        "actionTitle",
                    ]).actionTitle;
                    let partId = _.pick(parts[k], [
                        "partId",
                    ]).partId;
                    let answer = _.pick(parts[k], [
                        "answer",
                    ]).answer;
                    let calcDone = _.pick(parts[k], [
                        "calcDone",
                    ]).calcDone;
                    let comment = _.pick(parts[k], [
                        "comment",
                    ]).comment;
                    if(comment == null) comment = {comment: null}
                    let photo = this.photoKeys.find((data)=>data.partId == partId && data.groupId == groupId);
                    photo = photo ? photo.photo : null;
                    dataSource.push({
                        key: key,
                        partId: partId,
                        plan: diagnosticTemplateTitle,
                        stage: groupTitle,
                        detail: partTitle,
                        actionTitle: actionTitle,
                        status: answer,
                        commentary: comment,
                        orderId: orderId,
                        diagnosticTemplateId: diagnosticTemplateId,
                        groupId: groupId,
                        photo: photo,
                        disabled: calcDone,
                    },);
                    if(!calcDone) this.state.possibleRows.push(key);
                    key++;
                    if(answer == 0) this.open++;
                    if(answer == 1) this.ok++;
                    if(answer == 2) this.bad++;
                    if(answer == 3) this.critical++; 
                }
            }
        }
        const filtredData = this.filterDataSource(dataSource);

        if(filtredData.length < dataSource.length) {
            const { filterPlan, filterStage, filterCommentary, filterPhoto } = this.state;
            if(filterPlan || filterStage || filterCommentary || filterPhoto) {
                this.ok = 0;
                this.bad = 0;
                this.critical = 0;
                this.open = 0;
            }
            filtredData.map((data)=>{
                if(filterPlan || filterStage || filterCommentary || filterPhoto) {
                    if(data.status == 0) this.open++;
                    if(data.status == 1) this.ok++;
                    if(data.status == 2) this.bad++;
                    if(data.status == 3) this.critical++;
                }
                if(data.commentary != undefined) this.withCommentary++;
                if(data.photo != undefined && data.photo.length > 0) this.withPhoto++;
            })
            /*filtredData.push({
                key: key,
                partId: "",
                plan: "",
                detail: "",
                actionTitle: "",
                stage: "",
                status: "",
                commentary: "",
                orderId: orderId,
                diagnosticTemplateId: "",
                groupId: "",
                photo: null,
                allTemplatesData: orderDiagnostic,
            },);*/
            this.state.possibleRows.push(key-1);
            this.setState({
                dataSource: filtredData,
                rowsCount: filtredData.length,
            });
        }
        else{
            dataSource.map((data)=>{
                if(data.commentary != undefined) this.withCommentary++;
                if(data.photo != undefined && data.photo.length > 0) this.withPhoto++;
            })
            if(!disabled) {
                dataSource.push({
                    key: key,
                    partId: "",
                    plan: "",
                    detail: "",
                    actionTitle: "",
                    stage: "",
                    status: "",
                    commentary: "",
                    orderId: orderId,
                    diagnosticTemplateId: "",
                    groupId: "",
                    photo: null,
                    allTemplatesData: orderDiagnostic,
                },);
            }
            this.state.possibleRows.push(key);
            
            this.setState({
                dataSource: dataSource,
                rowsCount: key,
            });
        }
        this.forceUpdate();
        this.setRowsColor();
    }

    setPhoto(photo, groupId, partId) {
        const index = this.photoKeys.findIndex((data)=>data.partId == partId && data.groupId == groupId);
        if(index > -1) {
            this.photoKeys[index].photo = photo;
        }
        else {
            this.photoKeys.push({
                partId: partId,
                groupId: groupId,
                photo: photo,
            });
        }
        this.updateDataSource();
    }

    componentWillMount() {
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/diagnostics`;
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
            that.templatesData = data;
            that.getTemplatesList();
            that.forceUpdate();
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }

    componentDidMount() {
        if(!this.props.forbidden) {
            this._isMounted = true;
            this.getCurrentDiagnostic();
            this.setRowsColor();
        }
    }

    componentDidUpdate() {
        //this.setRowsColor();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const disabled = this.props.disabled;
        const columns = this.columns;
        return (
            <Catcher>
                <DiagnosticTableHeader
                    defaultEmployeeId={this.props.defaultEmployeeId}
                    user={this.props.user}
                    tecdocId={this.props.tecdocId}
                    disabled={disabled}
                    orderId={this.props.orderId}
                    getCurrentDiagnostic={this.getCurrentDiagnostic}
                    templatesTitles={this.templatesTitles}
                    rowsCount={this.state.rowsCount}
                    selectedRows={this.state.selectedRows}
                    indeterminate={this.state.headerCheckboxIndeterminate}
                    checkedAll={this.state.checkedAll}
                    onCheckAll={this.onCheckAll}
                    addNewDiagnostic={this.addNewDiagnostic}
                    deleteDiagnostic={this.deleteDiagnostic}
                    editSelectedRowsStatus={this.editSelectedRowsStatus}
                    deleteSelectedRows={this.deleteSelectedRows}
                    dataSource={this.state.dataSource}
                    orderServices={this.props.orderServices}
                    orderDetails={this.props.orderDetails}
                    updateTabs={this.props.updateTabs}
                    reloadOrderPageComponents={this.props.reloadOrderPageComponents}
                />
                <Table
                    className={!disabled?Styles.diagnosticTable:Styles.diagnosticTableDisabled}
                    rowClassName={(elem, i)=>{
                        return elem.disabled ? Styles.diagnosticTableDisabled : null;
                    }}
                    dataSource={this.state.dataSource}
                    columns={columns}
                    locale={{
                        emptyText: <FormattedMessage id='no_data' />,
                    }}
                    pagination={false}
                    scroll={{ y: 540 }}
                />
            </Catcher>
        );
    }
}

class DiagnosticTableHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            indeterminate: props.indeterminate,
            checked: props.checkedAll,
            selectValue : undefined,
            dataSource: props.dataSource,
        }
    }

    handleClickCheckbox() {
        this.setState({
            checked: !this.state.checked,
        });
    }

    handleClickStatusButtons(status) {
        {this.props.editSelectedRowsStatus(status)};
    }

    handleClickDeleteButton() {
        {this.props.deleteSelectedRows()};
    }

    updateState() {
        this.state.checked = this.props.checkedAll;
        this.state.indeterminate = this.props.indeterminate;
        this.state.dataSource = this.props.dataSource;
    }

    componentWillUpdate() {
        this.updateState();
    }

    render(){
        const { Option } = Select;
        const { disabled } = this.props;
        return(
            <div className={Styles.diagnosticTableHeader}>
                <div style={{ width: "5%", padding: '5px 15px' }}>
                    <Checkbox
                        disabled={disabled}
                        checked = {this.state.checked}
                        indeterminate = {this.state.indeterminate}
                        onChange = {this.props.onCheckAll}
                        onClick = {()=>this.handleClickCheckbox()}
                    />
                </div>
                <div style={{ width: "15%" }}>
                    <Select
                        disabled={disabled}
                        allowClear
                        value={this.state.selectValue}
                        showSearch
                        placeholder={<FormattedMessage id='order_form_table.diagnostic.plan' />}
                        onChange={()=>{this.setState({selectValue: event.target.innerText})}}
                    >
                        {this.props.templatesTitles.map((template, i) => <Option key={i+1} value={template.id}>{template.title}</Option>)}
                    </Select>
                </div>
                <div style={{ width: "15%" }}>
                    <Button
                        disabled={disabled} 
                        onClick={() => {
                            this.props.addNewDiagnostic(this.state.selectValue);
                            this.setState({selectValue: undefined});
                        }}
                    >
                        <FormattedMessage id='+' />
                    </Button>
                    <Button
                        disabled={disabled}
                        onClick={() => {
                            this.props.deleteDiagnostic(this.state.selectValue);
                            this.setState({selectValue: undefined});
                        }}
                    >
                        <FormattedMessage id='-' />
                    </Button>
                </div>
                <div style={{ width: "35%" }}>
                    <ConfirmDiagnosticModal
                        defaultEmployeeId={this.props.defaultEmployeeId}
                        user={this.props.user}
                        tecdocId={this.props.tecdocId}
                        confirmed={disabled}
                        orderId={this.props.orderId}
                        isMobile={false}
                        dataSource = {this.state.dataSource}
                        orderServices={this.props.orderServices}
                        orderDetails={this.props.orderDetails}
                        getCurrentDiagnostic={this.props.getCurrentDiagnostic}
                        updateTabs={this.props.updateTabs}
                        reloadOrderPageComponents={this.props.reloadOrderPageComponents}
                    />
                </div>
                <div style={{ width: "10%" }}>
                    <Button disabled={disabled} type="primary" onClick={()=>{this.handleClickStatusButtons(0)}} style={{width: "80%", padding: 0}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                    </Button>
                </div>
                <div className={Styles.diagnostic_status_button_wrap} style={{ width: "15%" }}>
                    <Button disabled={disabled} className={Styles.diagnostic_status_button} onClick={()=>{this.handleClickStatusButtons(1)}}  style={{background:"rgb(81, 205, 102)"}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                    </Button>
                    <Button disabled={disabled} className={Styles.diagnostic_status_button} onClick={()=>{this.handleClickStatusButtons(2)}} style={{background:"rgb(255, 255, 0)"}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                    </Button>
                    <Button disabled={disabled} className={Styles.diagnostic_status_button}  type="danger" onClick={()=>{this.handleClickStatusButtons(3)}} style={{background:"rgb(255, 126, 126)", color: "rgba(0, 0, 0, 0.65)"}}>
                        <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                    </Button>
                </div>
                <div className={Styles.delete_diagnostic_button_wrap} style={{width: "5%"}}>
                    <Icon
                        type="delete"
                        className={!disabled?Styles.delete_diagnostic_button:Styles.delete_diagnostic_button_disabled}
                        onClick={()=>{this.handleClickDeleteButton()}}
                    />
                </div>
            </div>
        );
    }
}

class DiagnosticStatusButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            status: props.status
        }
    }
    setColor() {
        let color = ""
        if(this.state.status == 1) {
            color = "rgb(200,225,180)";
        }
        else if(this.state.status == 2) {
            color = "rgb(255,240,180)";
        }
        else if(this.state.status == 3) {
            color = "rgb(250,175,175)";
        }

        ReactDOM.findDOMNode(this).parentNode.parentNode.style.backgroundColor = color;
    }

    componentDidMount() {
        {this.setColor()}
    }

    componentDidUpdate() {
        {this.setColor()}
    }

    updateState() {
        this.state.status = this.props.status;
    }

    componentWillUpdate() {
        this.updateState();
    }

    handleClick = async (status) => {
        const { rowProp } = this.props;
        await sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.groupId, rowProp.partId, status);
        await this.setState({status:status});
        await this.props.getCurrentDiagnostic();
    }
    render(){
        const { status } = this.state;
        const { disabled, rowProp } = this.props;

        if(!rowProp.partId) {
            return (
                <div className={Styles.diagnostic_status_button_wrap}>
                    <Button
                        disabled
                        className={Styles.diagnostic_status_button_edit}
                        type="primary"
                    >
                        <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                    </Button>
                </div>
            )
        }
        return status > 0 ? (
            <div className={Styles.diagnostic_status_button_wrap}>
                <Button
                    disabled={disabled}
                    className={Styles.diagnostic_status_button_edit}
                    type="primary"
                    onClick={()=>this.handleClick(0)}
                >
                    <FormattedMessage id='order_form_table.diagnostic.status.edit' />
                </Button>
            </div>
            ) : (
            <div className={Styles.diagnostic_status_button_wrap}>
                <Button
                    disabled={disabled}
                    className={Styles.diagnostic_status_button}
                    onClick={()=>this.handleClick(1)}
                    style={{background:'rgb(81, 205, 102)'}}
                >
                    <FormattedMessage id='order_form_table.diagnostic.status.ok' />
                </Button>
                <Button
                    disabled={disabled}
                    className={Styles.diagnostic_status_button}
                    onClick={()=>this.handleClick(2)}
                    style={{background:'rgb(255, 255, 0)'}}
                >
                    <FormattedMessage id='order_form_table.diagnostic.status.bad' />
                </Button>
                <Button 
                    disabled={disabled}
                    className={Styles.diagnostic_status_button} type="danger"
                    onClick={()=>this.handleClick(3)}
                    style={{background:'rgb(255, 126, 126)', color: 'rgba(0, 0, 0, 0.65)'}}
                >
                    <FormattedMessage id='order_form_table.diagnostic.status.critical' />
                </Button>
            </div>
        );
    }
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

    getPositions() {
        const that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/diagnostics/positions?partId=${this.props.rowProp.partId}`;
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
                rcl: data.rcl,
                fcr: data.fcr,
                tb: data.tb,
                io: data.io,
            });
            if(data.rcl != null && data.rcl.length==1) {
                switch (data.rcl) {
                    case "R":
                        that.setCurrentCommentaryProps('back', 'RIGHT');
                        break;
                    case "L":
                        that.setCurrentCommentaryProps('back', 'LEFT');
                        break;
                }
            }
            if(data.fcr != null && data.fcr.length==1) {
                switch (data.fcr) {
                    case "F":
                        that.setCurrentCommentaryProps('side', 'FRONT');
                        break;
                    case "R":
                        that.setCurrentCommentaryProps('side', 'REAR');
                        break;
                    case "C":
                        that.setCurrentCommentaryProps('side', 'MIDDLE');
                        break;
                }
            }
            if(data.tb != null && data.tb.length==1) {
                switch (data.tb) {
                    case "T":
                        that.setCurrentCommentaryProps('side', 'TOP');
                        break;
                    case "B":
                        that.setCurrentCommentaryProps('side', 'BOTTOM');
                        break;
                }
            }
            if(data.io != null && data.io.length==1) {
                switch (data.io) {
                    case "I":
                        that.setCurrentCommentaryProps('front', 'IN');
                        break;
                    case "O":
                        that.setCurrentCommentaryProps('front', 'OUT');
                        break;
                }
            }
        })
        .catch(function (error) {
            console.log('error', error)
        })
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

    handleOk = async () => {
        this.setState({
            loading: true,
        });
        const { rowProp } = this.props;
        await sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.groupId, rowProp.partId, rowProp.status, 
            JSON.stringify(
                {
                    comment: this.state.currentCommentary,
                    problems: this.state.currentCommentaryProps.problems,
                    mm: this.state.currentCommentaryProps.mm,
                    percent: this.state.currentCommentaryProps.percent,
                    deg: this.state.currentCommentaryProps.deg,
                }
            ));
        await this.props.getCurrentDiagnostic();
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 500);
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
                  {this.props.rowProp.detail}
              </p>
              <p style={{fontSize:"16px", fontStyle: "italic", fontWeight: "normal"}}>
                  {this.props.rowProp.actionTitle}
              </p>
            </div>
          );
    }

    setCurrentCommentaryProps(key, value) {
        const { rowProp } = this.props;
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
        var commentary = `${rowProp.detail} - `;
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
        if(!this.state.problems && this.props.rowProp.partId) {
            getPartProblems(this.props.rowProp.partId, (data)=>{
                this.setState({problems: data})
            });
            this.state.currentCommentaryProps.problems = this.props.commentary.problems ? this.props.commentary.problems : [];
            this.state.currentCommentaryProps.mm = this.props.commentary.mm ? this.props.commentary.mm : 0;
            this.state.currentCommentaryProps.percent = this.props.commentary.percent ? this.props.commentary.percent : 0;
            this.state.currentCommentaryProps.deg = this.props.commentary.deg ? this.props.commentary.deg : 0;
            this.getPositions();
        }
    }

    componentDidUpdate() {
        
    }

    render() {
        const { TextArea } = Input;
        const { visible, loading, problems, currentCommentaryProps, currentCommentary } = this.state;
        const { commentary } = this.props;
        const { disabled, rowProp } = this.props;
        var problemOptions = [];
        if(problems) {
            problems.map((data)=>{
                if(data.code) {
                    problemOptions.push({
                        label: data.description, value: data.code
                    })
                }
            })
        }
        const defaultProblems = commentary.problems ? commentary.problems : [];

        if(!rowProp.partId) {
            return (
                <Button
                    disabled
                    type="primary"
                    onClick={this.showModal}
                >
                    <Icon type="message" />
                </Button>
            )
        }

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
                                    disabled={this.state.tb == undefined || this.state.tb.indexOf("T") == -1}
                                    type={currentCommentaryProps.side.indexOf("TOP") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "0%", left: "50%", transform: "translateX(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'TOP')}}
                                >
                                    <FormattedMessage id='TOP'/>
                                </Button>
                                <Button
                                    disabled={this.state.fcr == undefined || this.state.fcr.indexOf("R") == -1}
                                    type={currentCommentaryProps.side.indexOf("REAR") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", left: "0%", transform: "translateY(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'REAR')}}
                                >
                                    <FormattedMessage id='REAR'/>
                                </Button>
                                <Button
                                    disabled={this.state.tb == undefined || this.state.tb.indexOf("B") == -1}
                                    type={currentCommentaryProps.side.indexOf("BOTTOM") != -1 ? null : "primary"}
                                    style={{position: "absolute", bottom: "0%", left: "50%", transform: "translateX(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'BOTTOM')}}
                                >
                                    <FormattedMessage id='BOTTOM'/>
                                </Button>
                                <Button
                                    disabled={this.state.fcr == undefined || this.state.fcr.indexOf("F") == -1}
                                    type={currentCommentaryProps.side.indexOf("FRONT") != -1 ? null : "primary"}
                                    style={{position: "absolute", top: "50%", right: "0%", transform: "translateY(-50%)"}}
                                    onClick={()=>{this.setCurrentCommentaryProps('side', 'FRONT')}}
                                >
                                    <FormattedMessage id='FRONT'/>
                                </Button>
                                <Button
                                    disabled={this.state.fcr == undefined || this.state.fcr.indexOf("С") == -1}
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
                                        disabled={this.state.rcl == undefined || this.state.rcl.indexOf("L") == -1}
                                        type={currentCommentaryProps.back.indexOf("LEFT") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "0%", bottom: "0%"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'LEFT')}}
                                    >
                                        <FormattedMessage id='LEFT'/>
                                    </Button>
                                    <Button
                                        disabled={this.state.rcl == undefined || this.state.rcl.indexOf("C") == -1}
                                        type={currentCommentaryProps.back.indexOf("CENTER") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "50%", bottom: "50%", transform: "translate(-50%, 50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('back', 'CENTER')}}
                                    >
                                        <FormattedMessage id='CENTER'/>
                                    </Button>
                                    <Button
                                        disabled={this.state.rcl == undefined || this.state.rcl.indexOf("R") == -1}
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
                                        disabled={this.state.io == undefined || this.state.io.indexOf("I") == -1}
                                        type={currentCommentaryProps.front.indexOf("IN") != -1 ? null : "primary"}
                                        style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('front', 'IN')}}
                                    >
                                        <FormattedMessage id='IN'/>
                                    </Button>
                                    <Button
                                        disabled={this.state.io == undefined || this.state.io.indexOf("O") == -1}
                                        type={currentCommentaryProps.front.indexOf("OUT") != -1 ? null : "primary"}
                                        style={{position: "absolute", right: "0%", top: "50%", transform: "translateY(-50%)"}}
                                        onClick={()=>{this.setCurrentCommentaryProps('front', 'OUT')}}
                                    >
                                        <FormattedMessage id='OUT'/>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {problemOptions.length > 0 ?
                            <div>
                                <p className={Styles.commentarySectionHeader}>Тип проблемы:</p>
                                <div>
                                    <Checkbox.Group
                                        options={problemOptions}
                                        defaultValue={defaultProblems}
                                        onChange={(problems)=>{this.setCurrentCommentaryProps('problems', problems)}}
                                    />
                                </div>
                            </div>
                        : <></>}
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


class PhotoButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            photo: props.photo,
            upload: null,
        }
    }

    componentDidMount() {
        //this.getPhoto();
    }

    getPhoto() {
        const { rowProp } = this.props;
        var that = this;
        let token = localStorage.getItem('_my.carbook.pro_token');
        let url = API_URL;
        let params = `/orders/diagnostics/part?orderId=${rowProp.orderId}&templateId=${rowProp.diagnosticTemplateId}&groupId=${rowProp.groupId}&partId=${rowProp.partId}`;
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
            that.props.setPhoto(data.photos, rowProp.groupId, rowProp.partId);
        })
        .catch(function (error) {
            console.log('error', error)
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = async () => {
        this.setState({ loading: true });
        const { rowProp } = this.props;
        await sendDiagnosticAnswer(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.groupId, rowProp.partId, rowProp.status, rowProp.commentary, this.state.upload);
        await this.setState({ loading: false, visible: false });
        await this.getPhoto();
        await this.props.getCurrentDiagnostic();
    };
    
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        /*this.state.photo = this.props.photo;
        const { visible, loading, photo } = this.state;
        const { disabled, rowProp } = this.props;
        if(!rowProp.partId) {
            return (
                <Button
                    disabled
                    type="primary"
                    onClick={this.showModal}
                >
                    <Icon type="message" />
                </Button>
            )
        }
        if(photo === null) {
            if(this.props.rowProp.partId) {
                this.getPhoto();
            }*/
            return (
                <div>
                    <Button type="primary" disabled><Icon type={"camera"} /></Button>
                </div>
            )
        /*}
        var fileList = [];
        if(photo.length > 0) {
            photo.map((data, index)=>{
                fileList.push({
                    uid: index*-1,
                    name: index+1+".img",
                    status: 'done',
                    url: data,
                    thumbUrl: data,
                });
            });
        }
        return (
            <div>
                <Button
                    disabled={disabled}
                    type={photo.length==0?"primary":""}
                    onClick={this.showModal}
                >
                    <Icon type={photo.length==0?"camera":"file-image"} />
                </Button>
                <Modal
                    visible={visible}
                    title={<FormattedMessage id='order_form_table.diagnostic.photo' />}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                            {<FormattedMessage id='cancel' />}
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                            {<FormattedMessage id='save' />}
                        </Button>,
                    ]}
                    >
                    <Upload 
                        listType='picture'
                        defaultFileList={[...fileList]}
                        beforeUpload={file => {
                            const reader = new FileReader();
                            reader.onload = e => {
                                this.state.upload = e.target.result;
                            };
                            reader.readAsDataURL(file);
                            return false;
                        }}
                    >
                        <Button>
                            <Icon type="upload" />
                            <FormattedMessage id='upload' />
                        </Button>
                    </Upload>
                </Modal>
            </div>
        );*/
    }
}


class DeleteProcessButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            deleted: false,
        }
    }

    handleClick = () => {
        const { rowProp } = this.props;
            if(rowProp.partId) {
            deleteDiagnosticProcess(rowProp.orderId, rowProp.diagnosticTemplateId, rowProp.groupId, rowProp.partId);
            ReactDOM.findDOMNode(this).parentNode.parentNode.style.backgroundColor = "";
            this.props.deleteRow(this.props.rowProp.key-1);
            this.setState({deleted:true});
        }
    }

    render() {
        const { disabled, rowProp } = this.props;
        return (
        <div className={Styles.delete_diagnostic_button_wrap} style={{width: "5%"}}>
            <Icon
                type="delete"
                className={!disabled?Styles.delete_diagnostic_button:Styles.delete_diagnostic_button_disabled}
                onClick={this.handleClick}
            />
        </div>
        );
    }
}


export default DiagnosticTable;
